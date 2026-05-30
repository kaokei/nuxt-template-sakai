import type {
  GenerateParams,
  GenerateResult,
  MiniApp,
} from '@sakai/types/miniapp';

@Injectable()
export class MiniAppService {
  async getMiniApps(): Promise<MiniApp[]> {
    const res = await $fetch<{ code: number; data: MiniApp[] }>(
      '/api/miniapps',
    );
    return res.data;
  }

  async generate(params: GenerateParams): Promise<GenerateResult> {
    const res = await $fetch<{
      code: number;
      data: GenerateResult;
      message?: string;
    }>('/api/miniapp/generate', {
      method: 'POST',
      body: params,
    });
    if (res.code !== 0) {
      throw new Error(res.message || '生成失败');
    }
    return res.data!;
  }
}
