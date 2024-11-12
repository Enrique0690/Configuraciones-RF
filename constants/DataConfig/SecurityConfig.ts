function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
    return config.map(item => ({ ...item, route }));
  }

type FieldConfig = {
    label: string;
    field: keyof typeof defaultData;
    type: 'text'| 'buttonlist' | 'input';
    route?: string;
    iconName?: string;
    finalText?: string;
};

export const defaultData = {
    eliminarMotivo: '',
    anularFacturaMotivo: '',
    anularPedidoMotivo: '',
    none: ''
};

export const securityConfig: Array<FieldConfig> = withGlobalRoute([
    { label: 'security.deleteProductReason', field: 'eliminarMotivo', type: 'input', finalText:'security.characters' },
    { label: 'security.cancelInvoiceReason', field: 'anularFacturaMotivo', type: 'input',finalText:'security.characters' },
    { label: 'security.cancelOrderReason', field: 'anularPedidoMotivo', type: 'input',finalText:'security.characters' },
], '/Security');

const linksConfig = [
    { label: 'security.users', route: '/Security/users/userlist' },
    { label: 'security.roles', route: '/Security/rols/rollist' },
];

export const Securityall = {
    general: securityConfig,
    links: linksConfig
}