<script lang="ts" setup>
import { MiniAppService } from '@sakai/services/MiniAppService';
import { MiniAppMgrService } from '@sakai/services/MiniAppMgrService';
import type { GenerateRecord, GenerateType } from '@sakai/types/miniapp';
import { GENERATE_TYPE_LABELS } from '@sakai/types/miniapp';

declareProviders([MiniAppService, MiniAppMgrService]);

const mgr = useService(MiniAppMgrService);
const toast = useToast();

definePageMeta({ layout: 'sakai-sidebar' });
useSeoMeta({ title: '小程序工具' });

const GENERATE_TYPES: GenerateType[] = [
  'wxacode',
  'wxacodeunlimit',
  'qrcode',
  'scheme',
  'urllink',
];

const ENV_VERSIONS = [
  { label: '正式版', value: 'release' },
  { label: '体验版', value: 'trial' },
  { label: '开发版', value: 'develop' },
];

const TYPE_SEVERITY: Record<GenerateType, string> = {
  wxacode: 'success',
  wxacodeunlimit: 'info',
  qrcode: 'help',
  scheme: 'warn',
  urllink: 'danger',
};

const TYPE_DESCRIPTIONS: Record<GenerateType, string> = {
  wxacode:
    '适用于正式业务场景，样式可定制（尺寸、颜色、透明底色），有数量限制（总数 10 万个）',
  wxacodeunlimit:
    '不限数量生成，需要填写 scene 场景值传递参数，适用于营销推广、带参二维码',
  qrcode: '普通二维码样式，最简单的生成方式，有数量限制（总数 10 万个）',
  scheme:
    '生成 weixin:// 协议的加密跳转链接，支持设置有效期，适用于短信、App 内跳转',
  urllink:
    '生成 https:// 协议的短链接，可在短信、邮件、网页中使用，支持设置有效期',
};

