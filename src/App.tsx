import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EntryScreen } from './components/EntryScreen';
import { MainInterface } from './components/MainInterface';
import './index.css';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [hyperspace, setHyperspace] = useState(false);

  // 7秒後に自動でワープ開始（タグ表示後）
  useEffect(() => {
    const timer = setTimeout(() => {
      setHyperspace(true);
      setTimeout(() => {
        setEntered(true);
        setHyperspace(false);
      }, 1800);
    }, 7000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {!entered && !hyperspace && (
          <EntryScreen key="entry" />
        )}

        {hyperspace && (
          <motion.div
            key="hyperspace"
            className="fixed inset-0 z-50 pointer-events-none overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* 背景 */}
            <div className="absolute inset-0 bg-black" />

            {/* 集中線エフェクト - repeating-conic-gradientで放射状の線 */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `repeating-conic-gradient(
                  from 0deg at 50% 50%,
                  transparent 0deg 0.5deg,
                  rgba(0, 200, 255, 0.8) 0.5deg 0.7deg,
                  transparent 0.7deg 0.9deg
                )`,
              }}
              initial={{
                opacity: 0,
                scale: 0.1,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.1, 1, 1.5, 2],
              }}
              transition={{
                duration: 1.2,
                ease: [0.4, 0, 0.2, 1],
              }}
            />

            {/* 第2層 - 少しずれた集中線 */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `repeating-conic-gradient(
                  from 0.45deg at 50% 50%,
                  transparent 0deg 0.4deg,
                  rgba(100, 220, 255, 0.6) 0.4deg 0.55deg,
                  transparent 0.55deg 0.9deg
                )`,
              }}
              initial={{
                opacity: 0,
                scale: 0.1,
              }}
              animate={{
                opacity: [0, 0.8, 0.8, 0],
                scale: [0.1, 1.1, 1.6, 2.2],
              }}
              transition={{
                duration: 1.3,
                delay: 0.05,
                ease: [0.4, 0, 0.2, 1],
              }}
            />

            {/* 第3層 - 白い線 */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: `repeating-conic-gradient(
                  from 0.25deg at 50% 50%,
                  transparent 0deg 0.6deg,
                  rgba(255, 255, 255, 0.9) 0.6deg 0.7deg,
                  transparent 0.7deg 1.2deg
                )`,
              }}
              initial={{
                opacity: 0,
                scale: 0.1,
              }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.1, 0.9, 1.4, 1.8],
              }}
              transition={{
                duration: 1.1,
                delay: 0.1,
                ease: [0.4, 0, 0.2, 1],
              }}
            />

            {/* 中心の光点 */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 2, 100],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.4,
                delay: 0.2,
                times: [0, 0.2, 0.5, 1],
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div
                className="w-16 h-16 rounded-full"
                style={{
                  background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,220,255,0.9) 40%, rgba(0,150,255,0.4) 70%, transparent 100%)',
                  boxShadow: '0 0 60px rgba(0, 220, 255, 1), 0 0 120px rgba(0, 200, 255, 0.8), 0 0 200px rgba(0, 180, 255, 0.5)',
                }}
              />
            </motion.div>

            {/* 画面フラッシュ */}
            <motion.div
              className="absolute inset-0 bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0, 0, 1, 0] }}
              transition={{
                duration: 1.8,
                times: [0, 0.5, 0.7, 0.85, 1],
                ease: "easeOut"
              }}
            />
          </motion.div>
        )}

        {entered && (
          <MainInterface key="main" />
        )}
      </AnimatePresence>
    </div>
  );
}
