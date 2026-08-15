"""Regression tests for the article contract validator."""

from __future__ import annotations

import importlib.util
import tempfile
import unittest
from datetime import timedelta
from pathlib import Path


SCRIPT = Path(__file__).with_name("validate_article.py")
SPEC = importlib.util.spec_from_file_location("validate_article", SCRIPT)
assert SPEC and SPEC.loader
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


def webp_vp8x(width: int, height: int) -> bytes:
    payload = (
        b"\x00\x00\x00\x00"
        + (width - 1).to_bytes(3, "little")
        + (height - 1).to_bytes(3, "little")
    )
    chunk = b"VP8X" + len(payload).to_bytes(4, "little") + payload
    return b"RIFF" + (4 + len(chunk)).to_bytes(4, "little") + b"WEBP" + chunk


class ValidateArticleTest(unittest.TestCase):
    def setUp(self) -> None:
        self.temp = tempfile.TemporaryDirectory()
        self.repo = Path(self.temp.name)
        self.posts = self.repo / "blog/src/content/posts"
        self.public = self.repo / "blog/public"
        self.posts.mkdir(parents=True)
        self.public.mkdir(parents=True)
        (self.repo / "blog/src/content/config.ts").touch()
        self.article = self.posts / "sample-article.md"
        self.image = self.public / "sample-article-eyecatch.webp"
        self.image.write_bytes(webp_vp8x(1672, 941))

    def tearDown(self) -> None:
        self.temp.cleanup()

    def write_article(
        self, body: str, extra: str = "", pub_date: str | None = None
    ) -> None:
        published = pub_date or MODULE._today_jst().isoformat()
        self.article.write_text(
            f"""---
title: "A2Aの変更を実務から解説"
shortTitle: "A2Aの変更"
description: "A2Aの変更点と実務上の確認事項を解説します。"
pubDate: {published}
tags: ["A2A", "実装"]
category: "ニュース解説"
readingTime: "8分"
heroImage: "/blog/sample-article-eyecatch.webp"
heroAlt: "二つのAIエージェント間で情報を検証して受け渡す構成"
featured: false
breaking: false
draft: false
"""
            + extra
            + """---
"""
            + body,
            encoding="utf-8",
        )

    def valid_body(self) -> str:
        return """結論を最初に説明します。

## 何が変わったか
変更点です。

## 仕組み
仕組みです。

## 実務への影響
影響です。

## 確認すべきこと
確認事項です。

## 参照した一次情報
- [公式仕様](https://example.com/spec)
"""

    def test_valid_article_passes(self) -> None:
        self.write_article(self.valid_body())
        self.assertEqual(MODULE.validate_article(self.article, self.repo), [])

    def test_rejects_internal_term_in_frontmatter(self) -> None:
        self.write_article(
            self.valid_body(),
            'internalNote: "candidate_idsを公開しない"\n',
        )
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertIn("公開本文に内部処理語が含まれています", errors)

    def test_rejects_wrong_image_dimensions(self) -> None:
        self.image.write_bytes(webp_vp8x(1200, 630))
        self.write_article(self.valid_body())
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertTrue(any("1672x941" in error for error in errors))

    def test_allows_protocol_claim_term(self) -> None:
        self.write_article(self.valid_body().replace("仕組みです。", "JWT claimを検証します。"))
        self.assertEqual(MODULE.validate_article(self.article, self.repo), [])

    def test_rejects_invalid_date(self) -> None:
        self.write_article(self.valid_body(), pub_date="2026-99-99")
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertIn("pubDateは実在する日付にしてください", errors)

    def test_rejects_future_date(self) -> None:
        future = (MODULE._today_jst() + timedelta(days=1)).isoformat()
        self.write_article(self.valid_body(), pub_date=future)
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertIn("pubDateを未来日にしないでください", errors)

    def test_rejects_breaking_until_rendered(self) -> None:
        self.write_article(self.valid_body(), "breaking: true\n")
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertTrue(any("breakingは現行表示で未使用" in error for error in errors))

    def test_allows_featured_after_human_approval(self) -> None:
        self.write_article(self.valid_body(), "featured: true\n")
        self.assertEqual(
            MODULE.validate_article(self.article, self.repo, allow_featured=True),
            [],
        )

    def test_rejects_reference_section_without_url(self) -> None:
        self.write_article(self.valid_body().replace("https://example.com/spec", "/spec"))
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertTrue(any("参照した一次情報の節" in error for error in errors))

    def test_rejects_bare_reference_url(self) -> None:
        self.write_article(
            self.valid_body().replace(
                "[公式仕様](https://example.com/spec)",
                "https://example.com/spec",
            )
        )
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertTrue(any("名称付きのHTTPS Markdownリンク" in error for error in errors))

    def test_rejects_non_string_tag(self) -> None:
        self.write_article(self.valid_body(), "tags: [1]\n")
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertIn("tagsは1件以上のJSON配列にしてください", errors)

    def test_rejects_non_string_hero_path(self) -> None:
        self.write_article(
            self.valid_body(),
            'heroImage: ["/blog/sample-article-eyecatch.webp"]\n',
        )
        errors = MODULE.validate_article(self.article, self.repo)
        self.assertIn("heroImageは文字列にしてください", errors)


if __name__ == "__main__":
    unittest.main()
