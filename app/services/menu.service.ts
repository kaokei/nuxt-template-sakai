import type { Router } from 'vue-router';
import type { SystemConfig } from '~/types/menu';

@Injectable()
export class MenuService {
  systems: SystemConfig[] = [];
  currentSystemId = '';

  get currentSystem(): SystemConfig | null {
    return this.systems.find((s) => s.id === this.currentSystemId) ?? null;
  }

  get currentMenu() {
    return this.currentSystem?.menuItems ?? [];
  }

  get currentLayout() {
    return (this.currentSystem?.defaultLayout ?? 'sakai-sidebar') as
      | 'sakai-sidebar'
      | 'sakai-topnav'
      | 'sakai-mix';
  }

  registerSystems(configs: SystemConfig[]) {
    this.systems = configs;
    if (!this.currentSystemId && configs.length > 0) {
      this.currentSystemId = configs[0].id;
    }
  }

  switchSystem(systemId: string, router?: Router) {
    const system = this.systems.find((s) => s.id === systemId);
    if (!system) return;
    this.currentSystemId = systemId;
    if (router) {
      router.push(system.homeRoute);
    }
  }
}
