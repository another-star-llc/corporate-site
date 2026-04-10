import type { ReactNode } from 'react';

import naoyaYasudaImg from '../assets/naoya_yasuda.png';
import saitoImg from '../assets/saito_shinnnosuke.jpeg';
import hiromatsuImg from '../assets/hiromatsu.png';
import satoKojiImg from '../assets/sato_koji.png';
import kannoImg from '../assets/Kanno.png';

// ─── 共通パーツ ────────────────────────────────────────────────

const bodyTextClass = 'text-[15px] leading-8 text-slate-200/88';
const subTextClass = 'text-sm leading-7 text-slate-300/78';
const cardClass = 'rounded-2xl border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.08),rgba(255,255,255,0.04))] shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]';
const labelClass = 'text-[11px] tracking-[0.18em] uppercase text-slate-400/80';

function ContentShell({ children }: { children: ReactNode }) {
  return <div className="px-6 py-6 sm:px-7 sm:py-7">{children}</div>;
}

function ContentHeading({ children }: { children: ReactNode }) {
  return (
    <h2 className="text-[2rem] text-white font-light tracking-[0.04em] mb-6">{children}</h2>
  );
}

function InfoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className={`${cardClass} p-4`}>
      <div className={`${labelClass} mb-2`}>{label}</div>
      <div className={bodyTextClass}>{children}</div>
    </div>
  );
}

function PersonCard({
  img,
  name,
  role,
  description,
  detail,
}: {
  img: string;
  name: string;
  role: string;
  description?: string;
  detail?: ReactNode;
}) {
  return (
    <div className="py-6 border-b border-white/10 last:border-0 last:pb-0 first:pt-0">
      <div className="flex items-start gap-4">
        <img
          src={img}
          alt={name}
          className="w-16 h-16 rounded-full ring-1 ring-white/15 object-cover flex-shrink-0 shadow-[0_8px_24px_rgba(0,0,0,0.28)]"
        />
        <div className="min-w-0 flex-1">
          <div className="text-white font-light text-[1.9rem] leading-none tracking-[0.03em]">{name}</div>
          <div className="text-slate-300/72 text-sm tracking-[0.08em] mt-2">{role}</div>
          {description && (
            <p className={`${bodyTextClass} mt-4`}>{description}</p>
          )}
          {detail && <div className="mt-3">{detail}</div>}
        </div>
      </div>
    </div>
  );
}

// ─── コンテンツ ────────────────────────────────────────────────

export function AboutContent() {
  return (
    <ContentShell>
      <ContentHeading>会社概要</ContentHeading>

      <div className={`space-y-4 mb-7 ${bodyTextClass}`}>
        <p>
          Another Star合同会社は、AIエージェント間の安全な連携を実現するセキュリティ基盤を開発するテクノロジー企業です。
        </p>
        <p>
          2025年7月の設立からわずか8ヶ月で、NEDO主催 GENIAC-PRIZEにおいて特別賞「みらいビジョン賞」を受賞。AIエージェント同士の通信に信頼レイヤーを提供する独自のプラットフォームが、新規性・将来性の観点から高く評価されました。
        </p>
        <p>
          今後は公的機関や産官学との連携を深め、AIエージェント連携のグローバルセキュリティ標準の確立を目指します。
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <InfoBlock label="設立">2025年7月22日</InfoBlock>
        <InfoBlock label="資本金">50万円</InfoBlock>
      </div>
      <div className="mt-2">
        <InfoBlock label="所在地">〒107-0062 東京都港区南青山３丁目１番３６号 青山丸竹ビル６F</InfoBlock>
      </div>
    </ContentShell>
  );
}

export function MissionContent() {
  const items = [
    {
      title: 'AIエージェントの信頼を守る',
      body: 'エージェントストアと仲介エージェントで、AI間通信の安全性を多層防御する。',
    },
    {
      title: 'AIが市場を歪めることを防ぐ',
      body: 'デジタル市場の価格操作・バイアス・不正パターンをリアルタイムに検知・可視化する。',
    },
    {
      title: 'オープンな標準で社会全体を守る',
      body: '産官学連携で、誰もが参照できるグローバルなAIガバナンス基準を確立する。',
    },
  ];

  return (
    <ContentShell>
      <ContentHeading>ミッション</ContentHeading>
      <div className="space-y-px">
        {items.map((item) => (
          <div
            key={item.title}
            className="py-5 border-b border-white/10 last:border-0"
          >
            <div className="text-white font-light text-lg tracking-[0.02em] mb-2">{item.title}</div>
            <p className={subTextClass}>{item.body}</p>
          </div>
        ))}
      </div>
    </ContentShell>
  );
}

export function MembersContent() {
  return (
    <ContentShell>
      <ContentHeading>メンバー紹介</ContentHeading>
      <div>
        <PersonCard
          img={naoyaYasudaImg}
          name="安田 直也"
          role="共同創業者 / 代表社員"
          description="複数のSIerを経てフリーランスのFDEとして活動。並行して公正取引委員会にてデジタルアナリストを兼務。"
          detail={
            <div className="grid grid-cols-2 gap-2">
              <div className={`${cardClass} px-4 py-3`}>
                <div className={`${labelClass} mb-1`}>専門</div>
                <p className={subTextClass}>データ基盤構築、AIシステム設計</p>
              </div>
              <div className={`${cardClass} px-4 py-3`}>
                <div className={`${labelClass} mb-1`}>経験</div>
                <p className={subTextClass}>日系中華系SIer企業でのリード開発</p>
              </div>
            </div>
          }
        />
        <PersonCard
          img={saitoImg}
          name="齊藤 慎之介"
          role="共同創業者 / 業務執行社員"
          description="大手SIerにて全社の技術戦略や先端技術を推進。現在はデータ基盤構築やAIを活用した商用アプリ開発に従事。"
          detail={
            <div className="grid grid-cols-2 gap-2">
              <div className={`${cardClass} px-4 py-3`}>
                <div className={`${labelClass} mb-1`}>専門</div>
                <p className={subTextClass}>セキュリティ、AI、データ基盤</p>
              </div>
              <div className={`${cardClass} px-4 py-3`}>
                <div className={`${labelClass} mb-1`}>経験</div>
                <p className={subTextClass}>AI・データ活用の戦略立案から実装</p>
              </div>
            </div>
          }
        />
      </div>
    </ContentShell>
  );
}

