<script lang="ts" setup>
import type { ImageElement } from '@sakai/types/certificate';

const props = defineProps<{
  element: ImageElement;
  isSelected: boolean;
}>();

const emit = defineEmits<{
  select: [id: string | null];
  update: [id: string, patch: Partial<ImageElement>];
  remove: [id: string];
}>();

const isExpanded = computed(() => props.isSelected);

function toggleExpand() {
  emit('select', props.isSelected ? null : props.element.id);
}

const fitOptions = [
  { label: '覆盖（cover）', value: 'cover' },
  { label: '包含（contain）', value: 'contain' },
  { label: '拉伸（fill）', value: 'fill' },
];

function onFileSelect(event: { files: File[] }) {
  const file = event.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    emit('update', props.element.id, {
      defaultValue: reader.result as string,
    });
  };
  reader.readAsDataURL(file);
}
</script>

<template>
  <div
    class="rounded-lg border transition-colors"
    :class="isSelected ? 'border-primary bg-primary-50/30' : 'border-surface'"
  >
    <div
      class="flex cursor-pointer items-center justify-between p-3"
      @click="toggleExpand"
    >
      <div class="flex items-center gap-2">
        <i class="pi pi-image text-sm text-orange-500" />
        <span class="text-sm font-medium">{{ element.name }}</span>
        <PrimeTag value="图片" severity="warn" class="text-xs" />
      </div>
      <div class="flex items-center gap-1">
        <PrimeButton
          icon="pi pi-trash"
          size="small"
          severity="danger"
          text
          rounded
          @click.stop="emit('remove', element.id)"
        />
        <i
          class="pi text-muted-color text-xs transition-transform"
          :class="isExpanded ? 'pi-chevron-up' : 'pi-chevron-down'"
        />
      </div>
    </div>

    <div v-if="isExpanded" class="flex flex-col gap-3 px-3 pb-3">
      <div class="flex flex-col gap-1">
        <label class="text-muted-color text-xs">元素名称</label>
        <PrimeInputText
          :model-value="element.name"
          size="small"
          fluid
          @update:model-value="(v) => emit('update', element.id, { name: v })"
        />
      </div>

      <div class="grid grid-cols-4 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">X（px）</label>
          <PrimeInputNumber
            :model-value="element.x"
            size="small"
            fluid
            @update:model-value="(v) => emit('update', element.id, { x: v })"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">Y（px）</label>
          <PrimeInputNumber
            :model-value="element.y"
            size="small"
            fluid
            @update:model-value="(v) => emit('update', element.id, { y: v })"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">宽度（px）</label>
          <PrimeInputNumber
            :model-value="element.width"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { width: v })
            "
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">高度（px）</label>
          <PrimeInputNumber
            :model-value="element.height"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { height: v })
            "
          />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">填充模式</label>
          <PrimeSelect
            :model-value="element.fit"
            :options="fitOptions"
            option-label="label"
            option-value="value"
            size="small"
            fluid
            @update:model-value="(v) => emit('update', element.id, { fit: v })"
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">圆角（px）</label>
          <PrimeInputNumber
            :model-value="element.borderRadius"
            :min="0"
            size="small"
            fluid
            @update:model-value="
              (v) =>
                emit('update', element.id, { borderRadius: v ?? undefined })
            "
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">透明度</label>
          <PrimeInputNumber
            :model-value="element.opacity"
            :min="0"
            :max="1"
            :step="0.1"
            :min-fraction-digits="1"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { opacity: v ?? undefined })
            "
          />
        </div>
      </div>

      <PrimeDivider class="my-1" />

      <div class="flex flex-col gap-1">
        <label class="text-muted-color text-xs">数据绑定字段名（后端用）</label>
        <PrimeInputText
          :model-value="element.bindingKey"
          placeholder="如 qrcode"
          size="small"
          fluid
          @update:model-value="
            (v) => emit('update', element.id, { bindingKey: v || undefined })
          "
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-muted-color text-xs">默认图片</label>
        <div>
          <PrimeFileUpload
            mode="basic"
            accept="image/*"
            custom-upload
            @select="onFileSelect"
          />
        </div>
        <span v-if="element.defaultValue" class="text-xs text-green-600"
          >已设置默认图片</span
        >
      </div>
    </div>
  </div>
</template>
