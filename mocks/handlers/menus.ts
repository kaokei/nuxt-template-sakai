import { HttpResponse, delay, http } from 'msw';
import { MENU_LIST } from '../data/menus';
import type { Menu } from '../data/menus';

let menus: Menu[] = JSON.parse(JSON.stringify(MENU_LIST)) as Menu[];

function deleteRecursive(id: string): number {
  let count = 0;
  const children = menus.filter((m) => m.parentId === id);
  for (const child of children) {
    count += deleteRecursive(child.id);
  }
  const idx = menus.findIndex((m) => m.id === id);
  if (idx !== -1) {
    menus.splice(idx, 1);
    count++;
  }
  return count;
}

function getAllDescendantIds(id: string): string[] {
  const children = menus.filter((m) => m.parentId === id);
  return [id, ...children.flatMap((child) => getAllDescendantIds(child.id))];
}

function buildParentOptions(
  menuList: Menu[],
): { label: string; value: string }[] {
  const eligible = menuList.filter((m) => m.type !== 'button');

  const childrenMap = new Map<string | null, Menu[]>();
  for (const m of eligible) {
    const key = m.parentId;
    if (!childrenMap.has(key)) {
      childrenMap.set(key, []);
    }
    childrenMap.get(key)!.push(m);
  }
  for (const [, children] of childrenMap) {
    children.sort((a, b) => a.order - b.order);
  }

  const result: { label: string; value: string }[] = [];

  function flatten(parentId: string | null, depth: number, prefix: string) {
    const children = childrenMap.get(parentId) ?? [];
    for (const child of children) {
      const indent = depth === 0 ? '' : `${prefix}├ `;
      result.push({
        label: `${indent}${child.name}`,
        value: child.id,
      });
      flatten(child.id, depth + 1, `${prefix}│  `);
    }
  }

  flatten(null, 0, '');
  return result;
}

function generateNextId(): string {
  let maxNum = 0;
  for (const m of menus) {
    const match = /^menu-(\d+)$/.exec(m.id);
    if (match) {
      const num = parseInt(match[1]!, 10);
      if (num > maxNum) maxNum = num;
    }
  }
  return `menu-${String(maxNum + 1).padStart(3, '0')}`;
}

export const menuHandlers = [
  // 查询菜单列表（扁平数组）
  http.get('/api/menus', async ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');

    let result = [...menus];

    if (keyword) {
      result = result.filter((m) =>
        m.name.toLowerCase().includes(keyword.toLowerCase()),
      );
    }

    await delay(200);
    return HttpResponse.json({ data: result });
  }),

  // 父级菜单选项（必须在 /:id 之前）
  // ⚠️ 必须在 /api/menus/:id 之前，避免 options 被当作 id 匹配
  http.get('/api/menus/options', async () => {
    const parentOptions = buildParentOptions(menus);
    await delay(150);
    return HttpResponse.json({ data: { parentOptions } });
  }),

  // 查询单条菜单
  http.get('/api/menus/:id', async ({ params }) => {
    const menu = menus.find((m) => m.id === params.id);
    await delay(200);
    if (!menu)
      return HttpResponse.json({ message: '菜单不存在' }, { status: 404 });
    return HttpResponse.json(menu);
  }),

  // 新增菜单
  http.post('/api/menus', async ({ request }) => {
    const body = (await request.json()) as Omit<Menu, 'id' | 'createTime'>;
    const now = new Date().toISOString();
    const created: Menu = {
      id: generateNextId(),
      name: body.name ?? '',
      parentId: body.parentId ?? null,
      type: body.type ?? 'menu',
      icon: body.icon ?? '',
      order: body.order ?? 0,
      route: body.route ?? '',
      component: body.component ?? '',
      permission: body.permission ?? '',
      external: body.external ?? false,
      cache: body.cache ?? true,
      visible: body.visible ?? true,
      status: body.status ?? 'active',
      createTime: now,
    };
    menus.push(created);
    await delay(400);
    return HttpResponse.json(created, { status: 201 });
  }),

  // 更新菜单
  http.put('/api/menus/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Menu>;
    const idx = menus.findIndex((m) => m.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '菜单不存在' }, { status: 404 });

    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    menus[idx] = {
      ...menus[idx]!,
      ...clean,
      id: params.id as string,
    } as Menu;
    await delay(400);
    return HttpResponse.json(menus[idx]);
  }),

  // 删除菜单（递归删除子节点）
  http.delete('/api/menus/:id', async ({ params }) => {
    const exists = menus.some((m) => m.id === params.id);
    if (!exists)
      return HttpResponse.json({ message: '菜单不存在' }, { status: 404 });
    const deletedCount = deleteRecursive(params.id as string);
    await delay(300);
    return HttpResponse.json({ success: true, deletedCount });
  }),

  // 批量删除
  http.post('/api/menus/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };

    // 去重：如果父节点和子节点都在 ids 中，只删除父节点及其子树一次
    const allIdsToDelete = new Set<string>();
    for (const id of ids) {
      // 检查当前 id 是否已被某个父节点覆盖
      const isAlreadyCovered = ids.some(
        (parentId) =>
          parentId !== id && getAllDescendantIds(parentId).includes(id),
      );
      if (!isAlreadyCovered) {
        const descendants = getAllDescendantIds(id);
        for (const d of descendants) {
          allIdsToDelete.add(d);
        }
      }
    }

    const before = menus.length;
    menus = menus.filter((m) => !allIdsToDelete.has(m.id));
    const deletedCount = before - menus.length;

    await delay(400);
    return HttpResponse.json({
      success: true,
      deleted: deletedCount,
      deletedCount,
    });
  }),
];
