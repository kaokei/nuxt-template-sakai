export function usePageLoading() {
  const loading = ref(true);
  onMounted(() => {
    loading.value = false;
  });
  return loading;
}
