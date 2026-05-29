<script lang="ts" setup>
import * as XLSX from 'xlsx';
import type { ShortLink } from '@sakai/types/short-link';
import { generateShortCode } from '@sakai/services/ShortLinkService';

const visible = defineModel<boolean>('visible', { required: true });
const emit = defineEmits<{
  imported: [rows: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[]];
}>();

type Row = Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>;

const previewRows = ref<Row[]>([]);
const allRows = ref<Row[]>([]);
const fileName = ref('');

function downloadTemplate(): void {
  const header = [
    '标题',
    '目标URL',
    '短码',
    '活动标签',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_term',
    'utm_content',
    '过期时间',
  ];
  const example = [
    '示例',
    'https://example.com',
    '',
    '618大促',
    'wechat',
    'social',
    '618_2026',
    '',
    '',
    '',
  ];
  const ws = XLSX.utils.aoa_to_sheet([header, example]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, '短链导入模板');
  XLSX.writeFile(wb, '短链导入模板.xlsx');
}

async function handleUpload(event: { files: File | File[] }): Promise<void> {
  const files = Array.isArray(event.files) ? event.files : [event.files];
  const file = files[0];
  if (!file) return;

  fileName.value = file.name;
  const buffer = await file.arrayBuffer();
  const wb = XLSX.read(buffer);
  const sheetName = wb.SheetNames[0];
  if (!sheetName) return;
  const sheet = wb.Sheets[sheetName];
  if (!sheet) return;
  const rawRows = XLSX.utils.sheet_to_json<Record<string, string>>(sheet);

  allRows.value = rawRows.map((row) => ({
    title: row['标题'] || '',
    originalUrl: row['目标URL'] || '',
    shortCode: row['短码'] || generateShortCode(),
    campaign: row['活动标签'] || '',
    utmSource: row['utm_source'] || undefined,
    utmMedium: row['utm_medium'] || undefined,
    utmCampaign: row['utm_campaign'] || undefined,
    utmTerm: row['utm_term'] || undefined,
    utmContent: row['utm_content'] || undefined,
    expireAt: row['过期时间'] || undefined,
  }));
  previewRows.value = allRows.value.slice(0, 5);
}

function handleConfirm(): void {
  emit('imported', allRows.value);
}

watch(visible, (v) => {
  if (!v) {
    previewRows.value = [];
    allRows.value = [];
    fileName.value = '';
  }
});
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="批量导入短链"
    :modal="true"
    :style="{ width: '600px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center justify-between">
        <PrimeButton
          label="下载模板"
          icon="pi pi-download"
          size="small"
          severity="secondary"
          @click="downloadTemplate"
        />
      </div>

      <PrimeFileUpload
        mode="basic"
        accept=".xlsx,.csv"
        :max-file-size="5000000"
        choose-label="选择文件"
        @upload="handleUpload"
      />

      <div
        v-if="fileName"
        class="text-surface-500 dark:text-surface-400 text-sm"
      >
        已选择: {{ fileName }}（{{ allRows.length }} 条数据）
      </div>

      <div v-if="previewRows.length > 0">
        <h4 class="mb-2 text-sm font-medium">数据预览（前 5 行）</h4>
        <div class="overflow-x-auto">
          <table class="w-full text-xs">
            <thead>
              <tr class="border-surface-200 dark:border-surface-700 border-b">
                <th class="px-2 py-1 text-left">标题</th>
                <th class="px-2 py-1 text-left">目标 URL</th>
                <th class="px-2 py-1 text-left">短码</th>
                <th class="px-2 py-1 text-left">标签</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(row, i) in previewRows"
                :key="i"
                class="border-surface-100 dark:border-surface-800 border-b"
              >
                <td class="max-w-[100px] truncate px-2 py-1">
                  {{ row.title }}
                </td>
                <td class="max-w-[200px] truncate px-2 py-1">
                  {{ row.originalUrl }}
                </td>
                <td class="px-2 py-1 font-mono">{{ row.shortCode }}</td>
                <td class="px-2 py-1">{{ row.campaign }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton
        label="确认导入"
        :disabled="allRows.length === 0"
        @click="handleConfirm"
      />
    </template>
  </PrimeDialog>
</template>
