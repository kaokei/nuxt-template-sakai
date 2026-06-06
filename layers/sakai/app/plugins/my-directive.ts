import focusDirective from '@sakai/directives/focus';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', focusDirective);
});
