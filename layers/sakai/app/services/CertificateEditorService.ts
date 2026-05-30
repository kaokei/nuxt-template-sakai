import { CertificateService } from '@sakai/services/CertificateService';
import type {
  CertificateTemplate,
  ImageElement,
  TemplateElement,
  TextElement,
} from '@sakai/types/certificate';

let elementCounter = 0;
function genElementId(): string {
  return `el-${Date.now()}-${++elementCounter}`;
}

@Injectable()
export class CertificateEditorService {
  @Inject(CertificateService)
  private certService!: CertificateService;

  template: CertificateTemplate | null = null;
  loading = false;
  isDirty = false;
  isNew = false;

  selectedElementId: string | null = null;
  get selectedElement(): TemplateElement | undefined {
    if (!this.template || !this.selectedElementId) return undefined;
    return this.template.elements.find((e) => e.id === this.selectedElementId);
  }
  get elements(): TemplateElement[] {
    return this.template?.elements ?? [];
  }

  renderTick = 0;

  triggerRerender(): void {
    this.renderTick++;
  }

  async loadTemplate(id: string): Promise<void> {
    this.loading = true;
    try {
      if (id === 'new') {
        this.isNew = true;
        this.template = {
          id: '',
          name: '',
          description: '',
          category: 'certificate',
          backgroundUrl: '',
          width: 1200,
          height: 800,
          elements: [],
          createdAt: '',
          updatedAt: '',
        };
      } else {
        this.isNew = false;
        this.template = await this.certService.getById(id);
      }
      this.selectedElementId = null;
      this.isDirty = false;
    } finally {
      this.loading = false;
    }
  }

  addTextElement(): void {
    if (!this.template) return;
    const el: TextElement = {
      type: 'text',
      id: genElementId(),
      name: '新文字',
      x: 100,
      y: 100 + this.template.elements.length * 50,
      width: 200,
      fontSize: 24,
      fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      color: '#333333',
      fontWeight: 'normal',
      textAlign: 'left',
      verticalAlign: 'top',
      lineHeight: 1.5,
    };
    this.template.elements.push(el);
    this.selectedElementId = el.id;
    this.isDirty = true;
    this.triggerRerender();
  }

  addImageElement(): void {
    if (!this.template) return;
    const el: ImageElement = {
      type: 'image',
      id: genElementId(),
      name: '新图片',
      x: 100,
      y: 100 + this.template.elements.length * 50,
      width: 120,
      height: 120,
      fit: 'contain',
    };
    this.template.elements.push(el);
    this.selectedElementId = el.id;
    this.isDirty = true;
    this.triggerRerender();
  }

  updateElement(id: string, patch: Partial<TemplateElement>): void {
    if (!this.template) return;
    const idx = this.template.elements.findIndex((e) => e.id === id);
    if (idx === -1) return;
    this.template.elements[idx] = {
      ...this.template.elements[idx],
      ...patch,
    } as TemplateElement;
    this.isDirty = true;
    this.triggerRerender();
  }

  removeElement(id: string): void {
    if (!this.template) return;
    this.template.elements = this.template.elements.filter((e) => e.id !== id);
    if (this.selectedElementId === id) {
      this.selectedElementId = null;
    }
    this.isDirty = true;
    this.triggerRerender();
  }

  selectElement(id: string | null): void {
    this.selectedElementId = id;
    this.triggerRerender();
  }

  getRenderValues(): Record<string, string> {
    const values: Record<string, string> = {};
    for (const el of this.elements) {
      if (el.defaultValue) {
        values[el.id] = el.defaultValue;
      }
    }
    return values;
  }

  async save(): Promise<CertificateTemplate> {
    if (!this.template) throw new Error('没有模板数据');
    const data = {
      name: this.template.name,
      description: this.template.description,
      category: this.template.category,
      backgroundUrl: this.template.backgroundUrl,
      width: this.template.width,
      height: this.template.height,
      elements: this.template.elements,
    };
    let result: CertificateTemplate;
    if (this.isNew) {
      result = await this.certService.create(data);
    } else {
      result = await this.certService.update(this.template.id, data);
    }
    this.template = result;
    this.isDirty = false;
    this.isNew = false;
    return result;
  }
}
