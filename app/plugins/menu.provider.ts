import { demoMonitorConfig } from '~/config/menu/monitor-menu';
import { demoNotifyConfig } from '~/config/menu/notify-menu';
import { demoShowcaseConfig } from '~/config/menu/showcase-menu';
import { demoSystemConfig } from '~/config/menu/system-menu';
import { demoWorkbenchConfig } from '~/config/menu/workbench-menu';
import { MenuService } from '~/services/menu.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([MenuService]);

  const menuService = useRootService(MenuService);
  menuService.registerSystems([
    demoSystemConfig,
    demoMonitorConfig,
    demoWorkbenchConfig,
    demoNotifyConfig,
    demoShowcaseConfig,
  ]);
});