export function TeamContent() {
  return (
    <ContentShell>
      <ContentHeading>開発チーム</ContentHeading>
      <div>
        <PersonCard
          img={hiromatsuImg}
          name="広松 太一"
          role="開発メンバー / テックリード"
          description="大手SIerのR&D部門で総合商社向けAI・DXプロジェクトを推進。企画から設計・開発まで担当。"
        />
        <PersonCard
          img={satoKojiImg}
          name="佐藤 幸治"
          role="開発メンバー / 戦略担当"
          description="複数の外資系コンサルを経て公正取引委員会のデジタルアナリストを務める。事業戦略・市場展開を担当。"
        />
        <PersonCard
          img={kannoImg}
          name="菅野 哲"
          role="アドバイザー"
          description="公正取引委員会デジタルアナリスト兼GMOコネクト執行役員CTO。第三者レビュー・技術監修・意思決定支援担当。"
        />
      </div>
    </ContentShell>
  );
}

export function SystemsContent() {
  return (
    <ContentShell>
      <ContentHeading>システム・技術紹介</ContentHeading>

      {/* 受賞バッジ */}
      <div className={`${cardClass} mb-6 p-5`}>
        <div className={`${labelClass} mb-2`}>
          GENIAC-PRIZE 領域3
        </div>
        <div className="text-white text-base font-medium mb-2">みらいビジョン賞 受賞</div>
        <p className={subTextClass}>
          外部AIエージェントの真正性とセキュリティを多段階で評価しスコア化するエージェントストアと、仲介エージェントを組み合わせた国産OSSプラットフォーム。計画逸脱や不正を検知した場合は即座にブロックし、自己改善ループにより安全性を継続向上させます。
        </p>
      </div>

      <div className="space-y-4">
        {/* Browser Agent Detector */}
        <div className="border-b border-white/10 pb-5">
          <div className="text-white font-light text-lg mb-1.5">Browser Agent Detector</div>
          <div className="text-slate-300/68 text-xs tracking-[0.12em] mb-3">機械学習モデルによるブラウザ操作検知システム</div>
          <p className={`${subTextClass} mb-4`}>
            会員制サイトを対象に「会員のペルソナからの逸脱度」「操作ログやブラウザ属性」による多段検知システム
          </p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['Comet', 'ChatGPT Atlas', 'Playwright MCP', 'Gemini Computer Use'].map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 rounded-full border border-white/10 bg-white/[0.06] text-slate-200/86 text-xs tracking-wide"
              >
                {tag}
              </span>
            ))}
          </div>
          <div className={labelClass}>提供形態 - API提供サービス</div>
        </div>

        {/* AI Bias Watcher */}
        <div>
          <div className="text-white font-light text-lg mb-1.5">AI Bias Watcher</div>
          <div className="text-slate-300/68 text-xs tracking-[0.12em] mb-3">AI検索サービスの企業バイアス検知</div>
          <p className={`${subTextClass} mb-4`}>
            PerplexityなどのAI検索サービスに企業評価クエリを定期送信し、回答の偏りを時系列で可視化する監視ダッシュボード。
          </p>
          <div className="grid grid-cols-2 gap-1.5">
            {[
              '定期クエリと自動収集',
              '指標別バイアストラッキング',
              '時系列ダッシュボード解析',
              'SNS投稿&レポート生成',
            ].map((item) => (
              <div key={item} className={`${cardClass} px-3 py-2.5 text-slate-200/80 text-xs leading-5`}>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentShell>
  );
}

export function ContactContent() {
  return (
    <ContentShell>
      <ContentHeading>お問い合わせ</ContentHeading>

      <p className={`${bodyTextClass} mb-6`}>
        受託開発のご依頼を承っております。詳細はメールにてお問い合わせください。
      </p>

      <div className="space-y-2">
        <a
          href="mailto:contact@another-star.jp"
          className={`flex items-center justify-between p-4 transition-colors group ${cardClass} hover:bg-white/[0.09]`}
        >
          <div>
            <div className={`${labelClass} mb-1.5`}>Email</div>
            <div className="text-white text-base group-hover:text-white transition-colors">
              contact@another-star.jp
            </div>
          </div>
          <span className="text-slate-300/70 group-hover:text-white group-hover:translate-x-0.5 transition-all text-base">
            →
          </span>
        </a>

        <div className="grid grid-cols-2 gap-2">
          <InfoBlock label="Business">受託開発・コンサルティング・技術提携</InfoBlock>
          <InfoBlock label="Location">東京都港区南青山</InfoBlock>
        </div>
      </div>
    </ContentShell>
  );
}

// ─── エントリポイント ────────────────────────────────────────────

export function getWindowContent(id: string): ReactNode {
  const map: Record<string, ReactNode> = {
    about: <AboutContent />,
    mission: <MissionContent />,
    members: <MembersContent />,
    team: <TeamContent />,
    systems: <SystemsContent />,
    contact: <ContactContent />,
  };
  return map[id] ?? null;
}
