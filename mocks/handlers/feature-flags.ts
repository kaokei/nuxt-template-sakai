import { HttpResponse, delay, http } from 'msw';
import type { FeatureFlag } from '../../app/types/feature-flag';
import {
  ALL_FEATURE_FLAGS,
  ALL_FLAG_RULES,
  TAG_OPTIONS,
} from '../data/feature-flags';

let flags = [...ALL_FEATURE_FLAGS];
let rules = [...ALL_FLAG_RULES];

export const featureFlagHandlers = [
  http.get('/api/feature-flags', async ({ request }) => {
    const url = new URL(request.url);
    const env =
      (url.searchParams.get('environment') as 'dev' | 'staging' | 'prod') ||
      'prod';

    const activeFlags = flags.filter((f) => f.status === 'active');

    const result = activeFlags.map((flag) => {
      const flagRules = rules.filter(
        (r) => r.flagKey === flag.key && r.environment === env,
      );
      return {
        ...flag,
        rules: flagRules,
      };
    });

    await delay(300);
    return HttpResponse.json(result);
  }),

  http.get('/api/feature-flags/admin', async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') || 1);
    const pageSize = Number(url.searchParams.get('pageSize') || 10);
    const sortField = url.searchParams.get('sortField') || '';
    const sortOrder = Number(url.searchParams.get('sortOrder') || 1);
    const key = url.searchParams.get('key') || '';
    const name = url.searchParams.get('name') || '';
    const tag = url.searchParams.get('tag') || '';
    const status = url.searchParams.get('status') || '';
    const owner = url.searchParams.get('owner') || '';

    let filtered = [...flags];

    if (key) {
      filtered = filtered.filter((f) =>
        f.key.toLowerCase().includes(key.toLowerCase()),
      );
    }
    if (name) {
      filtered = filtered.filter((f) =>
        f.name.toLowerCase().includes(name.toLowerCase()),
      );
    }
    if (tag) {
      filtered = filtered.filter((f) => f.tags.includes(tag));
    }
    if (status) {
      filtered = filtered.filter((f) => f.status === status);
    }
    if (owner) {
      filtered = filtered.filter((f) =>
        f.owner.toLowerCase().includes(owner.toLowerCase()),
      );
    }

    // 更新时间范围筛选
    const updatedAtFrom = url.searchParams.get('updatedAtFrom');
    const updatedAtTo = url.searchParams.get('updatedAtTo');
    if (updatedAtFrom || updatedAtTo) {
      const fromMs = updatedAtFrom ? Date.parse(updatedAtFrom) : NaN;
      const toMs = updatedAtTo ? Date.parse(updatedAtTo) : NaN;
      filtered = filtered.filter((f) => {
        const c = new Date(f.updatedAt).getTime();
        if (!isNaN(fromMs) && c < fromMs) return false;
        if (!isNaN(toMs) && c > toMs) return false;
        return true;
      });
    }

    if (sortField) {
      filtered.sort((a, b) => {
        const va = (a as unknown as Record<string, unknown>)[sortField];
        const vb = (b as unknown as Record<string, unknown>)[sortField];
        const sa = String(va ?? '');
        const sb = String(vb ?? '');
        return sa.localeCompare(sb, 'zh-CN') * sortOrder;
      });
    }

    const total = filtered.length;
    const start = (page - 1) * pageSize;
    const data = filtered.slice(start, start + pageSize) as FeatureFlag[];

    await delay(300);
    return HttpResponse.json({ data, total });
  }),

  // ⚠️ 必须在 /api/feature-flags/admin/:key 之前，避免 tags 被当作 :key 匹配
  http.get('/api/feature-flags/admin/tags', async () => {
    await delay(300);
    return HttpResponse.json(TAG_OPTIONS);
  }),

  http.get('/api/feature-flags/admin/:key', async ({ params }) => {
    const { key } = params as { key: string };
    const flag = flags.find((f) => f.key === key);

    if (!flag) {
      await delay(300);
      return HttpResponse.json({ message: 'Flag not found' }, { status: 404 });
    }

    const flagRules = rules.filter((r) => r.flagKey === key);

    await delay(300);
    return HttpResponse.json({ ...flag, rules: flagRules });
  }),

  http.post('/api/feature-flags/admin', async ({ request }) => {
    const body = (await request.json()) as Partial<FeatureFlag>;
    const now = new Date().toISOString();

    const newFlag: FeatureFlag = {
      key: body.key || '',
      name: body.name || '',
      description: body.description || '',
      type: body.type || 'boolean',
      tags: body.tags || [],
      owner: body.owner || '',
      status: 'active',
      createdAt: now,
      updatedAt: now,
      rules: [],
    };

    flags.unshift(newFlag);

    const envs: Array<'dev' | 'staging' | 'prod'> = ['dev', 'staging', 'prod'];
    for (const env of envs) {
      rules.push({
        flagKey: newFlag.key,
        environment: env,
        strategy: 'on',
        rolloutPercent: 100,
        userIds: [],
        updatedAt: now,
      });
    }

    await delay(300);
    return HttpResponse.json(newFlag, { status: 201 });
  }),

  http.put('/api/feature-flags/admin/:key', async ({ params, request }) => {
    const { key } = params as { key: string };
    const body = (await request.json()) as Partial<FeatureFlag>;
    const index = flags.findIndex((f) => f.key === key);

    if (index === -1) {
      await delay(300);
      return HttpResponse.json({ message: 'Flag not found' }, { status: 404 });
    }

    const current = flags[index]!;
    const updatedFlag: FeatureFlag = {
      key: current.key,
      name: body.name ?? current.name,
      description: body.description ?? current.description,
      type: body.type ?? current.type,
      tags: body.tags ?? current.tags,
      owner: body.owner ?? current.owner,
      status: body.status ?? current.status,
      createdAt: current.createdAt,
      updatedAt: new Date().toISOString(),
      rules: [],
    };

    flags[index] = updatedFlag;

    await delay(300);
    return HttpResponse.json(updatedFlag);
  }),

  http.delete('/api/feature-flags/admin/:key', async ({ params }) => {
    const { key } = params as { key: string };
    const index = flags.findIndex((f) => f.key === key);

    if (index === -1) {
      await delay(300);
      return HttpResponse.json({ message: 'Flag not found' }, { status: 404 });
    }

    const current = flags[index]!;
    const now = new Date().toISOString();
    flags[index] = {
      ...current,
      status: 'archived' as const,
      updatedAt: now,
    };

    await delay(300);
    return HttpResponse.json({ message: 'Archived successfully' });
  }),

  http.put(
    '/api/feature-flags/admin/:key/rules/:env',
    async ({ params, request }) => {
      const { key, env } = params as { key: string; env: string };
      const body = (await request.json()) as {
        strategy: 'off' | 'on' | 'gradual' | 'whitelist';
        rolloutPercent?: number;
        userIds?: number[];
      };

      const ruleIndex = rules.findIndex(
        (r) => r.flagKey === key && r.environment === env,
      );

      if (ruleIndex === -1) {
        await delay(300);
        return HttpResponse.json(
          { message: 'Rule not found' },
          { status: 404 },
        );
      }

      const current = rules[ruleIndex]!;
      rules[ruleIndex] = {
        flagKey: current.flagKey,
        environment: current.environment,
        strategy: body.strategy,
        rolloutPercent: body.rolloutPercent ?? current.rolloutPercent,
        userIds: body.userIds ?? current.userIds,
        updatedAt: new Date().toISOString(),
      };

      await delay(300);
      return HttpResponse.json(rules[ruleIndex]);
    },
  ),
];
