/**
 * Pure image processing algorithms for ReColor Image.
 * Client-side Canvas pixel manipulation: color spaces, filters, presets, duotone, tint, and temperature adjustments.
 */

export type PresetId =
  | 'original'
  | 'bw'
  | 'warm'
  | 'cool'
  | 'vintage'
  | 'cinematic'
  | 'pastel'
  | 'sepia'
  | 'faded'
  | 'duotone';

export interface ImageAdjustments {
  brightness: number; // -100 to 100, default 0
  contrast: number; // -100 to 100, default 0
  saturation: number; // -100 to 100, default 0
  hue: number; // -180 to 180, default 0
  intensity: number; // 0 to 200, default 100
  temperature: number; // -100 to 100 (Cool to Warm), default 0
  tint: number; // -100 to 100 (Green to Magenta), default 0
}

export type BlendMode = 'color' | 'overlay' | 'multiply' | 'screen' | 'soft-light';

export interface RecolorSettings {
  tintColor: string; // Hex color for overall wash/tint, e.g. '#2563eb'
  tintOpacity: number; // 0 to 100, default 0
  tintBlendMode: BlendMode;
  duotoneShadow: string; // Hex color for darks, e.g. '#1e1b4b'
  duotoneHighlight: string; // Hex color for highlights, e.g. '#fef08a'
  duotoneIntensity: number; // 0 to 100, default 100
}

export interface PresetDefinition {
  id: PresetId;
  name: string;
  description: string;
  previewColor: string;
}

export const PRESETS: PresetDefinition[] = [
  { id: 'original', name: 'Original', description: 'Natural image colors with zero alterations', previewColor: '#64748b' },
  { id: 'bw', name: 'Black & White', description: 'High-definition monochrome balanced for tonal depth', previewColor: '#1e293b' },
  { id: 'warm', name: 'Warm Golden', description: 'Sunset amber warmth with soft golden highlights', previewColor: '#d97706' },
  { id: 'cool', name: 'Cool Marine', description: 'Crisp azure and cyan tones with calm undertones', previewColor: '#0284c7' },
  { id: 'vintage', name: 'Vintage 70s', description: 'Classic faded film aesthetic with warm yellow cast', previewColor: '#b45309' },
  { id: 'cinematic', name: 'Cinematic', description: 'Moody teal shadows paired with rich orange highlights', previewColor: '#0f766e' },
  { id: 'pastel', name: 'Pastel Dream', description: 'Soft desaturated tones with gentle lifted blacks', previewColor: '#ec4899' },
  { id: 'sepia', name: 'Classic Sepia', description: 'Authentic 19th-century photographic sepia toning', previewColor: '#78350f' },
  { id: 'faded', name: 'Matte Faded', description: 'Low-contrast modern editorial matte finish', previewColor: '#71717a' },
  { id: 'duotone', name: 'Duotone Neo', description: 'Striking two-tone color gradient mapping', previewColor: '#8b5cf6' },
];

export const DEFAULT_ADJUSTMENTS: ImageAdjustments = {
  brightness: 0,
  contrast: 0,
  saturation: 0,
  hue: 0,
  intensity: 100,
  temperature: 0,
  tint: 0,
};

export const DEFAULT_RECOLOR: RecolorSettings = {
  tintColor: '#2563eb',
  tintOpacity: 0,
  tintBlendMode: 'color',
  duotoneShadow: '#090d16',
  duotoneHighlight: '#38bdf8',
  duotoneIntensity: 100,
};

/** Convert Hex color string (#RRGGBB or #RGB) to RGB triplet [r, g, b] */
export function hexToRgb(hex: string): [number, number, number] {
  let cleaned = hex.replace('#', '').trim();
  if (cleaned.length === 3) {
    cleaned = cleaned
      .split('')
      .map((c) => c + c)
      .join('');
  }
  const num = parseInt(cleaned, 16);
  if (isNaN(num) || cleaned.length !== 6) {
    return [0, 0, 0];
  }
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

/** Convert RGB to Hex string */
export function rgbToHex(r: number, g: number, b: number): string {
  const clamp = (v: number) => Math.max(0, Math.min(255, Math.round(v)));
  const toHex = (n: number) => clamp(n).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

/** RGB [0-255] to HSL [0-360, 0-1, 0-1] */
export function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm:
        h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0);
        break;
      case gNorm:
        h = (bNorm - rNorm) / d + 2;
        break;
      case bNorm:
        h = (rNorm - gNorm) / d + 4;
        break;
    }
    h *= 60;
  }

  return [h, s, l];
}

