<script lang="ts" setup>
import { PHONE_RULE_TEMPLATES } from '@sakai/services/AreaCodeService';
import { AreaCodeMgrService } from '@sakai/services/AreaCodeMgrService';
import type { AreaCode } from '@sakai/types/area-code';

const visible = defineModel<boolean>('visible', { required: true });

const props = defineProps<{
  target: AreaCode | null;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const mgr = useService(AreaCodeMgrService);
const toast = useToast();

const rule = ref('');
const testNumber = ref('');
const testResult = ref<{ valid: boolean; message: string } | null>(null);
const isSaving = ref(false);
const selectedTemplate = ref('');

const templates = PHONE_RULE_TEMPLATES;

watch(visible, (isVisible) => {
  if (isVisible && props.target) {
    rule.value = props.target.validationRule || '';
    testNumber.value = '';
    testResult.value = null;
    selectedTemplate.value = '';
  }
});

function selectTemplate(templateRule: string) {
  rule.value = templateRule;
  testResult.value = null;
}

function handleTest() {
  if (!rule.value) {
    testResult.value = { valid: false, message: '请先输入验证规则' };
    return;
  }
  if (!testNumber.value) {
    testResult.value = { valid: false, message: '请输入测试号码' };
    return;
  }
  try {
    const regex = new RegExp(rule.value);
    const match = regex.test(testNumber.value);
    testResult.value = match
      ? { valid: true, message: '匹配成功' }
      : { valid: false, message: '不匹配，请检查正则表达式或测试号码' };
  } catch {
    testResult.value = { valid: false, message: '正则表达式语法错误' };
  }
}

async function handleSave() {
  if (!props.target) return;

  // 校验正则语法
  if (rule.value) {
    try {
      new RegExp(rule.value);
    } catch {
      toast.add({
        severity: 'error',
        summary: '错误',
        detail: '正则表达式语法错误',
        life: 3000,
      });
      return;
    }
  }

  isSaving.value = true;
  try {
    await mgr.saveRule(props.target.id, rule.value);
    visible.value = false;
    emit('saved');
  } catch {
    toast.add({
      severity: 'error',
      summary: '失败',
      detail: '保存失败',
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
    header="验证规则配置"
    :modal="true"
    :style="{ width: '560px' }"
    :draggable="false"
  >
    <div v-if="target" class="flex flex-col gap-4">
      <div
        class="border-surface-100 bg-surface-50 flex items-center gap-2 rounded-lg border p-3"
      >
        <span class="text-lg">{{ mgr.getFlagEmoji(target.countryCode) }}</span>
        <span class="font-medium">{{ target.regionName }}</span>
        <span class="text-primary font-mono">+{{ target.code }}</span>
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">预设模板</label>
        <PrimeSelect
          v-model="selectedTemplate"
          :options="templates"
          option-label="label"
          option-value="rule"
          placeholder="选择预设模板或手动输入"
          show-clear
          class="w-full"
          @change="selectTemplate($event.value)"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">正则表达式</label>
        <PrimeInputText
          v-model="rule"
          placeholder="如 ^1[3-9]\d{9}$"
          class="font-mono"
        />
      </div>

      <div class="border-surface-200 rounded-lg border p-3">
        <div class="mb-2 text-sm font-medium">实时测试</div>
        <div class="flex gap-2">
          <PrimeInputText
            v-model="testNumber"
            placeholder="输入测试手机号"
            class="flex-1"
            @keydown.enter="handleTest"
          />
          <PrimeButton
            label="测试"
            icon="pi pi-check"
            size="small"
            @click="handleTest"
          />
        </div>
        <div
          v-if="testResult"
          :class="[
            'mt-2 rounded px-3 py-1.5 text-sm',
            testResult.valid
              ? 'bg-green-50 text-green-700'
              : 'bg-red-50 text-red-700',
          ]"
        >
          {{ testResult.valid ? '✅' : '❌' }} {{ testResult.message }}
        </div>
      </div>

      <div class="text-surface-500 text-xs">
        用户端登录时，将使用此规则验证手机号格式。留空表示不限制格式。
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
