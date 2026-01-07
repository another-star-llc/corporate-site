import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';

interface Planet {
  id: string;
  name: string;
  color: number;
  position: [number, number, number];
  size: number;
  orbitSpeed: number;
  rotationSpeed: number;
  emissive: number;
  ringColor?: number;
}

interface SpaceBackgroundProps {
  onPlanetClick?: (planetId: string) => void;
  onPlanetHover?: (planetId: string | null) => void;
  onEarthClick?: () => void;
}

const planets: Planet[] = [
  {
    id: 'about',
    name: 'ABOUT',
    color: 0x4a9eff,
    emissive: 0x2463a8,
    position: [-22, 8, -35],
    size: 2.5,
    orbitSpeed: 0.0003,
    rotationSpeed: 0.005,
  },
  {
    id: 'mission',
    name: 'MISSION',
    color: 0xa855f7,
    emissive: 0x7c3aed,
    position: [18, 12, -28],
    size: 2.2,
    orbitSpeed: 0.0004,
    rotationSpeed: 0.007,
  },
  {
    id: 'members',
    name: 'MEMBERS',
    color: 0x60a5fa,
    emissive: 0x3b82f6,
    position: [-5, -12, -42],
    size: 2.0,
    orbitSpeed: 0.0005,
    rotationSpeed: 0.006,
  },
  {
    id: 'team',
    name: 'TEAM',
    color: 0x34d399,
    emissive: 0x10b981,
    position: [20, -8, -38],
    size: 2.3,
    orbitSpeed: 0.00035,
    rotationSpeed: 0.004,
  },
  {
    id: 'systems',
    name: 'SYSTEMS',
    color: 0xfb923c,
    emissive: 0xf97316,
    position: [-8, 15, -25],
    size: 2.6,
    orbitSpeed: 0.00045,
    rotationSpeed: 0.008,
  },
  {
    id: 'contact',
    name: 'CONTACT',
    color: 0xec4899,
    emissive: 0xdb2777,
    position: [-18, -5, -30],
    size: 2.4,
    orbitSpeed: 0.0006,
    rotationSpeed: 0.005,
    ringColor: 0xf9a8d4,
  },
];