/** HSL [0-360, 0-1, 0-1] to RGB [0-255] */
export function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  let r: number, g: number, b: number;

  const normalizedH = ((h % 360) + 360) % 360;
  const hNorm = normalizedH / 360;

  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      let tNorm = t;
      if (tNorm < 0) tNorm += 1;
      if (tNorm > 1) tNorm -= 1;
      if (tNorm < 1 / 6) return p + (q - p) * 6 * tNorm;
      if (tNorm < 1 / 2) return q;
      if (tNorm < 2 / 3) return p + (q - p) * (2 / 3 - tNorm) * 6;
      return p;
    };

    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, hNorm + 1 / 3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1 / 3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

/**
 * Blend mode calculation for color wash / tinting
 */
export function blendPixels(
  baseR: number,
  baseG: number,
  baseB: number,
  tintR: number,
  tintG: number,
  tintB: number,
  mode: BlendMode,
  opacity: number
): [number, number, number] {
  const alpha = opacity / 100;
  if (alpha <= 0) return [baseR, baseG, baseB];

  // Defensive clamping to prevent NaN in mathematical calculations
  const bR = Math.max(0, Math.min(255, baseR));
  const bG = Math.max(0, Math.min(255, baseG));
  const bB = Math.max(0, Math.min(255, baseB));

  let targetR = bR;
  let targetG = bG;
  let targetB = bB;

  if (mode === 'multiply') {
    targetR = (bR * tintR) / 255;
    targetG = (bG * tintG) / 255;
    targetB = (bB * tintB) / 255;
  } else if (mode === 'screen') {
    targetR = 255 - ((255 - bR) * (255 - tintR)) / 255;
    targetG = 255 - ((255 - bG) * (255 - tintG)) / 255;
    targetB = 255 - ((255 - bB) * (255 - tintB)) / 255;
  } else if (mode === 'overlay') {
    const overlayCh = (b: number, t: number) =>
      b < 128 ? (2 * b * t) / 255 : 255 - (2 * (255 - b) * (255 - t)) / 255;
    targetR = overlayCh(bR, tintR);
    targetG = overlayCh(bG, tintG);
    targetB = overlayCh(bB, tintB);
  } else if (mode === 'soft-light') {
    const softLightCh = (b: number, t: number) => {
      const bNorm = b / 255;
      const tNorm = t / 255;
      const res =
        tNorm < 0.5
          ? 2 * bNorm * tNorm + bNorm * bNorm * (1 - 2 * tNorm)
          : Math.sqrt(Math.max(0, bNorm)) * (2 * tNorm - 1) + 2 * bNorm * (1 - tNorm);
      return Math.round(res * 255);
    };
    targetR = softLightCh(bR, tintR);
    targetG = softLightCh(bG, tintG);
    targetB = softLightCh(bB, tintB);
  } else {
    // Mode 'color': preserve base lightness, adopt tint hue and saturation
    const [, , baseL] = rgbToHsl(bR, bG, bB);
    const [tintH, tintS] = rgbToHsl(tintR, tintG, tintB);
    const [r, g, b] = hslToRgb(tintH, tintS, baseL);
    targetR = r;
    targetG = g;
    targetB = b;
  }

  // Linear interpolation with opacity
  const finalR = Math.max(0, Math.min(255, Math.round(bR * (1 - alpha) + targetR * alpha)));
  const finalG = Math.max(0, Math.min(255, Math.round(bG * (1 - alpha) + targetG * alpha)));
  const finalB = Math.max(0, Math.min(255, Math.round(bB * (1 - alpha) + targetB * alpha)));

  return [finalR, finalG, finalB];
}

/**
 * Apply preset mathematical transformation to a pixel (r, g, b)
 */
