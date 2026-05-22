<script lang="ts" setup>
import type { AnnouncementMgrService } from '@sakai/services/AnnouncementMgrService';
import type { AnnouncementStatus } from '~/types/announcement';

const props = defineProps<{
  mgr: AnnouncementMgrService;
}>();

const emit = defineEmits<{
  saved: [];
}>();

const formData = reactive({
  title: '',
  content: '',
  summary: '',
  isPinned: false,
  scheduledAt: null as Date | null,
});

const schedulePopover = ref<{
  toggle: (event: Event) => void;
  hide: () => void;
} | null>(null);
const publishAnchor = ref<HTMLElement | null>(null);
const scheduleVisible = ref(false);

/** 编辑时公告的原始状态；新建时为 null */
const editingStatus = computed<AnnouncementStatus | null>(() => {
  if (props.mgr.isEdit && props.mgr.editData) return props.mgr.editData.status;
  return null;
});

const publishMenuItems = computed(() => [
  {
    label: '定时发布',
    icon: 'pi pi-clock',
    command: () => {
      scheduleVisible.value = true;
      setTimeout(() => {
        const el = publishAnchor.value;
        if (el) {
          schedulePopover.value?.toggle({
            currentTarget: el,
          } as unknown as Event);
        }
      }, 150);
    },
  },
]);

watch(
  () => props.mgr.formDialogVisible,
  (visible) => {
    if (visible) {
      if (props.mgr.editData) {
        formData.title = props.mgr.editData.title;
        formData.content = props.mgr.editData.content;
        formData.summary = props.mgr.editData.summary || '';
        formData.isPinned = props.mgr.editData.isPinned;
        formData.scheduledAt = props.mgr.editData.scheduledAt
          ? new Date(props.mgr.editData.scheduledAt)
          : null;
      } else {
        formData.title = '';
        formData.content = '';
        formData.summary = '';
        formData.isPinned = false;
        formData.scheduledAt = null;
      }
      scheduleVisible.value = false;
    }
  },
);

async function doSave(status: AnnouncementStatus) {
  if (!formData.title.trim() || !formData.content.trim()) return;

  const payload = {
    title: formData.title.trim(),
    content: formData.content.trim(),
    summary: formData.summary.trim(),
    isPinned: formData.isPinned,
    status,
    scheduledAt: formData.scheduledAt
      ? formData.scheduledAt.toISOString()
      : undefined,
  };

  try {
    if (props.mgr.isEdit && props.mgr.editData) {
      await props.mgr.announcementService.updateAnnouncement(
        props.mgr.editData.id,
        payload,
      );
    } else {
      await props.mgr.announcementService.createAnnouncement(payload);
    }
    props.mgr.formDialogVisible = false;
    emit('saved');
  } catch {
    // toast handled by page
  }
}

async function saveDraft() {
  await doSave('draft');
}

async function publishNow() {
  await doSave('published');
}

async function schedulePublish() {
  if (!formData.scheduledAt) return;
  scheduleVisible.value = false;
  schedulePopover.value?.hide();
  await doSave('scheduled');
}

function closeSchedule() {
  scheduleVisible.value = false;
  schedulePopover.value?.hide();
}
</script>

<template>
  <PrimeDialog
    v-model:visible="mgr.formDialogVisible"
    :header="mgr.isEdit ? '编辑公告' : '新建公告'"
    :modal="true"
    :style="{ width: '700px' }"
    :closable="false"
  >
    <div class="flex flex-col gap-4 pt-2">
      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium"
          >标题 <span class="text-red-500">*</span></label
        >
        <PrimeInputText
          v-model="formData.title"
          placeholder="请输入公告标题"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium">摘要</label>
        <PrimeTextarea
          v-model="formData.summary"
          placeholder="简要描述（列表展示用，可选）"
          rows="2"
          class="w-full"
        />
      </div>

      <div class="flex flex-col gap-1">
        <label class="text-sm font-medium"
          >正文 <span class="text-red-500">*</span></label
        >
        <PrimeTextarea
          v-model="formData.content"
          placeholder="请输入公告正文内容"
          rows="8"
          class="w-full"
        />
      </div>

      <div class="flex flex-wrap items-center gap-4">
        <div class="flex items-center gap-2">
          <PrimeToggleSwitch v-model="formData.isPinned" input-id="isPinned" />
          <label for="isPinned" class="text-sm">置顶</label>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-2">
        <PrimeButton
          label="取消"
          icon="pi pi-times"
          severity="secondary"
          outlined
          @click="mgr.formDialogVisible = false"
        />
        <PrimeButton
          v-if="!editingStatus || editingStatus === 'draft'"
          label="保存草稿"
          icon="pi pi-save"
          severity="info"
          outlined
          @click="saveDraft"
        />
        <PrimeButton
          v-if="editingStatus === 'published'"
          label="保存"
          icon="pi pi-check"
          severity="primary"
          @click="publishNow"
        />
        <template v-if="editingStatus !== 'published'">
          <div ref="publishAnchor" class="inline-flex">
            <PrimeSplitButton
              label="发布"
              icon="pi pi-send"
              :model="publishMenuItems"
              severity="primary"
              :disabled="scheduleVisible"
              @click="publishNow"
            />
          </div>
          <PrimePopover ref="schedulePopover">
            <div class="flex flex-col gap-3 p-3">
              <label class="text-sm font-medium">选择发布时间</label>
              <PrimeDatePicker
                v-model="formData.scheduledAt"
                show-time
                hour-format="24"
                date-format="yy-mm-dd"
                placeholder="选择发布时间"
                class="w-56"
              />
              <div class="flex justify-end gap-2">
                <PrimeButton
                  label="取消"
                  size="small"
                  severity="secondary"
                  text
                  @click="closeSchedule"
                />
                <PrimeButton
                  label="确认定时发布"
                  size="small"
                  icon="pi pi-clock"
                  severity="warn"
                  :disabled="!formData.scheduledAt"
                  @click="schedulePublish"
                />
              </div>
            </div>
          </PrimePopover>
        </template>
      </div>
    </template>
  </PrimeDialog>
</template>
