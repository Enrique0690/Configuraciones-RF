function withGlobalRoute<T>(config: T[], route: string, category?: string): (T & { route: string, category?: string })[] {
    return config.map(item => ({ ...item, route, category }));
  }
  export const StationsConfig = withGlobalRoute([
    { label: 'stations.header' },
    { label: 'stations.addStationTitle'},
  ], '/Ordering-stations', "layout.categorys.orderingstations");