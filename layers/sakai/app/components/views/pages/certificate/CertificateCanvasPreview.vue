<script lang="ts" setup>
import type { CertificateEditorService } from '@sakai/services/CertificateEditorService';

const props = defineProps<{
  editor: CertificateEditorService;
}>();

const canvasRef = ref<HTMLCanvasElement | null>(null);

watch(
  () => props.editor.renderTick,
  () => {
    if (canvasRef.value && props.editor.template) {
      nextTick(() => {
        requestAnimationFrame(() => {
          const values = props.editor.getRenderValues();
          renderToCanvas(canvasRef.value!, props.editor.template!, values);
        });
      });
    }
  },
);

watch(
  () => props.editor.template?.backgroundUrl,
  () => {
    if (canvasRef.value && props.editor.template) {
      nextTick(() => {
        requestAnimationFrame(() => {
          const values = props.editor.getRenderValues();
          renderToCanvas(canvasRef.value!, props.editor.template!, values);
        });
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
    />
  </div>
</template>
