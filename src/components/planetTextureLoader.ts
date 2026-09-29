import {
  drawPlanetTexture,
  PLANET_TEXTURE_HEIGHT,
  PLANET_TEXTURE_WIDTH,
  type PlanetTextureStyle,
  type RGB,
} from './planetTexture';
import type { PlanetTextureRequest } from './planetTexture.worker';

export interface GeneratedPlanetTexture {
  /** Worker で作った画像（上下反転済み）か、メインスレッドで描いたキャンバス */
  image: ImageBitmap | HTMLCanvasElement;
  /** three.js の Texture.flipY に設定する値 */
  flipY: boolean;
}

type Job = Omit<PlanetTextureRequest, 'id'>;

function drawOnMainThread({ base, secondary, style }: Job): GeneratedPlanetTexture {
  const canvas = document.createElement('canvas');
  canvas.width = PLANET_TEXTURE_WIDTH;
  canvas.height = PLANET_TEXTURE_HEIGHT;
  drawPlanetTexture(canvas.getContext('2d')!, base, secondary, style);
  return { image: canvas, flipY: true };
}

/**
 * 惑星のテクスチャをまとめて生成し、できたものから onReady で返す。
 * OffscreenCanvas と Worker が使えればメインスレッドの外で描く。
 * 使えない場合や Worker が失敗した場合は、メインスレッドで描く（従来と同じ処理）。
 * 戻り値の関数で、未完了の生成を打ち切る。
 */
export function generatePlanetTextures(
  jobs: Record<string, Job>,
  onReady: (id: string, texture: GeneratedPlanetTexture) => void,
): () => void {
  let cancelled = false;
  const pending = new Set(Object.keys(jobs));

  const fallback = () => {
    for (const id of pending) {
      if (cancelled) return;
      onReady(id, drawOnMainThread(jobs[id]));
    }
    pending.clear();
  };

  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') {
    // 初回描画を先に済ませるため、次のタスクで描く。
    const timer = setTimeout(fallback);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }

  const worker = new Worker(new URL('./planetTexture.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (event: MessageEvent<{ id: string; bitmap: ImageBitmap }>) => {
    const { id, bitmap } = event.data;
    if (cancelled || !pending.delete(id)) {
      bitmap.close();
      return;
    }
    onReady(id, { image: bitmap, flipY: false });
    if (pending.size === 0) worker.terminate();
  };
  worker.onerror = () => {
    worker.terminate();
    if (!cancelled) fallback();
  };
  for (const [id, job] of Object.entries(jobs)) {
    worker.postMessage({ id, ...job } satisfies PlanetTextureRequest);
  }

  return () => {
    cancelled = true;
    worker.terminate();
  };
}

export type { PlanetTextureStyle, RGB };
