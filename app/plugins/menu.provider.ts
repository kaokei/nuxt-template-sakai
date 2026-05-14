import { dashboardSystem } from '~/config/menu/dashboard-menu';
import { demoSystem } from '~/config/menu/demo-menu';
import { monitorSystem } from '~/config/menu/monitor-menu';
import { notifySystem } from '~/config/menu/notify-menu';
import { systemManageSystem } from '~/config/menu/system-menu';
import { MenuService } from '~/services/menu.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([MenuService]);

  const menuService = useRootService(MenuService);
  menuService.registerSystems([
    systemManageSystem,
    monitorSystem,
    dashboardSystem,
    notifySystem,
    demoSystem,
  ]);
});
