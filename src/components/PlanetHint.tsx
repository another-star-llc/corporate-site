import { memo } from 'react';
import { motion } from 'motion/react';
import { MousePointer2 } from 'lucide-react';

export const PlanetHint = memo(function PlanetHint() {
  return (
    <motion.div
      className="fixed top-6 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <div className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-[0_0_20px_rgba(0,200,255,0.2)]">
        {/* クリックアイコン */}
        <motion.div
          className="flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <MousePointer2 className="w-4 h-4 text-cyan-400" />
        </motion.div>

        {/* テキスト */}
        <span className="text-cyan-400 font-mono text-sm tracking-wide">
          惑星をクリックしてナビゲート
        </span>

        {/* 装飾ドット */}
        <motion.div
          className="w-2 h-2 rounded-full bg-cyan-500"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
});
