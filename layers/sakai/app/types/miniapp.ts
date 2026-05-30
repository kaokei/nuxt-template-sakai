// 小程序码/链接生成工具 — 类型定义

/** 生成类型 */
export type GenerateType =
  | 'wxacode'
  | 'wxacodeunlimit'
  | 'qrcode'
  | 'scheme'
  | 'urllink';

/** 小程序信息 */
export interface MiniApp {
  id: string;
  name: string;
  appid: string;
}

/** 生成请求参数 */
export interface GenerateParams {
  appId: string;
  type: GenerateType;
  path: string;
  query?: string;
  envVersion?: 'release' | 'trial' | 'develop';
  width?: number;
  isHyaline?: boolean;
  scene?: string;
  expireType?: string;
}

/** 生成结果（API 返回） */
export interface GenerateResult {
  type: GenerateType;
  contentType: 'image/png' | 'text/plain';
  imageUrl?: string;
  link?: string;
}

/** 会话生成记录 */
export interface GenerateRecord {
  id: string;
  type: GenerateType;
  miniAppName: string;
  params: Record<string, unknown>;
  result: GenerateResult;
  createdAt: number;
}

/** 生成类型标签映射 */
export const GENERATE_TYPE_LABELS: Record<GenerateType, string> = {
  wxacode: '小程序码（有限）',
  wxacodeunlimit: '小程序码（无限）',
  qrcode: '普通二维码',
  scheme: 'URL Scheme',
  urllink: 'URL Link',
};
