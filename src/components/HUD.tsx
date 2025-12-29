import { motion } from 'motion/react';
import { Activity, Wifi, Battery, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

export function HUD() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* 左上 - システム情報 */}
      <motion.div
        className="fixed top-6 left-6 z-20 font-mono"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-black/40 backdrop-blur-md border border-cyan-500/30 rounded-lg p-4 shadow-[0_0_20px_rgba(0,200,255,0.3)]">
          <div className="flex items-center gap-2 mb-3">
            <motion.div
              className="w-3 h-3 bg-green-500 rounded-full"
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="text-green-400 text-sm">SYSTEM OPERATIONAL</span>
          </div>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-2 text-cyan-400">
              <Activity className="w-3 h-3" />
              <span>CPU: 47%</span>
              <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-cyan-500"
                  initial={{ width: 0 }}
                  animate={{ width: '47%' }}
                  transition={{ duration: 1 }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-cyan-400">
              <Wifi className="w-3 h-3" />
              <span>SIGNAL: STRONG</span>
            </div>
            
            <div className="flex items-center gap-2 text-cyan-400">
              <Battery className="w-3 h-3" />
              <span>POWER: 89%</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* 右上 - 時計とステータス */}
      <motion.div
        className="fixed top-6 right-6 z-20 font-mono"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5 }}
      >
        <div className="bg-black/40 backdrop-blur-md border border-purple-500/30 rounded-lg p-4 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-4 h-4 text-purple-400" />
            <div className="text-purple-400">
              {time.toLocaleTimeString('ja-JP')}
            </div>
          </div>
          
          <div className="text-xs text-purple-400/70">
            {time.toLocaleDateString('ja-JP', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          
          <div className="mt-3 pt-3 border-t border-purple-500/30">
            <div className="text-xs text-purple-400/70">SECTOR: 7G</div>
            <div className="text-xs text-purple-400/70">VESSEL: AS-001</div>
          </div>
        </div>
      </motion.div>

      {/* 左下 - レーダー風UI */}
      <motion.div
        className="fixed bottom-6 left-6 z-20"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="relative w-32 h-32 bg-black/40 backdrop-blur-md border border-green-500/30 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.3)]">
          {/* レーダーグリッド */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" />
          </svg>
          
          {/* 回転するレーダーライン */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          >
            <div className="absolute top-1/2 left-1/2 w-1/2 h-px bg-gradient-to-r from-green-500 to-transparent origin-left" />
          </motion.div>
          
          {/* ランダムな点 */}
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-green-500 rounded-full"
              style={{
                top: `${20 + Math.random() * 60}%`,
                left: `${20 + Math.random() * 60}%`,
              }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ 
                duration: 1 + Math.random() * 2, 
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_10px_rgba(34,197,94,1)]" />
          </div>
        </div>
        
        <div className="mt-2 text-center text-xs text-green-400 font-mono">
          PROXIMITY SCAN
        </div>
      </motion.div>

      {/* 右下 - システムログ */}
      <motion.div
        className="fixed bottom-6 right-6 z-20 font-mono"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <div className="bg-black/40 backdrop-blur-md border border-blue-500/30 rounded-lg p-4 w-80 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
          <div className="text-blue-400 text-xs mb-2">SYSTEM LOG</div>
          
          <div className="space-y-1 text-xs max-h-24 overflow-hidden">
            <motion.div
              className="text-blue-400/70"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1 }}
            >
              <span className="text-blue-500">[{time.toLocaleTimeString()}]</span> Interface initialized
            </motion.div>
            <motion.div
              className="text-green-400/70"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.2 }}
            >
              <span className="text-green-500">[{time.toLocaleTimeString()}]</span> All systems nominal
            </motion.div>
            <motion.div
              className="text-cyan-400/70"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1.4 }}
            >
              <span className="text-cyan-500">[{time.toLocaleTimeString()}]</span> Awaiting command input
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* グリッドオーバーレイ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <svg className="w-full h-full opacity-10">
          <defs>
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="cyan" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* スキャンライン */}
      <motion.div
        className="fixed left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none z-10"
        animate={{ y: [0, window.innerHeight] }}
        transition={{ 
          duration: 8, 
          repeat: Infinity, 
          ease: "linear",
          repeatDelay: 2,
        }}
        style={{ top: 0 }}
      />
    </>
  );
}
