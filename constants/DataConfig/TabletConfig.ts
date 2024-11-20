function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
  return config.map(item => ({ ...item, route }));
}

type TabletConfigField = {
  label: string;
  id: keyof typeof defaultData;
  type: 'text' | 'switch' | 'input' | 'inputlist';
  route?: string;
  list?: string[];
};

export const defaultData = {
  Mesa_mostrarCliente: false,
  PedidoEnMesa_MostrarReloj: false,
  showCommercialName: false,
};

export const TabletConfig: Array<TabletConfigField> = withGlobalRoute([
  { label: 'tabletConfiguration.showUser', id: 'Mesa_mostrarCliente', type: 'switch' },
  { label: 'tabletConfiguration.showTime', id: 'PedidoEnMesa_MostrarReloj', type: 'switch' },
  { label: 'tabletConfiguration.showCommercialName', id: 'showCommercialName', type: 'switch' },
], '/table-layout/');
