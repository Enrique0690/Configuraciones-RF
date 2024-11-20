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

export const TableConfig: Array<TabletConfigField> = withGlobalRoute([
  { id: 'Mesa_mostrarCliente', label: 'tabletConfiguration.showUser', type: 'switch' },
  { id: 'PedidoEnMesa_MostrarReloj', label: 'tabletConfiguration.showTime', type: 'switch' },
  { id: 'showCommercialName', label: 'tabletConfiguration.showCommercialName', type: 'switch' },
], '/table-layout/');