import { fakerZH_CN as faker } from '@faker-js/faker';

export interface FeatureFlagItem {
  key: string;
  name: string;
  description: string;
  type: 'boolean' | 'multivariate';
  tags: string[];
  owner: string;
  status: 'active' | 'archived';
  createdAt: string;
  updatedAt: string;
  rules: unknown[];
}

export interface FlagRuleItem {
  flagKey: string;
  environment: 'dev' | 'staging' | 'prod';
  strategy: 'off' | 'on' | 'gradual' | 'whitelist';
  rolloutPercent: number;
  userIds: number[];
  updatedAt: string;
}

faker.seed(2026);

const TAG_OPTIONS = [
  'order',
  'payment',
  'user-center',
  'search',
  'notification',
  'experiment',
  'release',
  'beta',
  'kill-switch',
];

const OWNERS = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十'];

const FLAG_NAMES = [
  'new_checkout',
  'dark_mode_v2',
  'ai_recommend',
  'bulk_export',
  'live_chat',
  'subscription_flow',
  'new_onboarding',
  'advanced_search',
  'social_login',
  'push_notification',
  'payment_split',
  'ab_test_homepage',
];

const FLAG_DESCRIPTIONS = [
  '新版本结算流程，提供更流畅的购买体验',
  '深色模式升级版，支持自动切换和自定义主题',
  'AI 商品推荐，基于用户行为智能推荐',
  '批量导出功能，支持 Excel 和 CSV 格式',
  '实现在线客服聊天功能',
  '订阅付费流程优化',
  '新版用户引导流程',
  '高级搜索功能，支持多维度筛选',
  '第三方社交账号登录',
  '推送通知功能',
  '分期付款功能',
  '首页 A/B 测试实验',
];

export function generateFeatureFlags(count = 12): FeatureFlagItem[] {
  return Array.from({ length: count }, (_, i) => {
    const createdAt = faker.date.past({ years: 1 });
    const isMultivariate = i === 0;
    const type: 'boolean' | 'multivariate' = isMultivariate
      ? 'multivariate'
      : 'boolean';

    return {
      key: FLAG_NAMES[i] ?? `flag_${i}`,
      name: (FLAG_NAMES[i] ?? `flag_${i}`)
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      description: FLAG_DESCRIPTIONS[i] || '',
      type,
      tags: faker.helpers.arrayElements(TAG_OPTIONS, { min: 1, max: 3 }),
      owner: faker.helpers.arrayElement(OWNERS),
      status: 'active' as const,
      createdAt: createdAt.toISOString(),
      updatedAt: faker.date.recent().toISOString(),
      rules: [],
    };
  });
}

export function generateFlagRules(flags: FeatureFlagItem[]): FlagRuleItem[] {
  const rules: FlagRuleItem[] = [];

  // Prod 策略分布：4 on, 3 off, 3 gradual, 2 whitelist
  const prodConfigs: Array<{
    strategy: 'on' | 'off' | 'gradual' | 'whitelist';
    rolloutPercent?: number;
    userIds?: number[];
  }> = [
    { strategy: 'on' },
    { strategy: 'on' },
    { strategy: 'on' },
    { strategy: 'on' },
    { strategy: 'off' },
    { strategy: 'off' },
    { strategy: 'off' },
    { strategy: 'gradual', rolloutPercent: 25 },
    { strategy: 'gradual', rolloutPercent: 50 },
    { strategy: 'gradual', rolloutPercent: 75 },
    { strategy: 'whitelist', userIds: [9527, 1001, 1002] },
    { strategy: 'whitelist', userIds: [9527, 1001, 1002] },
  ];

  for (const flag of flags) {
    const flagIndex = flags.indexOf(flag);
    const prodConfig = prodConfigs[flagIndex % prodConfigs.length]!;
    // Dev: always on
    rules.push({
      flagKey: flag.key,
      environment: 'dev' as const,
      strategy: 'on' as const,
      rolloutPercent: 100,
      userIds: [],
      updatedAt: faker.date.recent().toISOString(),
    });

    // Staging: always on
    rules.push({
      flagKey: flag.key,
      environment: 'staging' as const,
      strategy: 'on' as const,
      rolloutPercent: 100,
      userIds: [],
      updatedAt: faker.date.recent().toISOString(),
    });

    // Prod: varies
    rules.push({
      flagKey: flag.key,
      environment: 'prod' as const,
      strategy: prodConfig.strategy,
      rolloutPercent:
        prodConfig.rolloutPercent ?? (prodConfig.strategy === 'on' ? 100 : 0),
      userIds: prodConfig.userIds ?? [],
      updatedAt: faker.date.recent().toISOString(),
    });
  }

  return rules;
}

export const ALL_FEATURE_FLAGS = generateFeatureFlags();
export const ALL_FLAG_RULES = generateFlagRules(ALL_FEATURE_FLAGS);
export { TAG_OPTIONS };
