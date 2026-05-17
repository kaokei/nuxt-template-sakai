/**
 * v-permission 指令
 * 根据用户权限控制元素的显示与隐藏
 * 用法: <PrimeButton v-permission="'system:user:add'" />
 *
 * 直接从 localStorage 读取权限列表（不依赖 DI），
 * 因为 Vue 指令的 mounted 钩子中无法使用 useService()。
 */
export default {
  mounted(el: Element, binding: { value?: string | null }) {
    const permission = binding.value as string | undefined | null;

    if (!permission) {
      el.remove();
      return;
    }

    try {
      const userJson = localStorage.getItem('auth_user');
      if (!userJson) {
        el.remove();
        return;
      }

      const user = JSON.parse(userJson);
      const permissions = (user?.permissions ?? []) as string[];

      if (!permissions.includes(permission)) {
        el.remove();
      }
    } catch {
      // localStorage 读取失败时移除元素
      el.remove();
    }
  },
};
