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
      <div className="news-popup-frame">
        <div className="news-popup-glow news-popup-glow-top" />
        <div className="news-popup-glow news-popup-glow-bottom" />

        {/* タイトルバー */}
        <div className="news-popup-titlebar">
          <div className="flex items-center gap-3">
            <div className="news-popup-pill">
              <Icon className="w-3.5 h-3.5 text-blue-300 flex-shrink-0" />
              <span>{title}</span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <motion.button
              className="news-popup-icon-button"
              whileTap={{ scale: 0.85 }}
              onClick={() => setIsMaximized(!isMaximized)}
            >
              <Maximize2 className="w-3 h-3" />
            </motion.button>
            <motion.button
              className="news-popup-icon-button"
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
          className="news-popup-content overflow-y-auto popup-scroll select-text"
          style={{ maxHeight: isMaximized ? 'calc(85vh - 44px)' : 'min(68vh, 460px)' }}
        >
          {children}
        </div>
      </div>
    </motion.div>
  );
}
