import { AssetService } from '@sakai/services/AssetService';
import type {
  Asset,
  AssetQuery,
  MediaBehavior,
  MimeCategory,
} from '@sakai/types/asset';

const MIME_CATEGORY_MAP: Record<string, MimeCategory> = {
  image: 'image',
  video: 'video',
  audio: 'audio',
};

function getMimeCategory(mimeType: string): MimeCategory {
  const prefix = mimeType.split('/')[0];
  if (prefix && MIME_CATEGORY_MAP[prefix]) return MIME_CATEGORY_MAP[prefix];
  if (mimeType === 'application/pdf' || prefix === 'text') return 'document';
  if (
    mimeType === 'application/zip' ||
    mimeType === 'application/gzip' ||
    mimeType.includes('compress')
  )
    return 'archive';
  if (mimeType.startsWith('application/vnd.')) return 'document';
  return 'other';
}

function getDefaultBehavior(mimeType: string): MediaBehavior {
  const inlineTypes = [
    'image/',
    'video/',
    'audio/',
    'text/',
    'application/pdf',
  ];
  if (inlineTypes.some((t) => mimeType.startsWith(t))) return 'inline';
  return 'attachment';
}

function getBehaviorLabel(behavior: MediaBehavior): string {
  return behavior === 'inline' ? '在线预览' : '触发下载';
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

type FormDataInput = {
  title?: string;
  description?: string;
  tags: string[];
  behavior: MediaBehavior;
};

@Injectable()
export class AssetMgrService {
  @Inject(AssetService)
  private service!: AssetService;

  assets: Asset[] = [];
  loading = false;
  currentSceneId = '';

  searchQuery: AssetQuery = {};
  allTags: string[] = [];
  selectedAssets: Asset[] = [];
  activeMimeCategory: MimeCategory | undefined;

  formDialogVisible = false;
  editData: Asset | null = null;
  isEdit = false;

  deleteDialogVisible = false;
  deleteTarget: Asset | null = null;

  batchUploadDialogVisible = false;
  previewDialogVisible = false;
  previewData: Asset | null = null;

  get getMimeCategory(): (mimeType: string) => MimeCategory {
    return getMimeCategory;
  }

  get getDefaultBehavior(): (mimeType: string) => MediaBehavior {
    return getDefaultBehavior;
  }

  get getBehaviorLabel(): (behavior: MediaBehavior) => string {
    return getBehaviorLabel;
  }

  async loadAssets(sceneId: string): Promise<void> {
    this.currentSceneId = sceneId;
    this.loading = true;
    try {
      this.assets = await this.service.list(sceneId, {
        ...this.searchQuery,
        mimeCategory: this.activeMimeCategory,
      });
      this.allTags = await this.service.getTags(sceneId);
    } finally {
      this.loading = false;
    }
  }

  onSearch(query: AssetQuery): void {
    this.searchQuery = { ...query };
    this.loadAssets(this.currentSceneId);
  }

  onReset(): void {
    this.searchQuery = {};
    this.activeMimeCategory = undefined;
    this.loadAssets(this.currentSceneId);
  }

  onMimeTabChange(category: MimeCategory | undefined): void {
    this.activeMimeCategory = category;
    this.loadAssets(this.currentSceneId);
  }

  openUpload(): void {
    this.editData = null;
    this.isEdit = false;
    this.formDialogVisible = true;
  }

  openEdit(asset: Asset): void {
    this.editData = asset;
    this.isEdit = true;
    this.formDialogVisible = true;
  }

  onFormSaved(): { isEdit: boolean } {
    const result = { isEdit: this.isEdit };
    this.formDialogVisible = false;
    this.loadAssets(this.currentSceneId);
    return result;
  }

  confirmDelete(asset: Asset): void {
    this.deleteTarget = asset;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<void> {
    if (this.deleteTarget) {
      await this.service.delete(this.currentSceneId, this.deleteTarget.id);
    } else if (this.selectedAssets.length > 0) {
      await this.service.batchDelete(
        this.currentSceneId,
        this.selectedAssets.map((a) => a.id),
      );
    }
    this.deleteDialogVisible = false;
    this.deleteTarget = null;
    this.selectedAssets = [];
    this.loadAssets(this.currentSceneId);
  }

  openBatchUpload(): void {
    this.batchUploadDialogVisible = true;
  }

  async onBatchUploaded(count: number): Promise<number> {
    this.batchUploadDialogVisible = false;
    this.loadAssets(this.currentSceneId);
    return count;
  }

  openPreview(asset: Asset): void {
    this.previewData = asset;
    this.previewDialogVisible = true;
  }

  getMaxFileSize(): number {
    return MAX_FILE_SIZE;
  }

  validateFileSize(file: File): boolean {
    return file.size <= MAX_FILE_SIZE;
  }
}
