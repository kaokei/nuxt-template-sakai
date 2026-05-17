import { fakerZH_CN as faker } from '@faker-js/faker';

export interface User {
  id: string;
  userName: string;
  nickName: string;
  phone: string;
  email: string;
  gender: 'male' | 'female' | 'other';
  avatar: string;
  deptId: string;
  deptName: string;
  postId?: string;
  postName?: string;
  roleIds: string[];
  roleNames: string[];
  status: 'active' | 'inactive';
  createTime: string;
  remark: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface UserOptions {
  deptOptions: SelectOption[];
  roleOptions: SelectOption[];
  genderOptions: SelectOption[];
  statusOptions: SelectOption[];
}

export const DEPT_LIST = [
  { id: 'dept-001', name: '总公司' },
  { id: 'dept-002', name: '技术部' },
  { id: 'dept-003', name: '前端组' },
  { id: 'dept-004', name: '后端组' },
  { id: 'dept-005', name: '测试组' },
  { id: 'dept-006', name: '产品部' },
  { id: 'dept-007', name: '产品一组' },
  { id: 'dept-008', name: '产品二组' },
  { id: 'dept-009', name: '设计部' },
  { id: 'dept-010', name: '市场部' },
  { id: 'dept-011', name: '销售部' },
  { id: 'dept-012', name: '华东区' },
  { id: 'dept-013', name: '华南区' },
  { id: 'dept-014', name: '人事部' },
  { id: 'dept-015', name: '财务部' },
  { id: 'dept-016', name: '行政部' },
];

export const ROLE_LIST = [
  { id: 'role-001', name: '超级管理员' },
  { id: 'role-002', name: '系统管理员' },
  { id: 'role-003', name: '普通用户' },
  { id: 'role-004', name: '部门经理' },
  { id: 'role-005', name: '审核员' },
  { id: 'role-006', name: '访客' },
];

faker.seed(2026);

export function generateUsers(count = 55): User[] {
  return Array.from({ length: count }, (_) => {
    const gender = faker.helpers.arrayElement<'male' | 'female'>([
      'male',
      'female',
    ]);
    const userName = faker.internet.username({
      firstName: faker.person.firstName(gender),
      lastName: faker.person.lastName(),
    });
    const nickName = faker.person.fullName({ sex: gender });
    const dept = faker.helpers.arrayElement(DEPT_LIST);
    const roles = faker.helpers.arrayElements(ROLE_LIST, { min: 1, max: 3 });

    return {
      id: faker.string.uuid(),
      userName,
      nickName,
      phone: `1${faker.string.numeric({ length: 10, allowLeadingZeros: false })}`,
      email: faker.internet.email({ firstName: userName }),
      gender,
      avatar: `https://i.pravatar.cc/150?u=${userName}`,
      deptId: dept.id,
      deptName: dept.name,
      roleIds: roles.map((r) => r.id),
      roleNames: roles.map((r) => r.name),
      status: faker.helpers.weightedArrayElement([
        { weight: 85, value: 'active' as const },
        { weight: 15, value: 'inactive' as const },
      ]),
      createTime: faker.date.past({ years: 2 }).toISOString(),
      remark:
        faker.helpers.maybe(() => faker.lorem.sentence(), {
          probability: 0.4,
        }) ?? '',
    };
  });
}

export const ALL_USERS = generateUsers(55);
