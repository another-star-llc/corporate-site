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
  onEmptyClick?: () => void;
  focusPlanetId?: string | null;
}

// 地球中心座標（JAFCOスタイル：少し上に配置）
const EARTH_CENTER: [number, number, number] = [0, 30, 0];

const planets: Planet[] = [
  {
    id: 'about',
    name: 'ABOUT',
    color: 0x4a9eff,
    emissive: 0x2463a8,
    position: [-500, 240, -130],
    size: 44,
    orbitSpeed: 0.0003,
    rotationSpeed: 0.005,
  },
  {
    id: 'mission',
    name: 'MISSION',
    color: 0xa855f7,
    emissive: 0x7c3aed,
    position: [440, 360, -220],
    size: 40,
    orbitSpeed: 0.0004,
    rotationSpeed: 0.007,
  },
  {
    id: 'members',
    name: 'MEMBERS',
    color: 0x60a5fa,
    emissive: 0x3b82f6,
    position: [-260, -440, -260],
    size: 36,
    orbitSpeed: 0.0005,
    rotationSpeed: 0.006,
  },
  {
    id: 'team',
    name: 'TEAM',
    color: 0x34d399,
    emissive: 0x10b981,
    position: [560, -280, -100],
    size: 42,
    orbitSpeed: 0.00035,
    rotationSpeed: 0.004,
  },
  {
    id: 'systems',
    name: 'SYSTEMS',
    color: 0xfb923c,
    emissive: 0xf97316,
    position: [100, 520, -70],
    size: 48,
    orbitSpeed: 0.00045,
    rotationSpeed: 0.008,
  },
  {
    id: 'contact',
    name: 'CONTACT',
    color: 0xec4899,
    emissive: 0xdb2777,
    position: [-480, -200, -320],
    size: 40,
    orbitSpeed: 0.0006,
    rotationSpeed: 0.005,
    ringColor: 0xf9a8d4,
  },
];

