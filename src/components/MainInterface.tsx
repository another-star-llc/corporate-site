import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { SpaceBackground } from './SpaceBackground';
import { ChicWindow } from './ChicWindow';
import { getWindowContent } from './WindowContents';
import {
  Building2,
  Target,
  Users,
  UserCog,
  Shield,
  Mail,
  Menu,
  X,
  ExternalLink,
  type LucideIcon
} from 'lucide-react';

interface WindowState {
  id: string;
  title: string;
  content: ReactNode;
  icon: LucideIcon;
  position: { x: number; y: number };
  zIndex: number;
}

type FocusPlanetSide = 'left' | 'right' | null;

export function MainInterface() {
  const [windows, setWindows] = useState<WindowState[]>([]);
  const [highestZIndex, setHighestZIndex] = useState(100);
  const [focusPlanetId, setFocusPlanetId] = useState<string | null>(null);
  const [focusPlanetSide, setFocusPlanetSide] = useState<FocusPlanetSide>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const newsHeadingRef = useRef<HTMLHeadingElement>(null);
  const touchScrollStateRef = useRef({
    lastY: 0,
    lastTime: 0,
    velocity: 0,
    animationFrame: 0,
  });

  const scrollToNews = () => {
    setWindows([]);
    setFocusPlanetId(null);
    setFocusPlanetSide(null);
    setIsMobileMenuOpen(false);

    requestAnimationFrame(() => {
      const container = scrollContainerRef.current;
      const heading = newsHeadingRef.current;
      if (!container) return;

      if (window.innerWidth < 768 && heading) {
        const containerRect = container.getBoundingClientRect();
        const headingRect = heading.getBoundingClientRect();
        const headerOffset = 40;
        const targetTop = container.scrollTop
          + (headingRect.top - containerRect.top)
          - ((container.clientHeight - headerOffset - headingRect.height) / 2);

        container.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
        return;
      }

      container.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
    });
  };

  const { scrollYProgress } = useScroll({ container: scrollContainerRef });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.25], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.25], [1, 0.92]);
  const pageVeilOpacity = useTransform(scrollYProgress, [0, 0.22], [0, 0.78]);

  useEffect(() => {
    const stopMomentumScroll = () => {
      if (touchScrollStateRef.current.animationFrame) {
        cancelAnimationFrame(touchScrollStateRef.current.animationFrame);
        touchScrollStateRef.current.animationFrame = 0;
      }
    };

    const startMomentumScroll = () => {
      stopMomentumScroll();

      const step = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const nextVelocity = touchScrollStateRef.current.velocity * 0.94;
        if (Math.abs(nextVelocity) < 0.2) {
          touchScrollStateRef.current.velocity = 0;
          touchScrollStateRef.current.animationFrame = 0;
          return;
        }

        container.scrollTop += nextVelocity;
        touchScrollStateRef.current.velocity = nextVelocity;
        touchScrollStateRef.current.animationFrame = requestAnimationFrame(step);
      };

      if (Math.abs(touchScrollStateRef.current.velocity) >= 0.2) {
        touchScrollStateRef.current.animationFrame = requestAnimationFrame(step);
      }
    };

    const handleWheel = (e: WheelEvent) => {
      const target = e.target as Element;
      if (target.closest('[data-draggable-window-content]')) return;
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += e.deltaY;
      }
    };

    const handleTouchStart = (e: TouchEvent) => {
      stopMomentumScroll();
      touchScrollStateRef.current.lastY = e.touches[0].clientY;
      touchScrollStateRef.current.lastTime = performance.now();
      touchScrollStateRef.current.velocity = 0;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const target = e.target as Element;
      if (target.closest('[data-draggable-window-content]')) return;
      const now = performance.now();
      const delta = touchScrollStateRef.current.lastY - e.touches[0].clientY;
      const elapsed = Math.max(now - touchScrollStateRef.current.lastTime, 1);

      touchScrollStateRef.current.lastY = e.touches[0].clientY;
      touchScrollStateRef.current.lastTime = now;
      touchScrollStateRef.current.velocity = (delta / elapsed) * 16;

      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTop += delta;
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      const target = e.target as Element | null;
      if (target?.closest('[data-draggable-window-content]')) return;
      startMomentumScroll();
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    window.addEventListener('touchcancel', stopMomentumScroll);

    return () => {
      stopMomentumScroll();
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', stopMomentumScroll);
    };
  }, []);

  const menuItems = [
    { id: 'about', label: 'ABOUT', icon: Target },
    { id: 'systems', label: 'SYSTEMS', icon: UserCog },
    { id: 'members', label: 'MEMBERS', icon: Users },
    { id: 'team', label: 'TEAM', icon: Building2 },
    { id: 'contact', label: 'CONTACT', icon: Mail },
    { id: 'mission', label: 'MISSION', icon: Shield },
  ];

  const defaultPlanetSides: Record<string, Exclude<FocusPlanetSide, null>> = {
    about: 'right',
    members: 'right',
    contact: 'right',
    systems: 'left',
    team: 'left',
    mission: 'left',
  };

  const openWindow = useCallback((itemId: string, clickPos?: { x: number; y: number }) => {
    const item = menuItems.find(m => m.id === itemId);
    if (!item) return;

    const newWindow: WindowState = {
      id: `${itemId}-${Date.now()}`,
      title: item.label,
      content: getWindowContent(itemId),
      icon: item.icon,
      position: { x: 0, y: 0 },
      zIndex: highestZIndex + 1,
    };

    if (clickPos) {
      setFocusPlanetSide(clickPos.x < window.innerWidth / 2 ? 'left' : 'right');
    } else {
      setFocusPlanetSide(defaultPlanetSides[itemId] ?? 'right');
    }

    setWindows([newWindow]);
    setHighestZIndex(highestZIndex + 1);
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  }, [defaultPlanetSides, highestZIndex, menuItems]);

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id));
    setFocusPlanetId(null);
    setFocusPlanetSide(null);
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
    setFocusPlanetSide(defaultPlanetSides[itemId] ?? 'right');
    openWindow(itemId);
  }, [defaultPlanetSides, openWindow]);

  return (
    <motion.div
      className="fixed inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <SpaceBackground
        onPlanetClick={(id, screenPos) => { setFocusPlanetId(id); openWindow(id, screenPos); }}
        onPlanetHover={() => {}}
        onEmptyClick={() => { setFocusPlanetId(null); setFocusPlanetSide(null); setWindows([]); }}
        focusPlanetId={focusPlanetId}
        focusPlanetSide={focusPlanetSide}
      />

      {/* ヘッダーナビゲーション */}
      <header className="fixed top-0 left-0 right-0 z-[1000]">
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
              className="md:hidden relative isolate flex flex-col items-start gap-4 px-10 pb-6 bg-black/90 backdrop-blur-xl border-b border-white/10 shadow-[0_24px_80px_rgba(0,0,0,0.65)]"
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
      <div
        className={`absolute bottom-[28%] left-0 right-0 text-center pointer-events-none select-none transition-opacity duration-300 ${windows.length > 0 ? 'opacity-0' : 'opacity-100'}`}
      >
      <motion.div
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <h1 className="text-4xl md:text-5xl text-white font-light leading-tight tracking-wide">
          AIエージェントが信頼でつながる<br />世界をつくる。
        </h1>
        <p className="text-gray-400 mt-5 text-sm tracking-[0.15em]">
          Becoming the next stellar force for safe, sustainable AI.
        </p>
      </motion.div>
      </div>

      <motion.div
        aria-hidden
        style={{ opacity: pageVeilOpacity }}
        className="fixed inset-0 z-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(8,14,24,0.04)_0%,rgba(3,7,16,0.14)_32%,rgba(2,4,12,0.42)_62%,rgba(1,2,8,0.82)_100%)]"
      />

      {/* ウィンドウ */}
      <AnimatePresence>
        {windows.map((w) => (
          <ChicWindow
            key={w.id}
            id={w.id}
            title={w.title}
            icon={w.icon}
            initialPosition={w.position}
            zIndex={w.zIndex}
            onClose={() => closeWindow(w.id)}
            onFocus={() => bringToFront(w.id)}
            onPositionChange={(pos) => updateWindowPosition(w.id, pos)}
          >
            {w.content}
          </ChicWindow>
        ))}
      </AnimatePresence>

      {/* スクロール可能なオーバーレイ */}
      <div
        ref={scrollContainerRef}
        className="fixed inset-0 overflow-y-auto pointer-events-none z-20"
      >
        <div className="relative">
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(180deg,rgba(0,0,0,0)_0vh,rgba(2,6,16,0.08)_38vh,rgba(2,6,16,0.28)_72vh,rgba(0,0,0,0.82)_120vh,rgba(0,0,0,0.96)_100%)]" />

          {/* 最初の画面分のスペーサー */}
          <div className="h-screen" />

          {/* ニュースセクション */}
          <section id="news" className="relative px-6 pt-6 pb-12 sm:py-32 pointer-events-auto">
            <div className="max-w-5xl mx-auto w-full">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="relative p-8 md:p-16 rounded-3xl border border-blue-500/20 bg-[linear-gradient(180deg,rgba(5,10,20,0.72),rgba(2,5,12,0.84))] backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full" />
              <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />

              <div className="relative z-10">
                <div className="text-left">
                  <div className="inline-block px-4 py-1 rounded-full border border-blue-500/30 bg-blue-500/10 text-[10px] tracking-[0.2em] text-blue-400 mb-6 uppercase">
                    Special Award
                  </div>
                  <h2 ref={newsHeadingRef} className="text-2xl md:text-4xl font-light tracking-wider mb-6 leading-tight text-white">
                    GENIAC-PRIZE <br className="md:hidden" />
                    みらいビジョン賞（特別賞）受賞
                  </h2>
                  <p className="text-sm md:text-base text-gray-400 font-light leading-relaxed mb-8">
                    Another Star合同会社は、経済産業省およびNEDOが主催する「GENIAC（Generative AI Accelerator Challenge）」において、
                    設立わずか8ヶ月で「みらいビジョン賞（特別賞）」を受賞いたしました。
                    急成長するAIエージェントセキュリティ市場において、国産OSSによる安全性確保技術の開発が高く評価されました。
                  </p>
                  <div className="flex flex-wrap justify-start gap-4">
                    <a
                      href="https://prtimes.jp/main/html/rd/p/000000002.000180278.html"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black text-xs tracking-widest font-medium hover:bg-blue-400 transition-colors"
                    >
                      PRESS RELEASE <ExternalLink size={14} />
                    </a>
                    <div className="flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-xs tracking-widest font-light text-gray-300">
                      2026.03.24
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
            </div>
          </section>

          <div className="h-32" />
        </div>
      </div>
    </motion.div>
  );
}
