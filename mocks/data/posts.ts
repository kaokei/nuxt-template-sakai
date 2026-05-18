export interface Post {
  id: string;
  name: string;
  code: string;
  sort: number;
  status: 'active' | 'inactive';
  createTime: string;
  remark: string;
}

export const POST_LIST: Post[] = [
  {
    id: 'post-001',
    name: '技术总监',
    code: 'chiefTechnologyOfficer',
    sort: 1,
    status: 'active',
    createTime: '2024-01-15T08:00:00.000Z',
    remark: '负责公司技术方向与研发团队管理',
  },
  {
    id: 'post-002',
    name: '前端工程师',
    code: 'frontendEngineer',
    sort: 2,
    status: 'active',
    createTime: '2024-02-20T09:30:00.000Z',
    remark: '负责前端界面开发与性能优化',
  },
  {
    id: 'post-003',
    name: '后端工程师',
    code: 'backendEngineer',
    sort: 3,
    status: 'active',
    createTime: '2024-02-20T09:30:00.000Z',
    remark: '负责服务端业务逻辑与接口开发',
  },
  {
    id: 'post-004',
    name: '测试工程师',
    code: 'qualityAssuranceEngineer',
    sort: 4,
    status: 'active',
    createTime: '2024-03-10T10:00:00.000Z',
    remark: '负责产品质量保障与测试工作',
  },
  {
    id: 'post-005',
    name: '产品经理',
    code: 'productManager',
    sort: 5,
    status: 'active',
    createTime: '2024-04-05T14:00:00.000Z',
    remark: '负责产品规划与需求管理',
  },
  {
    id: 'post-006',
    name: 'UI设计师',
    code: 'uiDesigner',
    sort: 6,
    status: 'active',
    createTime: '2024-05-18T08:15:00.000Z',
    remark: '负责界面视觉设计与交互体验',
  },
  {
    id: 'post-007',
    name: 'HR经理',
    code: 'hrManager',
    sort: 7,
    status: 'active',
    createTime: '2024-06-22T11:45:00.000Z',
    remark: '负责人力资源规划与招聘管理',
  },
  {
    id: 'post-008',
    name: '财务专员',
    code: 'financeSpecialist',
    sort: 8,
    status: 'active',
    createTime: '2024-07-14T09:00:00.000Z',
    remark: '负责财务核算与报表编制',
  },
  {
    id: 'post-009',
    name: '运维工程师',
    code: 'devOpsEngineer',
    sort: 9,
    status: 'active',
    createTime: '2024-08-30T16:30:00.000Z',
    remark: '负责服务器运维与自动化部署',
  },
  {
    id: 'post-010',
    name: '数据分析师',
    code: 'dataAnalyst',
    sort: 10,
    status: 'inactive',
    createTime: '2024-10-08T08:45:00.000Z',
    remark: '负责数据分析与商业智能',
  },
];
