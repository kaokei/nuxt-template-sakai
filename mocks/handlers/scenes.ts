import { HttpResponse, delay, http } from 'msw';
import type { Scene } from '../../layers/sakai/app/types/asset';
import { SCENES } from '../data/scenes';

let scenes: Scene[] = JSON.parse(JSON.stringify(SCENES)) as Scene[];

export const sceneHandlers = [
  http.get('/api/scenes', async () => {
    await delay(200);
    return HttpResponse.json(scenes);
  }),

  http.post('/api/scenes', async ({ request }) => {
    const body = (await request.json()) as {
      name: string;
      bucketId: string;
      description?: string;
    };
    const now = new Date().toISOString();
    const created: Scene = {
      id: crypto.randomUUID(),
      name: body.name,
      bucketId: body.bucketId,
      description: body.description ?? '',
      assetCount: 0,
      createdAt: now,
      updatedAt: now,
    };
    scenes.unshift(created);
    await delay(300);
    return HttpResponse.json(created, { status: 201 });
  }),

  http.put('/api/scenes/:id', async ({ params, request }) => {
    const body = (await request.json()) as Partial<Scene>;
    const idx = scenes.findIndex((s) => s.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '场景不存在' }, { status: 404 });

    const clean = Object.fromEntries(
      Object.entries(body).filter(
        ([key, v]) => key !== 'bucketId' && v !== undefined,
      ),
    );

    scenes[idx] = {
      ...scenes[idx]!,
      ...clean,
      id: params.id as string,
      bucketId: scenes[idx]!.bucketId,
      updatedAt: new Date().toISOString(),
    } as Scene;
    await delay(300);
    return HttpResponse.json(scenes[idx]);
  }),

  http.delete('/api/scenes/:id', async ({ params }) => {
    const idx = scenes.findIndex((s) => s.id === params.id);
    if (idx === -1)
      return HttpResponse.json({ message: '场景不存在' }, { status: 404 });
    scenes.splice(idx, 1);
    await delay(300);
    return HttpResponse.json({ success: true });
  }),
];
