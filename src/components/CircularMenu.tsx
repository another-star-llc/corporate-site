import { motion } from 'motion/react';
import { X, type LucideIcon } from 'lucide-react';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
}

interface CircularMenuProps {
  items: MenuItem[];
  onSelect: (id: string) => void;
  onClose: () => void;
}

const colorMap: Record<string, { bg: string; text: string; glow: string }> = {
  cyan: { bg: 'from-cyan-500 to-blue-500', text: 'text-cyan-400', glow: 'rgba(0,200,255,0.5)' },
  purple: { bg: 'from-purple-500 to-pink-500', text: 'text-purple-400', glow: 'rgba(168,85,247,0.5)' },
  blue: { bg: 'from-blue-500 to-indigo-500', text: 'text-blue-400', glow: 'rgba(59,130,246,0.5)' },
  green: { bg: 'from-green-500 to-emerald-500', text: 'text-green-400', glow: 'rgba(34,197,94,0.5)' },
  orange: { bg: 'from-orange-500 to-red-500', text: 'text-orange-400', glow: 'rgba(249,115,22,0.5)' },
  pink: { bg: 'from-pink-500 to-purple-500', text: 'text-pink-400', glow: 'rgba(236,72,153,0.5)' },
};

export function CircularMenu({ items, onSelect, onClose }: CircularMenuProps) {
  const radius = 200;
  const angleStep = (Math.PI * 2) / items.length;

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      {/* 背景ブラー */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* メニューアイテム */}
      <div className="relative" onClick={(e) => e.stopPropagation()}>
        {items.map((item, index) => {
          const angle = angleStep * index - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          const colors = colorMap[item.color] || colorMap.cyan;

          return (
            <motion.button
              key={item.id}
              className={`absolute w-24 h-24 bg-gradient-to-br ${colors.bg} rounded-full flex flex-col items-center justify-center gap-1 shadow-lg hover:scale-110 transition-transform`}
              style={{
                left: '50%',
                top: '50%',
                boxShadow: `0 0 30px ${colors.glow}`,
              }}
              initial={{ 
                x: 0, 
                y: 0,
                scale: 0,
                opacity: 0,
              }}
              animate={{ 
                x: x - 48,
                y: y - 48,
                scale: 1,
                opacity: 1,
              }}
              exit={{
                x: 0,
                y: 0,
                scale: 0,
                opacity: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
                delay: index * 0.05,
              }}
              whileHover={{
                scale: 1.2,
                boxShadow: `0 0 50px ${colors.glow}`,
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(item.id)}
            >
              {/* 回転する外枠 */}
              <motion.div
                className="absolute inset-0 border-2 border-white/30 rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              />
              
              <item.icon className="w-8 h-8 text-white relative z-10" />
              <span className="text-xs text-white relative z-10">{item.label}</span>
              
              {/* パルスエフェクト */}
              <motion.div
                className="absolute inset-0 bg-white rounded-full"
                initial={{ scale: 1, opacity: 0.3 }}
                animate={{ 
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  delay: index * 0.1,
                }}
              />
            </motion.button>
          );
        })}

        {/* 中央の閉じるボタン */}
        <motion.button
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.5)] hover:shadow-[0_0_50px_rgba(239,68,68,0.8)] transition-all z-10"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          exit={{ scale: 0, rotate: 180 }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
        >
          <X className="w-8 h-8 text-white" />
        </motion.button>

        {/* 中央の接続線 */}
        <svg className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full pointer-events-none">
          {items.map((item, index) => {
            const angle = angleStep * index - Math.PI / 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const colors = colorMap[item.color] || colorMap.cyan;

            return (
              <motion.line
                key={item.id}
                x1="50%"
                y1="50%"
                x2={`calc(50% + ${x}px)`}
                y2={`calc(50% + ${y}px)`}
                stroke={`url(#gradient-${item.id})`}
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.3 }}
                exit={{ pathLength: 0, opacity: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <defs>
                  <linearGradient id={`gradient-${item.id}`}>
                    <stop offset="0%" stopColor={colors.glow} />
                    <stop offset="100%" stopColor="transparent" />
                  </linearGradient>
                </defs>
              </motion.line>
            );
          })}
        </svg>

        {/* 中央のパルスリング */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 border-2 border-cyan-500/30 rounded-full pointer-events-none"
            initial={{ width: 0, height: 0, opacity: 0 }}
            animate={{ 
              width: [0, radius * 2.5],
              height: [0, radius * 2.5],
              opacity: [0.5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: i * 1,
              ease: "easeOut",
            }}
          />
        ))}
      </div>

      {/* ヒントテキスト */}
      <motion.div
        className="absolute bottom-32 text-center font-mono"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <p className="text-cyan-400 text-sm">SELECT MODULE TO ACCESS</p>
        <p className="text-cyan-600 text-xs mt-1">Click outside to close</p>
      </motion.div>
    </motion.div>
  );
}
