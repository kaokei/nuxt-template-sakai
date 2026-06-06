/** 菜单项 */
export interface MenuItem {
  label: string;
  icon?: string;
  /** Vue Router 路由路径 */
  to?: string;
  /** 外链 URL */
  url?: string;
  /** 外链打开方式 */
  target?: string;
  /** 是否可见 */
  visible?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否为分隔线 */
  separator?: boolean;
  /** 自定义 CSS class */
  class?: string;
  /** 子菜单激活路径前缀 */
  path?: string;
  /** 子菜单项 */
  items?: MenuItem[];
}

/** 系统配置 */
export interface SystemConfig {
  /** 系统唯一标识 */
  id: string;
  /** 系统显示名称 */
  name: string;
  /** 系统图标 */
  icon?: string;
  /** 路由前缀，如 '/system' */
  routePrefix: string;
  /** 系统首页路由 */
  homeRoute: string;
  /** 默认使用的布局 */
  defaultLayout: 'sakai-sidebar' | 'sakai-topnav' | 'sakai-mix';
  /** 菜单项 */
  menuItems: MenuItem[];
}
