#!/usr/bin/env python3
"""Validate an OpenClaw-authored A2A Insights Markdown article."""

from __future__ import annotations

import argparse
import json
import re
import struct
import sys
from datetime import date, datetime
from pathlib import Path
from zoneinfo import ZoneInfo


REQUIRED_FIELDS = (
    "title",
    "shortTitle",
    "description",
    "pubDate",
    "tags",
    "category",
    "readingTime",
    "heroImage",
    "heroAlt",
    "featured",
    "breaking",
    "draft",
)
INTERNAL_TERMS = re.compile(
    r"(?<![A-Za-z0-9_])(?:Current Full KG|Full KG|Judge(?: PASS| NEEDS_FIX)|"
    r"(?:claim|evidence|candidate|source)_ids?|draft_sha256|"
    r"evidence pack|knowledge_binding|machine_verified|human_verified)"
    r"(?![A-Za-z0-9_])"
    r"|根拠パック|候補ID|ソースID|審査ラベル",
    re.IGNORECASE,
)
PLACEHOLDERS = re.compile(r"TODO|TBD|ここに(?:本文|安田)|要確認のまま公開", re.IGNORECASE)
SLUG = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")
FRONTMATTER = re.compile(r"\A---\r?\n(.*?)\r?\n---\r?\n?", re.DOTALL)
FIELD = re.compile(r"^([A-Za-z][A-Za-z0-9]*):[ \t]*(.*)$", re.MULTILINE)
PUB_DATE = re.compile(r"^\d{4}-\d{2}-\d{2}$")
READING_TIME = re.compile(r"^[1-9]\d*分$")


def _today_jst() -> date:
    return datetime.now(ZoneInfo("Asia/Tokyo")).date()


def _scalar(raw: str):
    value = raw.strip()
    if not value:
        return ""
    try:
        return json.loads(value)
    except json.JSONDecodeError:
        if len(value) >= 2 and value[0] == value[-1] and value[0] in {"'", '"'}:
            return value[1:-1]
        return value


def _parse_markdown(path: Path) -> tuple[dict[str, object], str, list[str]]:
    text = path.read_text(encoding="utf-8")
    match = FRONTMATTER.match(text)
    if not match:
        return {}, text, ["YAML frontmatterを先頭の---で囲んでください"]

    raw_frontmatter = match.group(1)
    fields = {key: _scalar(raw) for key, raw in FIELD.findall(raw_frontmatter)}
    return fields, text[match.end() :], []


def _webp_dimensions(path: Path) -> tuple[int, int] | None:
    data = path.read_bytes()
    if len(data) < 30 or data[:4] != b"RIFF" or data[8:12] != b"WEBP":
        return None

    offset = 12
    while offset + 8 <= len(data):
        fourcc = data[offset : offset + 4]
        size = struct.unpack_from("<I", data, offset + 4)[0]
        payload = data[offset + 8 : offset + 8 + size]
        if fourcc == b"VP8X" and len(payload) >= 10:
            width = int.from_bytes(payload[4:7], "little") + 1
            height = int.from_bytes(payload[7:10], "little") + 1
            return width, height
        if fourcc == b"VP8L" and len(payload) >= 5 and payload[0] == 0x2F:
            bits = int.from_bytes(payload[1:5], "little")
            return (bits & 0x3FFF) + 1, ((bits >> 14) & 0x3FFF) + 1
        if fourcc == b"VP8 " and len(payload) >= 10:
            frame = payload.find(b"\x9d\x01\x2a")
            if frame >= 0 and frame + 7 <= len(payload):
                width, height = struct.unpack_from("<HH", payload, frame + 3)
                return width & 0x3FFF, height & 0x3FFF
        offset += 8 + size + (size % 2)
    return None


