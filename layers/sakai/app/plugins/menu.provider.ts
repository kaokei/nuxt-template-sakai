import { demoShowcaseConfig } from '@sakai/config/menu/showcase-menu';
import { demoSystemConfig } from '@sakai/config/menu/system-menu';
import { demoWorkbenchConfig } from '@sakai/config/menu/workbench-menu';
import { MenuService } from '@sakai/services/menu.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([MenuService]);

  const menuService = useRootService(MenuService);
  const route = useRoute();
  menuService.registerSystems(
    [demoSystemConfig, demoWorkbenchConfig, demoShowcaseConfig],
    route.path,
  );

  // 路由变化时自动同步当前系统
  watch(
    () => route.path,
    (path) => {
      menuService.matchRoute(path);
    },
  );
});
