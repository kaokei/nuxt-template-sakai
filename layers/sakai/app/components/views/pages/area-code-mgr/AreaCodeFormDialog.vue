<script lang="ts" setup>
import { AreaCodeMgrService } from '@sakai/services/AreaCodeMgrService';
import type { AreaCode } from '~/types/area-code';

const visible = defineModel<boolean>('visible', { required: true });
const editData = defineModel<AreaCode | null>('editData', { default: null });

const emit = defineEmits<{
  saved: [];
}>();

const mgr = useService(AreaCodeMgrService);
const toast = useToast();
const submitted = ref(false);
const isSaving = ref(false);

const form = ref({
  code: '',
  regionName: '',
  countryCode: '',
  englishName: '',
  continent: '亚洲' as AreaCode['continent'],
  validationRule: '',
  enabled: true,
  sort: 0,
  remark: '',
});

const isEdit = computed(() => !!editData.value);

watch(visible, (isVisible) => {
  if (isVisible) {
    submitted.value = false;
    if (editData.value) {
      form.value = { ...editData.value };
    } else {
      form.value = {
        code: '',
        regionName: '',
        countryCode: '',
        englishName: '',
        continent: '亚洲',
        validationRule: '',
        enabled: true,
        sort: 0,
        remark: '',
      };
    }
  }
});

async function handleSave() {
  submitted.value = true;

  if (
    !form.value.code.trim() ||
    !form.value.regionName.trim() ||
    !form.value.countryCode.trim() ||
    !form.value.englishName.trim()
  ) {
    return;
  }

  isSaving.value = true;
  try {
    await mgr.save(form.value);
    visible.value = false;
    emit('saved');
  } catch {
    toast.add({
      severity: 'error',
      summary: '失败',
      detail: '保存失败，请重试',
      life: 3000,
    });
  } finally {
    isSaving.value = false;
  }
}
</script>

<template>
  <PrimeDialog
    v-model:visible="visible"
    :header="isEdit ? '编辑区号' : '新增区号'"
    :modal="true"
    :style="{ width: '560px' }"
    :draggable="false"
  >
    <div class="flex flex-col gap-4">
      <div class="flex gap-4">
        <div class="flex flex-1 flex-col gap-1">
          <label class="text-sm font-medium">
            区号 <span class="text-red-500">*</span>
          </label>
          <PrimeInputText
            v-model="form.code"
            placeholder="如 86"
            :invalid="submitted && !form.code.trim()"
          />
          <small v-if="submitted && !form.code.trim()" class="text-red-500"
            >请输入区号</small
          >
        </div>
        <div class="flex flex-1 flex-col gap-1">
          <label class="text-sm font-medium">
            国家代码 <span class="text-red-500">*</span>
          </label>
          <PrimeInputText
            v-model="form.countryCode"
            placeholder="如 CN"
            maxlength="2"
            class="uppercase"
            :invalid="submitted && !form.countryCode.trim()"
            @input="form.countryCode = form.countryCode.toUpperCase()"
          />
          <small
            v-if="submitted && !form.countryCode.trim()"
            class="text-red-500"
            >请输入国家代码</small
          >
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">
          地区名称 <span class="text-red-500">*</span>
        </label>
        <PrimeInputText
          v-model="form.regionName"
          placeholder="如 中国"
          :invalid="submitted && !form.regionName.trim()"
        />
        <small v-if="submitted && !form.regionName.trim()" class="text-red-500"
          >请输入地区名称</small
        >
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">
          英文名称 <span class="text-red-500">*</span>
        </label>
        <PrimeInputText
          v-model="form.englishName"
          placeholder="如 China"
          :invalid="submitted && !form.englishName.trim()"
        />
        <small v-if="submitted && !form.englishName.trim()" class="text-red-500"
          >请输入英文名称</small
        >
      </div>

      <div class="flex gap-4">
        <div class="flex flex-1 flex-col gap-1">
          <label class="text-sm font-medium">大洲</label>
          <PrimeSelect
            v-model="form.continent"
            :options="mgr.continentOptions"
            option-label="label"
            option-value="value"
          />
        </div>
        <div class="flex flex-1 flex-col gap-1">
          <label class="text-sm font-medium">排序权重</label>
          <PrimeInputNumber
            v-model="form.sort"
            :min="0"
            :max="999"
            show-buttons
            fluid
          />
        </div>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">备注</label>
        <PrimeTextarea
          v-model="form.remark"
          placeholder="可选备注信息"
          rows="2"
          auto-resize
        />
      </div>
    </div>

    <template #footer>
      <PrimeButton
        label="取消"
        icon="pi pi-times"
        severity="secondary"
        text
        @click="visible = false"
      />
      <PrimeButton
        label="保存"
        icon="pi pi-check"
        :loading="isSaving"
        @click="handleSave"
      />
    </template>
  </PrimeDialog>
</template>
