/** 存储桶 */
export interface Bucket {
  id: string;
  name: string;
  region?: string;
}

/** 场景（用户可见的分组概念） */
export interface Scene {
  id: string;
  name: string;
  bucketId: string;
  description?: string;
  assetCount: number;
  createdAt: string;
  updatedAt: string;
}

/** 素材 */
export interface Asset {
  id: string;
  fileName: string;
  title?: string;
  description?: string;
  tags: string[];
  fileSize: number;
  mimeType: string;
  md5: string;
  behavior: MediaBehavior;
  sceneId: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}

/** 素材查询参数 */
export interface AssetQuery {
  keyword?: string;
  tags?: string[];
  mimeCategory?: MimeCategory;
}

/** 浏览器行为：inline 在线预览，attachment 触发下载 */
export type MediaBehavior = 'inline' | 'attachment';

/** MIME 大类（用于前端快速筛选 Tab） */
export type MimeCategory =
  | 'image'
  | 'document'
  | 'archive'
  | 'video'
  | 'audio'
  | 'other';
