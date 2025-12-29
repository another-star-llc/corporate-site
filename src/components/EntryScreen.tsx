import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { HologramGlitch } from './HologramGlitch';

interface EntryScreenProps {
  onEnter: () => void;
}

export function EntryScreen({ onEnter }: EntryScreenProps) {
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
      className="fixed inset-0 bg-gradient-to-br from-gray-900 via-black to-blue-900"
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

        {/* グラデーションオーバーレイ */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/20 to-black/50" />
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
          
          {/* 外側セグメント化リング（12分割） */}
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
              
              {/* グラデーション */}
              <linearGradient id="segmentGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.3" />
                <stop offset="50%" stopColor="#00ffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#00ffff" stopOpacity="0.3" />
              </linearGradient>
            </defs>
            
            {/* 12分割セグメント */}
            {[...Array(12)].map((_, i) => {
              const startAngle = (i * 30) - 90;
              const endAngle = startAngle + 26; // 26度（4度のギャップ）
              const startRad = (startAngle * Math.PI) / 180;
              const endRad = (endAngle * Math.PI) / 180;
              const innerRadius = 280;
              const outerRadius = 300;
              
              const x1 = 300 + innerRadius * Math.cos(startRad);
              const y1 = 300 + innerRadius * Math.sin(startRad);
              const x2 = 300 + outerRadius * Math.cos(startRad);
              const y2 = 300 + outerRadius * Math.sin(startRad);
              const x3 = 300 + outerRadius * Math.cos(endRad);
              const y3 = 300 + outerRadius * Math.sin(endRad);
              const x4 = 300 + innerRadius * Math.cos(endRad);
              const y4 = 300 + innerRadius * Math.sin(endRad);
              
              return (
                <motion.path
                  key={`segment-${i}`}
                  d={`M ${x1} ${y1} L ${x2} ${y2} A ${outerRadius} ${outerRadius} 0 0 1 ${x3} ${y3} L ${x4} ${y4} A ${innerRadius} ${innerRadius} 0 0 0 ${x1} ${y1} Z`}
                  fill="url(#segmentGradient)"
                  stroke="#00ffff"
                  strokeWidth="1"
                  filter="url(#glow)"
                  initial={{ opacity: 0 }}
                  animate={{ 
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    delay: i * 0.1,
                  }}
                />
              );
            })}
            
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
          
          {/* 回転スキャンライン */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,255,255,0.4) 5%, transparent 10%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
          />
          
          {/* 発光インジケーター（24個） */}
          {[...Array(24)].map((_, i) => {
            const angle = (i * 15) - 90;
            const rad = (angle * Math.PI) / 180;
            const radius = 300;
            const x = 300 + radius * Math.cos(rad);
            const y = 300 + radius * Math.sin(rad);
            
            // 色を3色で分ける
            const colors = ['#00ffff', '#ff00ff', '#ffff00'];
            const color = colors[i % 3];
            const glowColor = color === '#00ffff' ? 'rgba(0,255,255,0.8)' : 
                             color === '#ff00ff' ? 'rgba(255,0,255,0.8)' : 
                             'rgba(255,255,0,0.8)';
            
            return (
              <motion.div
                key={`indicator-${i}`}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  left: `${(x / 600) * 100}%`,
                  top: `${(y / 600) * 100}%`,
                  backgroundColor: color,
                  boxShadow: `0 0 10px ${glowColor}, 0 0 20px ${glowColor}`,
                }}
                initial={{ scale: 0.5, opacity: 0.3 }}
                animate={{ 
                  scale: [0.5, 1.2, 0.5],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.08,
                }}
              />
            );
          })}
          
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
            className="absolute inset-[70px] rounded-full border-4 border-gray-900/80 shadow-[inset_0_0_80px_rgba(0,0,0,0.9)]"
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
            Another Star
          </motion.h1>
          
          <motion.p
            className="text-2xl mb-3 text-cyan-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.3 }}
          >
            生成AIの安全性確保技術開発
          </motion.p>

          <motion.p
            className="text-sm mb-12 text-cyan-400/80 max-w-2xl px-4 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            Becoming the next stellar force shaping safe, sustainable AI for society.
          </motion.p>

          <motion.button
            onClick={onEnter}
            className="relative px-12 py-4 text-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            <span className="relative z-10">INITIALIZE SYSTEM</span>
            
            {/* ボタンのグローエフェクト */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500"
              animate={{
                opacity: [0.5, 1, 0.5],
              }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            
            {/* ホバー時のレーザーライン */}
            <motion.div
              className="absolute inset-0 opacity-0 group-hover:opacity-100"
              initial={{ x: '-100%' }}
              whileHover={{
                x: '100%',
                transition: { duration: 0.6, repeat: Infinity },
              }}
            >
              <div className="absolute inset-y-0 left-0 w-1 bg-white shadow-[0_0_10px_rgba(255,255,255,1)]" />
            </motion.div>
          </motion.button>

          {/* スキャンライン */}
          <motion.div
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            animate={{ y: [0, 100, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ top: '-50px' }}
          />
        </motion.div>
      </div>

      {/* コーナーUI装飾 */}
      <div className="absolute top-8 left-8 text-cyan-400 text-sm font-mono">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span>SYSTEM ONLINE</span>
          </div>
          <div className="text-xs text-cyan-600">
            COORDINATES: SECTOR 7G<br />
            VESSEL ID: AS-001<br />
            STATUS: NOMINAL
          </div>
        </motion.div>
      </div>

      <div className="absolute top-8 right-8 text-cyan-400 text-sm font-mono text-right">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex items-center justify-end gap-2 mb-2">
            <span>AWAITING INPUT</span>
            <motion.div 
              className="w-2 h-2 bg-orange-500 rounded-full"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </div>
          <div className="text-xs text-cyan-600">
            DATE: 2025.12.29<br />
            TIME: {new Date().toLocaleTimeString()}<br />
            CLEARANCE: LEVEL 9
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
