import { HttpResponse, delay, http } from 'msw';
import { DEPT_LIST } from '../data/depts';
import type { Dept } from '../data/depts';

let depts: Dept[] = JSON.parse(JSON.stringify(DEPT_LIST)) as Dept[];

function deleteRecursive(id: string): number {
  let count = 0;
  const children = depts.filter((d) => d.parentId === id);
  for (const child of children) {
    count += deleteRecursive(child.id);
  }
  const idx = depts.findIndex((d) => d.id === id);
  if (idx !== -1) {
    depts.splice(idx, 1);
    count++;
  }
  return count;
}

function getAllDescendantIds(id: string): string[] {
  const children = depts.filter((d) => d.parentId === id);
  return [id, ...children.flatMap((child) => getAllDescendantIds(child.id))];
}

function buildParentOptions(
  deptList: Dept[],
): { label: string; value: string }[] {
  const childrenMap = new Map<string | null, Dept[]>();
  for (const d of deptList) {
    const key = d.parentId;
    if (!childrenMap.has(key)) {
      childrenMap.set(key, []);
    }
    childrenMap.get(key)!.push(d);
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

/** 获取指定部门的所有祖先 ID */
function getAncestorIds(id: string, list: Dept[]): string[] {
  const ancestors: string[] = [];
  let current = list.find((d) => d.id === id);
  while (current?.parentId) {
    ancestors.push(current.parentId);
    current = list.find((d) => d.id === current!.parentId);
  }
  return ancestors;
}

export const deptHandlers = [
  // 查询部门列表（扁平数组）
  http.get('/api/depts', async ({ request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword');

    let result = [...depts];

    if (keyword) {
      const kw = keyword.toLowerCase();
      const matched = result.filter((d) => d.name.toLowerCase().includes(kw));
      const keepIds = new Set(matched.map((d) => d.id));
      // 补全祖先节点，确保匹配的子节点在树中可见
      for (const d of matched) {
        for (const ancestorId of getAncestorIds(d.id, result)) {
          keepIds.add(ancestorId);
        }
      }
      result = result.filter((d) => keepIds.has(d.id));
    }

    await delay(200);
    return HttpResponse.json({ data: result });
  }),

  // 父级部门选项（必须在 /:id 之前）
  // ⚠️ 必须在 /api/depts/:id 之前，避免 options 被当作 id 匹配
  http.get('/api/depts/options', async () => {
    const parentOptions = buildParentOptions(depts);
    const deptOptions = depts.map((d) => ({ label: d.name, value: d.id }));
    await delay(150);
    return HttpResponse.json({ data: { parentOptions, deptOptions } });
  }),

  // 查询单条部门
  http.get('/api/depts/:id', async ({ params }) => {
    const dept = depts.find((d) => d.id === params.id);
    await delay(200);
    if (!dept)
      return HttpResponse.json({ message: '部门不存在' }, { status: 404 });
    return HttpResponse.json(dept);
  }),

  // 新增部门
  http.post('/api/depts', async ({ request }) => {
    const body = (await request.json()) as Omit<Dept, 'id' | 'createTime'>;
    const now = new Date().toISOString();
    const created: Dept = {
      id: crypto.randomUUID(),
      name: body.name ?? '',
      parentId: body.parentId ?? null,
      leader: body.leader ?? '',
      leaderId: body.leaderId ?? '',
      phone: body.phone ?? '',
      email: body.email ?? '',
      order: body.order ?? 0,
      status: body.status ?? 'active',
      createTime: now,
      remark: body.remark ?? '',
    };
    depts.push(created);
    await delay(400);
    return HttpResponse.json(created, { status: 201 });
  }),

  // 更新部门
  http.put('/api/depts/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Dept>;
    const idx = depts.findIndex((d) => d.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '部门不存在' }, { status: 404 });

    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    depts[idx] = {
      ...depts[idx]!,
      ...clean,
      id: params.id as string,
    } as Dept;
    await delay(400);
    return HttpResponse.json(depts[idx]);
  }),

  // 删除部门（递归删除子节点）
  http.delete('/api/depts/:id', async ({ params }) => {
    const exists = depts.some((d) => d.id === params.id);
    if (!exists)
      return HttpResponse.json({ message: '部门不存在' }, { status: 404 });
    const deletedCount = deleteRecursive(params.id as string);
    await delay(300);
    return HttpResponse.json({ success: true, deletedCount });
  }),

  // 批量删除
  http.post('/api/depts/batch-delete', async ({ request }) => {
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

    const before = depts.length;
    depts = depts.filter((d) => !allIdsToDelete.has(d.id));
    const deletedCount = before - depts.length;

    await delay(400);
    return HttpResponse.json({
      success: true,
      deleted: deletedCount,
      deletedCount,
    });
  }),
];
