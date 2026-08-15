import { useMemo, type ReactNode } from 'react';
import { ArrowRight, Check, ExternalLink, ShieldCheck } from 'lucide-react';
import { BlogShell, Breadcrumbs } from '../components/BlogShell';
import { getBlogArticle, type BlogArticle } from '../data/blogArticles';
import { usePageMetadata } from '../hooks/usePageMetadata';

export function BlogArticlePage({ slug }: { slug: string }) {
  const article = getBlogArticle(slug);

  if (!article) {
    return (
      <BlogShell>
        <main id="main-content" className="flex min-h-[70svh] items-center px-5 py-20 md:px-10">
          <div className="mx-auto w-full max-w-3xl text-center">
            <div className="text-xs tracking-[0.2em] text-cyan-300">404</div>
            <h1 className="mt-5 text-4xl font-light">記事が見つかりません</h1>
            <a href="/blog" className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/20 px-5 text-sm text-white">
              A2A Insightsへ戻る <ArrowRight size={15} aria-hidden="true" />
            </a>
          </div>
        </main>
      </BlogShell>
    );
  }

  return <Article article={article} />;
}

function Article({ article }: { article: BlogArticle }) {
  const jsonLd = useMemo(() => ([
    {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: article.title,
      description: article.description,
      image: `https://www.another-star.jp${article.heroImage}`,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt,
      author: { '@type': 'Organization', name: 'Another Star編集部' },
      publisher: { '@type': 'Organization', name: 'Another Star合同会社' },
      mainEntityOfPage: `https://www.another-star.jp/blog/${article.slug}`,
      isPartOf: { '@type': 'Blog', name: 'A2A Insights' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.another-star.jp/' },
        { '@type': 'ListItem', position: 2, name: 'A2A Insights', item: 'https://www.another-star.jp/blog' },
        { '@type': 'ListItem', position: 3, name: article.shortTitle, item: `https://www.another-star.jp/blog/${article.slug}` },
      ],
    },
  ]), [article]);

  usePageMetadata({
    title: `${article.shortTitle}｜A2A Insights | Another Star`,
    description: article.description,
    canonicalPath: `/blog/${article.slug}`,
    image: article.heroImage,
    type: 'article',
    jsonLd,
  });

  return (
    <BlogShell>
      <main id="main-content">
        <article>
          <header className="px-5 pb-10 pt-10 md:px-10 md:pb-16 md:pt-14">
            <div className="mx-auto max-w-6xl">
              <Breadcrumbs>{article.shortTitle}</Breadcrumbs>
              <div className="mx-auto mt-12 max-w-4xl text-center">
                <div className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/[0.07] px-4 py-2 text-xs tracking-[0.12em] text-cyan-200">
                  {article.category}
                </div>
                <h1 className="mt-7 text-[2.5rem] font-light leading-[1.16] tracking-[-0.025em] text-white sm:text-[3.5rem] lg:text-[4.25rem]">
                  {article.title}
                </h1>
                <p className="mx-auto mt-7 max-w-3xl text-base leading-8 text-slate-300 md:text-lg md:leading-9">
                  {article.lead}
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-slate-400">
                  <span>Another Star編集部</span>
                  <span aria-hidden="true">•</span>
                  <time dateTime={article.publishedAt}>{formatDate(article.publishedAt)}</time>
                  <span aria-hidden="true">•</span>
                  <span>読了 {article.readingTime}</span>
                  <span aria-hidden="true">•</span>
                  <span>情報確認日 {formatDate(article.updatedAt)}</span>
                </div>
              </div>
              <figure className="mt-12 overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#06101d]">
                <img src={article.heroImage} alt={article.heroAlt} width="1672" height="941" className="aspect-video w-full object-cover" />
                <figcaption className="border-t border-white/10 px-5 py-3 text-xs leading-5 text-slate-500">
                  A2A Insights コンセプトイメージ（生成画像）
                </figcaption>
              </figure>
            </div>
          </header>

          <div className="px-5 pb-24 md:px-10 md:pb-32">
            <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[minmax(0,1fr)_15rem] lg:items-start">
              <div className="min-w-0">
                <section className="rounded-3xl border border-cyan-300/18 bg-cyan-300/[0.045] p-6 md:p-8" aria-labelledby="takeaways-heading">
                  <h2 id="takeaways-heading" className="text-sm tracking-[0.12em] text-cyan-200">この記事でわかること</h2>
                  <ul className="mt-5 space-y-3">
                    {article.takeaways.map((takeaway) => (
                      <li key={takeaway} className="flex gap-3 text-sm leading-7 text-slate-200">
                        <Check size={18} className="mt-1 shrink-0 text-cyan-300" aria-hidden="true" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </section>

                <details className="mt-6 rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:hidden">
                  <summary className="cursor-pointer text-sm text-white">目次</summary>
                  <TableOfContents article={article} className="mt-4" />
                </details>

                <div className="blog-prose mt-12">
                  {article.slug === 'what-is-a2a' && <WhatIsA2AContent />}
                  {article.slug === 'a2a-vs-mcp' && <A2AVsMCPContent />}
                  {article.slug === 'copilot-studio-a2a-agent' && <CopilotStudioContent />}
                </div>

                <section className="mt-16 border-t border-white/10 pt-10" aria-labelledby="sources-heading">
                  <div className="flex items-center justify-between gap-4">
                    <h2 id="sources-heading" className="text-2xl font-light text-white">参照した一次情報</h2>
                    <span className="text-xs text-slate-500">確認日 {formatDate(article.updatedAt)}</span>
                  </div>
                  <ol className="mt-6 space-y-3">
                    {article.sources.map((source, index) => (
                      <li key={source.url} className="grid grid-cols-[1.5rem_1fr] gap-3 text-sm leading-6 text-slate-400">
                        <span className="tabular-nums text-slate-600">{index + 1}</span>
                        <a href={source.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-start gap-2 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white">
                          <span>{source.title} — {source.publisher}</span>
                          <ExternalLink size={13} className="mt-1 shrink-0" aria-hidden="true" />
                        </a>
                      </li>
                    ))}
                  </ol>
                </section>

                <ArticleCTA slug={article.slug} />
                <RelatedArticles article={article} />
              </div>

              <aside className="sticky top-28 hidden rounded-2xl border border-white/10 bg-white/[0.025] p-5 lg:block" aria-label="記事の目次">
                <div className="text-xs tracking-[0.16em] uppercase text-slate-500">Contents</div>
                <TableOfContents article={article} className="mt-5" />
              </aside>
            </div>
          </div>
        </article>
      </main>
    </BlogShell>
  );
}

function TableOfContents({ article, className = '' }: { article: BlogArticle; className?: string }) {
  return (
    <ol className={`space-y-3 text-sm leading-6 text-slate-400 ${className}`}>
      {article.toc.map((item, index) => (
        <li key={item.id}>
          <a href={`#${item.id}`} className="grid grid-cols-[1.5rem_1fr] gap-2 transition-colors hover:text-cyan-200">
            <span className="tabular-nums text-slate-600">{String(index + 1).padStart(2, '0')}</span>
            <span>{item.label}</span>
          </a>
        </li>
      ))}
    </ol>
  );
}

function RelatedArticles({ article }: { article: BlogArticle }) {
  const related = article.relatedSlugs.map(getBlogArticle).filter((item): item is BlogArticle => Boolean(item));
  return (
    <section className="mt-16" aria-labelledby="related-heading">
      <div className="mb-5 flex items-center gap-4">
        <h2 id="related-heading" className="text-xs tracking-[0.18em] uppercase text-slate-400">次に読む</h2>
        <span className="h-px flex-1 bg-white/10" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {related.map((item) => (
          <a key={item.slug} href={`/blog/${item.slug}`} className="group rounded-2xl border border-white/10 bg-white/[0.025] p-5 transition-colors hover:border-cyan-300/25 hover:bg-white/[0.045] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
            <div className="text-xs text-cyan-300">{item.category}</div>
            <h3 className="mt-3 text-lg font-light leading-snug text-white">{item.shortTitle}</h3>
            <div className="mt-5 inline-flex items-center gap-2 text-xs text-slate-400 group-hover:text-white">
              記事を読む <ArrowRight size={14} aria-hidden="true" />
            </div>
          </a>
        ))}
      </div>
    </section>
  );
}

function ArticleCTA({ slug }: { slug: string }) {
  const isImplementation = slug === 'copilot-studio-a2a-agent';
  return (
    <aside className="mt-14 rounded-3xl border border-cyan-300/20 bg-[linear-gradient(135deg,rgba(8,145,178,0.13),rgba(79,70,229,0.08))] p-7 md:p-9">
      <ShieldCheck size={25} className="text-cyan-300" aria-hidden="true" />
      <h2 className="mt-5 text-2xl font-light text-white">
        {isImplementation ? 'A2A連携の設計・検証をご相談ください' : 'AIエージェント間の通信に、信頼レイヤーを。'}
      </h2>
      <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-300">
        {isImplementation
          ? '外部エージェントの認証、権限、監査、相互運用テストまで、企業導入に必要な論点を一緒に整理します。'
          : 'Another Starは、外部AIエージェントを安全に発見・評価・連携するための信頼基盤を開発しています。'}
      </p>
      <a href={isImplementation ? 'mailto:contact@another-star.jp' : '/product'} className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-5 text-sm font-medium text-[#020611] transition-colors hover:bg-cyan-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300">
        {isImplementation ? 'お問い合わせ' : 'プロダクトを見る'} <ArrowRight size={15} aria-hidden="true" />
      </a>
    </aside>
  );
}

function WhatIsA2AContent() {
  return (
    <>
      <Section id="why-a2a" title="なぜA2Aが必要なのか">
        <p>企業が使うAIエージェントは、ひとつの製品や組織だけで完結するとは限りません。調達を担当するエージェントが物流会社のエージェントへ納期を確認し、信用調査エージェントへ評価を依頼するように、得意分野の異なるエージェントを組み合わせる場面が増えていきます。</p>
        <p>しかし、相手ごとにAPI、データ形式、進捗管理の方法が違えば、接続のたびに個別開発が必要です。A2Aはこの境界を共通化します。相手のモデル、プロンプト、内部メモリ、利用ツールを共有させるのではなく、外から見える能力と仕事の受け渡し方をそろえる考え方です。</p>
        <Callout title="2026年8月時点の基準">
          本記事は、最初の安定版・本番利用向け標準として公開されたA2A Protocol v1.0を基準にしています。旧0.3系とは互換性に関わる変更があるため、実装時は版を確認してください。
        </Callout>
      </Section>

      <Section id="core-model" title="A2Aを構成する5つの要素">
        <DefinitionGrid items={[
          ['A2A Client', '仕事を依頼する側のアプリケーションまたはエージェント。'],
          ['A2A Server', '能力を公開し、依頼を受けて処理するリモートエージェント。'],
          ['Agent Card', '名前、説明、接続先、対応機能、スキル、セキュリティ方式などを表すJSON。'],
          ['Message / Part', '指示や会話を運ぶ単位。テキスト、ファイル、構造化データをPartとして扱う。'],
          ['Task / Artifact', '追跡可能な仕事と、その結果として生成される成果物。'],
        ]} />
        <p>特に重要なのがTaskです。すぐ終わる質問だけでなく、途中経過があり、追加情報を求めたり、完了や失敗へ状態遷移したりする仕事を同じモデルで扱えます。</p>
      </Section>

      <Section id="workflow" title="依頼から成果物までの流れ">
        <ol className="blog-steps">
          <Step number="01" title="相手を知る">Agent Cardや管理されたレジストリ、直接設定を通じて、相手の能力と接続方法を確認します。</Step>
          <Step number="02" title="仕事を依頼する">Messageを送り、必要に応じてTaskを作成します。入力はテキストだけでなくファイルや構造化データも扱えます。</Step>
          <Step number="03" title="状態を追跡する">同期応答、ストリーミング、購読、プッシュ通知から、処理時間とネットワーク条件に合う方法を選びます。</Step>
          <Step number="04" title="成果物を受け取る">処理結果はArtifactとして受け取り、後続のエージェントや業務システムへつなぎます。</Step>
        </ol>
      </Section>

      <Section id="enterprise" title="企業導入で注意すること">
        <p>A2A対応であることは、そのエージェントが安全・正確・信頼できることの証明ではありません。プロトコルは通信の共通枠組みを定義しますが、誰を信頼するか、どのデータを渡すか、どの操作を許すかは導入側の設計事項です。</p>
        <ul>
          <li>本番通信はHTTPSを使い、サーバーの本人性を確認する</li>
          <li>APIキーやOAuth 2.0などを用途に合わせて選び、最小権限にする</li>
          <li>Agent Cardの内容だけを信用せず、登録・審査・署名検証を組み合わせる</li>
          <li>入力検証、監査ログ、タイムアウト、キャンセル、事故時の遮断を用意する</li>
          <li>外部エージェントへ送る会話履歴や機密情報の範囲を明示する</li>
        </ul>
      </Section>

      <Section id="summary" title="まとめ">
        <p>A2Aは、AIエージェントを単なるAPIとして呼ぶだけでなく、能力を発見し、仕事を委任し、途中の状態を追い、成果物を受け取るところまでを共通化します。企業にとっての価値は、異なる製品・組織のエージェントを組み合わせやすくなることです。</p>
        <p>次に設計判断で重要になるのが、A2AとMCPの役割分担です。両者は競合ではなく、異なる接続境界を標準化します。</p>
      </Section>
    </>
  );
}

function A2AVsMCPContent() {
  return (
    <>
      <Section id="answer" title="まず結論：接続相手が違う">
        <p><strong>A2Aはエージェント同士をつなぎ、MCPはAIアプリケーションをツールやデータへつなぎます。</strong>この一文が最も大きな違いです。</p>
        <p>A2Aでやり取りする相手は、自ら推論・計画し、複数のツールを使い、長時間のタスクを進める独立したエージェントです。一方、MCPサーバーはtools、resources、promptsなどを公開し、AIアプリケーションが必要な能力やコンテキストを利用できるようにします。</p>
      </Section>

      <Section id="comparison" title="6つの観点で比較">
        <div className="blog-table-wrap" tabIndex={0} aria-label="A2AとMCPの比較表。横にスクロールできます">
          <table>
            <caption>A2A 1.0とMCP 2026-07-28の責務比較</caption>
            <thead><tr><th scope="col">観点</th><th scope="col">A2A</th><th scope="col">MCP</th></tr></thead>
            <tbody>
              <tr><th scope="row">主な接続</th><td>エージェント ↔ エージェント</td><td>AIホスト／クライアント ↔ サーバー</td></tr>
              <tr><th scope="row">相手の性質</th><td>内部実装が不透明でもよい自律的な主体</td><td>ツール、データ、プロンプトを公開する能力提供者</td></tr>
              <tr><th scope="row">中心モデル</th><td>Agent Card、Message、Task、Artifact</td><td>Host、Client、Server、Tools、Resources、Prompts</td></tr>
              <tr><th scope="row">得意な仕事</th><td>委任、交渉、長時間・マルチターンの協調</td><td>関数実行、データ取得、コンテキスト供給</td></tr>
              <tr><th scope="row">状態</th><td>Taskの状態と成果物を追跡</td><td>能力利用の要求と結果を交換</td></tr>
              <tr><th scope="row">典型例</th><td>購買エージェントが物流エージェントへ配送計画を依頼</td><td>購買エージェントが社内DBや見積APIを利用</td></tr>
            </tbody>
          </table>
        </div>
        <p>「A2Aは会話、MCPは関数呼び出し」とだけ覚えると不十分です。A2Aの本質は、会話に加えてタスクのライフサイクルと成果物を扱えること。MCPの本質は、AIアプリケーションに能力とコンテキストを標準的に供給することです。</p>
      </Section>

      <Section id="architecture" title="A2AとMCPを併用する構成">
        <div className="architecture-diagram" role="img" aria-label="顧客対応エージェントと物流エージェントはA2Aで接続し、各エージェントはMCPでCRMや配送APIへ接続する構成">
          <div className="architecture-row"><DiagramNode accent="cyan">顧客対応エージェント</DiagramNode><DiagramLink label="A2A" /><DiagramNode accent="cyan">物流エージェント</DiagramNode></div>
          <div className="architecture-branches"><span>MCP</span><span>MCP</span></div>
          <div className="architecture-row"><DiagramNode accent="violet">CRM・注文DB</DiagramNode><span className="w-10" /><DiagramNode accent="violet">配送API・倉庫DB</DiagramNode></div>
        </div>
        <p>たとえば顧客対応エージェントが配送変更を受け付け、物流エージェントへA2Aで委任します。両エージェントは、それぞれの担当業務に必要なCRM、注文DB、配送APIをMCP経由で使えます。外部との協調と内部の道具利用を分離できる構成です。</p>
      </Section>

      <Section id="decision" title="どちらを使うべきか">
        <DecisionCards />
        <p>判断に迷ったら、接続先が「指示に従って決まった能力を提供するもの」か、「目標を受け取って自律的に進める主体」かを見ます。前者ならMCP、後者ならA2Aが有力です。両方に該当するシステムでは併用します。</p>
      </Section>

      <Section id="security" title="共通するセキュリティ責任">
        <p>標準プロトコルを採用しても、安全性が自動的に保証されるわけではありません。MCPではツール実行やリソース送信に対するユーザーの理解と同意、アクセス制御が重要です。A2Aでは相手の本人性、認証・認可、外部エージェントへ渡す履歴とデータ、長時間タスクの監査が重要になります。</p>
        <Callout title="設計時の要点">プロトコル選択とは別に、許可する相手、許可する能力、渡してよいデータ、実行後の監査を設計してください。A2AとMCPを併用する場合は、二つの境界をまたぐ権限拡大にも注意が必要です。</Callout>
      </Section>
    </>
  );
}

function CopilotStudioContent() {
  return (
    <>
      <Section id="scope" title="この記事で作るもの">
        <p>今回作るのは、Copilot Studio自身をA2Aサーバーとして公開する構成ではありません。外部で動く専門エージェントをA2A対応のHTTPSエンドポイントとして用意し、Copilot Studioのエージェントから接続・委任する構成です。</p>
        <a
          href="https://www.another-star.jp/product#demo"
          target="_blank"
          rel="noopener noreferrer"
          className="group not-prose my-8 flex min-h-20 items-center justify-between gap-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.055] px-5 py-4 transition-colors hover:border-cyan-300/40 hover:bg-cyan-300/[0.09] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 md:px-6"
        >
          <span>
            <span className="block text-[0.65rem] tracking-[0.18em] text-cyan-300">PRODUCT DEMO</span>
            <span className="mt-1 block text-sm leading-6 text-white md:text-base">Copilot Studioを使った実際の動作を動画で見る</span>
          </span>
          <ExternalLink size={18} className="shrink-0 text-cyan-300 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
        </a>
        <Callout title="提供状況">
          Copilot StudioからA2Aで他のエージェントへ接続する機能は、Microsoftの2026年4月更新で一般提供（GA）と案内されています。2026年6月に追加された「新しいエージェント体験」の他エージェント接続プレビューとは別です。本記事の画面名は標準ハーネス／クラシック体験を基準にしています。
        </Callout>
      </Section>

      <Section id="why-copilot-studio" title="なぜCopilot Studioなのか">
        <p>理由はモデルの優劣ではなく、<strong>外部A2Aエージェントを製品の設定画面から接続できる機能が、一般提供されているから</strong>です。Copilot Studioでは通信エンドポイントと認証方式を登録し、外部エージェントをオーケストレーションの委任先として追加できます。</p>
        <p>2026年8月15日時点で公開されている各社の公式資料を同じ条件で比べると、一般向けのChatGPT、Claude、Gemini Appsには、Copilot Studioと同じように任意のA2Aエージェントを委任先として登録する公式導線が確認できません。ChatGPTとClaudeのカスタム接続はMCPが中心で、Gemini AppsのGemsは指示や知識を再利用する機能です。</p>
        <div className="blog-table-wrap" tabIndex={0} aria-label="主要AIサービスにおける外部A2Aエージェント接続の提供状況。横にスクロールできます">
          <table>
            <caption>外部A2Aエージェント接続の公開情報（2026年8月15日確認）</caption>
            <thead><tr><th scope="col">製品</th><th scope="col">公開されている接続方式</th><th scope="col">A2Aの位置づけ</th></tr></thead>
            <tbody>
              <tr><th scope="row">Copilot Studio</th><td>外部A2Aエージェント、各種connector</td><td>A2A接続をGAで提供</td></tr>
              <tr><th scope="row">ChatGPT</th><td>MCP Apps／custom MCP connector</td><td>外部A2A登録の公式手順は確認できず</td></tr>
              <tr><th scope="row">Claude</th><td>remote MCP connector</td><td>外部A2A登録の公式手順は確認できず</td></tr>
              <tr><th scope="row">Gemini Apps</th><td>Gems、Connected Apps</td><td>任意の外部A2A登録は確認できず</td></tr>
              <tr><th scope="row">Gemini Enterprise</th><td>Agent Card JSONを手動登録</td><td>Preview。v0.3 streaming対応。選択／明示指定で会話可能</td></tr>
              <tr><th scope="row">Google Agent Platform</th><td>A2A対応runtime</td><td>A2A agent frameworkをPreviewで提供</td></tr>
            </tbody>
          </table>
        </div>
        <Callout title="「Geminiは非対応」と一括りにはできない">
          <p>一般向けのGemini Appsと、企業・開発者向けのエージェント基盤は別です。Gemini Appsでは任意のA2Aを追加する導線は確認できません。一方、Gemini Enterpriseには「Custom agent via A2A」を選び、独自のAgent Card JSONを手動登録する公式手順があります。登録後はPreviewでテストし、Agent Galleryから選択して会話できます。</p>
          <p>ただし、Gemini Enterprise側はPreviewで、ネイティブ対応はA2A v0.3 streamingです。A2A v1.0以降は互換パッケージが必要です。また、通常のGemini会話から能力を判断して独自A2Aへ自動委任することや、Copilot Studioと同等の汎用APIキー認証は公式資料で確認できません。エージェント未指定時はCore Assistantが処理するため、「Copilot Studioと同じ」とは扱わないのが安全です。</p>
        </Callout>
        <p>つまり、コードで独自のオーケストレーターを組むのではなく、GAのローコード管理画面、接続先認証、テストキャンバスまで含めてA2A連携を試したい場合に、Copilot Studioが現時点で扱いやすい選択肢になります。</p>
      </Section>

      <Section id="prerequisites" title="事前準備">
        <ul>
          <li>Copilot Studioの対象環境と、エージェントを編集・接続設定できる権限</li>
          <li>Copilot Studioから到達できるHTTPSのA2Aエンドポイント（公開または構成済みのVNet／オンプレミス接続）</li>
          <li>None、API key、OAuth 2.0のいずれかの認証設計</li>
          <li>接続先エージェントの名前、説明、得意なタスク</li>
          <li>本番利用に必要なCopilot StudioライセンスとCopilot Creditsの確認</li>
        </ul>
        <p>試用ライセンスでもエージェントの作成とテストチャットはできますが、公開はできません。本番化する場合は、スタンドアロン契約、従量課金、Microsoft 365 Copilotなど、利用形態に合う権利を管理者と確認します。</p>
      </Section>

      <Section id="external-agent" title="外部A2Aエージェントを公開する">
        <p>外部エージェントは、Copilot Studioから到達できるHTTPS URLで公開します。開発時はDev Tunnelsなどで確認できますが、本番では認証付きのWeb Appやコンテナへ配置し、安定したホスト名、証明書、監視、レート制限を用意します。</p>
        <p>Microsoft Agent Frameworkを使う場合は、ASP.NET Core統合でエージェント、パス、Agent Card情報をマッピングできます。次は構造を示すための最小例です。パッケージとAPIは更新されるため、実装時はMicrosoft Learnの最新版に合わせてください。</p>
        <pre><code>{`app.MapA2A(
    agent,
    path: "/a2a/specialist",
    agentCard: agentCard
);`}</code></pre>
        <p>Agent Cardを標準のwell-known URLで公開すると、Copilot Studioが名前と説明を自動取得できます。取得できない場合は手入力も可能です。</p>
        <Callout title="Agent CardのCORS対応を忘れない（現行UIでの実測）">
          <p>Copilot Studioの接続設定では、通信エンドポイントを入力すると、well-known URLのAgent Cardを読んで名前と説明を補完します。現行の設定画面では、このCard取得がCopilot Studioを開いているブラウザから接続先へ直接行われるため、Agent Cardを返すサーバー側でCORSを許可する必要があります。</p>
          <p><code>curl</code>やブラウザのアドレスバーでCardが200を返しても、CORSレスポンスヘッダーがなければ、設定画面のクロスオリジン取得は失敗します。ブラウザのNetworkパネルで実際の<code>Origin</code>を確認し、そのオリジンを<code>Access-Control-Allow-Origin</code>で必要最小限に許可してください。動的にOriginを返す場合は<code>Vary: Origin</code>も付け、プリフライトが発生する構成では<code>OPTIONS</code>も処理します。</p>
          <p>これは主に接続設定時のAgent Card discoveryに関する注意です。接続後のA2Aメッセージがcustom connector infrastructureを通ることとは、経路を分けて確認してください。</p>
        </Callout>
        <Callout title="A2A 1.0との互換性に注意">
          A2A 1.0の標準well-known URIは <code>/.well-known/agent-card.json</code> です。一方、現行のMicrosoft Learn手順には <code>/.well-known/agent.json</code> の記載も残っています。接続先SDK、Copilot Studioのロールアウト、送信するA2A-Versionをそろえ、実環境で発見とメッセージ送信を確認してください。
        </Callout>
      </Section>

      <Section id="connect" title="Copilot Studioから接続する">
        <Callout title="実際の接続ではMicrosoft Learnの最新版を確認">
          Copilot Studioの画面名、選択肢、接続手順はアップデートや段階的なロールアウトによって変わる可能性があります。実際に設定するときは、Microsoft Learnの
          {' '}<a href="https://learn.microsoft.com/ja-jp/microsoft-copilot-studio/add-agent-agent-to-agent" target="_blank" rel="noopener noreferrer">「Agent2Agent（A2A）プロトコル経由でエージェントに接続する」</a>
          を参照し、対象テナントの表示と照らし合わせてください。本記事の手順は2026年8月12日の確認内容です。
        </Callout>
        <ol className="blog-steps">
          <Step number="01" title="親エージェントを開く">Copilot Studioで、外部エージェントへ仕事を委任する側のエージェントを開きます。</Step>
          <Step number="02" title="A2A接続を追加">左側の「Agents」から「Add an agent」を選び、「Connect to an external agent」内の「Agent2Agent」または表示される「A2A agent」を選択します。</Step>
          <Step number="03" title="通信エンドポイントを入力">Agent Card URLではなく、外部エージェントの通信エンドポイントURLを入力します。Agent Cardが取得できれば名前と説明が補完されます。</Step>
          <Step number="04" title="認証を選ぶ">None、API key、OAuth 2.0から選択します。本番では公開範囲とデータ感度に合わせ、原則として認証を設定します。</Step>
          <Step number="05" title="接続を作成して追加">Createを押し、必要なconnectionを選択して「Add and configure」で親エージェントへ追加します。</Step>
        </ol>
      </Section>

      <Section id="test" title="委任をテストする">
        <p>テストキャンバスから、外部エージェントの説明とスキルに合う依頼を送ります。単に最終回答が返るかだけでなく、どのエージェントへ委任されたか、必要な会話履歴が渡ったか、Taskが完了・失敗・追加入力待ちになったときの挙動も確認します。</p>
        <Checklist items={[
          '親エージェントが適切な依頼だけを外部へ委任する',
          '認証失敗・タイムアウト・キャンセルを利用者へ説明できる',
          '同じcontextIdの会話が意図せず別ユーザーと混ざらない',
          '外部へ渡すチャット履歴に機密情報や不要な個人情報が含まれない',
          'ストリーミング結果、Task状態、最終Artifactを正しく扱える',
        ]} />
      </Section>

      <Section id="production" title="本番化のチェックポイント">
        <p>Copilot Studioは接続の窓口を提供しますが、外部エージェントの品質、データの流れ、権限、監査は導入者の責任です。次の項目を運用設計へ含めます。</p>
        <ul>
          <li>OAuth 2.0やAPIキーの保管・ローテーション・失効手順</li>
          <li>DLP、データ所在地、会話履歴と成果物の保持期間</li>
          <li>外部エージェントの変更監視とAgent Cardの再評価</li>
          <li>入力検証、出力の機密度、別の外部エージェントへの転送制御</li>
          <li>委任率、成功率、遅延、失敗理由を追う監視と監査ログ</li>
          <li>人の承認が必要な操作と、緊急時に接続を止める手順</li>
        </ul>
        <p>画面や機能は段階的にロールアウトされるため、公開前に対象テナントでUI、A2Aバージョン、タスク操作、ライセンスを再確認してください。</p>
      </Section>
    </>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return <section id={id} className="scroll-mt-28"><h2>{title}</h2>{children}</section>;
}

function Callout({ title, children }: { title: string; children: ReactNode }) {
  return <aside className="blog-callout"><div className="blog-callout-title">{title}</div><div>{children}</div></aside>;
}

function DefinitionGrid({ items }: { items: [string, string][] }) {
  return <dl className="definition-grid">{items.map(([term, description]) => <div key={term}><dt>{term}</dt><dd>{description}</dd></div>)}</dl>;
}

function Step({ number, title, children }: { number: string; title: string; children: ReactNode }) {
  return <li><span className="blog-step-number">{number}</span><div><h3>{title}</h3><p>{children}</p></div></li>;
}

function DiagramNode({ accent, children }: { accent: 'cyan' | 'violet'; children: ReactNode }) {
  return <div className={`diagram-node diagram-node-${accent}`}>{children}</div>;
}

function DiagramLink({ label }: { label: string }) {
  return <div className="diagram-link"><span>{label}</span></div>;
}

function DecisionCards() {
  return <div className="decision-cards"><div><span>A2Aを検討</span><h3>相手が自律的なエージェント</h3><p>目標を渡し、相手が計画・実行し、途中状態や成果物を返す。</p></div><div><span>MCPを検討</span><h3>相手がツールやデータ</h3><p>提供された関数、リソース、プロンプトをAIアプリケーションが利用する。</p></div></div>;
}

function Checklist({ items }: { items: string[] }) {
  return <ul className="checklist">{items.map((item) => <li key={item}><Check size={17} aria-hidden="true" /><span>{item}</span></li>)}</ul>;
}

function formatDate(value: string) {
  const [year, month, day] = value.split('-');
  return `${year}.${month}.${day}`;
}
