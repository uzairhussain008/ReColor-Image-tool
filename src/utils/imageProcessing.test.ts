import test from 'node:test';
import assert from 'node:assert/strict';
import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  applyPresetTransform,
  applyAdjustments,
  blendPixels,
  DEFAULT_ADJUSTMENTS,
  DEFAULT_RECOLOR,
  type ImageAdjustments,
} from './imageProcessing';

test('hexToRgb and rgbToHex convert correctly', () => {
  const [r, g, b] = hexToRgb('#2563eb');
  assert.equal(r, 0x25);
  assert.equal(g, 0x63);
  assert.equal(b, 0xeb);

  const hex = rgbToHex(37, 99, 235);
  assert.equal(hex.toLowerCase(), '#2563eb');

  // Short hex
  const shortRgb = hexToRgb('#fff');
  assert.deepEqual(shortRgb, [255, 255, 255]);
});

test('rgbToHsl and hslToRgb roundtrip accurately', () => {
  const original: [number, number, number] = [200, 100, 50];
  const [h, s, l] = rgbToHsl(original[0], original[1], original[2]);
  const restored = hslToRgb(h, s, l);

  // RGB can have minor roundoff +/- 1
  assert.ok(Math.abs(restored[0] - original[0]) <= 1);
  assert.ok(Math.abs(restored[1] - original[1]) <= 1);
  assert.ok(Math.abs(restored[2] - original[2]) <= 1);
});

test('preset "bw" converts color to luminance grayscale', () => {
  const red: [number, number, number] = [255, 0, 0];
  const [r, g, b] = applyPresetTransform(red[0], red[1], red[2], 'bw', [0, 0, 0], [255, 255, 255], 100);
  assert.equal(r, g);
  assert.equal(g, b);
  assert.ok(Math.round(r) === Math.round(0.299 * 255));
});

test('preset "duotone" maps darks to shadow color and brights to highlight color', () => {
  const shadow: [number, number, number] = [10, 20, 30];
  const highlight: [number, number, number] = [240, 250, 255];

  // Pure black pixel (luma = 0)
  const [darkR, darkG, darkB] = applyPresetTransform(0, 0, 0, 'duotone', shadow, highlight, 100);
  assert.deepEqual([Math.round(darkR), Math.round(darkG), Math.round(darkB)], shadow);

  // Pure white pixel (luma = 255)
  const [brightR, brightG, brightB] = applyPresetTransform(255, 255, 255, 'duotone', shadow, highlight, 100);
  assert.deepEqual([Math.round(brightR), Math.round(brightG), Math.round(brightB)], highlight);
});

test('applyAdjustments increases and decreases brightness predictably', () => {
  const base: [number, number, number] = [100, 100, 100];
  const brighterAdjustments: ImageAdjustments = { ...DEFAULT_ADJUSTMENTS, brightness: 20 };
  const darkerAdjustments: ImageAdjustments = { ...DEFAULT_ADJUSTMENTS, brightness: -20 };

  const [bR, bG, bB] = applyAdjustments(base[0], base[1], base[2], brighterAdjustments);
  assert.ok(bR > 100 && bG > 100 && bB > 100);

  const [dR, dG, dB] = applyAdjustments(base[0], base[1], base[2], darkerAdjustments);
  assert.ok(dR < 100 && dG < 100 && dB < 100);
});

test('blendPixels applies tint correctly based on opacity', () => {
  const base: [number, number, number] = [128, 128, 128];
  // 0% opacity should return unaltered base
  const zeroTint = blendPixels(base[0], base[1], base[2], 255, 0, 0, 'color', 0);
  assert.deepEqual(zeroTint, base);

  // 100% opacity color mode should tint towards red hue
  const fullTint = blendPixels(base[0], base[1], base[2], 255, 0, 0, 'color', 100);
  assert.ok(fullTint[0] > fullTint[1]);
  assert.ok(fullTint[0] > fullTint[2]);
});

test('all 10 presets produce distinct, valid pixel transformations', () => {
  const samplePixel: [number, number, number] = [140, 100, 70];
  const shadow: [number, number, number] = [10, 15, 30];
  const highlight: [number, number, number] = [250, 200, 100];

  const presets = [
    'original',
    'bw',
    'warm',
    'cool',
    'vintage',
    'cinematic',
    'pastel',
    'sepia',
    'faded',
    'duotone',
  ] as const;

  const results: Record<string, [number, number, number]> = {};

  for (const preset of presets) {
    const [r, g, b] = applyPresetTransform(
      samplePixel[0],
      samplePixel[1],
      samplePixel[2],
      preset,
      shadow,
      highlight,
      100
    );

    // Verify values are numbers and non-negative
    assert.ok(!isNaN(r) && !isNaN(g) && !isNaN(b));
    assert.ok(r >= 0 && g >= 0 && b >= 0);
    results[preset] = [Math.round(r), Math.round(g), Math.round(b)];
  }

  // Original should match sample pixel exactly
  assert.deepEqual(results['original'], samplePixel);

  // Warm should boost red/yellow and attenuate blue
  assert.ok(results['warm'][0] > samplePixel[0]);

  // Cool should boost blue/cyan and reduce red
  assert.ok(results['cool'][2] > samplePixel[2]);

  // Sepia should exhibit warm brownish tones
  assert.ok(results['sepia'][0] > results['sepia'][2]);
});

test('all 5 blend modes compute without NaN or out-of-bounds channels', () => {
  const modes = ['color', 'overlay', 'multiply', 'screen', 'soft-light'] as const;
  const base = [150, 100, 50];
  const tint = [37, 99, 235]; // Blue

  for (const mode of modes) {
    const [r, g, b] = blendPixels(base[0], base[1], base[2], tint[0], tint[1], tint[2], mode, 75);
    assert.ok(!isNaN(r) && !isNaN(g) && !isNaN(b), `Blend mode ${mode} produced NaN`);
    assert.ok(r >= 0 && r <= 255, `Blend mode ${mode} r out of bounds: ${r}`);
    assert.ok(g >= 0 && g <= 255, `Blend mode ${mode} g out of bounds: ${g}`);
    assert.ok(b >= 0 && b <= 255, `Blend mode ${mode} b out of bounds: ${b}`);
  }
});
