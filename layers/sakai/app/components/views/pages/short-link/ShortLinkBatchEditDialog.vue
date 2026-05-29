<script lang="ts" setup>
import { ShortLinkService } from '@sakai/services/ShortLinkService';
import type { ShortLink } from '@sakai/types/short-link';

const visible = defineModel<boolean>('visible', { required: true });
const count = defineModel<number>('count', { required: true });
const emit = defineEmits<{
  confirm: [data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>>];
}>();

const service = useService(ShortLinkService);
const allCampaigns = ref<string[]>([]);

const form = ref({
  campaign: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  utmContent: '',
  expireAt: null as Date | null,
});

async function loadCampaigns(): Promise<void> {
  allCampaigns.value = await service.getAllCampaigns();
}

const campaignModel = computed({
  get: () => form.value.campaign,
  set: (val: string | { label: string; value: string }) => {
    form.value.campaign = typeof val === 'string' ? val : val.value;
  },
});

const filteredCampaigns = computed(() => {
  const list = allCampaigns.value.map((c) => ({ label: c, value: c }));
  if (!form.value.campaign) return list;
  return list.filter((c) => c.label.includes(form.value.campaign));
});

watch(visible, (v) => {
  if (v) {
    loadCampaigns();
    form.value = {
      campaign: '',
      utmSource: '',
      utmMedium: '',
      utmCampaign: '',
      utmTerm: '',
      utmContent: '',
      expireAt: null,
    };
  }
});

function handleConfirm(): void {
  const data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>> = {};
  if (form.value.campaign.trim()) data.campaign = form.value.campaign.trim();
  if (form.value.utmSource.trim()) data.utmSource = form.value.utmSource.trim();
  if (form.value.utmMedium.trim()) data.utmMedium = form.value.utmMedium.trim();
  if (form.value.utmCampaign.trim())
    data.utmCampaign = form.value.utmCampaign.trim();
  if (form.value.utmTerm.trim()) data.utmTerm = form.value.utmTerm.trim();
  if (form.value.utmContent.trim())
    data.utmContent = form.value.utmContent.trim();
  if (form.value.expireAt) data.expireAt = form.value.expireAt.toISOString();
  emit('confirm', data);
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    header="批量编辑短链"
    :modal="true"
    :style="{ width: '520px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <p class="text-surface-500 dark:text-surface-400 text-sm">
        已选 <strong>{{ count }}</strong> 条短链。留空的字段保持不变。
      </p>

      <div>
        <label class="mb-2 block text-sm font-medium">活动标签</label>
        <PrimeAutoComplete
          v-model="campaignModel"
          :suggestions="filteredCampaigns"
          option-label="label"
          placeholder="选择或输入标签"
          dropdown
          fluid
        />
      </div>

      <PrimeDivider />

      <div class="text-sm font-medium">UTM 参数</div>
      <div class="grid grid-cols-2 gap-3">
        <PrimeInputText
          v-model.trim="form.utmSource"
          placeholder="utm_source"
          fluid
          size="small"
        />
        <PrimeInputText
          v-model.trim="form.utmMedium"
          placeholder="utm_medium"
          fluid
          size="small"
        />
        <PrimeInputText
          v-model.trim="form.utmCampaign"
          placeholder="utm_campaign"
          fluid
          size="small"
        />
        <PrimeInputText
          v-model.trim="form.utmTerm"
          placeholder="utm_term"
          fluid
          size="small"
        />
        <PrimeInputText
          v-model.trim="form.utmContent"
          placeholder="utm_content"
          fluid
          size="small"
        />
      </div>

      <PrimeDivider />

      <div>
        <label class="mb-2 block text-sm font-medium">过期时间</label>
        <PrimeDatePicker
          v-model="form.expireAt"
          :min-date="new Date()"
          placeholder="不修改"
          show-icon
          fluid
        />
      </div>
    </div>

    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton label="确认修改" @click="handleConfirm" />
    </template>
  </PrimeDialog>
</template>
