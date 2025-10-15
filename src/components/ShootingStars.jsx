import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial, Trail } from '@react-three/drei'
import * as THREE from 'three'

function ShootingStar({ position, speed, color }) {
  const ref = useRef()
  const trailRef = useRef()
  
  useFrame((state, delta) => {
    if (ref.current) {
      // 流星の移動
      ref.current.position.x -= speed * delta * 10
      ref.current.position.y -= speed * delta * 5
      
      // 画面外に出たらリセット
      if (ref.current.position.x < -20) {
        ref.current.position.x = 20
        ref.current.position.y = Math.random() * 20 - 10
        ref.current.position.z = Math.random() * 10 - 5
      }
    }
  })

  return (
    <group>
      <Trail
        ref={trailRef}
        width={0.5}
        length={8}
        color={color}
        attenuation={(t) => t * t}
      >
        <mesh ref={ref} position={position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
      </Trail>
    </group>
  )
}

function ShootingStarsField() {
  const stars = useMemo(() => {
    const temp = []
    for (let i = 0; i < 15; i++) {
      temp.push({
        id: i,
        position: [
          Math.random() * 40 - 20,
          Math.random() * 20 - 10,
          Math.random() * 10 - 5
        ],
        speed: Math.random() * 2 + 1,
        color: ['#ffffff', '#ffff88', '#88ffff', '#ff88ff'][Math.floor(Math.random() * 4)]
      })
    }
    return temp
  }, [])

  return (
    <>
      {stars.map((star) => (
        <ShootingStar
          key={star.id}
          position={star.position}
          speed={star.speed}
          color={star.color}
        />
      ))}
    </>
  )
}

function GiantFloatingStar() {
  const ref = useRef()
  
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.x = state.clock.elapsedTime * 0.3
      ref.current.rotation.y = state.clock.elapsedTime * 0.2
      ref.current.rotation.z = state.clock.elapsedTime * 0.1
      ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2
      
      // 脈動効果
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.2
      ref.current.scale.setScalar(scale)
    }
  })

  // 星の形状を作成
  const starShape = useMemo(() => {
    const shape = new THREE.Shape()
    const outerRadius = 3
    const innerRadius = 1.5
    const spikes = 5
    
    for (let i = 0; i < spikes * 2; i++) {
      const angle = (i / (spikes * 2)) * Math.PI * 2
      const radius = i % 2 === 0 ? outerRadius : innerRadius
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      if (i === 0) {
        shape.moveTo(x, y)
      } else {
        shape.lineTo(x, y)
      }
    }
    shape.closePath()
    return shape
  }, [])

  return (
    <mesh ref={ref} position={[0, 0, 0]}>
      <extrudeGeometry
        args={[
          starShape,
          {
            depth: 0.5,
            bevelEnabled: true,
            bevelSegments: 2,
            steps: 2,
            bevelSize: 0.1,
            bevelThickness: 0.1
          }
        ]}
      />
      <meshStandardMaterial
        color="#ffff00"
        emissive="#ffaa00"
        emissiveIntensity={0.5}
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

export default function ShootingStars({ className = "", showGiantStar = false }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <directionalLight position={[-10, -10, -5]} intensity={0.5} />
        
        <ShootingStarsField />
        {showGiantStar && <GiantFloatingStar />}
      </Canvas>
    </div>
  )
}

