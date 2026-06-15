export default defineNuxtPlugin(async () => {
  const { worker } = await import('../../../../mocks/browser');
  await worker.start({
    // 只拦截 /api/ 前缀的请求，其余请求（静态资源、_nuxt 等）直接放行
    onUnhandledRequest(request) {
      const url = new URL(request.url);
      if (url.pathname.startsWith('/api/')) {
        console.warn(
          `[MSW] 未匹配的 API 请求: ${request.method} ${url.pathname}`,
        );
      }
      // 其他请求静默放行，不产生任何警告
    },
  });
});
