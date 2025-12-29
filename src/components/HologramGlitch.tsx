import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export function HologramGlitch() {
  const [isGlitching, setIsGlitching] = useState(false);
  const [scanlinePosition, setScanlinePosition] = useState(0);

  // ランダムなグリッチエフェクト
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.7) { // 30%の確率でグリッチ
        setIsGlitching(true);
        setTimeout(() => setIsGlitching(false), 100 + Math.random() * 200);
      }
    }, 3000 + Math.random() * 2000); // 3-5秒ごと

    return () => clearInterval(glitchInterval);
  }, []);

  // スキャンライン移動
  useEffect(() => {
    const scanlineInterval = setInterval(() => {
      setScanlinePosition(prev => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(scanlineInterval);
  }, []);

  return (
    <>
      {/* RGB色収差グリッチ */}
      <AnimatePresence>
        {isGlitching && (
          <>
            <motion.div
              className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              style={{
                background: 'repeating-linear-gradient(0deg, rgba(255,0,0,0.1) 0px, transparent 2px, transparent 4px)',
                transform: `translateX(${Math.random() * 4 - 2}px)`,
              }}
            />
            <motion.div
              className="fixed inset-0 pointer-events-none z-[9999] mix-blend-screen"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.05 }}
              style={{
                background: 'repeating-linear-gradient(0deg, rgba(0,255,255,0.1) 0px, transparent 2px, transparent 4px)',
                transform: `translateX(${Math.random() * 4 - 2}px)`,
              }}
            />
          </>
        )}
      </AnimatePresence>

      {/* 走査線エフェクト（常時表示） */}
      <div 
        className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.03]"
        style={{
          background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.15) 0px, transparent 1px, transparent 2px)',
        }}
      />

      {/* 動的スキャンライン */}
      <motion.div
        className="fixed left-0 right-0 h-[2px] pointer-events-none z-[9998]"
        style={{
          top: `${scanlinePosition}%`,
          background: 'linear-gradient(to bottom, transparent, rgba(0,255,255,0.3), transparent)',
          boxShadow: '0 0 10px rgba(0,255,255,0.5)',
        }}
      />

      {/* ランダムなスキャンバー（グリッチ時） */}
      <AnimatePresence>
        {isGlitching && (
          <>
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="fixed left-0 right-0 pointer-events-none z-[9999] overflow-hidden"
                initial={{ 
                  opacity: 0,
                  top: `${Math.random() * 100}%`,
                  height: `${Math.random() * 50 + 10}px`,
                }}
                animate={{ 
                  opacity: [0, 0.8, 0],
                  x: [0, Math.random() * 20 - 10, 0],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                <div 
                  className="w-full h-full"
                  style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(0,255,255,0.2) 50%, transparent 100%)',
                    mixBlendMode: 'screen',
                  }}
                />
              </motion.div>
            ))}
          </>
        )}
      </AnimatePresence>

      {/* ノイズテクスチャ（軽量） */}
      <div
        className="fixed inset-0 pointer-events-none z-[9998] opacity-[0.02]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
        }}
      />

      {/* フリッカーエフェクト（画面全体の微妙な明滅） */}
      <motion.div
        className="fixed inset-0 pointer-events-none z-[9997] bg-cyan-500/5"
        animate={{
          opacity: [0.05, 0.08, 0.05, 0.07, 0.05],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* コーナーブラケット（HUD風） */}
      <div className="fixed inset-0 pointer-events-none z-[9998]">
        {/* 左上 */}
        <motion.div
          className="absolute top-4 left-4 w-12 h-12 border-l-2 border-t-2 border-cyan-500/40"
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
          }}
        />
        {/* 右上 */}
        <motion.div
          className="absolute top-4 right-4 w-12 h-12 border-r-2 border-t-2 border-cyan-500/40"
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 0.5,
          }}
        />
        {/* 左下 */}
        <motion.div
          className="absolute bottom-4 left-4 w-12 h-12 border-l-2 border-b-2 border-cyan-500/40"
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1,
          }}
        />
        {/* 右下 */}
        <motion.div
          className="absolute bottom-4 right-4 w-12 h-12 border-r-2 border-b-2 border-cyan-500/40"
          animate={{
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: 1.5,
          }}
        />
      </div>

      {/* ビネット効果 */}
      <div
        className="fixed inset-0 pointer-events-none z-[9997]"
        style={{
          background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.3) 100%)',
        }}
      />
    </>
  );
}
