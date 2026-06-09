import { motion } from 'motion/react';
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Workflow,
} from 'lucide-react';

const sectionTitleClass = 'text-[0.72rem] tracking-[0.28em] uppercase text-cyan-300/78';
const sectionHeadingClass = 'mt-4 text-3xl md:text-5xl font-light tracking-[0.04em] text-white leading-tight';
const sectionBodyClass = 'mt-5 max-w-3xl text-sm md:text-base leading-8 text-slate-300/82';

const solutionPillars = [
  {
    icon: BadgeCheck,
    title: '事前評価',
    body: '提供企業の登録エージェントを多段階で審査し、導入前に信頼スコアを付与します。',
  },
  {
    icon: Workflow,
    title: '仲介実行',
    body: 'エージェント同士を直接対話させず、仲介レイヤーが通信を引き受けます。',
  },
  {
    icon: ShieldAlert,
    title: 'リアルタイム防御',
    body: '間接的プロンプトインジェクションや計画逸脱を検知し、その場で遮断します。',
  },
  {
    icon: Sparkles,
    title: '継続再評価',
    body: '検知結果を反映してスコアを更新し、修正後の再評価までつなげます。',
  },
];

const flowSteps = [
  {
    id: '01',
    title: 'マッチング',
    body: 'A の意図に合う B を選定します。',
  },
  {
    id: '02',
    title: '計画立案',
    body: '逸脱しない実行プランを生成します。',
  },
  {
    id: '03',
    title: '代理実行',
    body: 'A の代わりに B と対話・検査します。',
  },
  {
    id: '04',
    title: '異常検知・遮断',
    body: '計画外行動を即時ブロックします。',
  },
];

const solutionColumns = [
  {
    label: 'Demand Side',
    title: '企業エージェント',
    body: '調達 / 与信 / 物流 / CS',
  },
  {
    label: 'Another Star Core',
    title: 'エージェントストア + 仲介エージェント',
    body: 'マッチング・PI 防御・異常検知・信頼スコア',
    featured: true,
  },
  {
    label: 'Supply Side',
    title: '登録エージェント群',
    body: '決済 / 物流 / 翻訳 / 信用調査',
  },
];

const solutionCapabilities = [
  {
    id: '01',
    title: '事前評価',
    body: 'AISI 準拠・6 段階自動審査で 0–100 点の信頼スコアを発行します。',
  },
  {
    id: '02',
    title: 'リアルタイム防御',
    body: '仲介経路で間接的プロンプトインジェクション・計画逸脱を検知してブロックします。',
  },
  {
    id: '03',
    title: '自己改善ループ',
    body: '脆弱性検知 → スコア自動引下げ → 修正 → 再評価で回復する動的フィードバックを備えます。',
  },
];

const fitCases = [
  {
    title: '利用企業 / 業務部門',
    body: '安全が確認された登録エージェントだけを使わせたい企業向け。迷わず導入できる利用環境を整えます。',
  },
  {
    title: 'セキュリティ部門 / SecOps',
    body: '許可リスト、監査ログ、双方向ブロックを前提に、A2A 連携を統制したいチーム向けです。',
  },
  {
    title: '提供企業 / エージェント開発側',
    body: '自社エージェントを見つけてもらい、安全性評価とインシデント時の流通停止まで備えたい提供側に向いています。',
  },
];

function SectionHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <div>
      <div className={sectionTitleClass}>{eyebrow}</div>
      <h2 className={sectionHeadingClass}>{title}</h2>
      <p className={sectionBodyClass}>{body}</p>
    </div>
  );
}

