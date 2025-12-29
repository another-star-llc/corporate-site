import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EntryScreen } from './components/EntryScreen';
import { MainInterface } from './components/MainInterface';
import './index.css';

export default function App() {
  const [entered, setEntered] = useState(false);
  const [hyperspace, setHyperspace] = useState(false);

  const handleEnter = () => {
    setHyperspace(true);
    setTimeout(() => {
      setEntered(true);
      setHyperspace(false);
    }, 1800);
  };

  // 高密度集中線のデータを事前計算
  const speedLines = useMemo(() => {
    const lines: Array<{
      angle: number;
      delay: number;
      duration: number;
      opacity: number;
      thickness: number;
    }> = [];

    // 360度を細かく分割して線を配置
    const totalLines = 400;
    for (let i = 0; i < totalLines; i++) {
      const baseAngle = (i / totalLines) * 360;
      const angle = baseAngle + (Math.random() - 0.5) * 2;
      const delay = Math.random() * 0.1;
      const duration = 0.6 + Math.random() * 0.3;
      const opacity = 0.7 + Math.random() * 0.3;
      const thickness = 1.5 + Math.random() * 2;

      lines.push({ angle, delay, duration, opacity, thickness });
    }

    return lines;
  }, []);

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {!entered && !hyperspace && (
          <EntryScreen key="entry" onEnter={handleEnter} />
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

            {/* 高密度集中線 - 中心から放射状に配置、外から中心に向かって伸びる */}
            <div className="absolute inset-0 flex items-center justify-center">
              {speedLines.map((line, i) => (
                <motion.div
                  key={i}
                  className="absolute"
                  style={{
                    // 線は画面中央を起点に、各角度に配置
                    width: '150vmax', // 画面を覆う十分な長さ
                    height: line.thickness,
                    background: `linear-gradient(90deg,
                      rgba(255, 255, 255, ${line.opacity}) 0%,
                      rgba(100, 220, 255, ${line.opacity * 0.8}) 5%,
                      rgba(0, 200, 255, ${line.opacity * 0.5}) 15%,
                      rgba(0, 150, 255, ${line.opacity * 0.2}) 30%,
                      transparent 50%)`,
                    transformOrigin: 'left center',
                    transform: `rotate(${line.angle}deg)`,
                    boxShadow: `0 0 ${line.thickness * 2}px rgba(0, 200, 255, 0.5)`,
                  }}
                  initial={{
                    scaleX: 0,
                    opacity: 0,
                  }}
                  animate={{
                    scaleX: [0, 0.6, 1],
                    opacity: [0, line.opacity, line.opacity, 0],
                  }}
                  transition={{
                    duration: line.duration,
                    delay: line.delay,
                    ease: [0.2, 0, 0.8, 1],
                  }}
                />
              ))}
            </div>

            {/* 中心の光点 */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 1, 1.5, 100],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.3,
                delay: 0.3,
                times: [0, 0.3, 0.6, 1],
                ease: [0.4, 0, 0.2, 1],
              }}
            >
              <div
                className="w-12 h-12 rounded-full"
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
