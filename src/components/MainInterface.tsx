import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SpaceBackground } from './SpaceBackground';
import { DraggableWindow } from './DraggableWindow';
import { HUD } from './HUD';
import { ControlPanel } from './ControlPanel';
import { HologramGlitch } from './HologramGlitch';
import { PlanetHint } from './PlanetHint';
import { EarthMessage } from './EarthMessage';
import {
  Building2,
  Target,
  Users,
  UserCog,
  Shield,
  Mail,
  type LucideIcon
} from 'lucide-react';

// メンバー画像のインポート
import naoyaYasudaImg from '../assets/naoya_yasuda.png';
import saitoImg from '../assets/saito_shinnnosuke.jpeg';
import hiromatsuImg from '../assets/hiromatsu.png';
import hasegawaImg from '../assets/Hasegawa.png';
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
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const [showEarthMessage, setShowEarthMessage] = useState(false);

  // 惑星ホバーハンドラをメモ化
  const handlePlanetHover = useCallback((planetId: string | null) => {
    setHoveredPlanet(planetId);
  }, []);

  // 地球クリックハンドラ
  const handleEarthClick = useCallback(() => {
    setWindows([]); // 既存のポップアップを閉じる
    setShowEarthMessage(true);
  }, []);

  const menuItems = [
    { id: 'about', label: 'ABOUT', icon: Target, color: 'cyan' },
    { id: 'mission', label: 'MISSION', icon: Shield, color: 'purple' },
    { id: 'members', label: 'MEMBERS', icon: Users, color: 'blue' },
    { id: 'team', label: 'TEAM', icon: Building2, color: 'green' },
    { id: 'systems', label: 'SYSTEMS', icon: UserCog, color: 'orange' },
    { id: 'contact', label: 'CONTACT', icon: Mail, color: 'pink' },
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
          Another Star合同会社は、生成AIの安全性確保という重要な社会課題に取り組むために設立されたテクノロジー企業です。
        </p>
        <p class="text-gray-300 leading-relaxed">
          私たちは、NEDOの懸賞プログラムであるGENIAC-PRIZEの領域03「生成AIの安全性確保に向けたリスク探索及びリスク低減技術の開発」に挑戦し、AI技術の安全で持続可能な社会実装とその事業化を目指しています。
        </p>
      </div>

      <div class="flex flex-wrap gap-2 my-6">
        <span class="px-3 py-1 bg-cyan-500/20 border border-cyan-500/40 rounded-full text-cyan-400 text-sm">GENIAC-PRIZE</span>
        <span class="px-3 py-1 bg-blue-500/20 border border-blue-500/40 rounded-full text-blue-400 text-sm">AI安全性</span>
        <span class="px-3 py-1 bg-purple-500/20 border border-purple-500/40 rounded-full text-purple-400 text-sm">リスク低減</span>
      </div>

      <div class="grid grid-cols-2 gap-4 mt-6">
        <div class="p-4 bg-cyan-500/10 border border-cyan-500/30 rounded-lg">
          <div class="text-xs text-gray-500 mb-1">設立</div>
          <div class="text-xl text-cyan-400">2025年7月14日</div>
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
      <h2 class="text-3xl bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent mb-6">私たちのミッション</h2>

      <div class="space-y-4">
        <div class="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 rounded-lg hover:border-purple-500/50 transition-all group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span class="text-2xl">🛡️</span>
            </div>
            <div>
              <h3 class="text-xl text-purple-400 mb-2">安全性の確保</h3>
              <p class="text-gray-400 text-sm leading-relaxed">生成AIシステムの潜在的なリスクを早期発見し、効果的な対策を提供します。</p>
            </div>
          </div>
        </div>

        <div class="p-5 bg-gradient-to-br from-blue-500/10 to-cyan-500/5 border border-blue-500/30 rounded-lg hover:border-blue-500/50 transition-all group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span class="text-2xl">⚡</span>
            </div>
            <div>
              <h3 class="text-xl text-blue-400 mb-2">技術革新</h3>
              <p class="text-gray-400 text-sm leading-relaxed">最先端の研究と実用的なソリューション開発を通じて技術革新を推進します。</p>
            </div>
          </div>
        </div>

        <div class="p-5 bg-gradient-to-br from-cyan-500/10 to-teal-500/5 border border-cyan-500/30 rounded-lg hover:border-cyan-500/50 transition-all group">
          <div class="flex items-start gap-4">
            <div class="w-12 h-12 bg-gradient-to-br from-cyan-500 to-teal-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
              <span class="text-2xl">🌍</span>
            </div>
            <div>
              <h3 class="text-xl text-cyan-400 mb-2">社会実装</h3>
              <p class="text-gray-400 text-sm leading-relaxed">誰もが安心して生成AIを活用できる未来の実現に貢献します。</p>
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

      <div class="p-4 bg-green-500/10 border border-green-500/30 rounded-lg mb-6">
        <p class="text-gray-300 text-sm leading-relaxed">
          GENIAC-PRIZEに挑むAnother Starの開発体制は、社員2名と4名の専門メンバーが役割を分担しながら密に連携することで、要件定義から実装、評価までを短いスプリントで回しています。
        </p>
      </div>

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
        <div class="p-5 bg-gradient-to-br from-teal-500/10 to-cyan-500/5 border border-teal-500/30 rounded-lg hover:border-teal-500/50 transition-all">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-20 h-20 rounded-full overflow-hidden border-2 border-teal-400 flex-shrink-0">
              <img src="${hasegawaImg}" alt="長谷川 大樹" class="w-full h-full object-cover" />
            </div>
            <div>
              <h3 class="text-2xl text-teal-400 mb-1">長谷川 大樹</h3>
              <p class="text-sm text-cyan-400">要件定義・設計・開発 | ソリューションエンジニア</p>
            </div>
          </div>
          <p class="text-gray-400 text-sm">アクセンチュアでブリッジエンジニア兼クラウドコンサルタントとして従事 / 技術検証 / セキュリティ設計 / PoC推進</p>
        </div>

        <!-- チームメンバー3 -->
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

      <div class="space-y-6">
        <!-- システム1 -->
        <div class="p-5 bg-gradient-to-br from-orange-500/10 to-red-500/5 border border-orange-500/30 rounded-lg">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-3xl">🔍</span>
            </div>
            <div>
              <h3 class="text-2xl text-orange-400 mb-1">Browser Agent Detector</h3>
              <p class="text-red-400 text-sm">機械学習モデルによるブラウザ操作検知システム</p>
            </div>
          </div>
          <div class="space-y-3">
            <p class="text-gray-300 text-sm leading-relaxed">
              会員制サイトを対象に「会員のペルソナからの逸脱度」「操作ログやブラウザ属性」による多段検知システム
            </p>
            <div class="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
              <div class="text-xs text-gray-500 mb-2">検知対象例</div>
              <div class="flex flex-wrap gap-2">
                <span class="px-2 py-1 bg-orange-500/20 rounded text-orange-300 text-xs">Comet</span>
                <span class="px-2 py-1 bg-red-500/20 rounded text-red-300 text-xs">ChatGPT Atlas</span>
                <span class="px-2 py-1 bg-orange-500/20 rounded text-orange-300 text-xs">Playwright MCP</span>
                <span class="px-2 py-1 bg-red-500/20 rounded text-red-300 text-xs">Gemini Computer Use</span>
              </div>
            </div>
            <div class="p-3 bg-red-500/10 border border-red-500/20 rounded">
              <div class="text-xs text-gray-500 mb-1">提供形態</div>
              <p class="text-red-300 text-sm">API提供サービス</p>
            </div>
          </div>
        </div>

        <!-- システム2 -->
        <div class="p-5 bg-gradient-to-br from-blue-500/10 to-indigo-500/5 border border-blue-500/30 rounded-lg">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-3xl">🤝</span>
            </div>
            <div>
              <h3 class="text-2xl text-blue-400 mb-1">A2A Mediation Agent</h3>
              <p class="text-indigo-400 text-sm">ユーザーと企業エージェントの仲介</p>
            </div>
          </div>
          <div class="space-y-3">
            <p class="text-gray-300 text-sm leading-relaxed">
              ユーザーエージェントのリクエストを解釈し、ストアに登録された企業エージェントに最適にルーティングする仲介プラットフォーム。
            </p>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                <p class="text-blue-300 text-xs">A2Aのプロンプトインジェクション検知</p>
              </div>
              <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded">
                <p class="text-indigo-300 text-xs">ニーズ分析と最適マッチング</p>
              </div>
              <div class="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
                <p class="text-blue-300 text-xs">裁判員制度を模したAIによるリスク評価</p>
              </div>
              <div class="p-3 bg-indigo-500/10 border border-indigo-500/20 rounded">
                <p class="text-indigo-300 text-xs">エージェントストア側へのフィードバック</p>
              </div>
            </div>
          </div>
        </div>

        <!-- システム3 -->
        <div class="p-5 bg-gradient-to-br from-purple-500/10 to-pink-500/5 border border-purple-500/30 rounded-lg">
          <div class="flex items-start gap-4 mb-4">
            <div class="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <span class="text-3xl">👁️</span>
            </div>
            <div>
              <h3 class="text-2xl text-purple-400 mb-1">AI Bias Watcher</h3>
              <p class="text-pink-400 text-sm">AI検索サービスの企業バイアス検知</p>
            </div>
          </div>
          <div class="space-y-3">
            <p class="text-gray-300 text-sm leading-relaxed">
              PerplexityなどのAI検索サービスに企業評価クエリを定期送信し、回答の偏りを時系列で可視化する監視ダッシュボード。
            </p>
            <div class="grid grid-cols-2 gap-3">
              <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                <p class="text-purple-300 text-xs">定期クエリと自動収集</p>
              </div>
              <div class="p-3 bg-pink-500/10 border border-pink-500/20 rounded">
                <p class="text-pink-300 text-xs">指標別バイアストラッキング</p>
              </div>
              <div class="p-3 bg-purple-500/10 border border-purple-500/20 rounded">
                <p class="text-purple-300 text-xs">時系列ダッシュボード解析</p>
              </div>
              <div class="p-3 bg-pink-500/10 border border-pink-500/20 rounded">
                <p class="text-pink-300 text-xs">SNS投稿&レポート生成</p>
              </div>
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

  // 地球メッセージからお問い合わせを開く
  const handleEarthContactClick = useCallback(() => {
    setShowEarthMessage(false);
    openWindow('contact');
  }, [openWindow]);

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
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

  return (
    <motion.div
      className="fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <SpaceBackground
        onPlanetClick={openWindow}
        onPlanetHover={handlePlanetHover}
        onEarthClick={handleEarthClick}
      />

      {/* 地球クリック時のメッセージオーバーレイ */}
      <EarthMessage
        isVisible={showEarthMessage}
        onClose={() => setShowEarthMessage(false)}
        onContactClick={handleEarthContactClick}
      />

      <HUD />

      {/* ホログラム・グリッチエフェクト */}
      <HologramGlitch />

      {/* 惑星クリックのヒントバナー */}
      <PlanetHint />

      {/* 制御パネル（中央下部） */}
      <ControlPanel
        hoveredPlanet={hoveredPlanet}
        planets={[
          { id: 'about', name: 'ABOUT', color: 0x4a9eff, position: [-22, 8, -35], size: 2.5 },
          { id: 'mission', name: 'MISSION', color: 0xa855f7, position: [18, 12, -28], size: 2.2 },
          { id: 'members', name: 'MEMBERS', color: 0x60a5fa, position: [-5, -12, -42], size: 2.0 },
          { id: 'team', name: 'TEAM', color: 0x34d399, position: [20, -8, -38], size: 2.3 },
          { id: 'systems', name: 'SYSTEMS', color: 0xfb923c, position: [-8, 15, -25], size: 2.6 },
          { id: 'contact', name: 'CONTACT', color: 0xec4899, position: [-18, -5, -30], size: 2.4 },
        ]}
      />

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
    </motion.div>
  );
}