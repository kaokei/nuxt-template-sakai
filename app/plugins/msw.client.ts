export default defineNuxtPlugin(async () => {
  const { worker } = await import('../../mocks/browser');
  await worker.start({
    onUnhandledRequest: 'warn',
    quiet: false,
  });
});
