import { motion } from 'motion/react';
import { Radar, Target } from 'lucide-react';
import { memo } from 'react';

interface Planet {
  id: string;
  name: string;
  color: number;
  position: [number, number, number];
  size: number;
}

interface ControlPanelProps {
  hoveredPlanet: string | null;
  planets: Planet[];
}

const planetInfo: Record<string, { 
  distance: string; 
  type: string; 
  status: string;
  description: string;
}> = {
  about: { 
    distance: '15.2 AU', 
    type: 'TERRAN', 
    status: 'ACCESSIBLE',
    description: '会社概要・企業情報'
  },
  mission: { 
    distance: '10.8 AU', 
    type: 'GAS GIANT', 
    status: 'ACCESSIBLE',
    description: 'ミッション・ビジョン'
  },
  people: { 
    distance: '15.4 AU', 
    type: 'FOREST', 
    status: 'ACCESSIBLE',
    description: 'メンバー紹介'
  },
  systems: { 
    distance: '16.7 AU', 
    type: 'VOLCANIC', 
    status: 'ACCESSIBLE',
    description: 'システム・技術'
  },
  contact: { 
    distance: '14.1 AU', 
    type: 'RINGED', 
    status: 'ACCESSIBLE',
    description: 'お問い合わせ'
  },
};

export const ControlPanel = memo(function ControlPanel({ hoveredPlanet, planets }: ControlPanelProps) {
  const currentPlanetInfo = hoveredPlanet ? planetInfo[hoveredPlanet] : null;

  // 惑星の位置を2D座標に変換（ミニマップ用）
  const getPlanetMapPosition = (planet: Planet) => {
    const scale = 3;
    const x = planet.position[0] * scale + 120;
    const z = planet.position[2] * scale + 120;
    return { x, y: z };
  };

  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30 pointer-events-none hidden sm:block"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.8 }}
    >
      {/* メインビューポート */}
      <div className="relative">
        {/* 中央の円形HUD */}
        <div className="relative w-[280px] h-[280px]">
          {/* 外側の回転リング */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-cyan-500/30"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {/* 4つのマーカー */}
            {[0, 90, 180, 270].map((angle) => (
              <div
                key={angle}
                className="absolute w-2 h-2 bg-cyan-500 rounded-full"
                style={{
                  top: '50%',
                  left: '50%',
                  transform: `rotate(${angle}deg) translateX(140px) translateY(-50%)`,
                }}
              />
            ))}
          </motion.div>

          {/* 中間リング */}
          <motion.div
            className="absolute inset-4 rounded-full border border-cyan-500/20"
            animate={{ rotate: -360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          {/* レーダースキャンライン */}
          <motion.div
            className="absolute inset-0 rounded-full overflow-hidden"
            style={{
              background: 'conic-gradient(from 0deg, transparent 0%, rgba(0,200,255,0.3) 10%, transparent 20%)',
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />

          {/* 惑星位置ドット（ミニマップ） */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {planets.map((planet) => {
              const pos = getPlanetMapPosition(planet);
              const isHovered = hoveredPlanet === planet.id;
              
              return (
                <g key={planet.id}>
                  {/* パルスエフェクト（ホバー時） */}
                  {isHovered && (
                    <motion.circle
                      cx={pos.x}
                      cy={pos.y}
                      r="8"
                      fill="none"
                      stroke="#00c8ff"
                      strokeWidth="2"
                      initial={{ r: 8, opacity: 0.8 }}
                      animate={{ r: 20, opacity: 0 }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  )}
                  
                  {/* 惑星ドット */}
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={isHovered ? "5" : "3"}
                    fill={isHovered ? "#00ffff" : `#${planet.color.toString(16).padStart(6, '0')}`}
                    opacity={isHovered ? "1" : "0.6"}
                  />
                  
                  {/* 接続線（ホバー時） */}
                  {isHovered && (
                    <motion.line
                      x1={pos.x}
                      y1={pos.y}
                      x2="140"
                      y2="140"
                      stroke="#00c8ff"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.5 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </g>
              );
            })}
            
            {/* 中央のクロスヘア */}
            <g>
              <line x1="140" y1="130" x2="140" y2="150" stroke="#00c8ff" strokeWidth="2" />
              <line x1="130" y1="140" x2="150" y2="140" stroke="#00c8ff" strokeWidth="2" />
              <circle cx="140" cy="140" r="3" fill="#00c8ff" />
            </g>
          </svg>

          {/* グリッドライン */}
          <div className="absolute inset-0 rounded-full" style={{
            background: `
              radial-gradient(circle at center, transparent 40%, rgba(0,200,255,0.05) 40%, rgba(0,200,255,0.05) 41%, transparent 41%),
              radial-gradient(circle at center, transparent 60%, rgba(0,200,255,0.05) 60%, rgba(0,200,255,0.05) 61%, transparent 61%),
              radial-gradient(circle at center, transparent 80%, rgba(0,200,255,0.05) 80%, rgba(0,200,255,0.05) 81%, transparent 81%)
            `,
          }} />

          {/* 中央の情報表示エリア */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              {currentPlanetInfo ? (
                <motion.div
                  key={hoveredPlanet}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="space-y-1"
                >
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Target className="w-4 h-4 text-cyan-400" />
                    <motion.div
                      className="text-cyan-400 font-mono text-xs"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      TARGET LOCKED
                    </motion.div>
                  </div>
                  
                  <div className="text-cyan-400 font-mono text-lg tracking-wider">
                    {planets.find(p => p.id === hoveredPlanet)?.name}
                  </div>
                  
                  <div className="text-cyan-600 font-mono text-xs">
                    {currentPlanetInfo.description}
                  </div>
                  
                  <div className="mt-3 space-y-1">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-gray-500">TYPE:</span>
                      <span className="text-cyan-500">{currentPlanetInfo.type}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-gray-500">DIST:</span>
                      <span className="text-cyan-500">{currentPlanetInfo.distance}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="text-gray-500">STATUS:</span>
                      <span className="text-green-400">{currentPlanetInfo.status}</span>
                    </div>
                  </div>
                  
                  <motion.div
                    className="mt-3 text-xs text-cyan-400 font-mono"
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    ▸ CLICK TO ACCESS
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <Radar className="w-8 h-8 text-cyan-500/50 mx-auto" />
                  <div className="text-cyan-500/50 font-mono text-xs">
                    SCANNING...
                  </div>
                  <div className="text-cyan-700 font-mono text-xs">
                    HOVER PLANET
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>


        {/* 角のアクセント */}
        {[
          { top: -8, left: -8 },
          { top: -8, right: -8 },
          { bottom: -8, left: -8 },
          { bottom: -8, right: -8 },
        ].map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 border-cyan-500/30"
            style={{
              ...pos,
              borderTopWidth: pos.top !== undefined ? '2px' : '0',
              borderBottomWidth: pos.bottom !== undefined ? '2px' : '0',
              borderLeftWidth: pos.left !== undefined ? '2px' : '0',
              borderRightWidth: pos.right !== undefined ? '2px' : '0',
            }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
          />
        ))}
      </div>
    </motion.div>
  );
});
