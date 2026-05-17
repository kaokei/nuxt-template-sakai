import { AuthService } from '~/services/auth.service';

/**
 * RBAC 按钮级权限控制 composable
 *
 * 用法：
 *   const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermission();
 *   if (hasPermission('system:user:add')) { ... }
 */
export function usePermission() {
  const authService = useService(AuthService);

  /**
   * 用户是否有指定权限
   * @param perm - 权限标识符，如 'system:user:add'
   */
  function hasPermission(perm: string): boolean {
    if (!authService.isAuthenticated()) {
      return false;
    }
    return authService.getPermissions().includes(perm);
  }

  /**
   * 用户是否有任意一个指定权限
   * @param perms - 权限标识符数组
   */
  function hasAnyPermission(perms: string[]): boolean {
    return perms.some((p) => hasPermission(p));
  }

  /**
   * 用户是否拥有所有指定权限
   * @param perms - 权限标识符数组
   */
  function hasAllPermissions(perms: string[]): boolean {
    return perms.every((p) => hasPermission(p));
  }

  return { hasPermission, hasAnyPermission, hasAllPermissions };
}
