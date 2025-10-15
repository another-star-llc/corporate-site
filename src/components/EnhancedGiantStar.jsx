import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

function StarParticles({ starPosition }) {
  const ref = useRef()
  
  const particles = useMemo(() => {
    const temp = []
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2
      const radius = 2 + Math.random() * 3
      temp.push({
        position: [
          Math.cos(angle) * radius,
          Math.sin(angle) * radius,
          (Math.random() - 0.5) * 2
        ],
        originalRadius: radius,
        angle: angle,
        speed: 0.5 + Math.random() * 0.5,
        scale: Math.random() * 0.3 + 0.1
      })
    }
    return temp
  }, [])

  useFrame((state) => {
    if (ref.current && starPosition.current) {
      ref.current.children.forEach((child, i) => {
        const particle = particles[i]
        const time = state.clock.elapsedTime
        
        // 星の周りを回転しながらまとわりつく
        const newAngle = particle.angle + time * particle.speed
        const radiusVariation = Math.sin(time * 2 + i) * 0.5
        const currentRadius = particle.originalRadius + radiusVariation
        
        child.position.x = starPosition.current.x + Math.cos(newAngle) * currentRadius
        child.position.y = starPosition.current.y + Math.sin(newAngle) * currentRadius
        child.position.z = starPosition.current.z + Math.sin(time * 3 + i) * 0.5
        
        // キラキラ効果
        const scale = particle.scale * (1 + Math.sin(time * 4 + i) * 0.5)
        child.scale.setScalar(scale)
      })
    }
  })

  return (
    <group ref={ref}>
      {particles.map((particle, i) => (
        <mesh key={i} position={particle.position}>
          <sphereGeometry args={[0.03, 6, 6]} />
          <meshBasicMaterial 
            color="#ffffff" 
            transparent 
            opacity={0.8}
            emissive="#ffff88"
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}

function SuperGiantStar() {
  const starRef = useRef()
  const glowRef = useRef()
  const starPosition = useRef({ x: 0, y: 0, z: 0 })
  
  useFrame((state) => {
    if (starRef.current) {
      // より複雑な縦横無尽の動き
      starRef.current.rotation.x = state.clock.elapsedTime * 0.4
      starRef.current.rotation.y = state.clock.elapsedTime * 0.3
      starRef.current.rotation.z = state.clock.elapsedTime * 0.2
      
      // 縦横無尽の位置移動
      starRef.current.position.x = Math.sin(state.clock.elapsedTime * 0.7) * 3
      starRef.current.position.y = Math.cos(state.clock.elapsedTime * 0.5) * 2 + Math.sin(state.clock.elapsedTime * 1.2) * 1
      starRef.current.position.z = Math.sin(state.clock.elapsedTime * 0.3) * 2
      
      // 位置を記録（パーティクルが追従するため）
      starPosition.current = {
        x: starRef.current.position.x,
        y: starRef.current.position.y,
        z: starRef.current.position.z
      }
      
      // より大きな脈動効果
      const scale = 1.5 + Math.sin(state.clock.elapsedTime * 2) * 0.4 + Math.cos(state.clock.elapsedTime * 3) * 0.2
      starRef.current.scale.setScalar(scale)
    }
    
    if (glowRef.current) {
      // グローエフェクトの脈動
      const glowScale = 2 + Math.sin(state.clock.elapsedTime * 1.5) * 0.5
      glowRef.current.scale.setScalar(glowScale)
      glowRef.current.rotation.z = -state.clock.elapsedTime * 0.1
      
      // 星と同じ位置に移動
      if (starPosition.current) {
        glowRef.current.position.x = starPosition.current.x
        glowRef.current.position.y = starPosition.current.y
        glowRef.current.position.z = starPosition.current.z - 0.5
      }
    }
  })

  // 5つの頂点を持つ星の形状を作成
  const starShape = useMemo(() => {
    const shape = new THREE.Shape()
    const outerRadius = 4
    const innerRadius = 2
    const spikes = 5 // 5つの頂点に戻す
    
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

  // グローエフェクト用の形状（5つの頂点）
  const glowShape = useMemo(() => {
    const shape = new THREE.Shape()
    const outerRadius = 5
    const innerRadius = 2.5
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
    <group>
      {/* グローエフェクト */}
      <mesh ref={glowRef} position={[0, 0, -0.5]}>
        <extrudeGeometry
          args={[
            glowShape,
            {
              depth: 0.2,
              bevelEnabled: false
            }
          ]}
        />
        <meshBasicMaterial
          color="#ffff00"
          transparent
          opacity={0.3}
        />
      </mesh>
      
      {/* メインの星 */}
      <mesh ref={starRef} position={[0, 0, 0]}>
        <extrudeGeometry
          args={[
            starShape,
            {
              depth: 1,
              bevelEnabled: true,
              bevelSegments: 4,
              steps: 3,
              bevelSize: 0.2,
              bevelThickness: 0.2
            }
          ]}
        />
        <meshStandardMaterial
          color="#ffff00"
          emissive="#ffaa00"
          emissiveIntensity={0.8}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>
      
      {/* 星にまとわりつくキラキラエフェクト */}
      <StarParticles starPosition={starPosition} />
    </group>
  )
}

export default function EnhancedGiantStar({ className = "" }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas camera={{ position: [0, 0, 12], fov: 75 }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={2} color="#ffff88" />
        <pointLight position={[-10, -10, 5]} intensity={1} color="#88ffff" />
        <directionalLight position={[0, 10, 5]} intensity={1} color="#ffffff" />
        
        <SuperGiantStar />
      </Canvas>
    </div>
  )
}

