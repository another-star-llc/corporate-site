import { memo, useCallback } from 'react';
import { motion } from 'motion/react';
import { Crosshair } from 'lucide-react';

interface PlanetHintProps {
  focusPlanetId: string | null;
  onCyclePlanet: (planetId: string | null) => void;
  planetIds: string[];
  planetLabels: Record<string, string>;
}

export const PlanetHint = memo(function PlanetHint({
  focusPlanetId,
  onCyclePlanet,
  planetIds,
  planetLabels,
}: PlanetHintProps) {
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();

    const currentIndex = focusPlanetId ? planetIds.indexOf(focusPlanetId) : -1;
    const nextIndex = (currentIndex + 1) % planetIds.length;
    onCyclePlanet(planetIds[nextIndex]);
  }, [focusPlanetId, onCyclePlanet, planetIds]);

  const label = focusPlanetId
    ? planetLabels[focusPlanetId] ?? focusPlanetId.toUpperCase()
    : null;

  return (
    <motion.div
      className="fixed top-20 sm:top-6 left-1/2 -translate-x-1/2 z-20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.5, duration: 0.6 }}
    >
      <motion.button
        className="flex items-center gap-3 px-5 py-2.5 bg-black/60 backdrop-blur-md border border-cyan-500/30 rounded-full shadow-[0_0_20px_rgba(0,200,255,0.2)] cursor-pointer"
        onClick={handleClick}
        whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0,200,255,0.4)' }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="flex items-center justify-center"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <Crosshair className="w-4 h-4 text-cyan-400" />
        </motion.div>

        <span className="text-cyan-400 font-mono text-sm tracking-wide">
          {label ? `FOCUS: ${label}` : '惑星をフォーカス'}
        </span>

        <motion.div
          className={`w-2 h-2 rounded-full ${focusPlanetId ? 'bg-green-500' : 'bg-cyan-500'}`}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: focusPlanetId ? 0.8 : 2, repeat: Infinity }}
        />
      </motion.button>
    </motion.div>
  );
});
