<script lang="ts" setup>
import type { TextElement } from '@sakai/types/certificate';

const props = defineProps<{
  element: TextElement;
  isSelected: boolean;
}>();

const emit = defineEmits<{
  select: [id: string | null];
  update: [id: string, patch: Partial<TextElement>];
  remove: [id: string];
}>();

const isExpanded = computed(() => props.isSelected);

function toggleExpand() {
  emit('select', props.isSelected ? null : props.element.id);
}

const fontFamilyOptions = [
  { label: '苹方', value: '"PingFang SC", "Microsoft YaHei", sans-serif' },
  { label: '楷体', value: '"KaiTi", "STKaiti", serif' },
  { label: '宋体', value: '"SimSun", "STSong", serif' },
  { label: '黑体', value: '"SimHei", "STHeiti", sans-serif' },
];

const fontWeightOptions = [
  { label: '常规', value: 'normal' },
  { label: '粗体', value: 'bold' },
];

const textAlignOptions = [
  { label: '左对齐', value: 'left' },
  { label: '居中', value: 'center' },
  { label: '右对齐', value: 'right' },
];

const verticalAlignOptions = [
  { label: '顶部', value: 'top' },
  { label: '居中', value: 'middle' },
  { label: '底部', value: 'bottom' },
];
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
        <i class="pi pi-font text-primary text-sm" />
        <span class="text-sm font-medium">{{ element.name }}</span>
        <PrimeTag value="文字" severity="info" class="text-xs" />
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

      <div class="grid grid-cols-3 gap-2">
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
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">字号（px）</label>
          <PrimeInputNumber
            :model-value="element.fontSize"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { fontSize: v })
            "
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">字体</label>
          <PrimeSelect
            :model-value="element.fontFamily"
            :options="fontFamilyOptions"
            option-label="label"
            option-value="value"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { fontFamily: v })
            "
          />
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">颜色</label>
          <PrimeInputText
            :model-value="element.color"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { color: v })
            "
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">字重</label>
          <PrimeSelect
            :model-value="element.fontWeight"
            :options="fontWeightOptions"
            option-label="label"
            option-value="value"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { fontWeight: v })
            "
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">行高</label>
          <PrimeInputNumber
            :model-value="element.lineHeight"
            :min="0.5"
            :max="3"
            :step="0.1"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { lineHeight: v })
            "
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">水平对齐</label>
          <PrimeSelect
            :model-value="element.textAlign"
            :options="textAlignOptions"
            option-label="label"
            option-value="value"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { textAlign: v })
            "
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">垂直对齐</label>
          <PrimeSelect
            :model-value="element.verticalAlign"
            :options="verticalAlignOptions"
            option-label="label"
            option-value="value"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { verticalAlign: v })
            "
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">旋转角度（°）</label>
          <PrimeInputNumber
            :model-value="element.rotation"
            :min="0"
            :max="360"
            size="small"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { rotation: v ?? undefined })
            "
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">最大行数</label>
          <PrimeInputNumber
            :model-value="element.maxLines"
            :min="1"
            :max="10"
            size="small"
            placeholder="无"
            fluid
            @update:model-value="
              (v) => emit('update', element.id, { maxLines: v ?? undefined })
            "
          />
        </div>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">背景色</label>
          <PrimeInputText
            :model-value="element.backgroundColor"
            placeholder="无"
            size="small"
            fluid
            @update:model-value="
              (v) =>
                emit('update', element.id, { backgroundColor: v || undefined })
            "
          />
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-muted-color text-xs">背景圆角（px）</label>
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
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-muted-color text-xs">背景内边距（px）</label>
        <PrimeInputNumber
          :model-value="
            typeof element.padding === 'number'
              ? element.padding
              : (element.padding as any)?.top
          "
          :min="0"
          size="small"
          fluid
          @update:model-value="
            (v) => emit('update', element.id, { padding: v ?? undefined })
          "
        />
      </div>

      <PrimeDivider class="my-1" />

      <div class="flex flex-col gap-1">
        <label class="text-muted-color text-xs">数据绑定字段名（后端用）</label>
        <PrimeInputText
          :model-value="element.bindingKey"
          placeholder="如 userName"
          size="small"
          fluid
          @update:model-value="
            (v) => emit('update', element.id, { bindingKey: v || undefined })
          "
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-muted-color text-xs">默认文字</label>
        <PrimeInputText
          :model-value="element.defaultValue"
          placeholder="保存后编辑页和合成页直接显示"
          size="small"
          fluid
          @update:model-value="
            (v: string | undefined) =>
              emit('update', element.id, { defaultValue: v || undefined })
          "
        />
      </div>
    </div>
  </div>
</template>
