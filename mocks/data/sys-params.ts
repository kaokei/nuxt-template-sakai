export interface SysParam {
  id: string;
  name: string;
  key: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
  group: string;
  sort: number;
  remark: string;
  status: 'active' | 'inactive';
  createTime: string;
}

export const SYS_PARAM_LIST: SysParam[] = [
  {
    id: 'param-001',
    name: '系统名称',
    key: 'system.name',
    value: 'Sakai Admin',
    type: 'string',
    group: '系统配置',
    sort: 1,
    remark: '显示在登录页和系统顶部的名称',
    status: 'active',
    createTime: '2024-01-15T08:00:00.000Z',
  },
  {
    id: 'param-002',
    name: '文件上传大小上限(MB)',
    key: 'sys.upload.maxSize',
    value: '10',
    type: 'number',
    group: '文件配置',
    sort: 2,
    remark: '单次上传文件大小不超过此值',
    status: 'active',
    createTime: '2024-02-20T09:30:00.000Z',
  },
  {
    id: 'param-003',
    name: '会话超时时间(分钟)',
    key: 'sys.session.timeout',
    value: '30',
    type: 'number',
    group: '安全配置',
    sort: 3,
    remark: '无操作后自动退出登录的时长',
    status: 'active',
    createTime: '2024-03-10T10:00:00.000Z',
  },
  {
    id: 'param-004',
    name: '用户初始密码',
    key: 'sys.user.defaultPassword',
    value: '123456',
    type: 'string',
    group: '安全配置',
    sort: 4,
    remark: '新用户注册后的默认密码',
    status: 'active',
    createTime: '2024-04-05T14:00:00.000Z',
  },
  {
    id: 'param-005',
    name: '验证码开关',
    key: 'sys.captcha.enabled',
    value: 'true',
    type: 'boolean',
    group: '安全配置',
    sort: 5,
    remark: '是否启用登录验证码',
    status: 'active',
    createTime: '2024-05-18T08:15:00.000Z',
  },
  {
    id: 'param-006',
    name: '日志保留天数',
    key: 'sys.log.retentionDays',
    value: '90',
    type: 'number',
    group: '日志配置',
    sort: 6,
    remark: '操作日志和登录日志的保留天数',
    status: 'active',
    createTime: '2024-06-22T11:45:00.000Z',
  },
  {
    id: 'param-007',
    name: '允许同时在线会话数',
    key: 'sys.session.maxConcurrent',
    value: '3',
    type: 'number',
    group: '安全配置',
    sort: 7,
    remark: '同一账号最多同时在线设备数',
    status: 'inactive',
    createTime: '2024-07-14T09:00:00.000Z',
  },
  {
    id: 'param-008',
    name: '数据备份路径',
    key: 'sys.backup.path',
    value: '/data/backup',
    type: 'string',
    group: '系统配置',
    sort: 8,
    remark: '数据库和文件备份的存储路径',
    status: 'active',
    createTime: '2024-08-30T16:30:00.000Z',
  },
];
