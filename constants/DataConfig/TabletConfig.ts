function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
    return config.map(item => ({ ...item, route }));
  }
  export const TabletConfig = withGlobalRoute([
    { label: 'tabletConfiguration.header' },
    { label: 'tabletConfiguration.showUser'},
    { label: 'tabletConfiguration.showTime'},
    { label: 'tabletConfiguration.showCommercialName'},
  ], '/Tablet-configuration');