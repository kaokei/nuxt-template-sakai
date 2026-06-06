/**
 * 认证中间件
 * 用于保护需要登录才能访问的路由
 * 未认证用户重定向到登录页
 */
export default defineNuxtRouteMiddleware((to) => {
  // 仅在客户端执行
  if (typeof window === 'undefined') {
    return;
  }

  // 已在登录页则不重定向，避免循环
  if (to.path === '/demo/auth/login') {
    return;
  }

  // 读取认证 token
  const token = localStorage.getItem('auth_token');

  // 无 token 则重定向到登录页
  if (!token) {
    return navigateTo('/demo/auth/login');
  }
});
