import type {
  CertificateTemplate,
  ImageElement,
  TextElement,
} from '@sakai/types/certificate';

function getPaddingObj(
  padding:
    | number
    | { top: number; right: number; bottom: number; left: number },
): { top: number; right: number; bottom: number; left: number } {
  if (typeof padding === 'number') {
    return { top: padding, right: padding, bottom: padding, left: padding };
  }
  return padding;
}

function drawRoundedRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines?: number,
): string[] {
  const lines: string[] = [];
  const chars = [...text];
  let currentLine = '';

  for (const char of chars) {
    const testLine = currentLine + char;
    if (ctx.measureText(testLine).width > maxWidth && currentLine.length > 0) {
      lines.push(currentLine);
      currentLine = char;
      if (maxLines && lines.length >= maxLines) return lines;
    } else {
      currentLine = testLine;
    }
  }
  if (currentLine) lines.push(currentLine);

  if (maxLines && lines.length > maxLines) {
    const lastLine = lines[maxLines - 1];
    if (lastLine) {
      lines.splice(maxLines);
      lines.push(lastLine.slice(0, -1) + '…');
    }
  }

  return lines;
}

function getTextContentHeight(
  ctx: CanvasRenderingContext2D,
  el: TextElement,
  text: string,
  padding: { top: number; right: number; bottom: number; left: number },
): number {
  ctx.save();
  ctx.font = `${el.fontWeight === 'bold' ? 'bold ' : ''}${el.fontSize}px ${el.fontFamily}`;
  const lines = wrapText(
    ctx,
    text,
    el.width - padding.left - padding.right,
    el.maxLines,
  );
  ctx.restore();
  return (
    lines.length * el.fontSize * el.lineHeight + padding.top + padding.bottom
  );
}

function getImageSourceRect(
  imgW: number,
  imgH: number,
  targetW: number,
  targetH: number,
  fit: 'cover' | 'contain' | 'fill',
): { sx: number; sy: number; sw: number; sh: number } {
  if (fit === 'fill') {
    return { sx: 0, sy: 0, sw: imgW, sh: imgH };
  }

  const imgRatio = imgW / imgH;
  const targetRatio = targetW / targetH;

  if (fit === 'cover') {
    if (imgRatio > targetRatio) {
      const sw = imgH * targetRatio;
      return { sx: (imgW - sw) / 2, sy: 0, sw, sh: imgH };
    }
    const sh = imgW / targetRatio;
    return { sx: 0, sy: (imgH - sh) / 2, sw: imgW, sh };
  }

  if (imgRatio > targetRatio) {
    return { sx: 0, sy: 0, sw: imgW, sh: imgW / imgRatio };
  }
  return { sx: 0, sy: 0, sw: imgH * imgRatio, sh: imgH };
}

function drawTextElement(
  ctx: CanvasRenderingContext2D,
  el: TextElement,
  text: string,
): void {
  const padding = getPaddingObj(el.padding || 0);

  ctx.save();

  if (el.rotation) {
    const cx = el.x + el.width / 2;
    const cy = el.y + el.width / 2;
    ctx.translate(cx, cy);
    ctx.rotate((el.rotation * Math.PI) / 180);
    ctx.translate(-cx, -cy);
  }

  if (el.backgroundColor) {
    ctx.fillStyle = el.backgroundColor;
    if (el.borderRadius) {
      drawRoundedRectPath(
        ctx,
        el.x,
        el.y,
        el.width,
        getTextContentHeight(ctx, el, text, padding),
        el.borderRadius,
      );
      ctx.fill();
    } else {
      ctx.fillRect(
        el.x,
        el.y,
        el.width,
        getTextContentHeight(ctx, el, text, padding),
      );
    }
  }

  ctx.fillStyle = el.color;
  ctx.font = `${el.fontWeight === 'bold' ? 'bold ' : ''}${el.fontSize}px ${el.fontFamily}`;
  ctx.textBaseline = 'top';

  const lines = wrapText(
    ctx,
    text,
    el.width - padding.left - padding.right,
    el.maxLines,
  );
  const lineHeightPx = el.fontSize * el.lineHeight;
  const totalTextHeight = lines.length * lineHeightPx;
  const contentHeight = totalTextHeight + padding.top + padding.bottom;

  let startY: number;
  switch (el.verticalAlign) {
    case 'middle':
      startY = el.y + (el.width - contentHeight) / 2 + padding.top;
      break;
    case 'bottom':
      startY = el.y + el.width - contentHeight + padding.top;
      break;
    default:
      startY = el.y + padding.top;
      break;
  }

  ctx.textAlign = el.textAlign;
  for (let i = 0; i < lines.length; i++) {
    let lineX: number;
    switch (ctx.textAlign) {
      case 'center':
        lineX = el.x + el.width / 2;
        break;
      case 'right':
        lineX = el.x + el.width - padding.right;
        break;
      default:
        lineX = el.x + padding.left;
        break;
    }
    const lineText = lines[i];
    if (lineText) {
      ctx.fillText(lineText, lineX, startY + i * lineHeightPx);
    }
  }

  ctx.restore();
}

function drawImageElement(
  ctx: CanvasRenderingContext2D,
  el: ImageElement,
  img: HTMLImageElement,
): void {
  ctx.save();

  if (el.opacity !== undefined && el.opacity < 1) {
    ctx.globalAlpha = el.opacity;
  }

  if (el.borderRadius) {
    ctx.beginPath();
    drawRoundedRectPath(ctx, el.x, el.y, el.width, el.height, el.borderRadius);
    ctx.clip();
  }

  const { sx, sy, sw, sh } = getImageSourceRect(
    img.naturalWidth,
    img.naturalHeight,
    el.width,
    el.height,
    el.fit,
  );
  ctx.drawImage(img, sx, sy, sw, sh, el.x, el.y, el.width, el.height);

  ctx.restore();
}

export function renderToCanvas(
  canvas: HTMLCanvasElement,
  template: CertificateTemplate,
  values?: Record<string, string>,
): Promise<void> {
  return new Promise((resolve) => {
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      resolve();
      return;
    }

    canvas.width = template.width;
    canvas.height = template.height;

    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.onload = async () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bgImg, 0, 0, template.width, template.height);

      for (const el of template.elements) {
        const val = values?.[el.id];
        if (val === undefined || val === null || val === '') continue;

        if (el.type === 'text') {
          drawTextElement(ctx, el, val);
        } else if (el.type === 'image') {
          try {
            const img = await loadImage(val);
            drawImageElement(ctx, el, img);
          } catch {
            // 图片加载失败，跳过该元素
          }
        }
      }
      resolve();
    };

    bgImg.onerror = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#f0f0f0';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#999';
      ctx.font = '16px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('背景图加载失败', canvas.width / 2, canvas.height / 2);
      resolve();
    };

    bgImg.src = template.backgroundUrl;
  });
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`图片加载失败: ${url}`));
    img.src = url;
  });
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  format: 'image/png' | 'image/jpeg' = 'image/png',
  quality = 0.95,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Canvas toBlob 失败'));
        }
      },
      format,
      quality,
    );
  });
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
