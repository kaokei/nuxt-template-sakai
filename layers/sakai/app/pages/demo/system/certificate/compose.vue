<script lang="ts" setup>
import ComposeDownloadPanel from '@sakai/components/views/pages/certificate/ComposeDownloadPanel.vue';
import ComposeInputForm from '@sakai/components/views/pages/certificate/ComposeInputForm.vue';
import { CertificateService } from '@sakai/services/CertificateService';
import type {
  CertificateTemplate,
  CertificateOption,
} from '@sakai/types/certificate';

declareProviders([CertificateService]);

const certService = useService(CertificateService);
const route = useRoute();
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '合成下载' });

const templateOptions = ref<CertificateOption[]>([]);
const selectedTemplateId = ref((route.query.templateId as string) || '');
const currentTemplate = ref<CertificateTemplate | null>(null);

const actualValues = ref<Record<string, string>>({});
const blobUrls = ref<Record<string, string>>({});

const previewCanvas = ref<HTMLCanvasElement | null>(null);
const renderTick = ref(0);

onMounted(async () => {
  try {
    templateOptions.value = await certService.getOptions();
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '加载模板列表失败',
      life: 3000,
    });
  }
  if (selectedTemplateId.value) {
    await loadTemplate(selectedTemplateId.value);
  }
});

onBeforeUnmount(() => {
  for (const url of Object.values(blobUrls.value)) {
    URL.revokeObjectURL(url);
  }
});

async function loadTemplate(id: string) {
  try {
    currentTemplate.value = await certService.getById(id);
    for (const url of Object.values(blobUrls.value)) {
      URL.revokeObjectURL(url);
    }
    blobUrls.value = {};
    actualValues.value = {};
    // 用元素默认值初始化，实现即时预览
    for (const el of currentTemplate.value.elements) {
      if (el.defaultValue) {
        actualValues.value[el.id] = el.defaultValue;
      }
    }
    renderTick.value++;
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '加载模板失败',
      life: 3000,
    });
  }
}

function onTemplateChange(id: string) {
  selectedTemplateId.value = id;
  if (id) {
    loadTemplate(id);
  }
}

watch(selectedTemplateId, (newId) => {
  if (newId) {
    loadTemplate(newId);
  }
});

function onInputChange(elementId: string, value: string) {
  actualValues.value[elementId] = value;
  renderTick.value++;
}

function onFileChange(elementId: string, file: File | null) {
  if (blobUrls.value[elementId]) {
    URL.revokeObjectURL(blobUrls.value[elementId]);
  }
  if (file) {
    blobUrls.value[elementId] = URL.createObjectURL(file);
    actualValues.value[elementId] = blobUrls.value[elementId];
  } else {
    delete blobUrls.value[elementId];
    delete actualValues.value[elementId];
  }
  renderTick.value++;
}

function triggerRender() {
  nextTick(() => {
    if (!previewCanvas.value || !currentTemplate.value) return;
    renderToCanvas(
      previewCanvas.value,
      currentTemplate.value,
      actualValues.value,
    );
  });
}

watch(renderTick, triggerRender);
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex gap-4">
      <div class="w-2/5 flex-shrink-0">
        <div class="card p-4!">
          <div class="mb-4">
            <label class="mb-1 block text-sm font-medium">选择模板</label>
            <PrimeSelect
              v-model="selectedTemplateId"
              :options="templateOptions"
              option-label="label"
              option-value="value"
              placeholder="请选择模板"
              class="w-full"
            />
          </div>
          <ComposeInputForm
            v-if="currentTemplate"
            :elements="currentTemplate.elements"
            :values="actualValues"
            :file-map="blobUrls"
            @input-change="onInputChange"
            @file-change="onFileChange"
          />
          <div v-else-if="selectedTemplateId" class="flex justify-center py-8">
            <i class="pi pi-spin pi-spinner" />
          </div>
          <div v-else class="text-muted-color py-8 text-center">
            请先选择一个模板
          </div>
        </div>
      </div>
      <div class="w-3/5 flex-shrink-0">
        <div class="card flex flex-col items-center gap-4 p-4!">
          <canvas
            ref="previewCanvas"
            class="border-surface max-w-full rounded border"
          />
          <ComposeDownloadPanel
            v-if="currentTemplate"
            :canvas="previewCanvas"
            :template-name="currentTemplate.name"
          />
        </div>
      </div>
    </div>
  </div>
</template>
