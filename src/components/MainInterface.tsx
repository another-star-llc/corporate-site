import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { SpaceBackground } from './SpaceBackground';
import { DraggableWindow } from './DraggableWindow';
import {
  Building2,
  Target,
  Users,
  UserCog,
  Shield,
  Mail,
  Menu,
  X,
  Award,
  ExternalLink,
  type LucideIcon
} from 'lucide-react';

// メンバー画像のインポート
import naoyaYasudaImg from '../assets/naoya_yasuda.png';
import saitoImg from '../assets/saito_shinnnosuke.jpeg';
import hiromatsuImg from '../assets/hiromatsu.png';
import satoKojiImg from '../assets/sato_koji.png';
import kannoImg from '../assets/Kanno.png';

interface WindowState {
  id: string;
  title: string;
  content: string;
  icon: LucideIcon;
  position: { x: number; y: number };
  zIndex: number;
  variant?: 'default' | 'chic';
}

export function MainInterface() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [focusPlanetId, setFocusPlanetId] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const scrollToNews = () => {
    scrollContainerRef.current?.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.92]);

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += e.deltaY;
      }
    };
    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, []);

  const menuItems = [
    { id: 'about', label: 'ABOUT', icon: Target, color: 'cyan' },
    { id: 'systems', label: 'SYSTEMS', icon: UserCog, color: 'orange' },
    { id: 'members', label: 'MEMBERS', icon: Users, color: 'blue' },
    { id: 'team', label: 'TEAM', icon: Building2, color: 'green' },
    { id: 'contact', label: 'CONTACT', icon: Mail, color: 'pink' },
    { id: 'mission', label: 'MISSION', icon: Shield, color: 'purple' },
  ];

  const contentMap: Record<string, string> = {
    about: `<div class="space-y-6">
      <div class="flex items-center gap-3 mb-6">
        <div class="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
          <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
          </svg>
        </div>
        <h2 class="text-3xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">会社概要</h2>
      </div>

      <div class="space-y-4">
        <p class="text-gray-300 leading-relaxed">
          Another Star合同会社は、AIエージェント間の安全な連携を実現するセキュリティ基盤を開発するテクノロジー企業です。
        </p>
        <p class="text-gray-300 leading-relaxed">
          2025年7月の設立からわずか8ヶ月で、NEDO主催 GENIAC-PRIZEにおいて特別賞「みらいビジョン賞」を受賞。AIエージェント同士の通信に信頼レイヤーを提供する独自のプラットフォームが、新規性・将来性の観点から高く評価されました。
        </p>
        <p class="text-gray-300 leading-relaxed">
          今後は公的機関や産官学との連携を深め、AIエージェント連携のグローバルセキュリティ標準の確立を目指します。
        </p>
      </div>


      <div class="grid grid-cols-2 gap-4 mt-6">
        <div class="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">設立</div>
          <div class="text-xl text-cyan-400">2025年7月22日</div>
        </div>
        <div class="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">資本金</div>
          <div class="text-xl text-blue-400">50万円</div>
        </div>
      </div>

      <div class="p-4 bg-slate-500/10 border border-slate-500/30 rounded-lg mt-4">
        <div class="text-xs text-gray-500 mb-1">所在地</div>
        <div class="text-base text-gray-300">〒107-0062 東京都港区南青山３丁目１番３６号青山丸竹ビル６Ｆ</div>
      </div>
    </div>`,

    mission: `<div class="space-y-6">
      <div class="space-y-4">
        <div class="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-all group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span class="text-2xl">🤝</span>
            </div>
            <div>
              <h3 class="text-xl text-purple-400 mb-2">安全な自律連携</h3>
              <p class="text-gray-400 text-sm leading-relaxed">AIエージェント同士が、人間の介在なしに安心して協働できる信頼基盤を築く。</p>
            </div>
          </div>
        </div>

        <div class="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 rounded-lg hover:border-blue-500/50 transition-all group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span class="text-2xl">🌐</span>
            </div>
            <div>
              <h3 class="text-xl text-blue-400 mb-2">世界標準の創出</h3>
              <p class="text-gray-400 text-sm leading-relaxed">産官学の協業を通じて、AIエージェント連携のグローバルセキュリティ標準を日本から確立する。</p>
            </div>
          </div>
        </div>

        <div class="p-5 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span class="text-2xl">🔎</span>
            </div>
            <div>
              <h3 class="text-xl text-cyan-400 mb-2">透明性の追求</h3>
              <p class="text-gray-400 text-sm leading-relaxed">すべての評価プロセスを公開し、誰もが検証できる透明なセキュリティを実現する。</p>
            </div>
          </div>
        </div>
      </div>
    </div>`,

    members: `<div class="space-y-6">
      <h2 class="text-3xl bg-gradient-to-r from-blue-400 to-cyan-500 bg-clip-text text-transparent mb-6">メンバー紹介</h2>

      <div class="space-y-6">
        <!-- メンバー1 -->
        <div class="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 rounded-lg">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-400 flex-shrink-0">
              <img src="${naoyaYasudaImg}" alt="安田 直也" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="text-2xl text-blue-400 mb-1">安田 直也</h3>
              <p class="text-cyan-400 text-sm mb-2">代表社員 / ソフトウェアエンジニア兼デジタルアナリスト</p>
            </div>
          </div>
          <div class="space-y-3 text-sm">
            <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
              <div class="text-xs text-gray-500 mb-1">経歴</div>
              <p class="text-gray-300">千葉大学工学部中退後、サイバー大学IT総合学部卒業。フリーランスとして活動する傍ら公正取引委員会にてデジタルアナリストとして従事。</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                <div class="text-xs text-gray-500 mb-1">専門分野</div>
                <p class="text-blue-300">データ基盤構築、AIシステム設計</p>
              </div>
              <div class="p-3 bg-cyan-500/10 border border-cyan-500/20 rounded">
                <div class="text-xs text-gray-500 mb-1">経験</div>
                <p class="text-cyan-300">日系中華系SIer企業での豊富な開発リーダー経験</p>
              </div>
            </div>
          </div>
        </div>

        <!-- メンバー2 -->
        <div class="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 rounded-lg">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-400 flex-shrink-0">
              <img src="${saitoImg}" alt="齊藤 慎之介" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="text-2xl text-purple-400 mb-1">齊藤 慎之介</h3>
              <p class="text-pink-400 text-sm mb-2">業務執行社員 / ソフトウェア・AIエンジニア</p>
            </div>
          </div>
          <div class="space-y-3 text-sm">
            <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
              <div class="text-xs text-gray-500 mb-1">経歴</div>
              <p class="text-gray-300">千葉大学大学院 融合理工学部を修了後、大手SIerにて全社の技術戦略や先端技術を推進。現在はデータ基盤構築やAIを活用した商用アプリ開発に従事。</p>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                <div class="text-xs text-gray-500 mb-1">専門分野</div>
                <p class="text-purple-300">セキュリティ、AI、データ基盤、Webアプリ開発</p>
              </div>
              <div class="p-3 bg-pink-500/10 border border-pink-500/20 rounded">
                <div class="text-xs text-gray-500 mb-1">経験</div>
                <p class="text-pink-300">AI・データ活用の戦略立案から実装まで一貫して推進</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`,

    team: `<div class="space-y-6">
      <h2 class="text-3xl bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent mb-4">開発チーム</h2>


      <div class="space-y-4">
        <!-- チームメンバー1 -->
        <div class="p-5 bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/30 rounded-lg hover:border-green-500/50 transition-all">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-green-400 flex-shrink-0">
              <img src="${hiromatsuImg}" alt="広松 太一" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="text-2xl text-green-400 mb-1">広松 太一</h3>
              <p class="text-sm text-emerald-400">要件定義・設計・開発 | AI安全アーキテクト</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm">SCSKのR&D部門で住友商事グループのDXプロジェクトに従事 / 要求分析 / システム設計 / リード開発</p>
        </div>

        <!-- チームメンバー2 -->
        <div class="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/30 rounded-lg hover:border-blue-500/50 transition-all">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-blue-400 flex-shrink-0">
              <img src="${satoKojiImg}" alt="佐藤 幸治" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="text-2xl text-blue-400 mb-1">佐藤 幸治</h3>
              <p class="text-sm text-indigo-400">要件定義・資料作成 | 制度・ドキュメンテーション</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm">複数の外資系コンサルを経て公正取引委員会のデジタルアナリストを務める / ヒアリング整理 / ドキュメント作成 / 行政対応支援</p>
        </div>

        <!-- チームメンバー4 -->
        <div class="p-5 bg-gradient-to-br from-purple-500/10 to-violet-500/5 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-all">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-purple-400 flex-shrink-0">
              <img src="${kannoImg}" alt="菅野 哲" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="text-2xl text-purple-400 mb-1">菅野 哲</h3>
              <p class="text-sm text-violet-400">アドバイザー | リスク評価・戦略</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm">公正取引委員会デジタルアナリスト兼GMOコネクトCTO / 第三者レビュー / 技術監修 / 意思決定支援</p>
        </div>
      </div>
    </div>`,

    systems: `<div class="space-y-6">
      <h2 class="text-3xl bg-gradient-to-r from-orange-400 to-red-500 bg-clip-text text-transparent mb-6">システム・技術紹介</h2>

      <div class="p-5 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/40 rounded-lg mb-2">
        <div class="flex items-center gap-2 mb-3">
          <span class="px-2 py-0.5 bg-orange-500/20 border border-orange-500/40 rounded-full text-orange-300 text-xs font-bold">GENIAC-PRIZE 領域3 みらいビジョン賞 受賞</span>
        </div>
        <h3 class="text-lg text-orange-300 font-bold mb-2">AIエージェント同士をセキュアにマッチング・連携させる国産OSSプラットフォーム</h3>
        <p class="text-gray-300 text-sm leading-relaxed">
          外部AIエージェントの真正性とセキュリティを多段階で評価しスコア化するエージェントストアと、ストアから安全な外部AIを選定し計画・実行・全通信監視を行う仲介エージェントを組み合わせた国産OSSプラットフォーム。計画逸脱や不正を検知した場合は即座にブロックし、ストアの信頼スコアへフィードバックする自己改善ループにより、エージェント連携の安全性を継続的に向上させます。
        </p>
      </div>

      <div class="space-y-6">
        <!-- システム1 -->
        <div class="p-5 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/40 rounded-lg">
          <h3 class="text-lg text-orange-300 font-bold mb-2">Browser Agent Detector</h3>
          <p class="text-gray-400 text-sm mb-3">機械学習モデルによるブラウザ操作検知システム</p>
          <p class="text-gray-300 text-sm leading-relaxed mb-3">
            会員制サイトを対象に「会員のペルソナからの逸脱度」「操作ログやブラウザ属性」による多段検知システム
          </p>
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-300 text-xs">Comet</span>
            <span class="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-300 text-xs">ChatGPT Atlas</span>
            <span class="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-300 text-xs">Playwright MCP</span>
            <span class="px-2 py-1 bg-orange-500/20 border border-orange-500/30 rounded text-orange-300 text-xs">Gemini Computer Use</span>
          </div>
          <div class="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
            <div class="text-xs text-gray-500 mb-1">提供形態</div>
            <p class="text-orange-300 text-sm">API提供サービス</p>
          </div>
        </div>

        <!-- システム2 -->
        <div class="p-5 bg-gradient-to-br from-orange-500/10 to-yellow-500/5 border border-orange-500/40 rounded-lg">
          <h3 class="text-lg text-orange-300 font-bold mb-2">AI Bias Watcher</h3>
          <p class="text-gray-400 text-sm mb-3">AI検索サービスの企業バイアス検知</p>
          <p class="text-gray-300 text-sm leading-relaxed mb-3">
            PerplexityなどのAI検索サービスに企業評価クエリを定期送信し、回答の偏りを時系列で可視化する監視ダッシュボード。
          </p>
          <div class="grid grid-cols-2 gap-3">
            <div class="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
              <p class="text-orange-300 text-xs">定期クエリと自動収集</p>
            </div>
            <div class="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
              <p class="text-orange-300 text-xs">指標別バイアストラッキング</p>
            </div>
            <div class="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
              <p class="text-orange-300 text-xs">時系列ダッシュボード解析</p>
            </div>
            <div class="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
              <p class="text-orange-300 text-xs">SNS投稿&レポート生成</p>
            </div>
          </div>
        </div>
      </div>
    </div>`,

    contact: `<div class="space-y-6">
      <h2 class="text-2xl text-gray-200 font-light tracking-wide mb-6">お問い合わせ</h2>

      <p class="text-gray-400 leading-relaxed text-sm">
        受託開発のご依頼を承っております。<br/>詳細はメールにてお問い合わせください。
      </p>

      <div class="space-y-4 mt-8">
        <a href="mailto:contact@another-star.jp" class="block p-5 bg-gray-800/50 border border-gray-600/50 rounded hover:border-gray-500 hover:bg-gray-800/70 transition-all group cursor-pointer">
          <div class="flex items-center gap-4">
            <div class="flex-1">
              <div class="text-xs text-gray-500 mb-2 tracking-widest">EMAIL</div>
              <div class="text-gray-300 text-base font-light group-hover:text-white transition-colors">contact@another-star.jp</div>
            </div>
            <div class="text-gray-500 group-hover:text-gray-300 group-hover:translate-x-1 transition-all">→</div>
          </div>
        </a>

        <div class="p-5 bg-gray-800/30 border border-gray-700/50 rounded">
          <div class="text-xs text-gray-500 mb-2 tracking-widest">BUSINESS</div>
          <div class="text-gray-400 text-sm font-light">受託開発・コンサルティング・技術提携</div>
        </div>

        <div class="p-5 bg-gray-800/30 border border-gray-700/50 rounded">
          <div class="text-xs text-gray-500 mb-2 tracking-widest">LOCATION</div>
          <div class="text-gray-400 text-sm font-light">東京都港区南青山</div>
        </div>
      </div>
    </div>`,
  };

  const openWindow = useCallback((itemId: string) => {
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;

    // 新しいウィンドウを画面中央に配置
    const newWindow: WindowState = {
      id: `${itemId}-${Date.now()}`,
      title: item.label,
      content: contentMap[itemId],
      icon: item.icon,
      position: {
        x: 0,
        y: 0
      },
      zIndex: highestZIndex + 1,
      variant: itemId === 'contact' ? 'chic' : 'default',
    };

    // 既存のウィンドウを閉じて、新しいウィンドウのみを表示
    setWindows([newWindow]);
    setHighestZIndex(highestZIndex + 1);
  }, [highestZIndex, menuItems, contentMap]);

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    setFocusPlanetId(null);
  };

  const bringToFront = (id: string) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, zIndex: highestZIndex + 1 } : w
    ));
    setHighestZIndex(highestZIndex + 1);
  };

  const updateWindowPosition = (id: string, position: { x: number; y: number }) => {
    setWindows(windows.map(w =>
      w.id === id ? { ...w, position } : w
    ));
  };

  const handleNavClick = useCallback((itemId: string) => {
    setFocusPlanetId(itemId);
    openWindow(itemId);
  }, [openWindow]);

  return (
    <motion.div
      className="fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <SpaceBackground
        onPlanetClick={(id) => { setFocusPlanetId(id); openWindow(id); }}
        onPlanetHover={() => {}}
        onEmptyClick={() => { setFocusPlanetId(null); setWindows([]); }}
        focusPlanetId={focusPlanetId}
      />

      {/* ヘッダーナビゲーション */}
      <header className="fixed top-0 left-0 right-0 z-50">
        <nav className="flex items-center justify-between px-10 py-6">
          <div className="text-white font-light tracking-[0.2em] text-base select-none">
            Another Star
          </div>
          <div className="hidden md:flex items-center gap-10">
            {menuItems.map(item => (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                  focusPlanetId === item.id
                    ? 'text-white'
                    : 'text-gray-400 hover:text-gray-200'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={scrollToNews}
              className="text-xs tracking-[0.15em] uppercase transition-colors duration-200 text-blue-400 hover:text-blue-200 relative"
            >
              NEWS
              <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
            </button>
          </div>
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMobileMenuOpen(prev => !prev)}
            aria-label="メニューを開く"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="md:hidden flex flex-col items-start gap-4 px-10 pb-6 bg-black/60 backdrop-blur-sm"
            >
              {menuItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    handleNavClick(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`text-xs tracking-[0.15em] uppercase transition-colors duration-200 ${
                    focusPlanetId === item.id
                      ? 'text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
              <button
                onClick={scrollToNews}
                className="text-xs tracking-[0.15em] uppercase transition-colors duration-200 text-blue-400 hover:text-blue-200 relative"
              >
                NEWS
                <span className="absolute -top-1 -right-2 w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ヒーローテキスト */}
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
        className="absolute bottom-[28%] left-0 right-0 text-center pointer-events-none select-none"
      >
        <h1 className="text-4xl md:text-5xl text-white font-light leading-tight tracking-wide">
          AIエージェントが信頼でつながる<br />世界をつくる。
        </h1>
        <p className="text-gray-400 mt-5 text-sm tracking-[0.15em]">
          Becoming the next stellar force for safe, sustainable AI.
        </p>
      </motion.div>

      {/* ウィンドウ */}
      <AnimatePresence>
        {windows.map((window) => (
          <DraggableWindow
            key={window.id}
            id={window.id}
            title={window.title}
            icon={window.icon}
            initialPosition={window.position}
            zIndex={window.zIndex}
            onClose={() => closeWindow(window.id)}
            onFocus={() => bringToFront(window.id)}
            onPositionChange={(pos) => updateWindowPosition(window.id, pos)}
            variant={window.variant}
          >
            <div dangerouslySetInnerHTML={{ __html: window.content }} />
          </DraggableWindow>
        ))}
      </AnimatePresence>

      {/* スクロール可能なオーバーレイ */}
      <div
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-auto pointer-events-none z-20"
      >
        {/* 最初の画面分のスペーサー */}
        <div className="h-screen" />

        {/* ニュースセクション */}
        <section id="news" className="relative py-32 px-6 pointer-events-auto bg-gradient-to-b from-black/60 via-blue-950/20 to-black/80 backdrop-blur-sm">
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 md:p-16 rounded-3xl border border-blue-500/20 bg-black/40 backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />

              <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
                <div className="flex-shrink-0">
                  <motion.div
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    className="w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center border border-white/10"
                  >
                    <Award className="w-16 h-16 md:w-24 md:h-24 text-blue-400" />
                  </motion.div>
                </div>

                <div className="flex-grow text-center md:text-left">
                  <div className="inline-block px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] tracking-[0.2em] text-blue-400 mb-6 uppercase">
                    Special Award
                  </div>
                  <h2 className="text-2xl md:text-4xl font-light tracking-wider mb-6 leading-tight text-white">
                    GENIAC-PRIZE <br className="md:hidden" />
                    みらいビジョン賞（特別賞）受賞
                  </h2>
                  <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-8">
                    Another Star合同会社は、経済産業省およびNEDOが主催する「GENIAC（Generative AI Accelerator Challenge）」において、
                    設立わずか8ヶ月で「みらいビジョン賞（特別賞）」を受賞いたしました。
                    急成長するAIエージェントセキュリティ市場において、国産OSSによる安全性確保技術の開発が高く評価されました。
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-4">
                    <a
                      href="https://prtimes.jp/main/html/rd/p/000000002.000180278.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs tracking-widest font-medium hover:bg-blue-400 transition-colors"
                    >
                      PRESS RELEASE <ExternalLink size={14} />
                    </a>
                    <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-xs tracking-widest font-light text-gray-300">
                      2026.03.31
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <div className="h-32 bg-black/60" />
      </div>
    </motion.div>
  );
}