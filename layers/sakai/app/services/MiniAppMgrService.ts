import { MiniAppService } from '@sakai/services/MiniAppService';
import type {
  GenerateRecord,
  GenerateType,
  MiniApp,
} from '@sakai/types/miniapp';
import { GENERATE_TYPE_LABELS } from '@sakai/types/miniapp';
import { nanoid } from 'nanoid';

@Injectable()
export class MiniAppMgrService {
  @Inject(MiniAppService)
  private service!: MiniAppService;

  miniApps: MiniApp[] = [];
  selectedAppId = '';
  miniAppsLoading = false;

  formPath = '';
  formQuery = '';
  formEnvVersion: 'release' | 'trial' | 'develop' = 'release';
  formWidth = 430;
  formIsHyaline = false;
  formScene = '';
  formExpireType = 'permanent';
  advancedExpanded = false;

  generating = false;
  records: GenerateRecord[] = [];

  get selectedMiniAppName(): string {
    return this.miniApps.find((a) => a.id === this.selectedAppId)?.name ?? '';
  }

  async loadMiniApps(): Promise<void> {
    this.miniAppsLoading = true;
    try {
      this.miniApps = await this.service.getMiniApps();
      if (this.miniApps.length > 0 && !this.selectedAppId) {
        const first = this.miniApps[0];
        if (first) this.selectedAppId = first.id;
      }
    } finally {
      this.miniAppsLoading = false;
    }
  }

  toggleAdvanced(): void {
    this.advancedExpanded = !this.advancedExpanded;
  }

  validateFields(type: GenerateType): string | null {
    if (!this.selectedAppId) return '请先选择小程序';

    if (type === 'wxacodeunlimit') {
      if (!this.formPath) return '页面路径(page)不能为空';
      if (!this.formScene) return '场景值(scene)不能为空';
    } else {
      if (!this.formPath) return '页面路径(path)不能为空';
    }

    if (
      (type === 'wxacode' || type === 'wxacodeunlimit' || type === 'qrcode') &&
      (this.formWidth < 280 || this.formWidth > 1280)
    ) {
      return '二维码宽度必须在 280~1280 之间';
    }

    return null;
  }

  async generate(type: GenerateType): Promise<void> {
    const error = this.validateFields(type);
    if (error) {
      throw new Error(error);
    }

    this.generating = true;
    try {
      const result = await this.service.generate({
        appId: this.selectedAppId,
        type,
        path: this.formPath,
        query: this.formQuery || undefined,
        envVersion: this.formEnvVersion,
        width: this.formWidth,
        isHyaline: this.formIsHyaline,
        scene: this.formScene || undefined,
        expireType: this.formExpireType,
      });

      this.records.unshift({
        id: nanoid(),
        type,
        miniAppName: this.selectedMiniAppName,
        params: { path: this.formPath, query: this.formQuery },
        result,
        createdAt: Date.now(),
      });
    } finally {
      this.generating = false;
    }
  }

  downloadImage(record: GenerateRecord): void {
    if (!record.result.imageUrl) return;
    const link = document.createElement('a');
    link.href = record.result.imageUrl;
    link.download = `qrcode_${record.type}_${Date.now()}.png`;
    link.click();
  }
}
