import { HttpResponse, delay, http } from 'msw';
import { nanoid } from 'nanoid';
import { MINI_APP_LIST, createMockQRImage } from '../data/miniapp';

export const miniappHandlers = [
  http.get('/api/miniapps', async () => {
    await delay(300);
    return HttpResponse.json({
      code: 0,
      data: MINI_APP_LIST,
    });
  }),

  http.post('/api/miniapp/generate', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;
    const { type, path, appId } = body;

    if (!appId) {
      return HttpResponse.json(
        { code: 40001, message: '请先选择小程序' },
        { status: 400 },
      );
    }
    if (!path && type !== 'wxacodeunlimit') {
      return HttpResponse.json(
        { code: 40001, message: '页面路径不能为空' },
        { status: 400 },
      );
    }
    if (type === 'wxacodeunlimit' && !body.scene) {
      return HttpResponse.json(
        { code: 40001, message: '无限码需要填写 scene 场景值' },
        { status: 400 },
      );
    }

    await delay(1000);

    const isImage =
      type === 'wxacode' || type === 'wxacodeunlimit' || type === 'qrcode';
    const miniApp = MINI_APP_LIST.find((app) => app.id === (appId as string));

    if (isImage) {
      return HttpResponse.json({
        code: 0,
        data: {
          type,
          imageUrl: createMockQRImage(miniApp?.name ?? '小程序码'),
          contentType: 'image/png',
        },
      });
    }

    return HttpResponse.json({
      code: 0,
      data: {
        type,
        link: `weixin://dl/business/?t=mock_${nanoid(8)}`,
        contentType: 'text/plain',
      },
    });
  }),
];
