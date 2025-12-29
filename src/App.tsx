import { useState } from 'react';
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
    }, 2000);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black">
      <AnimatePresence mode="wait">
        {!entered && !hyperspace && (
          <EntryScreen key="entry" onEnter={handleEnter} />
        )}
        
        {hyperspace && (
          <motion.div
            key="hyperspace"
            className="fixed inset-0 z-50 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* ハイパースペースエフェクト */}
            <div className="absolute inset-0 bg-black">
              {[...Array(100)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 bg-white"
                  style={{
                    height: `${Math.random() * 3 + 1}px`,
                    transformOrigin: 'left center',
                  }}
                  initial={{
                    x: 0,
                    y: 0,
                    rotate: Math.random() * 360,
                    scaleX: 0,
                  }}
                  animate={{
                    x: Math.cos((Math.random() * 360 * Math.PI) / 180) * 2000,
                    y: Math.sin((Math.random() * 360 * Math.PI) / 180) * 2000,
                    scaleX: [0, 50, 100],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2,
                    ease: "easeIn",
                  }}
                />
              ))}
            </div>
            <motion.div
              className="absolute inset-0 bg-cyan-500/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 0.5, times: [0, 0.5, 1] }}
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
