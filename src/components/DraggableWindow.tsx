import { useState, type ReactNode } from 'react';
import { motion, PanInfo } from 'motion/react';
import { X, Minimize2, Maximize2, type LucideIcon } from 'lucide-react';

interface DraggableWindowProps {
  id: string;
  title: string;
  icon: LucideIcon;
  children: ReactNode;
  initialPosition: { x: number; y: number };
  zIndex: number;
  onClose: () => void;
  onFocus: () => void;
  onPositionChange: (position: { x: number; y: number }) => void;
  variant?: 'default' | 'chic';
}

export function DraggableWindow({
  id,
  title,
  icon: Icon,
  children,
  initialPosition,
  zIndex,
  onClose,
  onFocus,
  onPositionChange,
  variant = 'default',
}: DraggableWindowProps) {
  const isChic = variant === 'chic';
  const [position, setPosition] = useState(initialPosition);
  const [isMaximized, setIsMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const handleDragEnd = (_event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    // ウィンドウの概算サイズ（レスポンシブ対応）
    const isMobile = window.innerWidth < 640;
    const windowWidth = isMobile ? window.innerWidth * 0.9 : 550;
    const windowHeight = isMobile ? window.innerHeight * 0.7 : 500;
    const margin = isMobile ? 10 : 50;

    // 画面の境界を計算（画面中央が原点なので、±で範囲を計算）
    const maxX = (window.innerWidth / 2) - (windowWidth / 2) - margin;
    const minX = -(window.innerWidth / 2) + (windowWidth / 2) + margin;
    const maxY = (window.innerHeight / 2) - (windowHeight / 2) - margin;
    const minY = -(window.innerHeight / 2) + (windowHeight / 2) + margin;

    // 新しい位置を計算
    let newX = position.x + info.offset.x;
    let newY = position.y + info.offset.y;

    // 境界内にクランプ
    newX = Math.max(minX, Math.min(maxX, newX));
    newY = Math.max(minY, Math.min(maxY, newY));

    const newPosition = { x: newX, y: newY };
    setPosition(newPosition);
    onPositionChange(newPosition);
  };

  const handleMaximize = () => {
    setIsMaximized(!isMaximized);
  };

  const handleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <motion.div
      className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none"
      style={{ 
        zIndex,
        x: isMaximized ? 0 : position.x,
        y: isMaximized ? 0 : position.y,
      }}
      initial={{ scale: 0, opacity: 0, rotate: -10 }}
      animate={{ 
        scale: isMinimized ? 0.1 : 1, 
        opacity: isMinimized ? 0 : 1, 
        rotate: 0,
        width: isMaximized ? '90vw' : 'auto',
        height: isMaximized ? '85vh' : 'auto',
      }}
      exit={{ scale: 0, opacity: 0, rotate: 10 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      drag={!isMaximized}
      dragMomentum={false}
      dragElastic={0}
      onDragEnd={handleDragEnd}
      onMouseDown={onFocus}
      onClick={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      whileHover={{
        boxShadow: isChic ? '0 0 20px rgba(100,100,100,0.2)' : '0 0 40px rgba(0,200,255,0.4)',
      }}
    >
      <div
        className={`backdrop-blur-xl rounded-lg overflow-hidden w-[90vw] sm:w-[500px] md:w-[550px] lg:w-[600px] max-w-[95vw] ${
          isChic
            ? 'bg-gray-900/90 border border-gray-700/60 shadow-[0_0_30px_rgba(0,0,0,0.5)]'
            : 'bg-black/40 border border-cyan-500/40 shadow-[0_0_30px_rgba(0,200,255,0.3)]'
        }`}
      >
        {/* タイトルバー */}
        <div className={`relative border-b px-4 py-3 cursor-move flex items-center justify-between ${
          isChic
            ? 'bg-gray-800/80 border-gray-700/50'
            : 'bg-gradient-to-r from-cyan-900/50 to-blue-900/50 border-cyan-500/30'
        }`}>
          {/* ホログラムエフェクト - シックモードでは非表示 */}
          {!isChic && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            />
          )}

          <div className="flex items-center gap-3 relative z-10">
            {isChic ? (
              <Icon className="w-5 h-5 text-gray-400" />
            ) : (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
              </motion.div>
            )}
            <span className={isChic ? "text-gray-300 font-light tracking-wide" : "text-cyan-300 font-mono"}>{title}</span>
          </div>

          <div className="flex items-center gap-2 relative z-10">
            {/* ミニマイズボタン */}
            <motion.button
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors group ${
                isChic
                  ? 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50'
                  : 'bg-yellow-500/20 hover:bg-yellow-500/40 border border-yellow-500/50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMinimize}
            >
              <Minimize2 className={`w-4 h-4 ${isChic ? 'text-gray-400 group-hover:text-gray-300' : 'text-yellow-400 group-hover:text-yellow-300'}`} />
            </motion.button>

            {/* 最大化ボタン */}
            <motion.button
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors group ${
                isChic
                  ? 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50'
                  : 'bg-green-500/20 hover:bg-green-500/40 border border-green-500/50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMaximize}
            >
              <Maximize2 className={`w-4 h-4 ${isChic ? 'text-gray-400 group-hover:text-gray-300' : 'text-green-400 group-hover:text-green-300'}`} />
            </motion.button>

            {/* 閉じるボタン */}
            <motion.button
              className={`w-8 h-8 rounded flex items-center justify-center transition-colors group ${
                isChic
                  ? 'bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/50'
                  : 'bg-red-500/20 hover:bg-red-500/40 border border-red-500/50'
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
            >
              <X className={`w-4 h-4 ${isChic ? 'text-gray-400 group-hover:text-gray-300' : 'text-red-400 group-hover:text-red-300'}`} />
            </motion.button>
          </div>

          {/* デコレーションライン - シックモードでは非表示 */}
          {!isChic && (
            <div className="absolute bottom-0 left-0 right-0 h-px overflow-hidden">
              <motion.div
                className="h-full w-1/3 bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
                animate={{ x: ['-100%', '300%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
            </div>
          )}
        </div>

        {/* コンテンツエリア */}
        <div
          data-draggable-window-content
          className="p-4 sm:p-6 text-gray-300 overflow-y-auto relative max-h-[60vh] sm:max-h-[70vh] md:max-h-[400px]"
          style={{
            maxHeight: isMaximized ? 'calc(85vh - 60px)' : undefined,
          }}
        >
          {/* グリッドオーバーレイ - シックモードでは非表示 */}
          {!isChic && (
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <svg className="w-full h-full">
                <defs>
                  <pattern id={`grid-${id}`} width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="cyan" strokeWidth="0.5" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill={`url(#grid-${id})`} />
              </svg>
            </div>
          )}

          <div className="relative z-10">
            {children}
          </div>

          {/* スキャンラインエフェクト - シックモードでは非表示 */}
          {!isChic && (
            <motion.div
              className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent pointer-events-none"
              animate={{ y: [0, 400] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
                repeatDelay: 1,
              }}
              style={{ top: 0 }}
            />
          )}
        </div>

        {/* フッター */}
        <div className={`border-t px-4 py-2 flex items-center justify-between text-xs ${
          isChic
            ? 'bg-gray-800/50 border-gray-700/50 font-light'
            : 'bg-gradient-to-r from-cyan-900/30 to-blue-900/30 border-cyan-500/30 font-mono'
        }`}>
          {isChic ? (
            <>
              <div className="text-gray-500">Another Star LLC</div>
              <div className="text-gray-600">{new Date().getFullYear()}</div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <motion.div
                  className="w-2 h-2 bg-green-500 rounded-full"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className="text-green-400">ACTIVE</span>
              </div>
              <div className="text-cyan-600">
                MODULE ID: {id.slice(0, 8).toUpperCase()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ウィンドウ周りの光エフェクト - シックモードでは非表示 */}
      {!isChic && (
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-purple-500/10 rounded-lg blur-xl -z-10"
          animate={{
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}