## 项目介绍

1. [Nuxt v4](https://nuxt.com/)
2. [PrimeVue v4](https://primevue.org/introduction/)
3. [Tailwind CSS v4](https://tailwindcss.com/)
4. [@nuxt/icon](https://nuxt.com/modules/icon)
5. [icon集合](https://icon-sets.iconify.design/)
6. [PrimeVue sakai模版](https://github.com/primefaces/sakai-vue)
7. [nuxt-template-sakai模版](https://github.com/kaokei/nuxt-template-sakai)

## 其他功能

1. 【手动】changeset生成变更记录
2. 【自动】prettier代码格式化
3. 【vscode编辑器自动显示】eslint代码规范检查  
   可以在CI/CD构建代码之前先运行`npm run lint`来检查代码问题，避免合并代码产生的bug。
4. 【自动】husky在提交代码时自动触发lint-staged调用prettier格式化代码
5. 【自动】git commit自动触发commitizen规范化提交信息

## tailwindcss版本选择

1. 如果是toC产品，只能选择tailwindcss v3
2. 如果是toB产品，可以选择tailwindcss v4

主要原因在于v4版本的浏览器兼容性较差，对浏览器的版本要求比较高。
可以参考[这个文档](https://primevue.org/tailwind/)来切换tailwindcss版本。
