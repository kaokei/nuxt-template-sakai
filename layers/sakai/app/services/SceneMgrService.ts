import { SceneService } from '@sakai/services/SceneService';
import type { Bucket, Scene } from '@sakai/types/asset';

@Injectable()
export class SceneMgrService {
  @Inject(SceneService)
  private service!: SceneService;

  scenes: Scene[] = [];
  buckets: Bucket[] = [];
  loading = false;

  formDialogVisible = false;
  editData: Scene | null = null;
  isEdit = false;

  deleteDialogVisible = false;
  deleteTarget: Scene | null = null;

  async loadBuckets(): Promise<void> {
    try {
      this.buckets = await this.service.getBuckets();
    } catch {
      this.buckets = [];
    }
  }

  async loadScenes(): Promise<void> {
    this.loading = true;
    try {
      this.scenes = await this.service.list();
    } finally {
      this.loading = false;
    }
  }

  async init(): Promise<void> {
    await this.loadBuckets();
    await this.loadScenes();
  }

  openNew(): void {
    this.editData = null;
    this.isEdit = false;
    this.formDialogVisible = true;
  }

  openEdit(scene: Scene): void {
    this.editData = scene;
    this.isEdit = true;
    this.formDialogVisible = true;
  }

  onFormSaved(): { isEdit: boolean } {
    const result = { isEdit: this.isEdit };
    this.formDialogVisible = false;
    this.loadScenes();
    return result;
  }

  confirmDelete(scene: Scene): void {
    this.deleteTarget = scene;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<void> {
    if (this.deleteTarget) {
      await this.service.delete(this.deleteTarget.id);
    }
    this.deleteDialogVisible = false;
    this.deleteTarget = null;
    this.loadScenes();
  }
}
