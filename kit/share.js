// Kit de imágenes para compartir. Fuente: lucasramosuy/brand/kit/share.js.
// Cada consumidor lo copia localmente: sin CDN y sin pedir datos a terceros.
export async function loadExportFonts(specs) {
  if (!globalThis.document?.fonts) throw new Error('Este navegador no puede cargar las fuentes de la imagen.');
  const loaded = await Promise.all(specs.map(async ({family, weight = 400, style = 'normal', size = 32}) => {
    const declaration = `${style} ${weight} ${size}px "${family}"`;
    const faces = await document.fonts.load(declaration);
    if (!faces.length || !document.fonts.check(declaration)) {
      throw new Error(`Falta la fuente ${family} (${style} ${weight}) para crear la imagen.`);
    }
    return faces;
  }));
  await document.fonts.ready;
  return loaded;
}

// Reducir sin alterar la fuente ni cortar caracteres.
export function fitText(ctx, text, maxWidth, startSize, minSize = 12, fontAtSize) {
  if (!(maxWidth > 0) || !(startSize > 0) || !(minSize > 0) || typeof fontAtSize !== 'function') throw new RangeError('Medidas de texto inválidas');
  let size = startSize;
  while (size > minSize) {
    ctx.font = fontAtSize(size);
    if (ctx.measureText(String(text)).width <= maxWidth) return size;
    size -= 1;
  }
  ctx.font = fontAtSize(minSize);
  return minSize;
}

export function wrapLines(ctx, text, maxWidth, maxLines = Infinity) {
  if (!(maxWidth > 0) || !(maxLines >= 1)) throw new RangeError('Medidas de línea inválidas');
  const words = String(text ?? '').trim().split(/\s+/).filter(Boolean);
  const lines = [];
  let line = '';
  for (const word of words) {
    const candidate = line ? `${line} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth || !line) { line = candidate; continue; }
    lines.push(line);
    line = word;
    if (lines.length === maxLines) break;
  }
  if (lines.length < maxLines && line) lines.push(line);
  // La última línea mantiene un indicador de corte si no entró todo.
  if (lines.length === maxLines && lines.join(' ').split(/\s+/).length < words.length) {
    let last = lines[maxLines - 1];
    while (last && ctx.measureText(`${last}…`).width > maxWidth) last = last.replace(/\s*\S+$/, '');
    lines[maxLines - 1] = last ? `${last}…` : '…';
  }
  return lines;
}

export function fillRound(ctx, x, y, width, height, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.roundRect(x, y, width, height, radius);
  ctx.fill();
}

export function canvasPngBlob(canvas) {
  return new Promise((resolve, reject) => canvas.toBlob(
    blob => blob ? resolve(blob) : reject(new Error('No se pudo generar la imagen PNG.')),
    'image/png',
  ));
}

export async function downloadPng(canvas, filename) {
  const blob = await canvasPngBlob(canvas);
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename.endsWith('.png') ? filename : `${filename}.png`;
    document.body.append(link);
    link.click();
    link.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 5000);
  }
}
