const ALL_PERMISSIONS = [
  'system:user:list',
  'system:user:add',
  'system:user:edit',
  'system:user:delete',
  'system:role:list',
  'system:role:add',
  'system:role:edit',
  'system:role:delete',
  'system:menu:list',
  'system:menu:add',
  'system:menu:edit',
  'system:menu:delete',
  'system:dept:list',
  'system:dept:add',
  'system:dept:edit',
  'system:dept:delete',
];

const MANAGER_PERMISSIONS = [
  'system:user:list',
  'system:user:add',
  'system:user:edit',
  'system:role:list',
  'system:menu:list',
  'system:dept:list',
  'system:dept:add',
  'system:dept:edit',
];

const USER_PERMISSIONS = [
  'system:user:list',
  'system:role:list',
  'system:menu:list',
  'system:dept:list',
];

export interface AuthUser {
  id: string;
  username: string;
  password: string;
  nickname: string;
  avatar: string;
  permissions: string[];
  roleIds: string[];
  deptId: string;
  deptName: string;
}

export const AUTH_USERS: AuthUser[] = [
  {
    id: 'auth-001',
    username: 'admin',
    password: 'admin123',
    nickname: '超级管理员',
    avatar: '',
    permissions: ALL_PERMISSIONS,
    roleIds: ['role-001'],
    deptId: 'dept-001',
    deptName: '技术部',
  },
  {
    id: 'auth-002',
    username: 'manager',
    password: 'manager123',
    nickname: '部门经理',
    avatar: '',
    permissions: MANAGER_PERMISSIONS,
    roleIds: ['role-004'],
    deptId: 'dept-002',
    deptName: '产品部',
  },
  {
    id: 'auth-003',
    username: 'user',
    password: 'user123',
    nickname: '普通用户',
    avatar: '',
    permissions: USER_PERMISSIONS,
    roleIds: ['role-003'],
    deptId: 'dept-003',
    deptName: '设计部',
  },
];
