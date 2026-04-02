import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HologramGlitch } from './HologramGlitch';

export function EntryScreen() {
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <motion.div
      className="fixed inset-0 bg-black sm:bg-gradient-to-br sm:from-gray-900 sm:via-black sm:to-blue-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      {/* ホログラム・グリッチエフェクト */}
      <HologramGlitch />
      {/* CSS星空背景 */}
      <div className="absolute inset-0 overflow-hidden">
        {/* 星レイヤー1（遠景 - 最も遅い）*/}
        <motion.div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(2px 2px at 20% 30%, white, transparent),
                             radial-gradient(2px 2px at 60% 70%, white, transparent),
                             radial-gradient(1px 1px at 50% 50%, white, transparent),
                             radial-gradient(1px 1px at 80% 10%, white, transparent),
                             radial-gradient(2px 2px at 90% 60%, white, transparent),
                             radial-gradient(1px 1px at 33% 50%, white, transparent),
                             radial-gradient(2px 2px at 79% 53%, white, transparent),
                             radial-gradient(1px 1px at 11% 29%, white, transparent),
                             radial-gradient(1px 1px at 45% 20%, white, transparent),
                             radial-gradient(1px 1px at 95% 85%, white, transparent)`,
            backgroundSize: '200% 200%',
            backgroundPosition: '50% 50%',
            transform: `translate(${(mousePosition.x - 0.5) * 20}px, ${(mousePosition.y - 0.5) * 20}px)`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 200,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* 星レイヤー2（中景 - より小さく速い） */}
        <motion.div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: `radial-gradient(1px 1px at 10% 20%, cyan, transparent),
                             radial-gradient(1px 1px at 40% 80%, cyan, transparent),
                             radial-gradient(1px 1px at 70% 30%, cyan, transparent),
                             radial-gradient(1px 1px at 85% 60%, cyan, transparent),
                             radial-gradient(1px 1px at 25% 40%, cyan, transparent),
                             radial-gradient(1px 1px at 55% 90%, cyan, transparent)`,
            backgroundSize: '250% 250%',
            transform: `translate(${(mousePosition.x - 0.5) * 40}px, ${(mousePosition.y - 0.5) * 40}px)`,
          }}
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 150,
            repeat: Infinity,
            ease: 'linear',
          }}
        />

        {/* グラデーションオーバーレイ（モバイル非表示） */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-black/50 hidden sm:block" />
      </div>

      {/* 中央の地球イメージ（前景 - 最も速い）*/}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
        style={{
          transform: `translate(${(mousePosition.x - 0.5) * 60}px, ${(mousePosition.y - 0.5) * 60}px)`,
        }}
      >
        <motion.div
          className="relative w-[400px] h-[400px] rounded-full overflow-hidden"
          animate={{
            boxShadow: [
              '0 0 40px rgba(0,200,255,0.3)',
              '0 0 80px rgba(0,200,255,0.6)',
              '0 0 40px rgba(0,200,255,0.3)',
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          {/* 地球画像 */}
          <img
            src="https://images.unsplash.com/photo-1727363584291-433dcd86a0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMHNwYWNlJTIwcGxhbmV0fGVufDF8fHx8MTc2NjkyMTk2OHww&ixlib=rb-4.1.0&q=80&w=1080"
            alt="Earth"
            className="w-full h-full object-cover opacity-80"
          />
          
          {/* 大気グロー */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-blue-500/20" />
        </motion.div>
      </motion.div>
      
      {/* 高度な制御リング＆スキャナーシステム（中景）*/}
      <div 
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          transform: `translate(${(mousePosition.x - 0.5) * 50}px, ${(mousePosition.y - 0.5) * 50}px)`,
        }}
      >
        <div className="relative w-[600px] h-[600px]">
          
          {/* リングシステム */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">
            <defs>
              {/* グローフィルター */}
              <filter id="glow">
                <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                <feMerge>
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/>
                </feMerge>
              </filter>
            </defs>

            {/* 中間リング */}
            <motion.circle
              cx="300"
              cy="300"
              r="260"
              fill="none"
              stroke="#0099ff"
              strokeWidth="1"
              strokeDasharray="8 8"
              opacity="0.4"
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
              style={{ transformOrigin: '300px 300px' }}
            />
            
            {/* 内側パルスリング */}
            <motion.circle
              cx="300"
              cy="300"
              r="240"
              fill="none"
              stroke="#00ffff"
              strokeWidth="2"
              filter="url(#glow)"
              initial={{ opacity: 0.3, scale: 1 }}
              animate={{ 
                opacity: [0.3, 1, 0.3],
                strokeWidth: [2, 4, 2],
              }}
              transition={{ duration: 3, repeat: Infinity }}
              style={{ transformOrigin: '300px 300px' }}
            />
            
            {/* グリッドライン（放射状） */}
            {[...Array(8)].map((_, i) => {
              const angle = (i * 45) - 90;
              const rad = (angle * Math.PI) / 180;
              const x = 300 + 240 * Math.cos(rad);
              const y = 300 + 240 * Math.sin(rad);
              
              return (
                <motion.line
                  key={`grid-${i}`}
                  x1="300"
                  y1="300"
                  x2={x}
                  y2={y}
                  stroke="#00ffff"
                  strokeWidth="0.5"
                  strokeDasharray="4 4"
                  opacity="0.2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: [0, 1, 0] }}
                  transition={{ duration: 4, repeat: Infinity, delay: i * 0.2 }}
                />
              );
            })}
          </svg>
          
          {/* データストリーム（円周上を流れるテキスト） */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 600 600">
            <defs>
              <path
                id="textPath"
                d="M 300,50 A 250,250 0 1,1 299,50"
              />
            </defs>
            <motion.text
              fill="#00ffff"
              fontSize="10"
              fontFamily="monospace"
              opacity="0.6"
              initial={{ startOffset: '0%' }}
              animate={{ startOffset: '100%' }}
              transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            >
              <textPath href="#textPath">
                INITIALIZING... 0xA3F2 0x89C1 0xDEAD 0xBEEF STANDBY 0x1234 0x5678 SYSTEM READY...
              </textPath>
            </motion.text>
          </svg>
          
          {/* 内側の暗い円（地球を囲む枠） */}
          <motion.div
            className="absolute inset-[70px] rounded-full border-4 border-gray-900/80 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)] hidden sm:block"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          />
        </div>
      </div>

      {/* UI オーバーレイ */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <motion.div
          className="text-center pointer-events-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <motion.h1
            className="text-7xl mb-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent"
            style={{
              textShadow:
                '0 4px 20px rgba(0,0,0,0.9), 0 0 18px rgba(0,200,255,0.6), 0 0 38px rgba(0,200,255,0.85)',
              filter:
                'drop-shadow(0 4px 12px rgba(0,0,0,0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
              WebkitTextStroke: '0.75px #0a1f4d',
              paintOrder: 'stroke fill',
            }}
            animate={{
              textShadow: [
                '0 4px 20px rgba(0,0,0,0.9), 0 0 18px rgba(0,200,255,0.6), 0 0 38px rgba(0,200,255,0.85)',
                '0 4px 22px rgba(0,0,0,0.9), 0 0 28px rgba(0,255,255,0.85), 0 0 60px rgba(0,255,255,1)',
                '0 4px 20px rgba(0,0,0,0.9), 0 0 18px rgba(0,200,255,0.6), 0 0 38px rgba(0,200,255,0.85)',
              ],
              filter: [
                'drop-shadow(0 4px 12px rgba(0,0,0,0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
                'drop-shadow(0 6px 16px rgba(0,0,0,0.65)) drop-shadow(0 3px 8px rgba(0,0,0,0.5))',
                'drop-shadow(0 4px 12px rgba(0,0,0,0.55)) drop-shadow(0 2px 6px rgba(0,0,0,0.4))',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Another Star LLC
          </motion.h1>

          <motion.p
            className="text-2xl mb-4 text-cyan-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            生成AIの安全性確保技術開発
          </motion.p>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.6 }}
          >
            <motion.span
              className="px-6 py-3 bg-cyan-500/30 border-2 border-cyan-400/60 rounded-full text-cyan-200 text-base font-medium shadow-[0_0_20px_rgba(0,255,255,0.3)]"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,255,255,0.5)' }}
            >
              受託開発
            </motion.span>
            <motion.span
              className="px-6 py-3 bg-blue-500/30 border-2 border-blue-400/60 rounded-full text-blue-200 text-base font-medium shadow-[0_0_20px_rgba(59,130,246,0.3)]"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59,130,246,0.5)' }}
            >
              コンサルティング
            </motion.span>
            <motion.span
              className="px-6 py-3 bg-purple-500/30 border-2 border-purple-400/60 rounded-full text-purple-200 text-base font-medium shadow-[0_0_20px_rgba(168,85,247,0.3)]"
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(168,85,247,0.5)' }}
            >
              研究開発
            </motion.span>
          </motion.div>

          <motion.p
            className="text-sm mb-8 text-cyan-400/80 max-w-2xl px-4 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.9 }}
          >
            Becoming the next stellar force shaping safe, sustainable AI for society.
          </motion.p>

          {/* スキャンライン */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            animate={{ y: [0, 100, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ top: '-50px' }}
          />
        </motion.div>
      </div>

    </motion.div>
  );
}
