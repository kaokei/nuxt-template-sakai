import type { Announcement } from '@sakai/types/announcement';

export const ANNOUNCEMENT_LIST: Announcement[] = [
  {
    id: 'ann-001',
    title: '关于2026年五一劳动节放假安排的通知',
    content:
      '<h2>关于2026年五一劳动节放假安排的通知</h2><p>根据国家法定节假日安排，现将2026年五一劳动节放假安排通知如下：</p><p>放假时间：5月1日至5月5日，共5天。4月26日（周日）、5月9日（周六）上班。</p><p>请各部门提前做好工作安排，确保放假期间公司正常运转。放假前请关闭办公区域电源、锁好门窗。</p><p>祝大家节日快乐！</p><p>特此通知。</p><p style="text-align: right;">行政部<br/>2026年4月25日</p>',
    summary:
      '根据国家法定节假日安排，现将2026年五一劳动节放假安排通知如下：放假时间5月1日至5月5日，共5天。',
    status: 'published',
    isPinned: true,
    publishedAt: '2026-04-25T08:00:00.000Z',
    createdBy: 'admin',
    viewCount: 128,
    createdAt: '2026-04-25T08:00:00.000Z',
    updatedAt: '2026-04-25T08:00:00.000Z',
  },
  {
    id: 'ann-002',
    title: '系统升级维护通知',
    content:
      '<h2>系统升级维护通知</h2><p>各位同事：</p><p>为了提升系统性能和安全性，技术部计划于2026年5月20日（周三）凌晨2:00-6:00进行系统升级维护。</p><p>维护期间，公司内部管理系统将暂停使用。请各位同事提前做好工作安排，避免在维护期间使用系统。</p><p>如有问题，请联系技术部（分机：8888）。</p><p style="text-align: right;">技术部<br/>2026年5月19日</p>',
    summary:
      '技术部计划于2026年5月20日凌晨2:00-6:00进行系统升级维护，维护期间系统暂停使用。',
    status: 'scheduled',
    isPinned: false,
    scheduledAt: '2026-05-20T18:00:00.000Z',
    createdBy: 'admin',
    viewCount: 0,
    createdAt: '2026-05-19T10:00:00.000Z',
    updatedAt: '2026-05-19T10:00:00.000Z',
  },
  {
    id: 'ann-003',
    title: '2026年新员工入职培训通知',
    content:
      '<h2>2026年新员工入职培训通知</h2><p>各位新同事：</p><p>欢迎加入公司！为了让新同事更好地了解公司文化和业务流程，特举办新员工入职培训。</p><p><strong>培训时间：</strong>2026年5月25日-5月26日（周一至周二）</p><p><strong>培训地点：</strong>公司3楼大会议室</p><p><strong>培训内容：</strong></p><ul><li>公司文化与发展历程</li><li>组织架构与部门介绍</li><li>人事制度与福利政策</li><li>IT系统使用培训</li><li>安全培训</li></ul><p>请各位新同事准时参加。如有特殊情况不能参加，请提前向HR部门请假。</p><p style="text-align: right;">人力资源部<br/>2026年5月18日</p>',
    summary:
      '欢迎新同事！新员工入职培训将于5月25日-26日在公司3楼大会议室举行，请准时参加。',
    status: 'published',
    isPinned: false,
    publishedAt: '2026-05-18T09:00:00.000Z',
    createdBy: 'admin',
    viewCount: 56,
    createdAt: '2026-05-18T09:00:00.000Z',
    updatedAt: '2026-05-18T09:00:00.000Z',
  },
  {
    id: 'ann-004',
    title: '2026年第二季度公司团建活动通知',
    content:
      '<h2>2026年第二季度公司团建活动通知</h2><p>为了增强团队凝聚力，丰富员工业余生活，公司将于6月中旬组织团建活动。</p><p>活动时间：2026年6月13日（周六）</p><p>活动地点：待定（将在微信群中通知）</p><p>请各部门统计参加人数，于5月30日前报至行政部。</p><p style="text-align: right;">行政部<br/>2026年5月15日</p>',
    summary:
      '公司将于6月中旬组织团建活动，请各部门于5月30日前统计参加人数报至行政部。',
    status: 'published',
    isPinned: false,
    publishedAt: '2026-05-15T14:30:00.000Z',
    createdBy: 'admin',
    viewCount: 89,
    createdAt: '2026-05-15T14:30:00.000Z',
    updatedAt: '2026-05-15T14:30:00.000Z',
  },
  {
    id: 'ann-005',
    title: '关于调整公司考勤制度的通知（草案）',
    content:
      '<h2>关于调整公司考勤制度的通知（草案）</h2><p>各位同事：</p><p>为适应公司业务发展需要，提供更灵活的工作方式，公司拟对考勤制度进行调整，现征求意见。</p><p><strong>主要调整内容：</strong></p><ol><li>实行弹性工作制，核心工作时间10:00-16:00</li><li>每月可申请2天远程办公</li><li>取消强制性打卡，改为目标管理制度</li></ol><p>请各部门于6月1日前反馈意见至hr@company.com。</p><p style="text-align: right;">人力资源部<br/>2026年5月12日</p>',
    summary:
      '公司拟对考勤制度进行调整，现征求意见。主要调整：弹性工作制、远程办公、取消强制打卡。',
    status: 'draft',
    isPinned: false,
    createdBy: 'admin',
    viewCount: 0,
    createdAt: '2026-05-12T10:00:00.000Z',
    updatedAt: '2026-05-12T10:00:00.000Z',
  },
  {
    id: 'ann-006',
    title: '2026年元旦放假通知',
    content:
      '<h2>2026年元旦放假通知</h2><p>2026年元旦放假时间为1月1日（周四），共1天。1月2日（周五）正常上班。</p><p>祝大家新年快乐！</p><p style="text-align: right;">行政部<br/>2025年12月28日</p>',
    summary: '2026年元旦放假时间为1月1日，共1天。',
    status: 'archived',
    isPinned: false,
    publishedAt: '2025-12-28T08:00:00.000Z',
    archivedAt: '2026-01-02T00:00:00.000Z',
    createdBy: 'admin',
    viewCount: 145,
    createdAt: '2025-12-28T08:00:00.000Z',
    updatedAt: '2026-01-02T00:00:00.000Z',
  },
];
