import { useSessionStorage } from '@vueuse/core';

export function useToolConfig<T extends object>(config: T) {
  const route = useRoute();
  const routeName = (route.name as string) || route.fullPath;
  const key = `tool-config-${routeName}`;
  return useSessionStorage(key, config, { initOnMounted: true });
}
