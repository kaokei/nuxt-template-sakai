/** 岗位 */
export interface Post {
  id: string;
  name: string;
  code: string;
  sort: number;
  status: 'active' | 'inactive';
  createTime: string;
  remark: string;
}
