import { memo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Globe, Shield, X } from 'lucide-react';

interface EarthMessageProps {
  isVisible: boolean;
  onClose: () => void;
  onContactClick?: () => void;
}

const messages = [
  'This is Earth.',
  'This is your business. This is your users.',
  '',
  'AI agents are evolving. Are you ready?',
  '',
  'We are Another Star. We protect what matters.',
];

export const EarthMessage = memo(function EarthMessage({
  isVisible,
  onClose,
  onContactClick,
}: EarthMessageProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [completedMessages, setCompletedMessages] = useState<string[]>([]);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setCurrentMessageIndex(0);
      setDisplayedText('');
      setCompletedMessages([]);
      setShowButton(false);
      return;
    }

    // タイプライター効果
    const currentMessage = messages[currentMessageIndex];

    if (currentMessage === '') {
      // 空行は完了リストに追加して次へ
      setCompletedMessages(prev => [...prev, '']);
      const timer = setTimeout(() => {
        if (currentMessageIndex < messages.length - 1) {
          setCurrentMessageIndex(prev => prev + 1);
        }
      }, 500);
      return () => clearTimeout(timer);
    }

    let charIndex = 0;
    setDisplayedText('');

    const typeInterval = setInterval(() => {
      if (charIndex < currentMessage.length) {
        setDisplayedText(currentMessage.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        // 完了したメッセージを追加
        setCompletedMessages(prev => [...prev, currentMessage]);
        setDisplayedText('');
        // 次のメッセージへ
        setTimeout(() => {
          if (currentMessageIndex < messages.length - 1) {
            setCurrentMessageIndex(prev => prev + 1);
          } else {
            // 最後のメッセージ後にボタンを表示
            setShowButton(true);
          }
        }, 600);
      }
    }, 40);

    return () => clearInterval(typeInterval);
  }, [isVisible, currentMessageIndex]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
        >
          {/* 背景オーバーレイ */}
          <motion.div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* 閉じるボタン */}
          <motion.button
            className="absolute top-6 right-6 z-60 p-2 text-gray-400 hover:text-white transition-colors"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-8 h-8" />
          </motion.button>

          {/* メインコンテンツ */}
          <div className="relative z-10 max-w-2xl mx-auto px-8">
            {/* 地球アイコン */}
            <motion.div
              className="flex justify-center mb-8"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, type: 'spring', damping: 15 }}
            >
              <div className="relative">
                <motion.div
                  className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-green-400 flex items-center justify-center"
                  animate={{
                    boxShadow: [
                      '0 0 30px rgba(59,130,246,0.5)',
                      '0 0 60px rgba(59,130,246,0.8)',
                      '0 0 30px rgba(59,130,246,0.5)',
                    ],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Globe className="w-12 h-12 text-white" />
                </motion.div>

                {/* パルスリング */}
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-blue-400"
                  initial={{ scale: 1, opacity: 0.8 }}
                  animate={{ scale: 2, opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </div>
            </motion.div>

            {/* メッセージ表示エリア */}
            <div className="min-h-[200px] flex flex-col items-center justify-center">
              {/* 完了したメッセージ */}
              {completedMessages.map((msg, idx) => (
                <motion.div
                  key={`completed-${idx}`}
                  className={`text-center mb-3 text-gray-500 text-lg md:text-xl ${
                    msg === '' ? 'h-4' : ''
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {msg}
                </motion.div>
              ))}
              {/* 現在タイプ中のメッセージ */}
              {displayedText && (
                <motion.div
                  key={`current-${currentMessageIndex}`}
                  className="text-center mb-3 text-white text-xl md:text-2xl"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="font-mono">
                    {displayedText}
                    <motion.span
                      className="inline-block w-0.5 h-5 bg-cyan-400 ml-1"
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                    />
                  </span>
                </motion.div>
              )}
            </div>

            {/* アクションボタン */}
            <AnimatePresence>
              {showButton && (
                <motion.div
                  className="flex justify-center gap-4 mt-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <motion.button
                    className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-mono text-sm hover:from-cyan-400 hover:to-blue-400 transition-all"
                    onClick={onContactClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Shield className="w-4 h-4" />
                    CONTACT US
                  </motion.button>

                  <motion.button
                    className="px-6 py-3 border border-gray-500 text-gray-400 rounded-lg font-mono text-sm hover:border-gray-400 hover:text-gray-300 transition-all"
                    onClick={onClose}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CLOSE
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 装飾的なライン */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
});
