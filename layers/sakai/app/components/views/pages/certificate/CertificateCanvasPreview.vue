<script lang="ts" setup>
import type { CertificateEditorService } from '@sakai/services/CertificateEditorService';
import type {
  TemplateElement,
  CertificateTemplate,
} from '@sakai/types/certificate';

const props = defineProps<{
  editor: CertificateEditorService;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

const dragState = ref<{
  mode: 'move' | 'resize';
  handle: string;
  startX: number;
  startY: number;
  elemStartX: number;
  elemStartY: number;
  elemStartW: number;
  elemStartH: number;
} | null>(null);

const cachedBg = ref<HTMLImageElement | null>(null);
const cachedBgUrl = ref('');
const dragEndPos = ref<{ x: number; y: number; w: number; h: number } | null>(
  null,
);
const imageCache = ref<Record<string, HTMLImageElement>>({});

const HANDLE_SIZE = 8;

function getScale(): { scaleX: number; scaleY: number } {
  const c = canvasRef.value;
  if (!c) return { scaleX: 1, scaleY: 1 };
  return { scaleX: c.width / c.clientWidth, scaleY: c.height / c.clientHeight };
}

function canvasToReal(cx: number, cy: number): { x: number; y: number } {
  const c = canvasRef.value;
  if (!c) return { x: 0, y: 0 };
  const r = c.getBoundingClientRect();
  const { scaleX, scaleY } = getScale();
  return { x: (cx - r.left) * scaleX, y: (cy - r.top) * scaleY };
}

function getElementRect(el: TemplateElement): {
  x: number;
  y: number;
  w: number;
  h: number;
} {
  if (el.type === 'image')
    return { x: el.x, y: el.y, w: el.width, h: el.height };
  return { x: el.x, y: el.y, w: el.width, h: 40 };
}

function hitTest(px: number, py: number): TemplateElement | null {
  const tpl = props.editor.template;
  if (!tpl) return null;
  for (let i = tpl.elements.length - 1; i >= 0; i--) {
    const el = tpl.elements[i];
    if (!el) continue;
    const r = getElementRect(el);
    if (px >= r.x && px <= r.x + r.w && py >= r.y && py <= r.y + r.h) return el;
  }
  return null;
}

function drawHandles(
  ctx: CanvasRenderingContext2D,
  r: { x: number; y: number; w: number; h: number },
) {
  const pts = [
    { x: r.x, y: r.y },
    { x: r.x + r.w / 2, y: r.y },
    { x: r.x + r.w, y: r.y },
    { x: r.x + r.w, y: r.y + r.h / 2 },
    { x: r.x + r.w, y: r.y + r.h },
    { x: r.x + r.w / 2, y: r.y + r.h },
    { x: r.x, y: r.y + r.h },
    { x: r.x, y: r.y + r.h / 2 },
  ];
  for (const p of pts) {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(
      p.x - HANDLE_SIZE / 2,
      p.y - HANDLE_SIZE / 2,
      HANDLE_SIZE,
      HANDLE_SIZE,
    );
    ctx.strokeStyle = '#3B82F6';
    ctx.lineWidth = 1;
    ctx.strokeRect(
      p.x - HANDLE_SIZE / 2,
      p.y - HANDLE_SIZE / 2,
      HANDLE_SIZE,
      HANDLE_SIZE,
    );
  }
}

function getHandleAt(px: number, py: number): string | null {
  const el = props.editor.selectedElement;
  if (!el) return null;
  const r = getElementRect(el);
  const hs = [
    { id: 'nw', x: r.x, y: r.y },
    { id: 'n', x: r.x + r.w / 2, y: r.y },
    { id: 'ne', x: r.x + r.w, y: r.y },
    { id: 'e', x: r.x + r.w, y: r.y + r.h / 2 },
    { id: 'se', x: r.x + r.w, y: r.y + r.h },
    { id: 's', x: r.x + r.w / 2, y: r.y + r.h },
    { id: 'sw', x: r.x, y: r.y + r.h },
    { id: 'w', x: r.x, y: r.y + r.h / 2 },
  ];
  for (const h of hs) {
    if (
      Math.abs(px - h.x) <= HANDLE_SIZE / 2 + 4 &&
      Math.abs(py - h.y) <= HANDLE_SIZE / 2 + 4
    )
      return h.id;
  }
  return null;
}

// 拖拽期间快速重绘：缓存背景 + 同步绘制元素（无异步，无闪烁）
function fastRedraw(
  canvas: HTMLCanvasElement,
  tpl: CertificateTemplate,
  selectedEl: TemplateElement | undefined,
  selRect: { x: number; y: number; w: number; h: number },
) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (cachedBg.value) {
    ctx.drawImage(cachedBg.value, 0, 0, tpl.width, tpl.height);
  }

  // 非选中元素
  for (const el of tpl.elements) {
    if (el === selectedEl || !el.defaultValue) continue;
    ctx.save();
    if (el.type === 'text') {
      ctx.fillStyle = el.color;
      ctx.font = `${el.fontWeight === 'bold' ? 'bold ' : ''}${el.fontSize}px ${el.fontFamily}`;
      ctx.textBaseline = 'top';
      const tx =
        el.textAlign === 'center'
          ? el.x + el.width / 2
          : el.textAlign === 'right'
            ? el.x + el.width
            : el.x;
      ctx.textAlign = el.textAlign;
      ctx.fillText(el.defaultValue, tx, el.y);
    } else if (el.type === 'image') {
      const img = imageCache.value[el.id];
      if (img) {
        ctx.drawImage(img, el.x, el.y, el.width, el.height);
      }
    }
    ctx.restore();
  }

  // 选中元素（在拖拽新位置绘制）
  if (selectedEl && selectedEl.defaultValue) {
    ctx.save();
    if (selectedEl.type === 'text') {
      ctx.fillStyle = selectedEl.color;
      ctx.font = `${selectedEl.fontWeight === 'bold' ? 'bold ' : ''}${selectedEl.fontSize}px ${selectedEl.fontFamily}`;
      ctx.textBaseline = 'top';
      const tx =
        selectedEl.textAlign === 'center'
          ? selRect.x + selRect.w / 2
          : selectedEl.textAlign === 'right'
            ? selRect.x + selRect.w
            : selRect.x;
      ctx.textAlign = selectedEl.textAlign;
      ctx.fillText(selectedEl.defaultValue, tx, selRect.y);
    } else if (selectedEl.type === 'image') {
      const img = imageCache.value[selectedEl.id];
      if (img) {
        ctx.drawImage(img, selRect.x, selRect.y, selRect.w, selRect.h);
      }
    }
    ctx.restore();
  }

  // 选中框 + 手柄
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.strokeRect(selRect.x, selRect.y, selRect.w, selRect.h);
  ctx.setLineDash([]);
  drawHandles(ctx, selRect);
}

