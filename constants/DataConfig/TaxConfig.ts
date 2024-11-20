function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
  return config.map(item => ({ ...item, route }));
}

type FieldConfig = {
  label: string;
  type: 'text' | 'buttonlist' | 'switch';
  route?: string;
  iconName?: string;
};

export const taxConfig: Array<FieldConfig> = [
  { label: 'taxConfigurationEC.infoTributaria.sectionTitle', type: 'buttonlist', route: '/Tax-configuration-ec/SRI/InfoTributaria', iconName: 'document-text' },
  //{ label: 'taxConfigurationEC.secuenciaFactura.sectionTitle', type: 'buttonlist', route: '/Tax-configuration-ec/SecuenciaFactura', iconName: 'clipboard' },
  //{ label: 'taxConfigurationEC.reglas.sectionTitle', type: 'buttonlist', route: '/Tax-configuration-ec/Reglas', iconName: 'settings' },
];

type InfoTributariaFieldConfig = {
  label: string;
  id: keyof typeof defaultInfoTributariaData;
  type: 'text' | 'switch' | 'input' | 'inputlist';
  route?: string;
  list?: string[]
};

export const defaultInfoTributariaData = {
  ruc: '',
  razonSocial: '',
  direccionMatriz: '',
  ObligadoContabilidad: false,
  es_agente_retencion_microempresa: false,
  agente_retencion_microempresa_resolucion: '',
  regimenContribuyente: '',
  calificacionArtesanal: '',
  sitioWebFacturaElectronica: '',
  correoEnvioComprobantes: '',
};

export const infoTributariaConfig: Array<InfoTributariaFieldConfig> = withGlobalRoute([
  { label: 'taxConfigurationEC.infoTributaria.ruc', id: 'ruc', type: 'input' },
  { label: 'taxConfigurationEC.infoTributaria.razonSocial', id: 'razonSocial', type: 'input' },
  { label: 'taxConfigurationEC.infoTributaria.direccionMatriz', id: 'direccionMatriz', type: 'input' },
  { label: 'taxConfigurationEC.infoTributaria.obligadollevarcontabilidad', id: 'ObligadoContabilidad', type: 'switch' },
  { label: 'taxConfigurationEC.infoTributaria.agenteRetencion', id: 'es_agente_retencion_microempresa', type: 'switch' },
  { label: 'taxConfigurationEC.infoTributaria.agente_retencion_microempresa_resolucion', id: 'agente_retencion_microempresa_resolucion', type: 'input' },
  { label: 'taxConfigurationEC.infoTributaria.regimenContribuyente', id: 'regimenContribuyente', type: 'inputlist', list: ['No Incluir Leyenda', 'Contribuyente Regimen General', 'Contribuyente Rigemen RIMPE', 'Contribuyente Negocio Popular - Regimen RIMPE'] },
  { label: 'taxConfigurationEC.infoTributaria.numeroCalificacionArtesanal', id: 'calificacionArtesanal', type: 'input' },
  { label: 'taxConfigurationEC.infoTributaria.sitioWebFacturaElectronica', id: 'sitioWebFacturaElectronica', type: 'input' },
  //{ label: 'taxConfigurationEC.infoTributaria.correoEnvioComprobantes', field: 'correoEnvioComprobantes', type: 'input' },
], '/organization/ecuador/tax-info');

type ReglasFieldConfig = {
  label: string;
  field: keyof typeof defaultReglasData;
  type: 'text' | 'switch' | 'input';
  route?: string;
};

export const defaultReglasData = {
  habilitarNotasEntrega: false,
  cambiarFacturaMetodo: false,
  cambiarFacturaDatos: false,
  cambiarNotaEntregaMonto: false,
  cambiarNotaEntregaFecha: false,
  notaEntregaHora: '',
};

export const reglasConfig: Array<ReglasFieldConfig> = withGlobalRoute([
  { label: 'taxConfigurationEC.reglas.cambiarFacturaMetodo', field: 'cambiarFacturaMetodo', type: 'switch' },
  { label: 'taxConfigurationEC.reglas.cambiarFacturaDatos', field: 'cambiarFacturaDatos', type: 'switch' },
  { label: 'taxConfigurationEC.reglas.cambiarNotaEntregaMonto', field: 'cambiarNotaEntregaMonto', type: 'switch' },
  { label: 'taxConfigurationEC.reglas.notaEntregaHora', field: 'notaEntregaHora', type: 'input' },
], '/Tax-configuration-ec/Reglas/');

type SecuenciaFacturaFieldConfig = {
  label: string;
  field: keyof typeof defaultSecuenciaFacturaData;
  type: 'text' | 'input';
  route?: string;
};

export const defaultSecuenciaFacturaData = {
  secuencia: '',
  secuenciadispositivo1: '',
  secuenciadispositivo2: '',
  secuenciadispositivo3: '',
  secuenciaespecifica: '',
};

export const secuenciaFacturaConfig: Array<SecuenciaFacturaFieldConfig> = withGlobalRoute([
  { label: 'taxConfigurationEC.secuenciaFactura.todosLosDispositivos', field: 'secuencia', type: 'input' },
  { label: 'taxConfigurationEC.secuenciaFactura.caja1', field: 'secuenciadispositivo1', type: 'input' },
  { label: 'taxConfigurationEC.secuenciaFactura.caja2', field: 'secuenciadispositivo2', type: 'input' },
  { label: 'taxConfigurationEC.secuenciaFactura.caja3', field: 'secuenciadispositivo3', type: 'input' },
  { label: 'taxConfigurationEC.secuenciaFactura.cambiarSecuencia', field: 'secuenciaespecifica', type: 'input' },
], '/Tax-configuration-ec/SecuenciaFactura/');

export const taxConfigall = {
  general: taxConfig,
  infoTributaria: infoTributariaConfig,
  //reglas: reglasConfig,
  //secuenciaFactura: secuenciaFacturaConfig,
};