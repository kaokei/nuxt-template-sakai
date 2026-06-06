import type { Asset, MediaBehavior, MimeCategory } from '@sakai/types/asset';
import { HttpResponse, delay, http } from 'msw';
import { ASSETS } from '../data/assets';

let assets: Asset[] = JSON.parse(JSON.stringify(ASSETS)) as Asset[];

function deriveMimeCategory(mimeType: string): MimeCategory {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf' || mimeType.startsWith('text/'))
    return 'document';
  if (
    mimeType === 'application/zip' ||
    mimeType === 'application/gzip' ||
    mimeType.includes('compress')
  )
    return 'archive';
  if (mimeType.startsWith('application/vnd.')) return 'document';
  return 'other';
}

function randomMd5(): string {
  return Array.from({ length: 32 }, () =>
    Math.floor(Math.random() * 16).toString(16),
  ).join('');
}

function buildAssetFromUpload(sceneId: string, formData: FormData): Asset {
  const file = formData.get('file') as File | null;
  const title = (formData.get('title') as string) ?? '';
  const description = (formData.get('description') as string) ?? '';
  const tagsRaw = (formData.get('tags') as string) ?? '';
  const tags = tagsRaw
    ? tagsRaw
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean)
    : [];
  const behaviorValue = (formData.get('behavior') as string) ?? 'attachment';
  const behavior: MediaBehavior =
    behaviorValue === 'inline' ? 'inline' : 'attachment';
  const fileName = file?.name ?? 'unknown';
  const mimeType = file?.type ?? 'application/octet-stream';
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    sceneId,
    fileName,
    title,
    description,
    url: `https://mock-cdn.example.com/uploads/${crypto.randomUUID()}`,
    md5: randomMd5(),
    fileSize: file?.size ?? Math.floor(Math.random() * 10_000_000) + 10_000,
    mimeType,
    tags,
    behavior,
    createdAt: now,
    updatedAt: now,
  };
}

export const assetHandlers = [
  http.get('/api/scenes/:sceneId/assets', async ({ params, request }) => {
    const url = new URL(request.url);
    const keyword = url.searchParams.get('keyword')?.toLowerCase();
    const tagsParam = url.searchParams.get('tags');
    const mimeCategory = url.searchParams.get('mimeCategory');

    let filtered = assets.filter((a) => a.sceneId === params.sceneId);

    if (keyword) {
      filtered = filtered.filter(
        (a) =>
          a.fileName.toLowerCase().includes(keyword) ||
          (a.title ?? '').toLowerCase().includes(keyword),
      );
    }

    if (tagsParam) {
      const queryTags = tagsParam
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
      if (queryTags.length > 0) {
        filtered = filtered.filter((a) =>
          a.tags.some((t: string) => queryTags.includes(t)),
        );
      }
    }

    if (mimeCategory) {
      filtered = filtered.filter(
        (a) => deriveMimeCategory(a.mimeType) === mimeCategory,
      );
    }

    await delay(200);
    return HttpResponse.json(filtered);
  }),

  http.post('/api/scenes/:sceneId/assets', async ({ params, request }) => {
    const formData = await request.formData();
    const created = buildAssetFromUpload(params.sceneId as string, formData);
    assets.unshift(created);
    await delay(300);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.post(
    '/api/scenes/:sceneId/assets/batch',
    async ({ params, request }) => {
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];
      const tagsRaw = (formData.get('tags') as string) ?? '';
      const tags = tagsRaw
        ? tagsRaw
            .split(',')
            .map((t: string) => t.trim())
            .filter(Boolean)
        : [];
      const behaviorValue =
        (formData.get('behavior') as string) ?? 'attachment';
      const behavior: MediaBehavior =
        behaviorValue === 'inline' ? 'inline' : 'attachment';

      const now = new Date().toISOString();
      const created: Asset[] = files.map((file) => {
        const mimeType = file.type || 'application/octet-stream';
        return {
          id: crypto.randomUUID(),
          sceneId: params.sceneId as string,
          fileName: file.name,
          title: '',
          description: '',
          url: `https://mock-cdn.example.com/uploads/${crypto.randomUUID()}`,
          md5: randomMd5(),
          fileSize: file.size,
          mimeType,
          tags,
          behavior,
          createdAt: now,
          updatedAt: now,
        };
      });
      assets.unshift(...created);
      await delay(400);
      return HttpResponse.json(created, { status: 201 });
    },
  ),

  http.get('/api/scenes/:sceneId/assets/tags', async ({ params }) => {
    const sceneAssets = assets.filter((a) => a.sceneId === params.sceneId);
    const tagSet = new Set<string>();
    for (const a of sceneAssets) {
      for (const t of a.tags) {
        tagSet.add(t);
      }
    }
    await delay(150);
    return HttpResponse.json([...tagSet]);
  }),

  http.post('/api/scenes/:sceneId/assets/batch-delete', async ({ request }) => {
    const { ids } = (await request.json()) as { ids: string[] };
    const before = assets.length;
    assets = assets.filter((a) => !ids.includes(a.id));
    await delay(300);
    return HttpResponse.json({
      deleted: before - assets.length,
    });
  }),

  http.put('/api/scenes/:sceneId/assets/:id', async ({ params, request }) => {
    const formData = await request.formData();
    const body: Partial<Asset> = {};
    const title = formData.get('title');
    if (title && typeof title === 'string') body.title = title;
    const description = formData.get('description');
    if (description && typeof description === 'string')
      body.description = description;
    const tagsRaw = formData.get('tags');
    if (tagsRaw && typeof tagsRaw === 'string') {
      body.tags = tagsRaw
        .split(',')
        .map((t: string) => t.trim())
        .filter(Boolean);
    }
    const behavior = formData.get('behavior');
    if (behavior && typeof behavior === 'string') {
      body.behavior = behavior === 'inline' ? 'inline' : 'attachment';
    }

    const idx = assets.findIndex(
      (a) => a.id === params.id && a.sceneId === params.sceneId,
    );
    if (idx === -1)
      return HttpResponse.json({ message: '素材不存在' }, { status: 404 });

    const clean = Object.fromEntries(
      Object.entries(body).filter(([, v]) => v !== undefined),
    );
    assets[idx] = {
      ...assets[idx]!,
      ...clean,
      id: params.id as string,
      sceneId: params.sceneId as string,
      updatedAt: new Date().toISOString(),
    } as Asset;
    await delay(300);
    return HttpResponse.json(assets[idx]);
  }),

  http.delete('/api/scenes/:sceneId/assets/:id', async ({ params }) => {
    const idx = assets.findIndex(
      (a) => a.id === params.id && a.sceneId === params.sceneId,
    );
    if (idx === -1)
      return HttpResponse.json({ message: '素材不存在' }, { status: 404 });
    assets.splice(idx, 1);
    await delay(200);
    return new HttpResponse(undefined, { status: 204 });
  }),
];