export function SpaceBackground({ onPlanetClick, onPlanetHover, onEmptyClick, focusPlanetId }: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null);
  const mousePositionRef = useRef({ x: 0, y: 0 }); // ステートからrefに変更
  const raycasterRef = useRef<THREE.Raycaster>();
  const mouseRef = useRef(new THREE.Vector2());
  const planetMeshesRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const earthMeshRef = useRef<THREE.Mesh | null>(null);
  const lastHoveredPlanetRef = useRef<string | null>(null); // 前回のホバー状態を保存
  const earthOriginalScale = useRef(1);
  const focusPlanetRef = useRef<string | null>(null);

  // コールバックをrefで保存（依存配列から除外するため）
  const onPlanetClickRef = useRef(onPlanetClick);
  const onPlanetHoverRef = useRef(onPlanetHover);
  const onEmptyClickRef = useRef(onEmptyClick);

  useEffect(() => {
    onPlanetClickRef.current = onPlanetClick;
    onPlanetHoverRef.current = onPlanetHover;
    onEmptyClickRef.current = onEmptyClick;
  }, [onPlanetClick, onPlanetHover, onEmptyClick]);

  // フォーカス対象をrefに同期
  useEffect(() => {
    focusPlanetRef.current = focusPlanetId ?? null;
  }, [focusPlanetId]);

  useEffect(() => {
    if (!canvasRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 5000);
    const renderer = new THREE.WebGLRenderer({ 
      canvas: canvasRef.current, 
      antialias: true,
      alpha: false,
    });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const raycaster = new THREE.Raycaster();
    raycasterRef.current = raycaster;

    // 背景色を真っ黒に
    scene.background = new THREE.Color(0x000000);

    // スカイボックス（テクスチャなし、星とパーティクルのみ）
    const skyboxGeometry = new THREE.SphereGeometry(3000, 64, 64);
    const skyboxMaterial = new THREE.MeshBasicMaterial({
      color: 0x000000,
      side: THREE.BackSide,
    });
    const skybox = new THREE.Mesh(skyboxGeometry, skyboxMaterial);
    scene.add(skybox);
    const textureLoader = new THREE.TextureLoader();

    // 星空を複数レイヤーで作成
    const starLayers: THREE.Points[] = [];

    // 層ごとに密度・サイズ・明るさを変えて奥行き感を出す
    const layerConfigs = [
      { count: 5000, spread: 3000, size: 0.2, opacity: 0.5, zOffset: 0 },      // 遠景: 暗く細かい
      { count: 2000, spread: 2000, size: 0.5, opacity: 0.7, zOffset: -200 },    // 中景: 中くらい
      { count: 800, spread: 1500, size: 1.2, opacity: 1.0, zOffset: -400 },     // 近景: 明るく大きい
    ];

    for (let layer = 0; layer < layerConfigs.length; layer++) {
      const config = layerConfigs[layer];
      const starsGeometry = new THREE.BufferGeometry();

      const starsVertices = [];
      const colors = [];
      const sizes = [];

      for (let i = 0; i < config.count; i++) {
        // クラスター（密集地帯）を作る: 20%の星をランダムな中心に集める
        let x, y, z;
        if (Math.random() < 0.2) {
          const cx = (Math.random() - 0.5) * config.spread;
          const cy = (Math.random() - 0.5) * config.spread;
          const cz = (Math.random() - 0.5) * config.spread + config.zOffset;
          x = cx + (Math.random() - 0.5) * 200;
          y = cy + (Math.random() - 0.5) * 200;
          z = cz + (Math.random() - 0.5) * 200;
        } else {
          x = (Math.random() - 0.5) * config.spread;
          y = (Math.random() - 0.5) * config.spread;
          z = (Math.random() - 0.5) * config.spread + config.zOffset;
        }

        starsVertices.push(x, y, z);

        // 明るさにばらつき
        const brightness = 0.3 + Math.random() * 0.7;
        const colorChoice = Math.random();
        if (colorChoice > 0.9) {
          colors.push(0.4 * brightness, 0.8 * brightness, 1 * brightness); // 青白い星
        } else if (colorChoice > 0.8) {
          colors.push(1 * brightness, 0.85 * brightness, 0.6 * brightness); // 暖色系
        } else if (colorChoice > 0.7) {
          colors.push(0.6 * brightness, 0.6 * brightness, 1 * brightness); // 青い星
        } else {
          colors.push(brightness, brightness, brightness); // 白
        }

        // サイズにもばらつき
        sizes.push(config.size * (0.3 + Math.random() * 1.5));
      }

      starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
      starsGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

      const starsMaterial = new THREE.PointsMaterial({
        size: config.size,
        transparent: true,
        opacity: config.opacity,
        vertexColors: true,
        sizeAttenuation: true,
      });

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
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000,
        (Math.random() - 0.5) * 1000
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

    // 回転する地球（JAFCOスタイル：大きく表示）
    const earthGeometry = new THREE.SphereGeometry(120, 64, 64);
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
    earth.position.set(EARTH_CENTER[0], EARTH_CENTER[1], EARTH_CENTER[2]);
    earth.userData = { id: 'earth', name: 'EARTH', originalScale: 1 };
    earthMeshRef.current = earth;
    earthOriginalScale.current = 1;
    scene.add(earth);

    const atmosphereGeometry = new THREE.SphereGeometry(130, 64, 64);
    const atmosphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x00aaff,
      transparent: true,
      opacity: 0.2,
      side: THREE.BackSide,
    });
    const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    earth.add(atmosphere);

    // 惑星ナビゲーション
    const planetGroup = new THREE.Group();
    scene.add(planetGroup);

    // プロシージャルテクスチャ生成関数
    const generatePlanetTexture = (
      baseColor: [number, number, number],
      secondaryColor: [number, number, number],
      style: 'gas' | 'rocky' | 'ice' | 'lava' | 'striped' | 'marble'
    ): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 512;
      const ctx = canvas.getContext('2d')!;

      // シード付き疑似ランダム
      let seed = baseColor[0] * 1000 + baseColor[1] * 100 + baseColor[2] * 10;
      const seededRandom = () => {
        seed = (seed * 9301 + 49297) % 233280;
        return seed / 233280;
      };

      // ベース塗り
      ctx.fillStyle = `rgb(${baseColor[0]}, ${baseColor[1]}, ${baseColor[2]})`;
      ctx.fillRect(0, 0, 1024, 512);

      if (style === 'gas' || style === 'striped') {
        // 木星風の横縞バンド
        const bandCount = 12 + Math.floor(seededRandom() * 8);
        for (let i = 0; i < bandCount; i++) {
          const y = (i / bandCount) * 512;
          const h = (512 / bandCount) * (0.6 + seededRandom() * 0.8);
          const mix = seededRandom();
          const r = Math.floor(baseColor[0] * (1 - mix) + secondaryColor[0] * mix);
          const g = Math.floor(baseColor[1] * (1 - mix) + secondaryColor[1] * mix);
          const b = Math.floor(baseColor[2] * (1 - mix) + secondaryColor[2] * mix);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.3 + seededRandom() * 0.5})`;
          ctx.fillRect(0, y, 1024, h);
        }
        // 渦巻き模様（大赤斑風）
        for (let s = 0; s < 3; s++) {
          const sx = seededRandom() * 1024;
          const sy = 100 + seededRandom() * 312;
          const sr = 20 + seededRandom() * 40;
          const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
          gradient.addColorStop(0, `rgba(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]}, 0.6)`);
          gradient.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.ellipse(sx, sy, sr * 1.5, sr, 0, 0, Math.PI * 2);
          ctx.fill();
        }
        // 横方向の流れ模様
        for (let i = 0; i < 60; i++) {
          const x = seededRandom() * 1024;
          const y = seededRandom() * 512;
          const w = 50 + seededRandom() * 200;
          const h2 = 2 + seededRandom() * 6;
          ctx.fillStyle = `rgba(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]}, ${0.1 + seededRandom() * 0.2})`;
          ctx.fillRect(x, y, w, h2);
          // 横方向にラップ（シームレス化）
          if (x + w > 1024) {
            ctx.fillRect(0, y, (x + w) - 1024, h2);
          }
        }
      } else if (style === 'rocky' || style === 'lava') {
        // 岩石/溶岩惑星：クレーターと地表模様
        // ノイズ的な地表
        for (let i = 0; i < 3000; i++) {
          const x = seededRandom() * 1024;
          const y = seededRandom() * 512;
          const r = 1 + seededRandom() * 4;
          const bright = 0.7 + seededRandom() * 0.6;
          ctx.fillStyle = `rgba(${Math.floor(secondaryColor[0] * bright)}, ${Math.floor(secondaryColor[1] * bright)}, ${Math.floor(secondaryColor[2] * bright)}, ${0.3 + seededRandom() * 0.4})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        // クレーター
        for (let i = 0; i < 20; i++) {
          const x = seededRandom() * 1024;
          const y = seededRandom() * 512;
          const r = 8 + seededRandom() * 30;
          // 影（暗い縁）
          ctx.strokeStyle = `rgba(0, 0, 0, 0.4)`;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.stroke();
          // 内側のグラデーション
          const cGrad = ctx.createRadialGradient(x - r * 0.2, y - r * 0.2, 0, x, y, r);
          cGrad.addColorStop(0, `rgba(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]}, 0.3)`);
          cGrad.addColorStop(0.7, `rgba(0, 0, 0, 0.2)`);
          cGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = cGrad;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        // 山脈・尾根線
        for (let i = 0; i < 8; i++) {
          ctx.strokeStyle = `rgba(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]}, 0.2)`;
          ctx.lineWidth = 1 + seededRandom() * 3;
          ctx.beginPath();
          let px = seededRandom() * 1024;
          let py = seededRandom() * 512;
          ctx.moveTo(px, py);
          for (let j = 0; j < 8; j++) {
            px += (seededRandom() - 0.3) * 150;
            py += (seededRandom() - 0.5) * 80;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else if (style === 'ice') {
        // 氷惑星：ひび割れと結晶模様
        for (let i = 0; i < 2000; i++) {
          const x = seededRandom() * 1024;
          const y = seededRandom() * 512;
          const r = 1 + seededRandom() * 3;
          ctx.fillStyle = `rgba(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]}, ${0.1 + seededRandom() * 0.3})`;
          ctx.beginPath();
          ctx.arc(x, y, r, 0, Math.PI * 2);
          ctx.fill();
        }
        // ひび割れ
        for (let i = 0; i < 15; i++) {
          ctx.strokeStyle = `rgba(${Math.min(255, secondaryColor[0] + 60)}, ${Math.min(255, secondaryColor[1] + 60)}, ${Math.min(255, secondaryColor[2] + 60)}, ${0.3 + seededRandom() * 0.3})`;
          ctx.lineWidth = 0.5 + seededRandom() * 1.5;
          ctx.beginPath();
          let px = seededRandom() * 1024;
          let py = seededRandom() * 512;
          ctx.moveTo(px, py);
          for (let j = 0; j < 12; j++) {
            px += (seededRandom() - 0.5) * 120;
            py += (seededRandom() - 0.5) * 60;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
        }
      } else if (style === 'marble') {
        // 大理石風：渦巻きと層
        for (let i = 0; i < 20; i++) {
          const y = seededRandom() * 512;
          const h = 10 + seededRandom() * 40;
          const mix = seededRandom();
          const r = Math.floor(baseColor[0] * (1 - mix) + secondaryColor[0] * mix);
          const g = Math.floor(baseColor[1] * (1 - mix) + secondaryColor[1] * mix);
          const b = Math.floor(baseColor[2] * (1 - mix) + secondaryColor[2] * mix);
          ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.3)`;
          // 波打つバンド
          ctx.beginPath();
          ctx.moveTo(0, y);
          for (let x = 0; x <= 1024; x += 10) {
            ctx.lineTo(x, y + Math.sin(x * 0.02 + i) * 15);
          }
          ctx.lineTo(1024, y + h);
          for (let x = 1024; x >= 0; x -= 10) {
            ctx.lineTo(x, y + h + Math.sin(x * 0.02 + i) * 15);
          }
          ctx.closePath();
          ctx.fill();
        }
        // 渦模様
        for (let s = 0; s < 5; s++) {
          const cx = seededRandom() * 1024;
          const cy = seededRandom() * 512;
          for (let a = 0; a < Math.PI * 4; a += 0.1) {
            const r = a * 5;
            const x = cx + Math.cos(a) * r;
            const y = cy + Math.sin(a) * r;
            ctx.fillStyle = `rgba(${secondaryColor[0]}, ${secondaryColor[1]}, ${secondaryColor[2]}, ${0.15 - a * 0.01})`;
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      }

      // 左右端をシームレスにブレンド
      const edgeWidth = 40;
      const imageData = ctx.getImageData(0, 0, 1024, 512);
      const data = imageData.data;
      for (let y = 0; y < 512; y++) {
        for (let x = 0; x < edgeWidth; x++) {
          const blend = x / edgeWidth;
          const leftIdx = (y * 1024 + x) * 4;
          const rightIdx = (y * 1024 + (1024 - edgeWidth + x)) * 4;
          for (let c = 0; c < 4; c++) {
            const mixed = data[leftIdx + c] * blend + data[rightIdx + c] * (1 - blend);
            data[leftIdx + c] = mixed;
          }
        }
      }
      ctx.putImageData(imageData, 0, 0);

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      return texture;
    };

    // 各惑星のテクスチャ設定
    const planetTextureConfigs: Record<string, { base: [number, number, number]; secondary: [number, number, number]; style: 'gas' | 'rocky' | 'ice' | 'lava' | 'striped' | 'marble' }> = {
      about: { base: [30, 80, 160], secondary: [80, 160, 255], style: 'marble' },        // 青い大理石風
      mission: { base: [100, 40, 140], secondary: [180, 100, 240], style: 'gas' },        // 紫のガス惑星（木星風）
      members: { base: [40, 80, 140], secondary: [100, 180, 255], style: 'ice' },         // 青い氷惑星
      team: { base: [20, 100, 60], secondary: [60, 220, 140], style: 'rocky' },           // 緑の岩石惑星
      systems: { base: [160, 80, 20], secondary: [255, 160, 60], style: 'lava' },         // オレンジの溶岩惑星
      contact: { base: [140, 40, 80], secondary: [240, 100, 160], style: 'striped' },     // ピンクの縞模様
    };

    planets.forEach((planetData) => {
      const geometry = new THREE.SphereGeometry(planetData.size, 128, 128);

      // プロシージャルテクスチャを生成
      const config = planetTextureConfigs[planetData.id];
      const texture = generatePlanetTexture(config.base, config.secondary, config.style);

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

      // 透明なヒットボックス（クリック判定を2倍に拡大）
      const hitboxGeometry = new THREE.SphereGeometry(planetData.size * 2, 16, 16);
      const hitboxMaterial = new THREE.MeshBasicMaterial({
        visible: false,
      });
      const hitbox = new THREE.Mesh(hitboxGeometry, hitboxMaterial);
      hitbox.userData = { id: planetData.id, name: planetData.name, originalScale: 1 };
      planet.add(hitbox);
      planetMeshesRef.current.set(planetData.id, hitbox);

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
    directionalLight.position.set(200, 100, 200);
    scene.add(directionalLight);

    const pointLight1 = new THREE.PointLight(0x00ffff, 2, 100);
    pointLight1.position.set(200, 200, 100);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0xff00ff, 1.5, 100);
    pointLight2.position.set(-200, -200, 100);
    scene.add(pointLight2);

    camera.position.z = 800;

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

      targetRotationY = mouseX * 3.0;
      targetRotationX = mouseY * 2.0;

      // パララックス効果用のカメラターゲット位置
      targetCameraX = mouseX * 50;
      targetCameraY = mouseY * 50;

      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const handleClick = (event: MouseEvent) => {
      // canvasへのクリックのみ処理（ヘッダーやUIボタンのクリックを無視）
      if (event.target !== canvasRef.current) return;
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

      // 何もヒットしなかった場合
      if (onEmptyClickRef.current) {
        onEmptyClickRef.current();
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

      // 星雲を回転（パララックス - 最遠景）
      skybox.rotation.z = elapsedTime * 0.005;
      skybox.rotation.x = currentRotationX * 0.3;
      skybox.rotation.y = currentRotationY * 0.3;

      // 星空を回転（パララックス - 惑星グループの回転に追従）
      starLayers.forEach((stars, index) => {
        const depth = (index + 1) * 0.15; // 層ごとに追従量が違う
        stars.rotation.y = elapsedTime * 0.005 * (index + 1) + currentRotationY * (0.4 + depth);
        stars.rotation.x = elapsedTime * 0.003 * (index + 1) + currentRotationX * (0.4 + depth);
      });

      // 地球を回転（パララックス - 中景、最も速い）
      earth.rotation.y = elapsedTime * 0.05;
      earth.position.x = EARTH_CENTER[0] + currentCameraX * 0.3;
      earth.position.y = EARTH_CENTER[1] + currentCameraY * 0.3;

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
      pointLight1.position.x = Math.sin(elapsedTime) * 300;
      pointLight1.position.y = Math.cos(elapsedTime * 0.7) * 300;

      pointLight2.position.x = Math.cos(elapsedTime * 0.8) * 300;
      pointLight2.position.y = Math.sin(elapsedTime * 0.5) * 300;

      // パララックス用のカメラ位置イージング
      currentCameraX += (targetCameraX - currentCameraX) * 0.05;
      currentCameraY += (targetCameraY - currentCameraY) * 0.05;

      // 惑星グループを回転（マウス追従）
      currentRotationX += (targetRotationX - currentRotationX) * 0.05;
      currentRotationY += (targetRotationY - currentRotationY) * 0.05;

      planetGroup.rotation.y = currentRotationY;
      planetGroup.rotation.x = currentRotationX;
      
      // 惑星グループ全体にもパララックス移動を適用（カメラと同期して逃げないように）
      planetGroup.position.x = currentCameraX * 6;
      planetGroup.position.y = currentCameraY * 6;

      // 各惑星を回転＋軌道移動（ヒットボックスの親＝可視メッシュを操作）
      planets.forEach((planetData) => {
        const hitbox = planetMeshesRef.current.get(planetData.id);
        const mesh = hitbox?.parent instanceof THREE.Mesh ? hitbox.parent : hitbox;
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
        // ヒットボックスの親（可視メッシュ）のスケールをリセット
        const target = mesh.parent && mesh.parent instanceof THREE.Mesh ? mesh.parent : mesh;
        target.scale.setScalar(mesh.userData.originalScale);
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

        // ヒットボックスの親（可視メッシュ）をスケール
        const visualMesh = hoveredMesh.parent && hoveredMesh.parent instanceof THREE.Mesh ? hoveredMesh.parent : hoveredMesh;
        visualMesh.scale.setScalar(1.3);
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

      // カメラをマウスに追従（パララックス効果統合）
      const focusId = focusPlanetRef.current;
      if (focusId) {
        // フォーカス中: 惑星のワールド座標をリアルタイム取得
        const hitbox = planetMeshesRef.current.get(focusId);
        const planetMesh = hitbox?.parent instanceof THREE.Mesh ? hitbox.parent : hitbox;
        if (planetMesh) {
          const worldPos = new THREE.Vector3();
          planetMesh.getWorldPosition(worldPos);

          // カメラから惑星へ向かう方向に、惑星手前で止まる位置を計算
          const planetData = planets.find(p => p.id === focusId);
          const standoffDistance = (planetData?.size ?? 12) * 8;
          const dirFromOrigin = worldPos.clone().normalize();
          const targetPos = worldPos.clone().sub(dirFromOrigin.multiplyScalar(standoffDistance));

          camera.position.x += (targetPos.x - camera.position.x) * 0.04;
          camera.position.y += (targetPos.y - camera.position.y) * 0.04;
          camera.position.z += (targetPos.z - camera.position.z) * 0.04;
          camera.lookAt(worldPos);

          // フォーカス中の惑星を拡大表示
          planetMesh.scale.setScalar(1.5);
        }
      } else {
        camera.position.x += (currentCameraX - camera.position.x) * 0.05;
        camera.position.y += (currentCameraY - camera.position.y) * 0.05;
        camera.position.z += (800 - camera.position.z) * 0.05;
        camera.lookAt(0, 0, 0);
      }

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

      {/* ホバー時のラベル（フォーカス中は非表示） */}
      <AnimatePresence>
        {hoveredPlanet && !focusPlanetId && (
          <motion.div
            className="fixed pointer-events-none z-20 hidden sm:block"
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