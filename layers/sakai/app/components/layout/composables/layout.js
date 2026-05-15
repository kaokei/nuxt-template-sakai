const layoutConfig = reactive({
  preset: 'Aura',
  primary: 'emerald',
  surface: null,
  darkTheme: false,
  menuMode: 'static',
});

const layoutState = reactive({
  staticMenuInactive: false,
  overlayMenuActive: false,
  mobileMenuActive: false,
  /** 顶部菜单移动端展开状态（仅 sakai-topnav 布局移动端使用） */
  topMenuMobileActive: false,
  profileSidebarVisible: false,
  configSidebarVisible: false,
  sidebarExpanded: false,
  menuHoverActive: false,
  activeMenuItem: null,
  activePath: null,
});

export function useLayout() {
  const toggleDarkMode = () => {
    if (!document.startViewTransition) {
      executeDarkModeToggle();

      return;
    }

    document.startViewTransition(() => executeDarkModeToggle(event));
  };

  const executeDarkModeToggle = () => {
    layoutConfig.darkTheme = !layoutConfig.darkTheme;
    document.documentElement.classList.toggle('app-dark');
  };

  const toggleMenu = () => {
    if (isDesktop()) {
      if (layoutConfig.menuMode === 'static') {
        layoutState.staticMenuInactive = !layoutState.staticMenuInactive;
      }

      if (layoutConfig.menuMode === 'overlay') {
        layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
      }
    } else {
      layoutState.mobileMenuActive = !layoutState.mobileMenuActive;
    }
  };

  const toggleConfigSidebar = () => {
    layoutState.configSidebarVisible = !layoutState.configSidebarVisible;
  };

  const hideMobileMenu = () => {
    layoutState.mobileMenuActive = false;
  };

  const toggleTopMenu = () => {
    layoutState.topMenuMobileActive = !layoutState.topMenuMobileActive;
  };

  const hideTopMenu = () => {
    layoutState.topMenuMobileActive = false;
  };

  const changeMenuMode = (event) => {
    layoutConfig.menuMode = event.value;
    layoutState.staticMenuInactive = false;
    layoutState.mobileMenuActive = false;
    layoutState.topMenuMobileActive = false;
    layoutState.sidebarExpanded = false;
    layoutState.menuHoverActive = false;
    layoutState.anchored = false;
  };

  const isDarkTheme = computed(() => layoutConfig.darkTheme);
  const isDesktop = () => window.innerWidth > 991;

  const hasOpenOverlay = computed(() => layoutState.overlayMenuActive);

  return {
    layoutConfig,
    layoutState,
    isDarkTheme,
    toggleDarkMode,
    toggleConfigSidebar,
    toggleMenu,
    hideMobileMenu,
    toggleTopMenu,
    hideTopMenu,
    changeMenuMode,
    isDesktop,
    hasOpenOverlay,
  };
}
