import {
  drawPlanetTexture,
  PLANET_TEXTURE_HEIGHT,
  PLANET_TEXTURE_WIDTH,
  type PlanetTextureStyle,
  type RGB,
} from './planetTexture';
import type { PlanetTextureRequest, PlanetTextureResponse } from './planetTexture.worker';

export interface GeneratedPlanetTexture {
  /** Worker で作った画像（上下反転済み）か、メインスレッドで描いたキャンバス */
  image: ImageBitmap | HTMLCanvasElement;
  /** three.js の Texture.flipY に設定する値 */
  flipY: boolean;
}

type Job = Omit<PlanetTextureRequest, 'id'>;

/** Worker が応答しないまま待ち続けないよう、この時間で残りをメインスレッドに切り替える */
const WORKER_TIMEOUT_MS = 5000;

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
 * 使えない場合や Worker が失敗・無応答の場合は、メインスレッドで1枚ずつ別のタスクに分けて描く。
 * 戻り値の関数で、未完了の生成を打ち切る。
 */
export function generatePlanetTextures(
  jobs: Record<string, Job>,
  onReady: (id: string, texture: GeneratedPlanetTexture) => void,
): () => void {
  let cancelled = false;
  const pending = new Set(Object.keys(jobs));
  const timers = new Set<ReturnType<typeof setTimeout>>();
  let worker: Worker | undefined;

  const later = (fn: () => void, ms = 0) => {
    const timer = setTimeout(() => {
      timers.delete(timer);
      fn();
    }, ms);
    timers.add(timer);
  };

  const finish = (id: string, texture: GeneratedPlanetTexture) => {
    if (cancelled || !pending.delete(id)) return false;
    onReady(id, texture);
    if (pending.size === 0) worker?.terminate();
    return true;
  };

  // 1枚ずつ次のタスクで描く（まとめて描くと長いタスクになり、操作を妨げる）。
  const fallback = (ids: string[]) => {
    const [id, ...rest] = ids;
    if (id === undefined) return;
    later(() => {
      if (!cancelled && pending.has(id)) finish(id, drawOnMainThread(jobs[id]));
      fallback(rest);
    });
  };
  const fallbackAll = () => {
    worker?.terminate();
    fallback([...pending]);
  };

  if (typeof Worker === 'undefined' || typeof OffscreenCanvas === 'undefined') {
    fallbackAll();
  } else {
    worker = new Worker(new URL('./planetTexture.worker.ts', import.meta.url), { type: 'module' });
    worker.onmessage = (event: MessageEvent<PlanetTextureResponse>) => {
      const response = event.data;
      if ('error' in response) {
        fallback([response.id]);
        return;
      }
      if (!finish(response.id, { image: response.bitmap, flipY: false })) response.bitmap.close();
    };
    // Worker のスクリプト自体を読み込めない場合（デプロイ直後の 404 など）
    worker.onerror = fallbackAll;
    for (const [id, job] of Object.entries(jobs)) {
      worker.postMessage({ id, ...job } satisfies PlanetTextureRequest);
    }
    later(() => {
      if (pending.size > 0) fallbackAll();
    }, WORKER_TIMEOUT_MS);
  }

  return () => {
    cancelled = true;
    timers.forEach(clearTimeout);
    worker?.terminate();
  };
}

export type { PlanetTextureStyle, RGB };
