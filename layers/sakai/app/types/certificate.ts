/** 模板实体 */
export interface CertificateTemplate {
  id: string;
  /** 模板名称 */
  name: string;
  /** 模板描述 */
  description?: string;
  /** 分类：certificate（证书）/ poster（海报） */
  category?: string;
  /** 底图 URL */
  backgroundUrl: string;
  /** 底图宽度（px） */
  width: number;
  /** 底图高度（px） */
  height: number;
  /** 合成元素列表 */
  elements: TemplateElement[];
  /** 创建时间 */
  createdAt: string;
  /** 更新时间 */
  updatedAt: string;
}

/** 合成元素（联合类型） */
export type TemplateElement = TextElement | ImageElement;

/** 文字元素 */
export interface TextElement {
  type: 'text';
  /** 元素唯一 ID */
  id: string;
  /** 显示名，如 "姓名" */
  name: string;
  /** 左上角 X（相对底图，px） */
  x: number;
  /** 左上角 Y（相对底图，px） */
  y: number;
  /** 文本框宽度（px） */
  width: number;
  /** 字号（px） */
  fontSize: number;
  /** 字体 */
  fontFamily: string;
  /** 文字颜色 */
  color: string;
  /** 粗体 */
  fontWeight: 'normal' | 'bold';
  /** 水平对齐 */
  textAlign: 'left' | 'center' | 'right';
  /** 垂直对齐（在文本框内） */
  verticalAlign: 'top' | 'middle' | 'bottom';
  /** 行高倍数 */
  lineHeight: number;
  /** 最大行数（超出截断） */
  maxLines?: number;
  /** 旋转角度（度，0-360） */
  rotation?: number;
  /** 背景色（标签样式），默认不填则透明 */
  backgroundColor?: string;
  /** 背景圆角（px） */
  borderRadius?: number;
  /** 背景内边距（px），支持统一值或四边分别设置 */
  padding?:
    | number
    | { top: number; right: number; bottom: number; left: number };
  /** 数据绑定字段名 */
  bindingKey?: string;
  /** 默认文字（预览用，编辑和合成页初始显示） */
  defaultValue?: string;
}

/** 图片元素 */
export interface ImageElement {
  type: 'image';
  /** 元素唯一 ID */
  id: string;
  /** 显示名，如 "用户二维码" */
  name: string;
  /** 左上角 X（相对底图，px） */
  x: number;
  /** 左上角 Y（相对底图，px） */
  y: number;
  /** 图片显示宽度（px） */
  width: number;
  /** 图片显示高度（px） */
  height: number;
  /** 图片填充模式 */
  fit: 'cover' | 'contain' | 'fill';
  /** 图片圆角（px） */
  borderRadius?: number;
  /** 透明度（0-1） */
  opacity?: number;
  /** 数据绑定字段名 */
  bindingKey?: string;
  /** 默认图片（预览用，base64 格式，编辑和合成页初始显示） */
  defaultValue?: string;
}

/** 分页结果 */
export interface PageResult<T> {
  data: T[];
  total: number;
}

/** 列表查询参数 */
export interface CertificateQuery {
  /** 关键词（搜索名称和描述） */
  keyword?: string;
  /** 分类筛选 */
  category?: string;
  /** 页码 */
  page?: number;
  /** 每页条数 */
  pageSize?: number;
}

/** 模板选项（下拉选择器用） */
export interface CertificateOption {
  label: string;
  value: string;
  category?: string;
}
