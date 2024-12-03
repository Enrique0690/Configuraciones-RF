function withGlobalRoute<T>(config: T[], route: string, category?: string): (T & { route: string, category?: string })[] {
  return config.map(item => ({ ...item, route, category }));
}

type FieldConfig = {
  label: string;
  id: string;
  type: 'text' | 'buttonlist' | 'input';
  route?: string;
  iconName?: string;
  finalText?: string;
};

export const securityConfig: Array<FieldConfig> = withGlobalRoute([
  { id: 'eliminarMotivo', label: 'security.deleteProductReason', type: 'text' },
  { id: 'minimo_caracteres_justificar_anulacion', label: 'security.cancelInvoiceReason', type: 'text' },
  { id: 'anularPedidoMotivo', label: 'security.cancelOrderReason', type: 'text' },
], '/security', "layout.categorys.security");

const linksConfig = [
  { label: 'security.users', route: '/security/users/userlist', category:"layout.categorys.security" },
  { label: 'security.roles', route: '/security/rols/rollist', category:"layout.categorys.security" },
];

export const Securityall = {
  general: securityConfig,
  links: linksConfig
}

export const rolePermissions = {
  sales: [
    'directSale',
    'tableOrder',
    'cashRegister',
    'expenseRecord',
    'closureQuery',
  ],
  inventory: [
    'articles',
    'inventoryEntry',
    'inventoryExit',
    'kardex',
    'viewMovements',
    'transformation',
    'production',
  ],
  configuration: ['config'],
  specialPermissions: [
    'singleWaiter',
    'cancelTables',
    'cancelCashClosures',
    'cancelSales',
    'cancelInventoryMovements',
    'removeItemsFromOrder',
    'verifyCashClosures',
    'chargePendingOrders',
    'accessAnyTable',
    'reprintSalesDocuments',
    'modifySalesData',
    'moveOrderItems',
  ],
  clients: ['clientQuery'],
  report: ['salesReport', 'inventoryReport'],
};