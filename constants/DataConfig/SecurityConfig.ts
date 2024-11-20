function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
  return config.map(item => ({ ...item, route }));
}

type FieldConfig = {
  label: string;
  id: keyof typeof defaultData;
  type: 'text'| 'buttonlist' | 'input';
  route?: string;
  iconName?: string;
  finalText?: string;
};

export const defaultData = {
  eliminarMotivo: '',
  minimo_caracteres_justificar_anulacion: '',
  anularPedidoMotivo: '',
  none: ''
};

export const securityConfig: Array<FieldConfig> = withGlobalRoute([
  { id: 'eliminarMotivo', label: 'security.deleteProductReason', type: 'input', finalText:'security.characters' },
  { id: 'minimo_caracteres_justificar_anulacion', label: 'security.cancelInvoiceReason', type: 'input',finalText:'security.characters' },
  { id: 'anularPedidoMotivo', label: 'security.cancelOrderReason', type: 'input',finalText:'security.characters' },
], '/security');

const linksConfig = [
  { label: 'security.users', route: '/security/users/userlist' },
  { label: 'security.roles', route: '/security/rols/rollist' },
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