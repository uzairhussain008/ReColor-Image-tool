/**
 * Utility for robust image loading and graceful fallbacks across ReColor Image.
 * Guarantees that broken image icons and empty black canvas regions never appear.
 */

/**
 * Generates an SVG Data URI fallback with a modern, high-contrast placeholder
 * matching ReColor Image's minimalist brand design.
 */
export function getSvgFallbackDataUrl(title: string = 'Sample Photo', width: number = 600, height: number = 450): string {
  const cleanTitle = title.replace(/[<>&"]/g, '');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#18181b" />
        <stop offset="50%" stop-color="#27272a" />
        <stop offset="100%" stop-color="#09090b" />
      </linearGradient>
      <linearGradient id="iconGrad" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stop-color="#8b5cf6" />
        <stop offset="50%" stop-color="#ec4899" />
        <stop offset="100%" stop-color="#0ea5e9" />
      </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#bgGrad)" />
    <g transform="translate(${width / 2 - 32}, ${height / 2 - 48})">
      <rect width="64" height="64" rx="16" fill="#18181b" stroke="#3f3f46" stroke-width="1.5" />
      <circle cx="26" cy="28" r="9" fill="#8b5cf6" fill-opacity="0.8" />
      <circle cx="38" cy="28" r="9" fill="#ec4899" fill-opacity="0.8" />
      <circle cx="32" cy="38" r="9" fill="#0ea5e9" fill-opacity="0.8" />
      <circle cx="32" cy="31" r="3.5" fill="#ffffff" />
    </g>
    <text x="${width / 2}" y="${height / 2 + 42}" font-family="system-ui, -apple-system, sans-serif" font-size="14" font-weight="600" fill="#f4f4f5" text-anchor="middle">${cleanTitle}</text>
    <text x="${width / 2}" y="${height / 2 + 62}" font-family="system-ui, -apple-system, sans-serif" font-size="11" font-weight="400" fill="#a1a1aa" text-anchor="middle">100% Client-Side Preview</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Handle <img> tag error event with a layered fallback:
 * 1. Try static public fallbackUrl
 * 2. If that also fails, swap to generated SVG data URI
 */
export function handleImageError(
  e: React.SyntheticEvent<HTMLImageElement>,
  fallbackUrl?: string,
  title?: string
) {
  const target = e.currentTarget;
  const stage = target.getAttribute('data-fallback-stage');

  if (!stage && fallbackUrl && target.src !== fallbackUrl) {
    target.setAttribute('data-fallback-stage', '1');
    target.src = fallbackUrl;
    return;
  }

  // Final stage: SVG Data URI to guarantee no broken icon
  if (stage !== 'svg') {
    target.setAttribute('data-fallback-stage', 'svg');
    target.src = getSvgFallbackDataUrl(title || target.alt || 'Sample Image');
    target.classList.add('bg-neutral-900');
  }
}

/**
 * Creates an in-memory high-resolution Canvas fallback
 * for the ImageEditor if an external or local file cannot be decoded.
 */
export function createFallbackCanvas(
  title: string = 'Sample Image',
  width: number = 1200,
  height: number = 800
): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Rich studio gradient background
  const grad = ctx.createLinearGradient(0, 0, width, height);
  grad.addColorStop(0, '#1e1b4b'); // Deep indigo
  grad.addColorStop(0.5, '#312e81'); // Indigo
  grad.addColorStop(1, '#0f172a'); // Slate
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Decorative ambient circles for color recolor testing
  const drawCircle = (x: number, y: number, r: number, color: string) => {
    ctx.save();
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.filter = 'blur(40px)';
    ctx.fill();
    ctx.restore();
  };

  drawCircle(width * 0.3, height * 0.4, 220, 'rgba(236, 72, 153, 0.4)'); // Pink
  drawCircle(width * 0.7, height * 0.5, 240, 'rgba(14, 165, 233, 0.4)'); // Sky
  drawCircle(width * 0.5, height * 0.7, 180, 'rgba(234, 179, 8, 0.35)'); // Amber

  // Geometric subject showcase (card & logo)
  const cardW = 420;
  const cardH = 260;
  const cardX = (width - cardW) / 2;
  const cardY = (height - cardH) / 2;

  ctx.save();
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(cardX, cardY, cardW, cardH, 20);
  ctx.fill();
  ctx.stroke();

  // Typography
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 36px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('ReColor Image Studio', width / 2, cardY + 90);

  ctx.fillStyle = '#cbd5e1';
  ctx.font = '500 20px system-ui, -apple-system, sans-serif';
  ctx.fillText(title, width / 2, cardY + 140);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '400 14px system-ui, -apple-system, sans-serif';
  ctx.fillText('Ready for preset transforms, duotone, and brush adjustments', width / 2, cardY + 185);
  ctx.restore();

  return canvas;
}
