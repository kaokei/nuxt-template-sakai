import { FeatureFlagService } from '~/services/feature-flag.service';

export default defineNuxtPlugin(async () => {
  declareRootProviders([FeatureFlagService]);
  const flagService = useRootService(FeatureFlagService);

  // 重试 bootstrap，等待 MSW worker 完全就绪
  let retries = 0;
  const maxRetries = 5;
  const retryDelay = 500;

  while (retries < maxRetries) {
    try {
      await flagService.bootstrap();
      return; // 成功则退出
    } catch (err) {
      retries++;
      if (retries >= maxRetries) {
        console.warn(
          '[FeatureFlag] bootstrap 失败，使用默认空 feature flags',
          err,
        );
        return; // 最终失败后降级，不阻塞应用
      }
      // 等待 MSW worker 就绪后重试
      await new Promise((resolve) => setTimeout(resolve, retryDelay));
    }
  }
});