export function applyPresetTransform(
  r: number,
  g: number,
  b: number,
  preset: PresetId,
  duotoneShadowRgb: [number, number, number],
  duotoneHighlightRgb: [number, number, number],
  duotoneIntensity: number
): [number, number, number] {
  if (preset === 'original') {
    return [r, g, b];
  }

  // Standard luminance
  const luma = 0.299 * r + 0.587 * g + 0.114 * b;

  switch (preset) {
    case 'bw':
      return [luma, luma, luma];

    case 'warm': {
      // Warm golden: increase red, slightly increase green, decrease blue
      const newR = r * 1.15 + 10;
      const newG = g * 1.05 + 5;
      const newB = b * 0.88 - 5;
      return [newR, newG, newB];
    }

    case 'cool': {
      // Cool marine: boost cyan/blue, slightly reduce red
      const newR = r * 0.88 - 5;
      const newG = g * 1.04 + 5;
      const newB = b * 1.18 + 15;
      return [newR, newG, newB];
    }

    case 'vintage': {
      // Vintage 70s: Sepia tone mix + lifted blacks + warm cast
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;
      // Mix with original and lift blacks
      return [tr * 0.7 + r * 0.3 + 12, tg * 0.7 + g * 0.3 + 8, tb * 0.7 + b * 0.3 + 2];
    }

    case 'cinematic': {
      // Teal and orange grading:
      // Shadows go towards teal (cyan/blue), highlights towards orange/gold
      const normLuma = luma / 255;
      const shadowWeight = Math.max(0, 1 - normLuma * 1.6);
      const highlightWeight = Math.max(0, (normLuma - 0.35) * 1.5);

      let newR = r + highlightWeight * 40 - shadowWeight * 20;
      let newG = g + highlightWeight * 15 + shadowWeight * 15;
      let newB = b - highlightWeight * 30 + shadowWeight * 45;
      return [newR, newG, newB];
    }

    case 'pastel': {
      // Soft high brightness, lowered saturation
      const [h, s, l] = rgbToHsl(r, g, b);
      const newL = Math.min(0.95, l * 1.15 + 0.05);
      const newS = s * 0.65;
      return hslToRgb(h, newS, newL);
    }

    case 'sepia': {
      // Standard W3C sepia matrix
      const tr = 0.393 * r + 0.769 * g + 0.189 * b;
      const tg = 0.349 * r + 0.686 * g + 0.168 * b;
      const tb = 0.272 * r + 0.534 * g + 0.131 * b;
      return [tr, tg, tb];
    }

    case 'faded': {
      // Matte finish: lift blacks, compress highlights, desaturate slightly
      const [h, s, l] = rgbToHsl(r, g, b);
      const liftedL = 0.1 + l * 0.8;
      return hslToRgb(h, s * 0.75, liftedL);
    }

    case 'duotone': {
      // Map grayscale luma to gradient between duotoneShadow and duotoneHighlight
      const t = luma / 255;
      const dtR = duotoneShadowRgb[0] * (1 - t) + duotoneHighlightRgb[0] * t;
      const dtG = duotoneShadowRgb[1] * (1 - t) + duotoneHighlightRgb[1] * t;
      const dtB = duotoneShadowRgb[2] * (1 - t) + duotoneHighlightRgb[2] * t;

      const alpha = (duotoneIntensity ?? 100) / 100;
      return [r * (1 - alpha) + dtR * alpha, g * (1 - alpha) + dtG * alpha, b * (1 - alpha) + dtB * alpha];
    }

    default:
      return [r, g, b];
  }
}

/**
 * Apply fine adjustments (Brightness, Contrast, Saturation, Hue, Temperature, Tint, Intensity)
 */