// 非拖拽期间：绘制选中覆盖层
function drawSelectOverlay() {
  const c = canvasRef.value;
  if (!c) return;
  const ctx = c.getContext('2d');
  if (!ctx) return;

  const el = props.editor.selectedElement;
  if (!el) return;
  const r = getElementRect(el);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#3B82F6';
  ctx.lineWidth = 2;
  ctx.strokeRect(r.x, r.y, r.w, r.h);
  ctx.setLineDash([]);
  drawHandles(ctx, r);
}

function onMouseDown(e: MouseEvent) {
  if (!canvasRef.value) return;
  const { x, y } = canvasToReal(e.clientX, e.clientY);
  const handle = getHandleAt(x, y);

  if (handle && props.editor.selectedElement) {
    const el = props.editor.selectedElement;
    const r = getElementRect(el);
    dragState.value = {
      mode: 'resize',
      handle,
      startX: x,
      startY: y,
      elemStartX: el.x,
      elemStartY: el.y,
      elemStartW: r.w,
      elemStartH: r.h,
    };
    return;
  }

  const hit = hitTest(x, y);
  if (hit) {
    props.editor.selectElement(hit.id);
    const r = getElementRect(hit);
    dragState.value = {
      mode: 'move',
      handle: '',
      startX: x,
      startY: y,
      elemStartX: hit.x,
      elemStartY: hit.y,
      elemStartW: r.w,
      elemStartH: r.h,
    };
    return;
  }

  props.editor.selectElement(null);
}

