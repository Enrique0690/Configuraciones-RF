function withGlobalRoute<T>(config: T[], route: string, category?: string): (T & { route: string, category?: string })[] {
  return config.map(item => ({ ...item, route, category}));
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
  { id: 'Mesa_mostrarCliente', label: 'tablelayout.showUser', type: 'switch' },
  { id: 'showCommercialName', label: 'tablelayout.showCommercialName', type: 'switch' },
  { id: 'PedidoEnMesa_MostrarReloj', label: 'tablelayout.showTime', type: 'switch' },
], '/table-layout/', "layout.categorys.tabletConfiguration");
