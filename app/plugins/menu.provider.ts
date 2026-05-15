import { demoMonitorConfig } from '~/config/menu/monitor-menu';
import { demoNotifyConfig } from '~/config/menu/notify-menu';
import { demoShowcaseConfig } from '~/config/menu/showcase-menu';
import { demoSystemConfig } from '~/config/menu/system-menu';
import { demoWorkbenchConfig } from '~/config/menu/workbench-menu';
import { MenuService } from '~/services/menu.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([MenuService]);

  const menuService = useRootService(MenuService);
  const route = useRoute();
  menuService.registerSystems(
    [
      demoSystemConfig,
      demoMonitorConfig,
      demoWorkbenchConfig,
      demoNotifyConfig,
      demoShowcaseConfig,
    ],
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
