function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
  return config.map(item => ({ ...item, route }));
}

type FieldConfig = {
  id:  keyof typeof defaultData;
  label: string;
  type: 'text' | 'image' | 'input' | 'inputlist';
  route?: string;
  imageUrl?: string | null;
  list?: string[]
};

export const defaultData = {
  id: '',
  nombreComercial: '',
  direccion: '',
  telefono: '',
  email: '',
  base: '',
  currency: '',
  pruebas: '',
  imageUrl: '',
};

export const organizationConfig: Array<FieldConfig> =  withGlobalRoute([
  { id: 'nombreComercial', label: 'businessInfo.name', type: 'input'},
  { id: 'direccion', label: 'businessInfo.address', type: 'input'},
  { id: 'telefono', label: 'businessInfo.phone', type: 'input'},
  { id: 'email', label: 'businessInfo.email', type: 'input'},
  { id: 'base', label: 'businessInfo.businessType', type: 'inputlist',list: ['FOODTRUCK / PUESTO DE COMIDA', 'RESTAURANT', 'REATIL/ LOCAL COMERCIAL', 'HOTEL']},
], '/organization'); 

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
  { id: 'ruc', label: 'taxConfigurationEC.infoTributaria.ruc', type: 'input' },
  { id: 'razonSocial', label: 'taxConfigurationEC.infoTributaria.razonSocial', type: 'input' },
  { id: 'direccionMatriz', label: 'taxConfigurationEC.infoTributaria.direccionMatriz', type: 'input' },
  { id: 'ObligadoContabilidad', label: 'taxConfigurationEC.infoTributaria.obligadollevarcontabilidad', type: 'switch' },
  { id: 'es_agente_retencion_microempresa', label: 'taxConfigurationEC.infoTributaria.agenteRetencion', type: 'switch' },
  { id: 'agente_retencion_microempresa_resolucion', label: 'taxConfigurationEC.infoTributaria.agente_retencion_microempresa_resolucion', type: 'input' },
  { id: 'regimenContribuyente', label: 'taxConfigurationEC.infoTributaria.regimenContribuyente', type: 'inputlist', list: ['No Incluir Leyenda', 'Contribuyente Regimen General', 'Contribuyente Rigemen RIMPE', 'Contribuyente Negocio Popular - Regimen RIMPE'] },
  { id: 'calificacionArtesanal', label: 'taxConfigurationEC.infoTributaria.numeroCalificacionArtesanal',type: 'input' },
  { id: 'sitioWebFacturaElectronica', label: 'taxConfigurationEC.infoTributaria.sitioWebFacturaElectronica', type: 'input' },
  //{ label: 'taxConfigurationEC.infoTributaria.correoEnvioComprobantes', field: 'correoEnvioComprobantes', type: 'input' },
], '/organization/ecuador/tax-info');

export const organizationall = {
  organization: organizationConfig,
  infoTributaria: infoTributariaConfig
};