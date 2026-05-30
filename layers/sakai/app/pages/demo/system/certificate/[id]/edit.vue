<script lang="ts" setup>
import CertificateCanvasPreview from '@sakai/components/views/pages/certificate/CertificateCanvasPreview.vue';
import CertificateEditForm from '@sakai/components/views/pages/certificate/CertificateEditForm.vue';
import { CertificateEditorService } from '@sakai/services/CertificateEditorService';
import { CertificateService } from '@sakai/services/CertificateService';

declareProviders([CertificateService, CertificateEditorService]);

const route = useRoute();
const router = useRouter();
const toast = useToast();
const editor = useService(CertificateEditorService);

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '模板配置' });

onMounted(async () => {
  const id = route.params.id as string;
  try {
    await editor.loadTemplate(id);
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '模板加载失败',
      life: 3000,
    });
    router.push('/demo/system/certificate');
  }
});

async function onSave() {
  try {
    await editor.save();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: '模板已保存',
      life: 1500,
    });
    router.push('/demo/system/certificate');
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '保存失败',
      life: 3000,
    });
  }
}
</script>

<template>
  <div v-if="editor.loading" class="flex h-64 items-center justify-center">
    <i class="pi pi-spin pi-spinner text-2xl" />
  </div>
  <div v-else-if="editor.template" class="flex h-[calc(100vh-140px)] gap-4">
    <div class="w-2/5 shrink-0 overflow-y-auto">
      <CertificateEditForm :editor="editor" @save="onSave" />
    </div>
    <div class="sticky top-0 flex w-3/5 shrink-0 items-start justify-center">
      <CertificateCanvasPreview :editor="editor" />
    </div>
  </div>
</template>
