<script lang="ts" setup>
const props = defineProps<{
  canvas: HTMLCanvasElement | null;
  templateName: string;
}>();

async function downloadPNG() {
  if (!props.canvas) return;
  try {
    const blob = await canvasToBlob(props.canvas, 'image/png');
    downloadBlob(blob, `${props.templateName}.png`);
  } catch {
    // nothing
  }
}

async function downloadJPEG() {
  if (!props.canvas) return;
  try {
    const blob = await canvasToBlob(props.canvas, 'image/jpeg', 0.9);
    downloadBlob(blob, `${props.templateName}.jpg`);
  } catch {
    // nothing
  }
}
</script>

<template>
  <div class="flex gap-2">
    <PrimeButton
      label="下载 PNG"
      icon="pi pi-download"
      severity="primary"
      @click="downloadPNG"
    />
    <PrimeButton
      label="下载 JPEG"
      icon="pi pi-download"
      severity="secondary"
      outlined
      @click="downloadJPEG"
    />
  </div>
</template>
