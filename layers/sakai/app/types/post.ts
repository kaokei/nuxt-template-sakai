/** 岗位（公司级独立实体，不属于特定部门） */
export interface Post {
  id: string;
  name: string;
  code: string;
  sort: number;
  status: 'active' | 'inactive';
  createTime: string;
  remark: string;
}
