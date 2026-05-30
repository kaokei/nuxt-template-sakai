import type { Bucket } from '@sakai/types/asset';

export const BUCKETS: Bucket[] = [
  {
    id: 'bucket-001',
    name: 'my-cdn-prod',
    region: '华东1（杭州）',
  },
  {
    id: 'bucket-002',
    name: 'my-cdn-test',
    region: '华北2（北京）',
  },
];
