function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
  return config.map(item => ({ ...item, route }));
}

type TabletConfigField = {
  label: string;
  field: keyof typeof defaultData;
  type: 'text' | 'switch' | 'input' | 'inputlist';
  route?: string;
  list?: string[];
};

export const defaultData = {
  showUser: false,
  showTime: false,
  showCommercialName: false,
};

export const TabletConfig: Array<TabletConfigField> = withGlobalRoute([
  { label: 'tabletConfiguration.showUser', field: 'showUser', type: 'switch' },
  { label: 'tabletConfiguration.showTime', field: 'showTime', type: 'switch' },
  { label: 'tabletConfiguration.showCommercialName', field: 'showCommercialName', type: 'switch' },
], '/Tablet-configuration/');
