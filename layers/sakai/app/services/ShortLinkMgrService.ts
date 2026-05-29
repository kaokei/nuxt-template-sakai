import { ShortLinkService, isExpired } from '@sakai/services/ShortLinkService';
import type { ShortLink, ShortLinkQuery } from '@sakai/types/short-link';

@Injectable()
export class ShortLinkMgrService {
  @Inject(ShortLinkService)
  private service!: ShortLinkService;

  links: ShortLink[] = [];
  loading = false;
  selectedLinks: ShortLink[] = [];

  searchQuery: ShortLinkQuery = {};
  allCampaigns: string[] = [];

  formDialogVisible = false;
  editData: ShortLink | null = null;
  isEdit = false;

  deleteDialogVisible = false;
  deleteTarget: ShortLink | null = null;

  bulkImportDialogVisible = false;
  batchEditDialogVisible = false;

  qrDialogVisible = false;
  qrData: ShortLink | null = null;

  getStatusLabel(link: ShortLink): string {
    return isExpired(link) ? '已过期' : '有效';
  }

  getStatusSeverity(link: ShortLink): 'success' | 'danger' {
    return isExpired(link) ? 'danger' : 'success';
  }

  getFullShortUrl(code: string): string {
    return `https://t.cn/${code}`;
  }

  async loadLinks(): Promise<void> {
    this.loading = true;
    try {
      this.links = await this.service.list(this.searchQuery);
      this.allCampaigns = await this.service.getAllCampaigns();
    } finally {
      this.loading = false;
    }
  }

  onSearch(query: ShortLinkQuery): void {
    this.searchQuery = { ...query };
    this.loadLinks();
  }

  onReset(): void {
    this.searchQuery = {};
    this.loadLinks();
  }

  openNew(): void {
    this.editData = null;
    this.isEdit = false;
    this.formDialogVisible = true;
  }

  openEdit(link: ShortLink): void {
    this.editData = link;
    this.isEdit = true;
    this.formDialogVisible = true;
  }

  onFormSaved(): { isEdit: boolean } {
    const result = { isEdit: this.isEdit };
    this.formDialogVisible = false;
    this.loadLinks();
    return result;
  }

  confirmDelete(link: ShortLink): void {
    this.deleteTarget = link;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<void> {
    if (this.deleteTarget) {
      await this.service.delete(this.deleteTarget.id);
    } else if (this.selectedLinks.length > 0) {
      await this.service.batchDelete(this.selectedLinks.map((l) => l.id));
    }
    this.deleteDialogVisible = false;
    this.selectedLinks = [];
    this.loadLinks();
  }

  openBulkImport(): void {
    this.bulkImportDialogVisible = true;
  }

  async onBulkImported(
    rows: Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>[],
  ): Promise<number> {
    const result = await this.service.batchCreate(rows);
    this.bulkImportDialogVisible = false;
    this.loadLinks();
    return result.length;
  }

  openBatchEdit(): void {
    if (this.selectedLinks.length === 0) return;
    this.batchEditDialogVisible = true;
  }

  async onBatchEdited(
    data: Partial<Omit<ShortLink, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<void> {
    await this.service.batchUpdate(
      this.selectedLinks.map((l) => l.id),
      data,
    );
    this.batchEditDialogVisible = false;
    this.selectedLinks = [];
    this.loadLinks();
  }

  showQR(link: ShortLink): void {
    this.qrData = link;
    this.qrDialogVisible = true;
  }
}
