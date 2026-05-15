import type { SystemConfig } from '~/types/menu';

interface MinimalRouter {
  push: (url: string) => void;
}

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

  registerSystems(configs: SystemConfig[], currentRoute?: string) {
    this.systems = configs;
    if (currentRoute) {
      this.matchRoute(currentRoute);
    } else if (!this.currentSystemId && configs[0]) {
      this.currentSystemId = configs[0].id;
    }
  }

  matchRoute(currentRoute: string) {
    if (this.systems.length === 0) return;
    const sorted = [...this.systems].sort(
      (a, b) => b.routePrefix.length - a.routePrefix.length,
    );
    const matched = sorted.find((s) => currentRoute.startsWith(s.routePrefix));
    if (matched) {
      this.currentSystemId = matched.id;
    }
  }

  switchSystem(systemId: string, router?: MinimalRouter) {
    const system = this.systems.find((s) => s.id === systemId);
    if (!system) return;
    this.currentSystemId = systemId;
    if (router) {
      router.push(system.homeRoute);
    }
  }
}
