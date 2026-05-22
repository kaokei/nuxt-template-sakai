import { AnnouncementService } from '@sakai/services/AnnouncementService';
import type {
  DataTablePageEvent,
  DataTableSortEvent,
} from 'primevue/datatable';
import type { Announcement } from '~/types/announcement';

@Injectable()
export class AnnouncementMgrService {
  @Inject(AnnouncementService)
  announcementService!: AnnouncementService;

  announcements: Announcement[] = [];
  totalRecords = 0;
  loading = false;

  page = 1;
  pageSize = 10;
  sortField = 'createdAt';
  sortOrder = '-1';
  searchParams: Record<string, any> = {};

  formDialogVisible = false;
  editData: Announcement | null = null;
  isEdit = false;

  readonly statusLabels: Record<string, string> = {
    draft: '草稿',
    scheduled: '定时',
    published: '已发布',
    archived: '已下架',
  };

  getStatusSeverity(
    status: string,
  ): 'info' | 'warn' | 'success' | 'secondary' | 'danger' {
    const map: Record<
      string,
      'info' | 'warn' | 'success' | 'secondary' | 'danger'
    > = {
      draft: 'info',
      scheduled: 'warn',
      published: 'success',
      archived: 'secondary',
    };
    return map[status] || 'info';
  }

  formatDateTime(date: string): string {
    if (!date) return '--';
    const d = new Date(date);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${y}-${m}-${day} ${h}:${min}`;
  }

  async loadAnnouncements(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.announcementService.queryAnnouncements({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
        sortField: this.sortField,
        sortOrder: this.sortOrder,
      });
      this.announcements = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  @autobind
  onSearch(params: Record<string, any>): void {
    this.searchParams = params;
    this.page = 1;
    this.loadAnnouncements();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadAnnouncements();
  }

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadAnnouncements();
  }

  @autobind
  onSort(event: DataTableSortEvent): void {
    this.sortField = event.sortField as string;
    this.sortOrder = event.sortOrder !== null ? String(event.sortOrder) : '1';
    this.loadAnnouncements();
  }

  @autobind
  openNew(): void {
    this.editData = null;
    this.isEdit = false;
    this.formDialogVisible = true;
  }

  @autobind
  openEdit(announcement: Announcement): void {
    this.editData = { ...announcement };
    this.isEdit = true;
    this.formDialogVisible = true;
  }

  @autobind
  onSaved(): { success: boolean; isEdit: boolean } {
    const isEdit = this.isEdit;
    this.loadAnnouncements();
    return { success: true, isEdit };
  }

  async publish(id: string): Promise<void> {
    await this.announcementService.publishAnnouncement(id);
    this.loadAnnouncements();
  }

  async archive(id: string): Promise<void> {
    await this.announcementService.archiveAnnouncement(id);
    this.loadAnnouncements();
  }

  async cancelSchedule(id: string): Promise<void> {
    await this.announcementService.updateAnnouncement(id, {
      status: 'draft',
      scheduledAt: undefined,
    } as any);
    this.loadAnnouncements();
  }
}
