<script lang="ts" setup>
import { useLayout } from '@sakai/components/layout/composables/layout';
import type { MenuItem } from '~/types/menu';

const props = defineProps<{
  items: MenuItem[];
}>();

const route = useRoute();
const router = useRouter();
const { layoutState, toggleTopMenu } = useLayout();

/** 将自定义 MenuItem 转换为 PrimeVue Menubar 所需的模型格式 */
function toPrimeMenuModel(items: MenuItem[]): any[] {
  return items
    .filter((item) => item.visible !== false)
    .map((item) => {
      const model: any = {
        label: item.label,
        icon: item.icon,
        disabled: item.disabled,
        class: item.class,
      };

      // 路由导航：使用 command + router.push
      if (item.to) {
        model.command = () => {
          router.push(item.to!);
          // 导航后关闭移动端菜单
          layoutState.topMenuMobileActive = false;
        };
      }

      // 外链：直接设置 url
      if (item.url) {
        model.url = item.url;
        model.target = item.target;
      }

      // 子菜单递归转换
      if (item.items && item.items.length > 0) {
        model.items = toPrimeMenuModel(item.items);
      }

      return model;
    });
}

/** PrimeVue Menubar 绑定的模型数据 */
const menuModel = computed(() => toPrimeMenuModel(props.items));

/** 判断菜单项是否激活（基于当前路由路径） */
function isItemActive(item: MenuItem): boolean {
  if (item.to && route.path === item.to) return true;
  if (item.to && route.path.startsWith(item.to + '/')) return true;
  if (item.path && route.path.startsWith(item.path)) return true;
  if (item.items) {
    return item.items.some((child) => isItemActive(child));
  }
  return false;
}

/** 监听路由变化，关闭移动端菜单 */
watch(
  () => route.path,
  () => {
    layoutState.topMenuMobileActive = false;
  },
);
</script>

<template>
  <div class="layout-topmenu">
    <!-- 桌面端：水平导航栏 -->
    <div class="layout-topmenu-desktop">
      <PrimeMenubar :model="menuModel" class="layout-topmenu-menubar">
        <template #item="{ item, props, hasSubmenu }">
          <a
            v-bind="props"
            :class="[
              'layout-topmenu-item',
              {
                'layout-topmenu-item-active': isItemActive(
                  (props as any).item?.__originalItem ?? ({} as MenuItem),
                ),
              },
            ]"
          >
            <i
              v-if="item.icon"
              :class="item.icon"
              class="layout-topmenu-icon"
            />
            <span class="layout-topmenu-label">{{ item.label }}</span>
            <i
              v-if="hasSubmenu"
              class="pi pi-angle-down layout-topmenu-submenu-icon"
            />
          </a>
        </template>
      </PrimeMenubar>
    </div>

    <!-- 移动端：下拉面板（由导航栏按钮触发） -->
    <div class="layout-topmenu-mobile">
      <Transition name="layout-topmenu-slide">
        <div
          v-if="layoutState.topMenuMobileActive"
          class="layout-topmenu-mobile-panel"
        >
          <ul class="layout-topmenu-mobile-list">
            <template v-for="item in items" :key="item.label">
              <li
                v-if="item.visible !== false"
                class="layout-topmenu-mobile-item"
              >
                <!-- 有子菜单的项 -->
                <template v-if="item.items && item.items.length > 0">
                  <div
                    class="layout-topmenu-mobile-group"
                    :class="{
                      'layout-topmenu-mobile-group-active': isItemActive(item),
                    }"
                  >
                    <i
                      v-if="item.icon"
                      :class="item.icon"
                      class="layout-topmenu-icon"
                    />
                    <span class="layout-topmenu-label">{{ item.label }}</span>
                  </div>
                  <ul class="layout-topmenu-mobile-children">
                    <li v-for="child in item.items" :key="child.label">
                      <NuxtLink
                        v-if="child.to"
                        :to="child.to"
                        class="layout-topmenu-mobile-link"
                        :class="{
                          'layout-topmenu-mobile-link-active':
                            isItemActive(child),
                        }"
                        @click="toggleTopMenu"
                      >
                        <i
                          v-if="child.icon"
                          :class="child.icon"
                          class="layout-topmenu-icon"
                        />
                        <span>{{ child.label }}</span>
                      </NuxtLink>
                      <a
                        v-else-if="child.url"
                        :href="child.url"
                        :target="child.target"
                        class="layout-topmenu-mobile-link"
                        @click="toggleTopMenu"
                      >
                        <i
                          v-if="child.icon"
                          :class="child.icon"
                          class="layout-topmenu-icon"
                        />
                        <span>{{ child.label }}</span>
                      </a>
                    </li>
                  </ul>
                </template>

                <!-- 无子菜单的路由项 -->
                <NuxtLink
                  v-else-if="item.to"
                  :to="item.to"
                  class="layout-topmenu-mobile-link"
                  :class="{
                    'layout-topmenu-mobile-link-active': isItemActive(item),
                  }"
                  @click="toggleTopMenu"
                >
                  <i
                    v-if="item.icon"
                    :class="item.icon"
                    class="layout-topmenu-icon"
                  />
                  <span class="layout-topmenu-label">{{ item.label }}</span>
                </NuxtLink>

                <!-- 无子菜单的外链 -->
                <a
                  v-else-if="item.url"
                  :href="item.url"
                  :target="item.target"
                  class="layout-topmenu-mobile-link"
                  @click="toggleTopMenu"
                >
                  <i
                    v-if="item.icon"
                    :class="item.icon"
                    class="layout-topmenu-icon"
                  />
                  <span class="layout-topmenu-label">{{ item.label }}</span>
                </a>
              </li>
            </template>
          </ul>
        </div>
      </Transition>

      <!-- 遮罩层 -->
      <Transition name="layout-topmenu-fade">
        <div
          v-if="layoutState.topMenuMobileActive"
          class="layout-topmenu-mask"
          @click="toggleTopMenu"
        />
      </Transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/* ====== 容器 ====== */
