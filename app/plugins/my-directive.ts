import focusDirective from '~/directives/focus';

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.directive('focus', focusDirective);
});