export function SpaceBackground({ onPlanetClick, onPlanetHover, onEarthClick }: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 }); // ステートからrefに変更
  const raycasterRef = useRef<THREE.Raycaster>();
  const mouseRef = useRef(new THREE.Vector2());
  const planetMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const lastHoveredPlanetRef = useRef<string | null>(null); // 前回のホバー状態を保存
  const earthOriginalScale = useRef(1);

  // コールバックをrefで保存（依存配列から除外するため）
  const onPlanetClickRef = useRef(onPlanetClick);
  const onPlanetHoverRef = useRef(onPlanetHover);
  const onEarthClickRef = useRef(onEarthClick);

  useEffect(() => {
    onPlanetClickRef.current = onPlanetClick;
    onPlanetHoverRef.current = onPlanetHover;
    onEarthClickRef.current = onEarthClick;
  }, [onPlanetClick, onPlanetHover, onEarthClick]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: false,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // スカイボックス（球体の内側に星雲テクスチャ）
    const skyboxGeometry = new THREE.SphereGeometry(300, 64, 64);
    const textureLoader = new THREE.TextureLoader();
    const nebulaTexture = textureLoader.load(
      'https://images.unsplash.com/photo-1715147286628-eaae87cc8196?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxnYWxheHklMjBuZWJ1bGElMjBzdGFyc3xlbnwxfHx8fDE3NjY5NzM1NDd8MA&ixlib=rb-4.1.0&q=80&w=1080'
    );
    
    const skyboxMaterial = new THREE.MeshBasicMaterial({
      map: nebulaTexture,
      side: THREE.BackSide,
      transparent: true,
      opacity: 0.6,
    });
    
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);

    // 星空を複数レイヤーで作成
    const starLayers: THREE.Points[] = [];
    
    for (let layer = 0; layer < 3; layer++) {
      const starsGeometry = new THREE.BufferGeometry();
      const starsMaterial = new THREE.PointsMaterial({ 
        color: 0xffffff, 
        size: 0.05 + layer * 0.02,
        transparent: true,
        opacity: 0.8 - layer * 0.2,
      });

      const starsVertices = [];
      const colors = [];
      
      for (let i = 0; i < 3000; i++) {
        const x = (Math.random() - 0.5) * 500;
        const y = (Math.random() - 0.5) * 500;
        const z = (Math.random() - 0.5) * 500 - layer * 50;
        
        starsVertices.push(x, y, z);
        
        const colorChoice = Math.random();
        if (colorChoice > 0.8) {
          colors.push(0.4, 0.8, 1);
        } else if (colorChoice > 0.6) {
          colors.push(0.6, 0.6, 1);
        } else {
          colors.push(1, 1, 1);
        }
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      
      starsMaterial.vertexColors = true;
      
      const stars = new THREE.Points(starsGeometry, starsMaterial);
      scene.add(stars);
      starLayers.push(stars);
    }

    // 動く光の粒子
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesMaterial = new THREE.PointsMaterial({
      color: 0x00ffff,
      size: 0.15,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });

    const particlesVertices = [];
    const particleVelocities: { x: number; y: number; z: number }[] = [];

    for (let i = 0; i < 200; i++) {
      particlesVertices.push(
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100,
        (Math.random() - 0.5) * 100
      );
      
      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      });
    }

    particlesGeometry.setAttribute('position', new THREE.Float32BufferAttribute(particlesVertices, 3));
    const particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);

    // 回転する地球（遠景）- NASAの地球テクスチャ
    const earthGeometry = new THREE.SphereGeometry(8, 64, 64);
    const earthTexture = textureLoader.load(
      'https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg'
    );

    const earthMaterial = new THREE.MeshPhongMaterial({
      map: earthTexture,
      emissive: 0x112244,
      emissiveIntensity: 0.3,
      shininess: 30,
    });

    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    earth.position.set(-30, -20, -80);
    earth.userData = { id: 'earth', name: 'EARTH', originalScale: 1 };
    earthMeshRef.current = earth;
    earthOriginalScale.current = 1;
    scene.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(8.5, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    atmosphere.position.copy(earth.position);
    scene.add(atmosphere);

    // 惑星ナビゲーション
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // 惑星テクスチャのURL
    const planetTextures = {
      about: 'https://images.unsplash.com/photo-1727363584291-433dcd86a0fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlYXJ0aCUyMHBsYW5ldCUyMHNwYWNlfGVufDF8fHx8MTc2NjkzODkzNXww&ixlib=rb-4.1.0&q=80&w=1080',
      mission: 'https://images.unsplash.com/photo-1639477734993-44982980229e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqdXBpdGVyJTIwcGxhbmV0JTIwcHVycGxlfGVufDF8fHx8MTc2NzAwNzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      members: 'https://images.unsplash.com/photo-1766699624032-636b6ee15a35?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2UlMjBwbGFuZXQlMjBmcm96ZW58ZW58MXx8fHwxNjY3MDA3NTUzfDA&ixlib=rb-4.1.0&q=80&w=1080',
      team: 'https://images.unsplash.com/photo-1642265466368-2a491569308a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMHBsYW5ldCUyMGVhcnRofGVufDF8fHx8MTc2NzAwNzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      systems: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXJzJTIwcGxhbmV0JTIwcmVkfGVufDF8fHx8MTc2NzAwNzU1M3ww&ixlib=rb-4.1.0&q=80&w=1080',
      contact: 'https://images.unsplash.com/photo-1614732414444-096e5f1122d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzYXR1cm4lMjBwbGFuZXQlMjByaW5nc3xlbnwxfHx8fDE3NjY5NDYyNDl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    };

    planets.forEach((planetData) => {
      const geometry = new THREE.SphereGeometry(planetData.size, 128, 128);
      
      // 実写テクスチャを読み込み（背景の地球と同じ手法）
      const texture = textureLoader.load(planetTextures[planetData.id as keyof typeof planetTextures]);
      
      const material = new THREE.MeshPhongMaterial({ 
        map: texture,
        emissive: planetData.emissive,
        emissiveIntensity: 0.3,
        shininess: 30,
      });

      const planet = new THREE.Mesh(geometry, material);
      planet.position.set(...planetData.position);
      planet.userData = { 
        id: planetData.id, 
        name: planetData.name, 
        originalScale: 1,
      };
      planetGroup.add(planet);
      planetMeshesRef.current.set(planetData.id, planet);

      // 大気グローエフェクト
      const glowGeometry = new THREE.SphereGeometry(planetData.size * 1.15, 32, 32);
      const glowMaterial = new THREE.MeshBasicMaterial({
        color: planetData.color,
        transparent: true,
        opacity: 0.2,
        side: THREE.BackSide,
      });
      const glow = new THREE.Mesh(glowGeometry, glowMaterial);
      planet.add(glow);

      // 土星の輪（CONTACTのみ）
      if (planetData.ringColor) {
        const ringGeometry = new THREE.RingGeometry(planetData.size * 1.5, planetData.size * 2.2, 64);
        const ringMaterial = new THREE.MeshBasicMaterial({
          color: planetData.ringColor,
          transparent: true,
          opacity: 0.6,
          side: THREE.DoubleSide,
        });
        const ring = new THREE.Mesh(ringGeometry, ringMaterial);
        ring.rotation.x = Math.PI / 2.3;
        planet.add(ring);
      }
    });

    // ライティング
    const ambientLight = new THREE.AmbientLight(0x222244, 0.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(20, 10, 20);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 100);
    pointLight1.position.set(20, 20, 10);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1.5, 100);
    pointLight2.position.set(-20, -20, 10);
    scene.add(pointLight2);

    camera.position.z = 30;

    // マウス追従
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;
    let currentRotationX = 0;
    let currentRotationY = 0;

    // パララックス用の変数
    let targetCameraX = 0;
    let targetCameraY = 0;
    let currentCameraX = 0;
    let currentCameraY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

      mouseRef.current.x = mouseX;
      mouseRef.current.y = mouseY;

      targetRotationY = mouseX * 0.3;
      targetRotationX = mouseY * 0.2;

      // パララックス効果用のカメラターゲット位置（効果を強く）
      targetCameraX = mouseX * 15;
      targetCameraY = mouseY * 15;

      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleClick = () => {
      if (!raycasterRef.current) return;

      raycaster.setFromCamera(mouseRef.current, camera);

      // 惑星のクリック検知
      const planetIntersects = raycaster.intersectObjects(Array.from(planetMeshesRef.current.values()));
      if (planetIntersects.length > 0 && onPlanetClickRef.current) {
        const clicked = planetIntersects[0].object as THREE.Mesh;
        const planetId = clicked.userData.id;
        if (planetId) {
          onPlanetClickRef.current(planetId);
          return;
        }
      }

      // 地球のクリック検知
      if (earthMeshRef.current && onEarthClickRef.current) {
        const earthIntersects = raycaster.intersectObject(earthMeshRef.current);
        if (earthIntersects.length > 0) {
          onEarthClickRef.current();
        }
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    // アニメーションループ
    let animationId: number;
    const clock = new THREE.Clock();
    
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // 星雲を回転（パララックス - 最遠景、最も遅い）
      skybox.rotation.z = elapsedTime * 0.01;
      skybox.rotation.x = currentCameraY * 0.0003;
      skybox.rotation.y = currentCameraX * 0.0003;

      // 星空を回転（パララックス - 遠景、中程度の速さ）
      starLayers.forEach((stars, index) => {
        const parallaxMultiplier = (index + 1) * 0.5; // より強い視差効果
        stars.rotation.y = elapsedTime * 0.02 * (index + 1) + currentCameraX * 0.001 * parallaxMultiplier;
        stars.rotation.x = elapsedTime * 0.01 * (index + 1) + currentCameraY * 0.0008 * parallaxMultiplier;
      });

      // 地球を回転（パララックス - 中景、最も速い）
      earth.rotation.y = elapsedTime * 0.05;
      atmosphere.rotation.y = elapsedTime * 0.05;
      earth.position.x = -30 + currentCameraX * 0.08; // より大きく動く
      earth.position.y = -20 + currentCameraY * 0.08;

      // 粒子を動かす
      const positions = particlesGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleVelocities.length; i++) {
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;

        if (Math.abs(positions[i * 3]) > 50) particleVelocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 50) particleVelocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 50) particleVelocities[i].z *= -1;
      }
      particlesGeometry.attributes.position.needsUpdate = true;

      // ライトを動かす
      pointLight1.position.x = Math.sin(elapsedTime) * 30;
      pointLight1.position.y = Math.cos(elapsedTime * 0.7) * 30;

      pointLight2.position.x = Math.cos(elapsedTime * 0.8) * 30;
      pointLight2.position.y = Math.sin(elapsedTime * 0.5) * 30;

      // パララックス用のカメラ位置イージング
      currentCameraX += (targetCameraX - currentCameraX) * 0.05;
      currentCameraY += (targetCameraY - currentCameraY) * 0.05;

      // 惑星グループを回転（マウス追従）
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      planetGroup.rotation.y = currentRotationY;
      planetGroup.rotation.x = currentRotationX;
      
      // 惑星グループ全体にもパララックス移動を適用（前景として速く動く）
      planetGroup.position.x = currentCameraX * 0.1;
      planetGroup.position.y = currentCameraY * 0.1;

      // 各惑星を回���＋軌道移動
      planets.forEach((planetData) => {
        const mesh = planetMeshesRef.current.get(planetData.id);
        if (mesh) {
          mesh.rotation.y += planetData.rotationSpeed;

          const orbitRadius = Math.sqrt(
            planetData.position[0] ** 2 +
            planetData.position[2] ** 2
          );
          const angle = elapsedTime * planetData.orbitSpeed;
          const baseAngle = Math.atan2(planetData.position[2], planetData.position[0]);
          
          mesh.position.x = Math.cos(baseAngle + angle) * orbitRadius;
          mesh.position.z = Math.sin(baseAngle + angle) * orbitRadius;
        }
      });

      // レイキャスト（ホバー検知）
      raycaster.setFromCamera(mouseRef.current, camera);
      const intersects = raycaster.intersectObjects(Array.from(planetMeshesRef.current.values()));

      planetMeshesRef.current.forEach((mesh) => {
        mesh.scale.setScalar(mesh.userData.originalScale);
      });

      // 地球のスケールをリセット
      if (earthMeshRef.current) {
        earthMeshRef.current.scale.setScalar(earthOriginalScale.current);
      }

      let isHoveringEarth = false;

      if (intersects.length > 0) {
        const hoveredMesh = intersects[0].object as THREE.Mesh;
        const planetId = hoveredMesh.userData.id;

        // 前回と異なる惑星にホバーした場合のみ更新
        if (lastHoveredPlanetRef.current !== planetId) {
          lastHoveredPlanetRef.current = planetId;
          setHoveredPlanet(planetId);
          if (onPlanetHoverRef.current) {
            onPlanetHoverRef.current(planetId);
          }
        }

        hoveredMesh.scale.setScalar(1.3);
      } else {
        // 惑星にホバーしていない場合、地球をチェック
        if (earthMeshRef.current) {
          const earthIntersects = raycaster.intersectObject(earthMeshRef.current);
          if (earthIntersects.length > 0) {
            isHoveringEarth = true;
            earthMeshRef.current.scale.setScalar(1.15);

            if (lastHoveredPlanetRef.current !== 'earth') {
              lastHoveredPlanetRef.current = 'earth';
              setHoveredPlanet('earth');
            }
          }
        }

        // ホバーが外れた場合のみ更新
        if (!isHoveringEarth && lastHoveredPlanetRef.current !== null) {
          lastHoveredPlanetRef.current = null;
          setHoveredPlanet(null);
          if (onPlanetHoverRef.current) {
            onPlanetHoverRef.current(null);
          }
        }
      }

      // カメラをマウスに追従
      camera.position.x += (mouseX * 5 - camera.position.x) * 0.05;
      camera.position.y += (mouseY * 5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // パララックス効果
      currentCameraX += (targetCameraX - currentCameraX) * 0.05;
      currentCameraY += (targetCameraY - currentCameraY) * 0.05;
      camera.position.x += currentCameraX;
      camera.position.y += currentCameraY;

      renderer.render(scene, camera);
    };

    animate();

    // リサイズハンドラ
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      earthGeometry.dispose();
      earthMaterial.dispose();
      atmosphereGeometry.dispose();
      atmosphereMaterial.dispose();
      particlesGeometry.dispose();
      particlesMaterial.dispose();
      skyboxGeometry.dispose();
      skyboxMaterial.dispose();
      starLayers.forEach(layer => {
        layer.geometry.dispose();
        (layer.material as THREE.PointsMaterial).dispose();
      });
    };
  }, []);

  return (
    <>
      <canvas ref={canvasRef} className="fixed inset-0 -z-10 pointer-events-auto" />

      {/* ホバー時のラベル */}
      <AnimatePresence>
        {hoveredPlanet && (
          <motion.div
            className="fixed pointer-events-none z-20"
            style={{
              left: mousePositionRef.current.x,
              top: mousePositionRef.current.y,
            }}
            initial={{ opacity: 0, scale: 0.5, x: -50, y: -50 }}
            animate={{ opacity: 1, scale: 1, x: -50, y: -70 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-black/80 backdrop-blur-md border border-cyan-500/50 rounded-lg px-4 py-2 shadow-[0_0_20px_rgba(0,200,255,0.5)]">
              <div className="text-cyan-400 font-mono text-sm">
                {hoveredPlanet === 'earth' ? 'EARTH' : planets.find(p => p.id === hoveredPlanet)?.name}
              </div>
              <div className="text-cyan-600 text-xs mt-1">Click to access</div>
            </div>
            <motion.div
              className="absolute top-full left-1/2 w-px h-8 bg-gradient-to-b from-cyan-500 to-transparent"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              exit={{ scaleY: 0 }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 操作ガイド - 削除（ControlPanelと重複するため） */}
    </>
  );
}