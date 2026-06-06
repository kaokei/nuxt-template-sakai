/** 系统参数 */
export interface SysParam {
  id: string;
  name: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean' | 'json';
  group: string;
  sort: number;
  remark: string;
  status: 'active' | 'inactive';
  createTime: string;
}
