import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Star, Shield, Brain, Users, Target, Globe } from 'lucide-react'
import ParticleBackground from './components/ParticleBackground'
import FloatingGeometry from './components/FloatingGeometry'
import ShootingStars from './components/ShootingStars'
import EnhancedGiantStar from './components/EnhancedGiantStar'
import member1 from './assets/naoya_yasuda.png'
import member2 from './assets/saito_shinnnosuke.jpeg'
import './App.css'

function App() {
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      <ParticleBackground />

      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-md border-b border-purple-500/20">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Star className="h-8 w-8 text-purple-400" />
            <span className="text-xl font-bold">Another Star</span>
          </div>
          <div className="hidden md:flex space-x-8">
            <a href="#about" className="hover:text-purple-400 transition-colors">会社概要</a>
            <a href="#members" className="hover:text-purple-400 transition-colors">メンバー</a>
            <a href="#systems" className="hover:text-purple-400 transition-colors">システム</a>
            <a href="#contact" className="hover:text-purple-400 transition-colors">お問い合わせ</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center relative overflow-hidden">
        {/* 流星エフェクト */}
        <div className="absolute inset-0 z-0">
          <ShootingStars />
        </div>
        <div className="container mx-auto px-6 text-center z-10">
          <div
            className="transform transition-transform duration-1000"
            style={{ transform: `translateY(${scrollY * 0.5}px)` }}
          >
            <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Another Star
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-300">
              生成AIの安全性確保技術開発
            </p>
            <p className="text-lg mb-12 text-gray-400 max-w-2xl mx-auto">
            Becoming the next stellar force shaping safe, sustainable AI for society.
            </p>
            {/* <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
              詳細を見る
            </Button> */}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 relative">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-purple-400">会社概要</h2>
              <p className="text-lg text-gray-300 mb-6">
                Another Star合同会社は、生成AIの安全性確保という重要な社会課題に取り組むために設立されたテクノロジー企業です。
              </p>
              <p className="text-lg text-gray-300 mb-6">
                私たちは、NEDOの懸賞プログラムであるGENIAC-PRIZEの領域03「生成AIの安全性確保に向けたリスク探索及びリスク低減技術の開発」に挑戦し、AI技術の安全で持続可能な社会実装とその事業化を目指しています。
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">GENIAC-PRIZE</Badge>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">AI安全性</Badge>
                <Badge variant="secondary" className="bg-purple-600/20 text-purple-300">リスク低減</Badge>
              </div>
            </div>
            <div className="relative h-96">
              <EnhancedGiantStar />
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-400">私たちのミッション</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-800/50 border-purple-500/20 text-white">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle>安全性の確保</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">生成AIシステムの潜在的なリスクを早期発見し、効果的な対策を提供します。</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20 text-white">
              <CardHeader>
                <Brain className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle>技術革新</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">最先端の研究と実用的なソリューション開発を通じて技術革新を推進します。</p>
              </CardContent>
            </Card>
            <Card className="bg-slate-800/50 border-purple-500/20 text-white">
              <CardHeader>
                <Target className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle>社会実装</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300">誰もが安心して生成AIを活用できる未来の実現に貢献します。</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Members Section */}
      <section id="members" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-400">メンバー紹介</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="bg-slate-800/50 border-purple-500/20 text-white hover:transform hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-400">
                  <img src={member1} alt="田中健太郎" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="text-xl">安田 直也</CardTitle>
                <CardDescription className="text-purple-300">代表社員 / ソフトウェアエンジニア兼デジタルアナリスト</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  千葉大学工学部中退後、サイバー大学IT総合学部卒業。フリーランスとして活動する傍ら公正取引委員会にてデジタルアナリストとして従事。
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400"><strong>専門分野:</strong> データ基盤構築、AIシステム設計</p>
                  <p className="text-sm text-gray-400"><strong>経歴:</strong> 日系、中華系SIer企業での豊富な開発リーダー経験</p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-800/50 border-purple-500/20 text-white hover:transform hover:scale-105 transition-all duration-300">
              <CardHeader className="text-center">
                <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-400">
                  <img src={member2} alt="佐藤美咲" className="w-full h-full object-cover" />
                </div>
                <CardTitle className="text-xl">齊藤 慎之介</CardTitle>
                <CardDescription className="text-purple-300">業務執行社員 / ソフトウェア・AIエンジニア</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                千葉大学大学院 融合理工学府を修了後、大手SIerにて全社の技術戦略や先端技術を推進。現在はデータ基盤構築やAIを活用した商用アプリ開発に従事。
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-gray-400"><strong>専門分野:</strong> セキュリティ、AI、データ基盤、Webアプリ開発</p>
                  <p className="text-sm text-gray-400"><strong>経歴:</strong> AI・データ活用の戦略立案から実装まで一貫して推進</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Systems Section */}
      <section id="systems" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-400">システム・技術紹介</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-slate-900/50 border-purple-500/20 text-white">
              <CardHeader>
                <Globe className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle>Browser Agent Detector</CardTitle>
                <CardDescription className="text-gray-400">AI Agentによるブラウザ操作検知システム</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  会員制サイトを対象に「会員のペルソナからの逸脱度」「操作ログやブラウザ属性」による多段検知システム
                </p>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>
                      • 対象例：
                      <div className="pl-6">
                        <div>Comet</div>
                        <div>Playwright MCP</div>
                        <div>Gemini Computer Use</div>
                      </div>
                    </li>
                    <li>• API提供サービス</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20 text-white">
              <CardHeader>
                <Shield className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle>Risk Assessment Framework</CardTitle>
                <CardDescription className="text-gray-400">包括的リスク評価</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  生成AIシステムの包括的なリスク評価を行うフレームワーク。
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• 多次元リスク評価</li>
                  <li>• ベンチマークテスト</li>
                  <li>• 改善提案生成</li>
                  <li>• レポート自動作成</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-slate-900/50 border-purple-500/20 text-white">
              <CardHeader>
                <Brain className="h-12 w-12 text-purple-400 mb-4" />
                <CardTitle>Secure AI Pipeline</CardTitle>
                <CardDescription className="text-gray-400">セキュア開発パイプライン</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-300 mb-4">
                  セキュリティを考慮した統合開発パイプライン。
                </p>
                <ul className="text-sm text-gray-400 space-y-1">
                  <li>• セキュアな学習環境</li>
                  <li>• 自動セキュリティテスト</li>
                  <li>• 脆弱性スキャン</li>
                  <li>• デプロイメント最適化</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-400">技術スタック</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">フロントエンド</h3>
              <div className="space-y-2">
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">React</Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">TypeScript</Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">Three.js</Badge>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">バックエンド</h3>
              <div className="space-y-2">
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">Python</Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">FastAPI</Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">PostgreSQL</Badge>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">AI/ML</h3>
              <div className="space-y-2">
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">PyTorch</Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">Transformers</Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">scikit-learn</Badge>
              </div>
            </div>
            <div className="text-center">
              <h3 className="text-xl font-semibold mb-4 text-purple-300">インフラ</h3>
              <div className="space-y-2">
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">AWS</Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">Docker</Badge>
                <Badge variant="outline" className="border-purple-500/50 text-purple-300">Kubernetes</Badge>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-slate-800/50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-8 text-purple-400">お問い合わせ</h2>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            生成AIの安全性確保に関するご相談や、技術的なお問い合わせはお気軽にご連絡ください。
          </p>
          <Button size="lg" className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 text-lg">
            お問い合わせはこちら
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-purple-500/20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Star className="h-6 w-6 text-purple-400" />
              <span className="text-lg font-semibold">Another Star合同会社</span>
            </div>
            <p className="text-gray-400 text-sm">
              © 2025 Another Star合同会社. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
