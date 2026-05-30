import { CertificateService } from '@sakai/services/CertificateService';
import type {
  CertificateQuery,
  CertificateTemplate,
} from '@sakai/types/certificate';
import type { DataTablePageEvent } from 'primevue/datatable';

@Injectable()
export class CertificateMgrService {
  @Inject(CertificateService)
  private certService!: CertificateService;

  templates: CertificateTemplate[] = [];
  totalRecords = 0;
  loading = false;

  page = 1;
  pageSize = 10;
  searchParams: CertificateQuery = {};

  deleteDialogVisible = false;
  deleteTarget: CertificateTemplate | null = null;

  readonly categoryOptions = [
    { label: '证书', value: 'certificate' },
    { label: '海报', value: 'poster' },
  ];
  readonly categoryLabels: Record<string, string> = {
    certificate: '证书',
    poster: '海报',
  };

  async loadTemplates(): Promise<void> {
    this.loading = true;
    try {
      const result = await this.certService.queryList({
        ...this.searchParams,
        page: this.page,
        pageSize: this.pageSize,
      });
      this.templates = result.data;
      this.totalRecords = result.total;
    } finally {
      this.loading = false;
    }
  }

  @autobind
  onSearch(params: CertificateQuery): void {
    this.searchParams = params;
    this.page = 1;
    this.loadTemplates();
  }

  @autobind
  onReset(): void {
    this.searchParams = {};
    this.page = 1;
    this.loadTemplates();
  }

  @autobind
  onPage(event: DataTablePageEvent): void {
    this.page = event.page + 1;
    this.pageSize = event.rows;
    this.loadTemplates();
  }

  @autobind
  confirmDelete(template: CertificateTemplate): void {
    this.deleteTarget = template;
    this.deleteDialogVisible = true;
  }

  async onDeleteConfirm(): Promise<{ success: true; message: string }> {
    if (!this.deleteTarget) throw new Error('未选择要删除的模板');
    const name = this.deleteTarget.name;
    await this.certService.delete(this.deleteTarget.id);
    this.deleteDialogVisible = false;
    this.deleteTarget = null;
    await this.loadTemplates();
    return { success: true, message: `模板"${name}"已删除` };
  }
}
