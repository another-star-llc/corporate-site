// 惑星のテクスチャを OffscreenCanvas に描き、ImageBitmap にして返す。
import {
  drawPlanetTexture,
  PLANET_TEXTURE_HEIGHT,
  PLANET_TEXTURE_WIDTH,
  type PlanetTextureStyle,
  type RGB,
} from './planetTexture';

export interface PlanetTextureRequest {
  id: string;
  base: RGB;
  secondary: RGB;
  style: PlanetTextureStyle;
}

export type PlanetTextureResponse =
  | { id: string; bitmap: ImageBitmap }
  | { id: string; error: string };

const post = (response: PlanetTextureResponse, transfer: Transferable[] = []) =>
  (self as unknown as Worker).postMessage(response, transfer);

// onmessage が async のため、中で例外が起きても Worker の error イベントは発火しない。
// 失敗はメッセージで返し、呼び出し側でその惑星だけメインスレッドで描き直す。
self.onmessage = async (event: MessageEvent<PlanetTextureRequest>) => {
  const { id, base, secondary, style } = event.data;
  try {
    const canvas = new OffscreenCanvas(PLANET_TEXTURE_WIDTH, PLANET_TEXTURE_HEIGHT);
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('OffscreenCanvas の 2D コンテキストを取得できません');
    drawPlanetTexture(ctx, base, secondary, style);
    // WebGL は ImageBitmap の上下反転（flipY）に対応しないため、ここで反転しておく。
    const bitmap = await createImageBitmap(canvas, { imageOrientation: 'flipY' });
    post({ id, bitmap }, [bitmap]);
  } catch (error) {
    post({ id, error: String(error) });
  }
};
