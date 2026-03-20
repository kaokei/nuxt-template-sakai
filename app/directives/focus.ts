export default {
  mounted(el: any, binding: any) {
    const value = binding.value ?? true;
    if (value) {
      el.focus();
    }
  },
  getSSRProps(binding: any, vnode: any) {
    // you can provide SSR-specific props here
    return {};
  },
};
