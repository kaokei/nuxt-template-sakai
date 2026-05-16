import { FeatureFlagService } from '~/services/feature-flag.service';

export default defineNuxtPlugin(async () => {
  declareRootProviders([FeatureFlagService]);
  const flagService = useRootService(FeatureFlagService);
  await flagService.bootstrap();
});
