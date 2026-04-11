import { useState, type ReactNode } from 'react';
import { motion } from 'motion/react';
import { X, Maximize2, type LucideIcon } from 'lucide-react';

interface ChicWindowProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  initialPosition: { x: number; y: number };
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
}

export function ChicWindow({
  id: _id,
  title,
  icon: Icon,
  children,
  initialPosition: _initialPosition,
  zIndex,
  onClose,
  onFocus,
  onPositionChange: _onPositionChange,
}: ChicWindowProps) {
  const [isMaximized, setIsMaximized] = useState(false);

  return (
    <motion.div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
      style={{
        zIndex,
        x: 0,
        y: 0,
      }}
      initial={{ scale: 0.96, opacity: 0, y: 12 }}
      animate={{
        scale: 1,
        opacity: 1,
        y: 0,
        width: isMaximized ? '90vw' : 'auto',
        height: isMaximized ? '85vh' : 'auto',
      }}
      exit={{ scale: 0.96, opacity: 0, y: 12 }}
      transition={{ type: 'spring', stiffness: 420, damping: 38 }}
      onMouseDown={onFocus}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
    >
      {/* ウィンドウ本体 */}
      <div className="rounded-[28px] overflow-hidden w-[90vw] sm:w-[540px] md:w-[600px] max-w-[95vw] bg-[linear-gradient(180deg,rgba(20,22,28,0.55),rgba(10,11,16,0.52))] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.72),0_0_0_1px_rgba(255,255,255,0.04)]">

        {/* タイトルバー */}
        <div className="border-b border-white/10 px-5 py-3 select-none bg-white/[0.02] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Icon className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <span className="text-[11px] tracking-[0.24em] uppercase text-slate-300/90 font-medium">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-0.5">
            <motion.button
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/[0.08] transition-colors"
              whileTap={{ scale: 0.85 }}
              onClick={() => setIsMaximized(!isMaximized)}
            >
              <Maximize2 className="w-3 h-3" />
            </motion.button>
            <motion.button
              className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-200 hover:bg-white/[0.08] transition-colors"
              whileTap={{ scale: 0.85 }}
              onClick={onClose}
            >
              <X className="w-3 h-3" />
            </motion.button>
          </div>
        </div>

        {/* コンテンツ */}
        <div
          data-draggable-window-content
          className="overflow-y-auto popup-scroll select-text"
          style={{ maxHeight: isMaximized ? 'calc(85vh - 44px)' : 'min(68vh, 460px)' }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}
