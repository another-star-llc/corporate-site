// 惑星のテクスチャ（1024×512）を 2D キャンバスに描く。
// シード付きの疑似乱数を使うため、同じ色・スタイルなら毎回同じ画像になる。
// メインスレッドをふさがないよう Web Worker（OffscreenCanvas）で実行し、
// 使えないブラウザではメインスレッドで同じ関数を実行する（planetTexture.worker.ts / SpaceBackground.tsx）。

export type PlanetTextureStyle = 'gas' | 'rocky' | 'ice' | 'lava' | 'striped' | 'marble';
export type RGB = [number, number, number];

export const PLANET_TEXTURE_WIDTH = 1024;
export const PLANET_TEXTURE_HEIGHT = 512;

export function drawPlanetTexture(
  ctx: CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D,
  baseColor: RGB,
  secondaryColor: RGB,
  style: PlanetTextureStyle,
): void {
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
}
