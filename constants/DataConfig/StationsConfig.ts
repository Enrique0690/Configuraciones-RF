function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
    return config.map(item => ({ ...item, route }));
  }
  export const StationsConfig = withGlobalRoute([
    { label: 'stations.header' },
    { label: 'stations.addStationTitle'},
  ], '/Ordering-stations');