export function applyAdjustments(
  r: number,
  g: number,
  b: number,
  adjustments: ImageAdjustments
): [number, number, number] {
  let curR = r;
  let curG = g;
  let curB = b;

  // 1. Temperature & Tint
  if (adjustments.temperature !== 0) {
    const tempFactor = adjustments.temperature / 100;
    // Temp > 0 is warm (more red/yellow, less blue)
    // Temp < 0 is cool (more blue/cyan, less red)
    curR += tempFactor * 35;
    curG += tempFactor * 10;
    curB -= tempFactor * 35;
  }

  if (adjustments.tint !== 0) {
    const tintFactor = adjustments.tint / 100;
    // Tint > 0 is magenta (more red/blue, less green)
    // Tint < 0 is green (more green, less red/blue)
    curR += tintFactor * 25;
    curG -= tintFactor * 35;
    curB += tintFactor * 25;
  }

  // 2. Brightness (-100 to 100 -> delta -150 to 150)
  if (adjustments.brightness !== 0) {
    const delta = (adjustments.brightness / 100) * 150;
    curR += delta;
    curG += delta;
    curB += delta;
  }

  // 3. Contrast (-100 to 100)
  if (adjustments.contrast !== 0) {
    const c = (adjustments.contrast / 100) * 100;
    const factor = (259 * (c + 255)) / (255 * (259 - c));
    curR = factor * (curR - 128) + 128;
    curG = factor * (curG - 128) + 128;
    curB = factor * (curB - 128) + 128;
  }

  // Clamp before HSL calculations
  curR = Math.max(0, Math.min(255, curR));
  curG = Math.max(0, Math.min(255, curG));
  curB = Math.max(0, Math.min(255, curB));

  // 4. Hue, Saturation & Color Intensity
  const needsHsl =
    adjustments.hue !== 0 ||
    adjustments.saturation !== 0 ||
    adjustments.intensity !== 100;

  if (needsHsl) {
    let [h, s, l] = rgbToHsl(curR, curG, curB);

    // Hue shift (-180 to 180 deg)
    if (adjustments.hue !== 0) {
      h = (h + adjustments.hue + 360) % 360;
    }

    // Saturation shift (-100 to 100)
    if (adjustments.saturation !== 0) {
      const satDelta = adjustments.saturation / 100;
      s = satDelta > 0 ? s + (1 - s) * satDelta : s * (1 + satDelta);
    }

    // Color Intensity / Vibrance multiplier (0% to 200%)
    if (adjustments.intensity !== 100) {
      s = s * (adjustments.intensity / 100);
    }

    s = Math.max(0, Math.min(1, s));
    [curR, curG, curB] = hslToRgb(h, s, l);
  }

  return [curR, curG, curB];
}

/**
 * Full pixel processing pipeline for an entire ImageData object.
 * Always computes from pristine original pixels, avoiding cumulative degradation.
 */
export function processImageData(
  source: ImageData,
  preset: PresetId,
  adjustments: ImageAdjustments,
  recolor: RecolorSettings
): ImageData {
  const width = source.width;
  const height = source.height;
  const output = new ImageData(new Uint8ClampedArray(source.data.length), width, height);
  const srcData = source.data;
  const outData = output.data;

  const duotoneShadowRgb = hexToRgb(recolor.duotoneShadow);
  const duotoneHighlightRgb = hexToRgb(recolor.duotoneHighlight);
  const tintRgb = hexToRgb(recolor.tintColor);

  const len = srcData.length;
  for (let i = 0; i < len; i += 4) {
    const alpha = srcData[i + 3];
    // Preserve transparent pixels directly
    if (alpha === 0) {
      outData[i] = 0;
      outData[i + 1] = 0;
      outData[i + 2] = 0;
      outData[i + 3] = 0;
      continue;
    }

    let r = srcData[i];
    let g = srcData[i + 1];
    let b = srcData[i + 2];

    // Step 1: Preset Transformation
    [r, g, b] = applyPresetTransform(
      r,
      g,
      b,
      preset,
      duotoneShadowRgb,
      duotoneHighlightRgb,
      recolor.duotoneIntensity
    );

    // Step 2: Fine Adjustments (Brightness, Contrast, Saturation, Hue, Temp, Tint, Intensity)
    [r, g, b] = applyAdjustments(r, g, b, adjustments);

    // Step 3: Color Wash / Tint Overlay
    if (recolor.tintOpacity > 0) {
      [r, g, b] = blendPixels(
        r,
        g,
        b,
        tintRgb[0],
        tintRgb[1],
        tintRgb[2],
        recolor.tintBlendMode,
        recolor.tintOpacity
      );
    }

    // Write back clamped values
    outData[i] = r;
    outData[i + 1] = g;
    outData[i + 2] = b;
    outData[i + 3] = alpha;
  }

  return output;
}
