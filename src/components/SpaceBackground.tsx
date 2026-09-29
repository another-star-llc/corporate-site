import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as THREE from 'three';
import { generatePlanetTextures, type PlanetTextureStyle, type RGB } from './planetTextureLoader';

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
  onPlanetClick?: (planetId: string, screenPos: { x: number; y: number }) => void;
  onPlanetHover?: (planetId: string | null) => void;
  onEmptyClick?: () => void;
  focusPlanetId?: string | null;
  focusPlanetSide?: 'left' | 'right' | null;
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
    id: 'people',
    name: 'MEMBERS',
    color: 0x4ade80,
    emissive: 0x22c55e,
    position: [120, -380, -180],
    size: 44,
    orbitSpeed: 0.00042,
    rotationSpeed: 0.005,
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

export function SpaceBackground({
  onPlanetClick,
  onPlanetHover,
  onEmptyClick,
  focusPlanetId,
  focusPlanetSide,
}: SpaceBackgroundProps) {
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
  const focusPlanetSideRef = useRef<'left' | 'right' | null>(null);

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
    focusPlanetSideRef.current = focusPlanetSide ?? null;
  }, [focusPlanetSide]);

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

    // 惑星のテクスチャは描画に時間がかかる（端末によっては 1 秒以上）ため、
    // Web Worker で生成して、できたものから差し替える。それまでは基本色 1 色のテクスチャを使う。
    // 最初から map を持たせておくことで、差し替え時にシェーダーの再コンパイルが起きないようにする。
    const createPlaceholderTexture = (color: RGB) => {
      const texture = new THREE.DataTexture(new Uint8Array([...color, 255]), 1, 1);
      texture.needsUpdate = true;
      return texture;
    };

    // 各惑星のテクスチャ設定
    const planetTextureConfigs: Record<string, { base: RGB; secondary: RGB; style: PlanetTextureStyle }> = {
      about: { base: [30, 80, 160], secondary: [80, 160, 255], style: 'marble' },        // 青い大理石風
      mission: { base: [100, 40, 140], secondary: [180, 100, 240], style: 'gas' },        // 紫のガス惑星（木星風）
      people: { base: [20, 100, 60], secondary: [90, 220, 170], style: 'rocky' },         // 緑の岩石惑星
      systems: { base: [160, 80, 20], secondary: [255, 160, 60], style: 'lava' },         // オレンジの溶岩惑星
      contact: { base: [140, 40, 80], secondary: [240, 100, 160], style: 'striped' },     // ピンクの縞模様
    };

    const planetMaterials = new Map<string, THREE.MeshPhongMaterial>();
    planets.forEach((planetData) => {
      const geometry = new THREE.SphereGeometry(planetData.size, 128, 128);

      // 生成が終わるまでは基本色のテクスチャを貼っておく
      const config = planetTextureConfigs[planetData.id];
      const material = new THREE.MeshPhongMaterial({
        map: createPlaceholderTexture(config.base),
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
      planetMaterials.set(planetData.id, material);

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

    const cancelPlanetTextures = generatePlanetTextures(
      Object.fromEntries(
        planets.map(({ id }) => [id, planetTextureConfigs[id]]),
      ),
      (id, { image, flipY }) => {
        const material = planetMaterials.get(id);
        if (!material) return;
        const texture = new THREE.Texture(image);
        texture.flipY = flipY;
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.ClampToEdgeWrapping;
        texture.needsUpdate = true;
        material.map?.dispose();
        material.map = texture;
      },
    );

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

    const updatePointerPosition = (clientX: number, clientY: number) => {
      const normalizedX = (clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(clientY / window.innerHeight) * 2 + 1;

      mouseRef.current.x = normalizedX;
      mouseRef.current.y = normalizedY;

      return { normalizedX, normalizedY };
    };

    const handleMouseMove = (event: MouseEvent) => {
      const { normalizedX, normalizedY } = updatePointerPosition(event.clientX, event.clientY);
      mouseX = normalizedX;
      mouseY = normalizedY;

      mouseRef.current.x = mouseX;
      mouseRef.current.y = mouseY;

      targetRotationY = mouseX * 3.0;
      targetRotationX = mouseY * 2.0;

      // パララックス効果用のカメラターゲット位置
      targetCameraX = mouseX * 50;
      targetCameraY = mouseY * 50;

      mousePositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const handlePointerDown = (event: PointerEvent) => {
      if (event.target !== canvasRef.current) return;
      if (!raycasterRef.current) return;

      updatePointerPosition(event.clientX, event.clientY);
      raycaster.setFromCamera(mouseRef.current, camera);

      // 惑星のクリック検知
      const planetIntersects = raycaster.intersectObjects(Array.from(planetMeshesRef.current.values()));
      if (planetIntersects.length > 0 && onPlanetClickRef.current) {
        const clicked = planetIntersects[0].object as THREE.Mesh;
        const planetId = clicked.userData.id;
        if (planetId) {
          onPlanetClickRef.current(planetId, { x: event.clientX, y: event.clientY });
          return;
        }
      }

      // 何もヒットしなかった場合
      if (onEmptyClickRef.current) {
        onEmptyClickRef.current();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('pointerdown', handlePointerDown);

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
        // 惑星にホバーしていない場合、地球はラベル対象にしない

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
          const distanceToPlanet = targetPos.distanceTo(worldPos);
          const horizontalFov = 2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2) * camera.aspect);
          const visibleWidthAtTarget = 2 * Math.tan(horizontalFov / 2) * distanceToPlanet;
          const compositionSide = focusPlanetSideRef.current ?? (worldPos.x < 0 ? 'left' : 'right');
          const framingOffsetRatio = window.innerWidth < 640 ? 0.12 : 0.2;
          const framingOffset = visibleWidthAtTarget * framingOffsetRatio;
          const offsetDirection = compositionSide === 'left' ? 1 : -1;

          camera.position.x += (targetPos.x - camera.position.x) * 0.04;
          camera.position.y += (targetPos.y - camera.position.y) * 0.04;
          camera.position.z += (targetPos.z - camera.position.z) * 0.04;
          camera.lookAt(worldPos.x + framingOffset * offsetDirection, worldPos.y, worldPos.z);

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
      window.removeEventListener('pointerdown', handlePointerDown);
      cancelAnimationFrame(animationId);
      cancelPlanetTextures();
      planetMaterials.forEach((material) => {
        material.map?.dispose();
        material.dispose();
      });
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
      <canvas ref={canvasRef} className="fixed inset-0 z-0 pointer-events-auto touch-pan-y" />

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
              {hoveredPlanet !== 'earth' && (
                <div className="text-cyan-600 text-xs mt-1">Click to access</div>
              )}
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