.layout-topmenu {
  position: fixed;
  top: 4rem; /* 紧贴 topbar 下方 */
  left: 0;
  width: 100%;
  z-index: 996;
  background-color: var(--surface-card);
  border-bottom: 1px solid var(--surface-border);
}

/* ====== 桌面端水平菜单 ====== */
.layout-topmenu-desktop {
  display: flex;
  padding: 0 2rem;
}

.layout-topmenu-menubar {
  width: 100%;
  border: none !important;
  background: transparent !important;
  padding: 0 !important;
}

/* 覆盖 PrimeVue Menubar 内部样式 */
.layout-topmenu-menubar :deep(.p-menubar-root-list) {
  display: flex;
  gap: 0;
  padding: 0;
  margin: 0;
  list-style: none;
  background: transparent;
}

.layout-topmenu-menubar :deep(.p-menubar-root-list > .p-menubar-item) {
  position: relative;
}

.layout-topmenu-menubar :deep(.p-menubar-item-content) {
  padding: 0 !important;
  border-radius: var(--content-border-radius);
  transition:
    background-color var(--element-transition-duration),
    color var(--element-transition-duration);
}

.layout-topmenu-menubar :deep(.p-menubar-item-content:hover) {
  background-color: var(--surface-hover);
}

/* 菜单项样式 */
.layout-topmenu-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  color: var(--text-color);
  cursor: pointer;
  border-radius: var(--content-border-radius);
  transition:
    background-color var(--element-transition-duration),
    color var(--element-transition-duration);
  white-space: nowrap;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
}

.layout-topmenu-item:hover {
  background-color: var(--surface-hover);
}

.layout-topmenu-item-active {
  color: var(--primary-color);
  font-weight: 700;
}

.layout-topmenu-icon {
  font-size: 1rem;
}

.layout-topmenu-label {
  line-height: 1;
}

.layout-topmenu-submenu-icon {
  font-size: 0.75rem;
  margin-left: 0.25rem;
  opacity: 0.6;
}

/* 下拉子菜单面板 */
.layout-topmenu-menubar :deep(.p-menubar-submenu) {
  min-width: 12rem;
  background-color: var(--surface-overlay);
  border: 1px solid var(--surface-border);
  border-radius: var(--content-border-radius);
  box-shadow:
    0px 3px 5px rgba(0, 0, 0, 0.02),
    0px 0px 2px rgba(0, 0, 0, 0.05),
    0px 1px 4px rgba(0, 0, 0, 0.08);
  padding: 0.5rem 0;
}

.layout-topmenu-menubar :deep(.p-menubar-submenu .p-menubar-item-content) {
  padding: 0 !important;
}

/* ====== 移动端菜单 ====== */
.layout-topmenu-mobile {
  display: none;
  padding: 0 2rem;
  position: relative;
}

.layout-topmenu-hamburger {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 1.25rem;
  color: var(--text-color);
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  transition: background-color var(--element-transition-duration);
}

.layout-topmenu-hamburger:hover {
  background-color: var(--surface-hover);
}

.layout-topmenu-mobile-panel {
  position: fixed;
  top: 4rem;
  left: 0;
  width: 100%;
  background-color: var(--surface-overlay);
  border-bottom: 1px solid var(--surface-border);
  box-shadow:
    0px 3px 5px rgba(0, 0, 0, 0.02),
    0px 0px 2px rgba(0, 0, 0, 0.05),
    0px 1px 4px rgba(0, 0, 0, 0.08);
  padding: 1rem 2rem;
  z-index: 999;
}

.layout-topmenu-mobile-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.layout-topmenu-mobile-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  font-weight: 700;
  color: var(--text-color);
  font-size: 0.857rem;
  text-transform: uppercase;
}

.layout-topmenu-mobile-group-active {
  color: var(--primary-color);
}

.layout-topmenu-mobile-children {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.layout-topmenu-mobile-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem 0.75rem 2rem;
  color: var(--text-color);
  text-decoration: none;
  border-radius: var(--content-border-radius);
  transition:
    background-color var(--element-transition-duration),
    color var(--element-transition-duration);
  font-size: 0.875rem;
}

.layout-topmenu-mobile-link:hover {
  background-color: var(--surface-hover);
}

.layout-topmenu-mobile-link-active {
  color: var(--primary-color);
  font-weight: 700;
}

/* 遮罩层 */
.layout-topmenu-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: var(--maskbg);
  z-index: 998;
}

/* ====== 过渡动画 ====== */
.layout-topmenu-slide-enter-active,
.layout-topmenu-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.05, 0.74, 0.2, 0.99);
}

.layout-topmenu-slide-enter-from,
.layout-topmenu-slide-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}

.layout-topmenu-fade-enter-active,
.layout-topmenu-fade-leave-active {
  transition: opacity 0.2s ease;
}

.layout-topmenu-fade-enter-from,
.layout-topmenu-fade-leave-to {
  opacity: 0;
}

/* ====== 响应式 ====== */
@media (max-width: 991px) {
  .layout-topmenu-desktop {
    display: none;
  }

  .layout-topmenu-mobile {
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
}
</style>
