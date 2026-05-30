import type { Scene } from '@sakai/types/asset';

export const SCENES: Scene[] = [
  {
    id: 's-1',
    name: 'App发布',
    bucketId: 'bucket-001',
    description: 'App 安装包和更新日志',
    assetCount: 3,
    createdAt: '2025-05-01T08:00:00.000Z',
    updatedAt: '2025-05-28T10:00:00.000Z',
  },
  {
    id: 's-2',
    name: '活动素材',
    bucketId: 'bucket-001',
    description: '营销活动海报和Banner',
    assetCount: 5,
    createdAt: '2025-05-10T09:00:00.000Z',
    updatedAt: '2025-05-27T14:00:00.000Z',
  },
  {
    id: 's-3',
    name: '官网资源',
    bucketId: 'bucket-002',
    description: '官网静态图片和文档',
    assetCount: 3,
    createdAt: '2025-05-15T10:00:00.000Z',
    updatedAt: '2025-05-26T16:00:00.000Z',
  },
];
