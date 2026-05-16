import type { Environment, FeatureFlag } from '~/types/feature-flag';

const KEY_FEATURE_FLAGS = 'KEY_FEATURE_FLAGS';

@Injectable()
export class FeatureFlagService {
  private flags: Map<string, FeatureFlag> = new Map();
  private currentEnv: Environment = 'prod';

  public async bootstrap(): Promise<void> {
    const result = await $fetch<FeatureFlag[]>('/api/feature-flags');
    this.flags.clear();
    for (const flag of result) {
      this.flags.set(flag.key, flag);
    }
    try {
      localStorage.setItem(
        KEY_FEATURE_FLAGS,
        JSON.stringify({
          values: Object.fromEntries(this.flags),
          lastFetched: Date.now(),
        }),
      );
    } catch {
      // ignore
    }
  }

  public isEnabled(key: string, userId: number): boolean {
    if (!userId) {
      return false;
    }
    const flag = this.flags.get(key);
    if (!flag) {
      return false;
    }
    const rule = flag.rules.find((r) => r.environment === this.currentEnv);
    if (!rule) {
      return false;
    }
    switch (rule.strategy) {
      case 'on':
        return true;
      case 'off':
        return false;
      case 'whitelist':
        return rule.userIds.includes(userId);
      case 'gradual':
        return this.checkGradual(key, rule.rolloutPercent, userId);
      default:
        return false;
    }
  }

  private checkGradual(
    flagKey: string,
    percent: number,
    userId: number,
  ): boolean {
    const bucket = hash(`${userId}:${flagKey}`) % 100;
    return bucket < percent;
  }
}

function hash(str: string): number {
  let h = 5381;
  for (let i = 0; i < str.length; i++) {
    h = (h << 5) + h + str.charCodeAt(i);
  }
  return h & 0x7fffffff;
}
