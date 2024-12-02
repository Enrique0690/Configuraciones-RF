function withGlobalRoute<T>(config: T[], route: string, category?: string): (T & { route: string, category?: string })[] {
  return config.map(item => ({ ...item, route, category }));
}

type FieldConfig = {
  id:  string;
  label: string;
  type: 'text' | 'image' | 'input' | 'inputlist';
  route?: string;
  imageUrl?: string | null;
  list?: string[];
  category?: string;
};

export const organizationConfig: Array<FieldConfig> =  withGlobalRoute([
  { id: 'nombreComercial', label: 'organization.name', type: 'input'},
  { id: 'direccion', label: 'organization.address', type: 'input'},
  { id: 'telefono', label: 'organization.phone', type: 'input'},
  { id: 'email', label: 'organization.email', type: 'input'},
  { id: 'base', label: 'organization.businessType', type: 'inputlist',list: ['FOODTRUCK / PUESTO DE COMIDA', 'RESTAURANT', 'REATIL/ LOCAL COMERCIAL', 'HOTEL']},
], '/organization', "layout.categorys.businessInfo"); 

type InfoTributariaFieldConfig = {
  label: string;
  id: string;
  type: 'text' | 'switch' | 'input' | 'inputlist';
  route?: string;
  list?: string[]
};

export const infoTributariaConfig: Array<InfoTributariaFieldConfig> = withGlobalRoute([
  { id: 'ruc', label: 'organization.taxinfo.ruc', type: 'input' },
  { id: 'razonSocial', label: 'organization.taxinfo.razonSocial', type: 'input' },
  { id: 'direccionMatriz', label: 'organization.taxinfo.direccionMatriz', type: 'input' },
  { id: 'ObligadoContabilidad', label: 'organization.taxinfo.obligadollevarcontabilidad', type: 'switch' },
  { id: 'es_agente_retencion_microempresa', label: 'organization.taxinfo.agenteRetencion', type: 'switch' },
  { id: 'agente_retencion_microempresa_resolucion', label: 'organization.taxinfo.agente_retencion_microempresa_resolucion', type: 'input' },
  { id: 'leyenda_contribuyente_rimpe', label: 'organization.taxinfo.regimenContribuyente', type: 'inputlist', list: ['No Incluir Leyenda', 'Contribuyente Regimen General', 'Contribuyente Rigemen RIMPE', 'Contribuyente Negocio Popular - Regimen RIMPE'] },
  { id: 'calificacionArtesanal', label: 'organization.taxinfo.numeroCalificacionArtesanal',type: 'input' },
  { id: 'sitioWebFacturaElectronica', label: 'organization.taxinfo.sitioWebFacturaElectronica', type: 'input' },
  //{ label: 'taxinfo.correoEnvioComprobantes', field: 'correoEnvioComprobantes', type: 'input' },
], '/organization/ecuador/tax-info', "layout.categorys.businessInfo");

export const organizationall = {
  organization: organizationConfig,
  infoTributaria: infoTributariaConfig
};