export function ProductPage() {
  return (
    <div className="min-h-[100svh] bg-[#020611] text-white">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(22,78,99,0.22),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(30,64,175,0.22),transparent_24%),linear-gradient(180deg,#040915_0%,#020611_45%,#01030b_100%)]" />
        <div className="absolute inset-0 opacity-40 bg-[linear-gradient(rgba(148,163,184,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.06)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      <div className="relative z-10">
        <header className="sticky top-0 z-20 border-b border-white/8 bg-[#020611]/72 backdrop-blur-2xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 md:px-10">
            <a
              href="/"
              className="inline-flex items-center gap-2 text-sm tracking-[0.16em] uppercase text-slate-300 transition-colors hover:text-white"
            >
              <ArrowLeft size={16} />
              Another Star
            </a>
            <a
              href="mailto:contact@another-star.jp"
              className="rounded-full border border-cyan-400/24 bg-cyan-400/10 px-4 py-2 text-[0.68rem] tracking-[0.18em] uppercase text-cyan-200 transition-colors hover:border-cyan-300/40 hover:bg-cyan-300/14"
            >
              Contact
            </a>
          </div>
        </header>

        <main>
          <section className="flex min-h-[100svh] items-center px-6 pb-16 pt-24 md:px-10 md:pb-20 md:pt-28">
            <div className="mx-auto grid w-full max-w-7xl gap-12 lg:items-end">
              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7 }}
                className="max-w-[72rem]"
              >
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/18 bg-cyan-400/8 px-4 py-2 text-[0.68rem] tracking-[0.2em] uppercase text-cyan-200/88">
                  A2A Trust Infrastructure
                </div>
                <h1 className="mt-6 max-w-5xl text-[2.6rem] font-light leading-[1.02] tracking-[0.02em] text-white sm:text-[3.8rem] lg:text-[4.4rem] xl:text-[4.8rem]">
                  <span className="block sm:whitespace-nowrap">AIエージェント同士の通信に、</span>
                  <span className="block sm:whitespace-nowrap">信頼レイヤーを挿し込む。</span>
                </h1>
                <p className="mt-7 max-w-3xl text-lg leading-8 text-slate-100/92">
                  AIエージェント間通信のための信頼基盤。
                </p>
                <p className="mt-4 max-w-4xl text-base leading-8 break-words text-slate-300/88 md:text-lg">
                  提供企業の登録エージェントの審査、信頼スコア、仲介実行、異常検知を一体で扱うことで、
                  A2A 通信をそのまま本番運用へ持ち込める状態に近づけます。
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#solution"
                    className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium tracking-[0.08em] text-black transition-transform hover:-translate-y-0.5"
                  >
                    仕組みを見る
                    <ArrowRight size={14} />
                  </a>
                  <a
                    href="mailto:contact@another-star.jp"
                    className="rounded-full border border-white/16 px-6 py-3 text-sm tracking-[0.08em] text-slate-200 transition-colors hover:border-white/28 hover:text-white"
                  >
                    お問い合わせ
                  </a>
                  <a
                    href="https://prtimes.jp/main/html/rd/p/000000002.000180278.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-cyan-400/18 bg-cyan-400/8 px-5 py-3 text-sm tracking-[0.08em] text-cyan-100/88 transition-colors hover:border-cyan-300/40 hover:bg-cyan-300/14 hover:text-white"
                  >
                    GENIAC-PRIZE みらいビジョン賞 受賞
                    <ExternalLink size={14} />
                  </a>
                </div>
              </motion.div>

            </div>
          </section>

          <section className="px-6 py-16 md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                eyebrow="Problem"
                title="AI 時代の連携には、A2A 専用の信頼レイヤーが必要です。"
                body="従来のシステム連携は、人やアプリケーションが決められた経路を呼び出す前提で設計されてきました。一方で AI 時代の連携では、AI が AI を呼び出し、委譲や判断が動的に連鎖します。その結果、既存の監視やログだけでは「誰が・何を・なぜ実行したか」が見えにくくなります。A2A では通信の正当性と責任分界を、別の信頼レイヤーで扱う必要があります。"
              />
            </div>
          </section>

          <section id="solution" className="px-6 py-16 md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                eyebrow="Solution"
                title="登録エージェント同士を、安全に接続して使える仲介基盤。"
                body="利用企業側の社内エージェントと、提供企業側の登録エージェント群を、本プラットフォームのコアが接続します。エージェントストア、仲介エージェント、信頼スコアを一体で扱うことで、A2A 通信を安全に成立させます。"
              />

              <div className="mt-10">
                <div className="mb-4 inline-flex rounded-xl border border-cyan-300/24 bg-cyan-300/10 px-4 py-2 text-[0.72rem] tracking-[0.18em] uppercase text-cyan-200">
                  全体構造
                </div>
              </div>

              <div className="p-6 md:p-8">
                <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_120px_minmax(320px,1.1fr)_120px_minmax(0,1fr)] lg:items-center">
                  {solutionColumns.map((column, index) => (
                    <div key={column.title} className="contents">
                      {index > 0 && (
                        <div className="hidden lg:flex flex-col items-center justify-center gap-3 text-slate-400/70">
                          <div className="text-2xl">⇄</div>
                          <div className="text-[0.72rem] tracking-[0.18em] uppercase">A2A 通信</div>
                        </div>
                      )}
                      <div
                        className={`rounded-[1.8rem] border p-7 ${
                          column.featured
                            ? 'border-cyan-300/28 bg-[linear-gradient(180deg,rgba(10,22,38,0.92),rgba(4,10,20,0.98))]'
                            : 'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.025))]'
                        }`}
                      >
                        <div className={`inline-flex rounded-xl border px-4 py-2 text-[0.72rem] tracking-[0.18em] uppercase ${
                          column.featured
                            ? 'border-cyan-300/32 bg-cyan-300/10 text-cyan-200'
                            : 'border-white/10 bg-white/[0.03] text-slate-300/72'
                        }`}>
                          {column.label}
                        </div>
                        <h3 className="mt-6 text-2xl font-light tracking-[0.03em] text-white">{column.title}</h3>
                        <p className="mt-4 text-sm leading-8 text-slate-300/78">{column.body}</p>
                        {!column.featured && (
                          <div className="mt-6 flex items-center gap-3 text-slate-400/70 lg:hidden">
                            <div className="text-xl">⇄</div>
                            <div className="text-[0.72rem] tracking-[0.18em] uppercase">A2A 通信</div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10">
                <div className="mb-4 inline-flex rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2 text-[0.72rem] tracking-[0.18em] uppercase text-slate-300/78">
                  主要機能
                </div>
              </div>

              <div className="grid gap-6 lg:grid-cols-3">
                {solutionCapabilities.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-[1.8rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.025),rgba(255,255,255,0.012))] p-7"
                  >
                    <div className="text-[0.78rem] tracking-[0.22em] uppercase text-slate-400/72">{item.id}</div>
                    <h3 className="mt-4 text-2xl font-light tracking-[0.03em] text-white">{item.title}</h3>
                    <p className="mt-4 text-sm leading-8 text-slate-300/78">{item.body}</p>
                  </div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 22 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.12 }}
                className="mt-10"
              >
                <div className="text-[0.68rem] tracking-[0.22em] uppercase text-cyan-300/78">Core Loop</div>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  {solutionPillars.map((pillar) => {
                    return (
                      <div
                        key={pillar.title}
                        className="rounded-2xl border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.03),rgba(255,255,255,0.018))] p-5"
                      >
                        <div>
                          <div className="text-lg font-light tracking-[0.03em] text-white">{pillar.title}</div>
                          <p className="mt-4 text-sm leading-7 text-slate-300/78">{pillar.body}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </section>

          <section className="px-6 py-16 md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl">
              <SectionHeader
                eyebrow="How It Works"
                title="企業エージェントと登録エージェントを、直接つなげない。"
                body="企業側のエージェントが登録エージェントと直接対話すると、登録先に混入した命令や不正な応答をそのまま信じてしまう余地が生まれます。本プラットフォームでは、仲介エージェントが間に入り、対話内容を検査・遮断したうえで、健全化された結果だけを返します。"
              />

              <div className="mt-10 overflow-hidden rounded-[2rem] border border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
                <picture>
                  <source media="(max-width: 767px)" srcSet="/how-it-works-mobile.png" />
                  <img
                    src="/how-it-works-desktop.png"
                    alt="仲介なしの直接対話と、仲介エージェント介在時の違いを比較した図"
                    className="block h-auto w-full"
                  />
                </picture>
              </div>

              <div className="mt-10">
                <div className="inline-flex rounded-xl border border-cyan-300/28 bg-cyan-300/10 px-4 py-2 text-[0.78rem] tracking-[0.18em] uppercase text-cyan-200">
                  仲介エージェントの 4 ステップ
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-4">
                {flowSteps.map((step) => (
                  <div
                    key={step.id}
                    className="rounded-[1.7rem] border border-white/8 bg-white/[0.025] p-6"
                  >
                    <div className="text-[0.72rem] tracking-[0.24em] uppercase text-cyan-300/70">{step.id}</div>
                    <div className="mt-4 text-lg font-light tracking-[0.03em] text-white">{step.title}</div>
                    <p className="mt-3 text-sm leading-7 text-slate-300/78">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 py-16 md:px-10 md:py-24">
            <div className="mx-auto max-w-7xl">
              <div className="max-w-3xl">
                <div className="text-[0.72rem] tracking-[0.22em] uppercase text-cyan-300/72">Best Fit</div>
                <h2 className="mt-4 text-3xl font-light tracking-[0.03em] text-white md:text-5xl">
                  こんな組織に向いています
                </h2>
              </div>

              <div className="mt-8 grid gap-4 lg:grid-cols-3">
                {fitCases.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.7rem] border border-cyan-400/14 bg-[linear-gradient(180deg,rgba(10,26,34,0.62),rgba(4,11,18,0.92))] p-6 text-sm leading-7 text-slate-200/80"
                  >
                    <div className="text-[0.72rem] tracking-[0.18em] uppercase text-cyan-300/74">{item.title}</div>
                    <p className="mt-4">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 pb-24 pt-10 md:px-10 md:pb-28">
            <div className="mx-auto max-w-7xl rounded-[2.2rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(34,211,238,0.08),rgba(59,130,246,0.12))] p-8 md:p-12">
              <div className="max-w-3xl">
                <div className="text-[0.72rem] tracking-[0.24em] uppercase text-cyan-200/72">Contact</div>
                <p className="mt-4 text-sm leading-8 text-slate-200/76 md:text-base">
                  製品詳細に加えて、共同研究、協業や事業提携、資金調達に関するご相談もメールで受け付けています。
                  <br />
                  事業会社、パートナー、VC の方もお気軽にご連絡ください。
                </p>
              </div>
              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="mailto:contact@another-star.jp"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-xs font-medium tracking-[0.18em] text-black transition-transform hover:-translate-y-0.5"
                >
                  contact@another-star.jp
                  <ArrowRight size={14} />
                </a>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