def validate_article(
    article: Path, repo_root: Path, *, allow_featured: bool = False
) -> list[str]:
    errors: list[str] = []
    posts_dir = (repo_root / "blog/src/content/posts").resolve()
    try:
        article.resolve().relative_to(posts_dir)
    except ValueError:
        errors.append(f"記事は{posts_dir}配下に置いてください")

    if article.suffix != ".md" or not SLUG.fullmatch(article.stem):
        errors.append("記事ファイル名は小文字ASCIIのkebab-case.mdにしてください")

    fields, body, parse_errors = _parse_markdown(article)
    errors.extend(parse_errors)
    if parse_errors:
        return errors

    for key in REQUIRED_FIELDS:
        if key not in fields or fields[key] == "" or fields[key] is None:
            errors.append(f"frontmatterに{key}を明示してください")

    for key in (
        "title",
        "shortTitle",
        "description",
        "category",
        "readingTime",
        "heroImage",
        "heroAlt",
    ):
        if key in fields and not isinstance(fields[key], str):
            errors.append(f"{key}は文字列にしてください")
    if "author" in fields and not isinstance(fields["author"], str):
        errors.append("authorを使う場合は文字列にしてください")

    if isinstance(fields.get("shortTitle"), str) and len(fields["shortTitle"]) > 50:
        errors.append("shortTitleは50文字以内にしてください")
    parsed_dates: dict[str, date] = {}
    for key in ("pubDate", "updatedDate"):
        value = fields.get(key)
        if value is None:
            continue
        if not isinstance(value, str) or not PUB_DATE.fullmatch(value):
            errors.append(f"{key}はYYYY-MM-DD形式にしてください")
            continue
        try:
            parsed_dates[key] = date.fromisoformat(value)
        except ValueError:
            errors.append(f"{key}は実在する日付にしてください")
    if parsed_dates.get("pubDate", date.min) > _today_jst():
        errors.append("pubDateを未来日にしないでください")
    if parsed_dates.get("updatedDate", date.min) > _today_jst():
        errors.append("updatedDateを未来日にしないでください")
    if (
        "pubDate" in parsed_dates
        and "updatedDate" in parsed_dates
        and parsed_dates["updatedDate"] < parsed_dates["pubDate"]
    ):
        errors.append("updatedDateをpubDateより前にしないでください")
    if isinstance(fields.get("readingTime"), str) and not READING_TIME.fullmatch(fields["readingTime"]):
        errors.append("readingTimeはN分形式にしてください")
    if (
        not isinstance(fields.get("tags"), list)
        or not fields.get("tags")
        or not all(isinstance(tag, str) and tag.strip() for tag in fields["tags"])
    ):
        errors.append("tagsは1件以上のJSON配列にしてください")

    for flag in ("featured", "breaking", "draft"):
        if flag in fields and not isinstance(fields[flag], bool):
            errors.append(f"{flag}はtrueまたはfalseにしてください")
    if fields.get("featured") is True and not allow_featured:
        errors.append("featuredの自動昇格は禁止です。通常はfalseにし、人間の判断を受けてください")
    if fields.get("breaking") is True:
        errors.append("breakingは現行表示で未使用です。表示実装を追加するまではfalseにしてください")
    if fields.get("draft") is True:
        errors.append("公開PRではdraftをfalseにしてください")

    expected_hero = f"/blog/{article.stem}-eyecatch.webp"
    hero = fields.get("heroImage")
    if isinstance(hero, str) and hero != expected_hero:
        errors.append(f"heroImageは{expected_hero}にしてください")
    if isinstance(hero, str) and hero.startswith("/blog/"):
        image_path = repo_root / "blog/public" / hero.removeprefix("/blog/")
        if not image_path.is_file():
            errors.append(f"hero画像がありません: {image_path}")
        else:
            dimensions = _webp_dimensions(image_path)
            if dimensions != (1672, 941):
                errors.append(
                    f"hero画像は1672x941のWebPにしてください（現在: {dimensions or '判定不能'}）"
                )
    if not body.strip():
        errors.append("本文が空です")
    if re.search(r"^#\s+", body, re.MULTILINE):
        errors.append("本文にH1を書かないでください。titleから自動生成されます")

    h2s = [heading.strip() for heading in re.findall(r"^##\s+(.+)$", body, re.MULTILINE)]
    reference_names = {"参照した一次情報", "参照元", "参考文献", "Sources"}
    content_h2s = [heading for heading in h2s if heading not in reference_names]
    if not 4 <= len(content_h2s) <= 5:
        errors.append(
            f"主要H2は4〜5個にしてください（参照節を除く現在: {len(content_h2s)}個）"
        )
    reference_indexes = [
        index for index, heading in enumerate(h2s) if heading in reference_names
    ]
    if not reference_indexes:
        errors.append("末尾に## 参照した一次情報を設けてください")
    else:
        if reference_indexes[-1] != len(h2s) - 1:
            errors.append("参照した一次情報は最後のH2にしてください")
        reference_match = re.search(
            r"^##\s+(?:参照した一次情報|参照元|参考文献|Sources)\s*$",
            body,
            re.MULTILINE,
        )
        reference_body = body[reference_match.end() :] if reference_match else ""
        if "https://" not in reference_body:
            errors.append("参照した一次情報の節にHTTPSリンクを含めてください")

    public_text = article.read_text(encoding="utf-8")
    if INTERNAL_TERMS.search(public_text):
        errors.append("公開本文に内部処理語が含まれています")
    if PLACEHOLDERS.search(public_text):
        errors.append("公開内容にTODOまたは未処理のプレースホルダーが含まれています")

    return errors


def _repo_root(article: Path, explicit: Path | None) -> Path:
    if explicit:
        return explicit.resolve()
    for parent in (article.resolve().parent, *article.resolve().parents):
        if (parent / "blog/src/content/config.ts").is_file():
            return parent
    raise ValueError("--repo-rootを指定するか、corporate-site配下の記事を渡してください")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("article", type=Path, help="検証するMarkdown記事")
    parser.add_argument("--repo-root", type=Path, help="corporate-siteのルート")
    parser.add_argument(
        "--allow-featured",
        action="store_true",
        help="人間が注目記事への昇格を承認した場合だけfeatured: trueを許可する",
    )
    args = parser.parse_args()

    if not args.article.is_file():
        parser.error(f"記事が見つかりません: {args.article}")

    try:
        repo_root = _repo_root(args.article, args.repo_root)
    except ValueError as exc:
        parser.error(str(exc))

    errors = validate_article(
        args.article.resolve(), repo_root, allow_featured=args.allow_featured
    )
    if errors:
        print(f"NG: {args.article}")
        for error in errors:
            print(f"- {error}")
        return 1

    print(f"OK: {args.article}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