async function onGenerate(type: GenerateType): Promise<void> {
  try {
    await mgr.generate(type);
    toast.add({
      severity: 'success',
      summary: '成功',
      detail: `${GENERATE_TYPE_LABELS[type]}已生成`,
      life: 3000,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : '生成失败';
    toast.add({ severity: 'error', summary: '失败', detail: msg, life: 5000 });
  }
}

function onDownload(record: GenerateRecord): void {
  mgr.downloadImage(record);
}

async function onCopyLink(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    toast.add({
      severity: 'info',
      summary: '已复制',
      detail: '链接已复制到剪贴板',
      life: 2000,
    });
  } catch {
    toast.add({
      severity: 'error',
      summary: '复制失败',
      detail: '请手动复制链接',
      life: 3000,
    });
  }
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

onMounted(() => {
  mgr.loadMiniApps();
});
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-3">
      <h1 class="text-surface-900 dark:text-surface-0 text-xl font-semibold">
        小程序码/链接生成工具
      </h1>
      <a
        href="https://developers.weixin.qq.com/miniprogram/dev/server/API/qrcode-link/qr-code/api_getqrcode.html"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary-500 hover:text-primary-400 flex items-center gap-1 text-sm transition-colors"
      >
        <i class="pi pi-external-link text-xs" />
        <span>腾讯官方文档</span>
      </a>
    </div>

    <div class="search-container">
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">选择小程序</label>
        <PrimeSelect
          v-model="mgr.selectedAppId"
          :options="mgr.miniApps.map((a) => ({ label: a.name, value: a.id }))"
          option-label="label"
          option-value="value"
          placeholder="请选择小程序"
          :loading="mgr.miniAppsLoading"
        />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">环境版本</label>
        <PrimeSelect
          v-model="mgr.formEnvVersion"
          :options="ENV_VERSIONS"
          option-label="label"
          option-value="value"
        />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">
          页面路径 <span class="text-red-400">*</span>
        </label>
        <PrimeInputText
          v-model="mgr.formPath"
          placeholder="pages/goods/detail"
          class="w-56"
        />
      </div>
      <div class="flex items-center gap-2">
        <label class="text-sm font-medium whitespace-nowrap">URL 参数</label>
        <PrimeInputText
          v-model="mgr.formQuery"
          placeholder="id=123&source=share"
          class="w-56"
        />
      </div>

      <PrimeButton
        :label="mgr.advancedExpanded ? '收起高级选项' : '展开高级选项'"
        :icon="mgr.advancedExpanded ? 'pi pi-chevron-up' : 'pi pi-chevron-down'"
        severity="secondary"
        size="small"
        text
        @click="mgr.toggleAdvanced()"
      />

      <div
        v-if="mgr.advancedExpanded"
        class="grid w-full grid-cols-1 gap-4 md:grid-cols-2"
      >
        <div>
          <label
            class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
          >
            二维码宽度 (280~1280)
          </label>
          <PrimeInputNumber
            v-model="mgr.formWidth"
            :min="280"
            :max="1280"
            fluid
          />
        </div>
        <div class="flex items-end gap-3">
          <div>
            <label
              class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
            >
              透明底色
            </label>
            <PrimeToggleSwitch v-model="mgr.formIsHyaline" />
          </div>
        </div>
        <div>
          <label
            class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
          >
            场景值 scene
            <span class="text-surface-400 text-[11px]">（仅无限码需要）</span>
          </label>
          <PrimeInputText v-model="mgr.formScene" placeholder="abc123" fluid />
        </div>
      </div>
    </div>

    <div class="search-container">
      <label class="text-surface-500 dark:text-surface-400 mb-2 block text-xs">
        一键生成
      </label>
      <div class="flex flex-wrap gap-3">
        <PrimeButton
          v-for="t in GENERATE_TYPES"
          :key="t"
          :severity="TYPE_SEVERITY[t]"
          :loading="mgr.generating"
          :disabled="mgr.generating"
          v-tooltip.top="TYPE_DESCRIPTIONS[t]"
          @click="onGenerate(t)"
        >
          {{ GENERATE_TYPE_LABELS[t] }}
          <i class="pi pi-question-circle ml-1 text-xs opacity-60" />
        </PrimeButton>
      </div>
    </div>

    <div v-if="mgr.records.length > 0" class="search-container">
      <div class="mb-3 flex items-center justify-between">
        <h2 class="text-surface-900 dark:text-surface-0 text-lg font-semibold">
          生成结果（本次会话）
        </h2>
        <PrimeTag :value="`共 ${mgr.records.length} 条`" severity="info" />
      </div>

      <div class="flex flex-col gap-3">
        <div
          v-for="record in mgr.records"
          :key="record.id"
          class="border-surface-100 flex flex-col gap-3 rounded-lg border p-3 md:flex-row md:items-center"
        >
          <div class="flex shrink-0 flex-col gap-1">
            <PrimeTag
              :value="GENERATE_TYPE_LABELS[record.type]"
              :severity="TYPE_SEVERITY[record.type]"
            />
            <span class="text-surface-400 text-xs">{{
              record.miniAppName
            }}</span>
          </div>

          <div class="text-surface-500 min-w-0 flex-1 text-xs">
            <div class="truncate">path: {{ record.params.path }}</div>
            <div v-if="record.params.query" class="truncate">
              query: {{ record.params.query }}
            </div>
            <div class="mt-1 text-[11px]">
              {{ formatTime(record.createdAt) }}
            </div>
          </div>

          <div class="flex shrink-0 items-center gap-2">
            <template v-if="record.result.contentType === 'image/png'">
              <img
                :src="record.result.imageUrl"
                :alt="GENERATE_TYPE_LABELS[record.type]"
                class="border-surface-100 max-h-24 max-w-30 rounded border object-contain"
              />
              <PrimeButton
                icon="pi pi-download"
                size="small"
                severity="secondary"
                @click="onDownload(record)"
              />
            </template>

            <template v-else>
              <code class="text-surface-600 max-w-50 truncate text-xs">
                {{ record.result.link }}
              </code>
              <PrimeButton
                icon="pi pi-copy"
                size="small"
                severity="secondary"
                @click="onCopyLink(record.result.link!)"
              />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
