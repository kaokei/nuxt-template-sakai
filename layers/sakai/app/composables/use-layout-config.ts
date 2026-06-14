import { useLocalStorage } from '@vueuse/core';

export function useLayoutConfig<T>(config: T) {
  const route = useRoute();
  const routeName = (route.name as string) || route.fullPath;
  const key = `layout-config-${routeName}`;
  return useLocalStorage(key, config, { initOnMounted: true });
}
