<script lang="ts" setup>
import { ShortLinkService } from '@sakai/services/ShortLinkService';
import type { ShortLink } from '@sakai/types/short-link';
import { generateShortCode } from '@sakai/services/ShortLinkService';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<ShortLink | null>('editData', { default: null });
const emit = defineEmits<{ saved: [] }>();

const service = useService(ShortLinkService);
const submitted = ref(false);
const allCampaigns = ref<string[]>([]);

const form = ref({
  title: '',
  originalUrl: '',
  shortCode: '',
  campaign: '',
  utmSource: '',
  utmMedium: '',
  utmCampaign: '',
  utmTerm: '',
  utmContent: '',
  expireAt: null as Date | null,
});

const isEdit = computed(() => !!editData.value);

async function loadCampaigns(): Promise<void> {
  allCampaigns.value = await service.getAllCampaigns();
}

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    loadCampaigns();
    if (editData.value) {
      form.value = {
        title: editData.value.title,
        originalUrl: editData.value.originalUrl,
        shortCode: editData.value.shortCode,
        campaign: editData.value.campaign,
        utmSource: editData.value.utmSource || '',
        utmMedium: editData.value.utmMedium || '',
        utmCampaign: editData.value.utmCampaign || '',
        utmTerm: editData.value.utmTerm || '',
        utmContent: editData.value.utmContent || '',
        expireAt: editData.value.expireAt
          ? new Date(editData.value.expireAt)
          : null,
      };
    } else {
      form.value = {
        title: '',
        originalUrl: '',
        shortCode: '',
        campaign: '',
        utmSource: '',
        utmMedium: '',
        utmCampaign: '',
        utmTerm: '',
        utmContent: '',
        expireAt: null,
      };
    }
  }
});

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

async function handleSave(): Promise<void> {
  submitted.value = true;
  if (!form.value.originalUrl.trim()) return;

  const shortCode = form.value.shortCode.trim() || generateShortCode();
  const expireAt = form.value.expireAt
    ? form.value.expireAt.toISOString()
    : undefined;

  const payload: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'> = {
    title: form.value.title.trim(),
    originalUrl: form.value.originalUrl.trim(),
    shortCode,
    campaign: form.value.campaign.trim(),
    utmSource: form.value.utmSource.trim() || undefined,
    utmMedium: form.value.utmMedium.trim() || undefined,
    utmCampaign: form.value.utmCampaign.trim() || undefined,
    utmTerm: form.value.utmTerm.trim() || undefined,
    utmContent: form.value.utmContent.trim() || undefined,
    expireAt,
  };

  try {
    if (isEdit.value && editData.value) {
      await service.update(editData.value.id, payload);
    } else {
      await service.create(payload);
    }
    visible.value = false;
    emit('saved');
  } catch (err) {
    console.error('保存短链失败', err);
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑短链' : '新建短链'"
    :modal="true"
    :style="{ width: '560px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div>
        <label class="mb-2 block text-sm font-medium"
          >目标 URL <span class="text-red-500">*</span></label
        >
        <PrimeInputText
          v-model.trim="form.originalUrl"
          placeholder="https://example.com/page"
          :invalid="submitted && !form.originalUrl"
          fluid
          autofocus
        />
        <small v-if="submitted && !form.originalUrl" class="text-red-500"
          >目标 URL 不能为空</small
        >
      </div>

      <div>
        <label class="mb-2 block text-sm font-medium">备注标题</label>
        <PrimeInputText
          v-model.trim="form.title"
          placeholder="用于识别短链用途"
          fluid
        />
      </div>

      <div class="flex gap-4">
        <div class="flex-1">
          <label class="mb-2 block text-sm font-medium">自定义短码</label>
          <PrimeInputText
            v-model.trim="form.shortCode"
            placeholder="留空自动生成"
            fluid
          />
        </div>
        <div class="flex-1">
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
      </div>

      <PrimeAccordion value="">
        <PrimeAccordionPanel value="utm">
          <PrimeAccordionHeader>UTM 参数（选填）</PrimeAccordionHeader>
          <PrimeAccordionContent>
            <div class="grid grid-cols-2 gap-3 pt-2">
              <div>
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_source</label
                >
                <PrimeInputText
                  v-model.trim="form.utmSource"
                  placeholder="如 wechat"
                  fluid
                  size="small"
                />
              </div>
              <div>
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_medium</label
                >
                <PrimeInputText
                  v-model.trim="form.utmMedium"
                  placeholder="如 social"
                  fluid
                  size="small"
                />
              </div>
              <div>
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_campaign</label
                >
                <PrimeInputText
                  v-model.trim="form.utmCampaign"
                  placeholder="如 618_2026"
                  fluid
                  size="small"
                />
              </div>
              <div>
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_term</label
                >
                <PrimeInputText
                  v-model.trim="form.utmTerm"
                  placeholder="如 sale"
                  fluid
                  size="small"
                />
              </div>
              <div class="col-span-2">
                <label
                  class="text-surface-500 dark:text-surface-400 mb-1 block text-xs"
                  >utm_content</label
                >
                <PrimeInputText
                  v-model.trim="form.utmContent"
                  placeholder="如 banner"
                  fluid
                  size="small"
                />
              </div>
            </div>
          </PrimeAccordionContent>
        </PrimeAccordionPanel>
      </PrimeAccordion>

      <div>
        <label class="mb-2 block text-sm font-medium">过期时间</label>
        <PrimeDatePicker
          v-model="form.expireAt"
          :min-date="new Date()"
          placeholder="永不过期"
          show-icon
          fluid
        />
      </div>
    </div>

    <template #footer>
      <PrimeButton label="取消" severity="secondary" @click="visible = false" />
      <PrimeButton label="保存" @click="handleSave" />
    </template>
  </PrimeDialog>
</template>