function onMouseMove(e: MouseEvent) {
  const { x, y } = canvasToReal(e.clientX, e.clientY);
  const c = canvasRef.value;
  const tpl = props.editor.template;

  if (dragState.value && c && tpl) {
    const ds = dragState.value;
    const dx = x - ds.startX;
    const dy = y - ds.startY;
    let nx = ds.elemStartX,
      ny = ds.elemStartY,
      nw = ds.elemStartW,
      nh = ds.elemStartH;

    if (ds.mode === 'move') {
      nx = Math.max(0, ds.elemStartX + dx);
      ny = Math.max(0, ds.elemStartY + dy);
    } else {
      if (ds.handle.includes('e')) nw = Math.max(20, ds.elemStartW + dx);
      if (ds.handle.includes('w')) {
        nx = ds.elemStartX + dx;
        nw = Math.max(20, ds.elemStartW - dx);
      }
      if (ds.handle.includes('s')) nh = Math.max(20, ds.elemStartH + dy);
      if (ds.handle.includes('n')) {
        ny = ds.elemStartY + dy;
        nh = Math.max(20, ds.elemStartH - dy);
      }
    }

    fastRedraw(c, tpl, props.editor.selectedElement, {
      x: nx,
      y: ny,
      w: nw,
      h: nh,
    });
    dragEndPos.value = { x: nx, y: ny, w: nw, h: nh };
    return;
  }

  if (c) {
    const h = getHandleAt(x, y);
    const cursors: Record<string, string> = {
      nw: 'nwse-resize',
      se: 'nwse-resize',
      ne: 'nesw-resize',
      sw: 'nesw-resize',
      n: 'ns-resize',
      s: 'ns-resize',
      e: 'ew-resize',
      w: 'ew-resize',
    };
    c.style.cursor = h
      ? cursors[h] || 'default'
      : hitTest(x, y)
        ? 'move'
        : 'default';
  }
}

function onMouseUp() {
  const ds = dragState.value;
  const pos = dragEndPos.value;
  dragState.value = null;
  dragEndPos.value = null;

  if (ds && pos && props.editor.selectedElement) {
    const el = props.editor.selectedElement;
    props.editor.isDirty = true;
    if (el.type === 'image') {
      props.editor.updateElement(el.id, {
        x: pos.x,
        y: pos.y,
        width: pos.w,
        height: pos.h,
      } as any);
    } else {
      props.editor.updateElement(el.id, { x: pos.x, y: pos.y, width: pos.w });
    }
  }
}

function preloadBackground(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      cachedBg.value = img;
      cachedBgUrl.value = url;
      resolve(img);
    };
    img.onerror = reject;
    img.src = url;
  });
}

function preloadImage(elementId: string, dataUrl: string) {
  const img = new Image();
  img.onload = () => {
    imageCache.value = { ...imageCache.value, [elementId]: img };
  };
  img.src = dataUrl;
}

async function fullRender() {
  const c = canvasRef.value;
  const tpl = props.editor.template;
  if (!c || !tpl) return;

  if (tpl.backgroundUrl && tpl.backgroundUrl !== cachedBgUrl.value) {
    try {
      await preloadBackground(tpl.backgroundUrl);
    } catch {
      cachedBg.value = null;
      cachedBgUrl.value = '';
    }
  }

  const values = props.editor.getRenderValues();
  await renderToCanvas(c, tpl, values);

  // 预加载图片元素的 defaultValue 到缓存，供拖拽期间同步绘制
  for (const el of tpl.elements) {
    if (el.type === 'image' && el.defaultValue) {
      preloadImage(el.id, el.defaultValue);
    }
  }

  drawSelectOverlay();
}

watch(
  () => props.editor.renderTick,
  () => {
    if (!dragState.value) fullRender();
  },
);
watch(
  () => props.editor.template?.backgroundUrl,
  () => {
    if (!dragState.value) fullRender();
  },
);
watch(
  () => props.editor.selectedElementId,
  () => {
    if (!dragState.value) {
      nextTick(() => {
        fullRender();
      });
    }
  },
);
</script>

<template>
  <div class="max-w-full overflow-auto">
    <canvas
      ref="canvasRef"
      class="border-surface max-w-full rounded border shadow-sm"
      @mousedown.prevent="onMouseDown"
      @mousemove="onMouseMove"
      @mouseup="onMouseUp"
      @mouseleave="onMouseUp"
    />
  </div>
</template>
