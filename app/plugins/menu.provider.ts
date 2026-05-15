import { demoSystem } from '~/config/menu/demo-menu';
import { MenuService } from '~/services/menu.service';

export default defineNuxtPlugin(() => {
  declareRootProviders([MenuService]);

  const menuService = useRootService(MenuService);
  menuService.registerSystems([demoSystem]);
});
