<script lang="ts" setup>
import type { CertificateTemplate } from '@sakai/types/certificate';
import type { DataTablePageEvent } from 'primevue/datatable';

defineProps<{
  templates: CertificateTemplate[];
  loading: boolean;
  totalRecords: number;
  page: number;
  pageSize: number;
  categoryLabels: Record<string, string>;
}>();

const emit = defineEmits<{
  page: [event: DataTablePageEvent];
  edit: [template: CertificateTemplate];
  compose: [template: CertificateTemplate];
  delete: [template: CertificateTemplate];
}>();
</script>

<template>
  <PrimeDataTable
    :value="templates"
    :loading="loading"
    :paginator="true"
    :rows="pageSize"
    :first="(page - 1) * pageSize"
    :total-records="totalRecords"
    paginator-template="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
    current-page-report-template="共 {totalRecords} 条"
    :rows-per-page-options="[5, 10, 20]"
    @page="emit('page', $event)"
  >
    <PrimeColumn field="id" header="ID" style="width: 100px" />
    <PrimeColumn field="name" header="模板名称" sortable />
    <PrimeColumn field="category" header="分类" style="width: 100px">
      <template #body="{ data }">
        <PrimeTag :value="categoryLabels[data.category] || data.category" />
      </template>
    </PrimeColumn>
    <PrimeColumn header="尺寸" style="width: 130px">
      <template #body="{ data }">
        <span class="text-muted-color text-sm"
          >{{ data.width }} × {{ data.height }}</span
        >
      </template>
    </PrimeColumn>
    <PrimeColumn header="更新时间" style="width: 180px">
      <template #body="{ data }">
        <span class="text-sm">{{
          new Date(data.updatedAt).toLocaleString('zh-CN')
        }}</span>
      </template>
    </PrimeColumn>
    <PrimeColumn header="操作" style="width: 240px">
      <template #body="{ data }">
        <div class="flex gap-2">
          <PrimeButton
            label="编辑"
            icon="pi pi-pencil"
            size="small"
            severity="primary"
            outlined
            @click="emit('edit', data)"
          />
          <PrimeButton
            label="合成"
            icon="pi pi-images"
            size="small"
            severity="success"
            outlined
            @click="emit('compose', data)"
          />
          <PrimeButton
            label="删除"
            icon="pi pi-trash"
            size="small"
            severity="danger"
            outlined
            @click="emit('delete', data)"
          />
        </div>
      </template>
    </PrimeColumn>
  </PrimeDataTable>
</template>
