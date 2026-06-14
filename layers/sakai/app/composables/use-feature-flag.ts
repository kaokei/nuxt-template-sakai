import { FeatureFlagService } from '@sakai/services/feature-flag.service';
import { UserService } from '@sakai/services/user.service';

export function useFeatureFlag(key: string): ComputedRef<boolean> {
  const flagService = useService(FeatureFlagService);
  const userService = useService(UserService);
  return computed(() => flagService.isEnabled(key, userService.user.userId));
}
