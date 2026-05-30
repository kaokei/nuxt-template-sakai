<script lang="ts" setup>
import CertificateDeleteDialog from '@sakai/components/views/pages/certificate/CertificateDeleteDialog.vue';
import CertificateSearchBar from '@sakai/components/views/pages/certificate/CertificateSearchBar.vue';
import CertificateTable from '@sakai/components/views/pages/certificate/CertificateTable.vue';
import { CertificateMgrService } from '@sakai/services/CertificateMgrService';
import { CertificateService } from '@sakai/services/CertificateService';

declareProviders([CertificateService, CertificateMgrService]);

const mgr = useService(CertificateMgrService);
const router = useRouter();
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '模板合成' });

function goCreate() {
  router.push('/demo/system/certificate/new/edit');
}

async function onDeleteConfirm() {
  try {
    const result = await mgr.onDeleteConfirm();
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: result.message,
      life: 3000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '错误',
      detail: '删除失败',
      life: 3000,
    });
  }
}

onMounted(() => {
  mgr.loadTemplates();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <CertificateSearchBar
      :category-options="mgr.categoryOptions"
      @search="mgr.onSearch"
      @reset="mgr.onReset"
    />

    <div class="card p-4!">
      <PrimeToolbar class="mb-4">
        <template #start>
          <PrimeButton
            label="新建模板"
            icon="pi pi-plus"
            severity="primary"
            @click="goCreate"
          />
        </template>
      </PrimeToolbar>

      <CertificateTable
        :templates="mgr.templates"
        :loading="mgr.loading"
        :total-records="mgr.totalRecords"
        :page="mgr.page"
        :page-size="mgr.pageSize"
        :category-labels="mgr.categoryLabels"
        @page="mgr.onPage"
        @edit="(tpl) => router.push(`/demo/system/certificate/${tpl.id}/edit`)"
        @compose="
          (tpl) =>
            router.push(`/demo/system/certificate/compose?templateId=${tpl.id}`)
        "
        @delete="mgr.confirmDelete"
      />
    </div>

    <CertificateDeleteDialog
      :visible="mgr.deleteDialogVisible"
      :template-name="mgr.deleteTarget?.name || ''"
      @update:visible="mgr.deleteDialogVisible = $event"
      @confirm="onDeleteConfirm"
    />
  </div>
</template>
