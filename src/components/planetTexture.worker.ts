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

self.onmessage = async (event: MessageEvent<PlanetTextureRequest>) => {
  const { id, base, secondary, style } = event.data;
  const canvas = new OffscreenCanvas(PLANET_TEXTURE_WIDTH, PLANET_TEXTURE_HEIGHT);
  drawPlanetTexture(canvas.getContext('2d')!, base, secondary, style);
  // WebGL は ImageBitmap の上下反転（flipY）に対応しないため、ここで反転しておく。
  const bitmap = await createImageBitmap(canvas, { imageOrientation: 'flipY' });
  (self as unknown as Worker).postMessage({ id, bitmap }, [bitmap]);
};
