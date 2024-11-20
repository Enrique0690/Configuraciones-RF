function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
  return config.map(item => ({ ...item, route }));
}

type FieldConfig = {
  id:  keyof typeof defaultData;
  label: string;
  type: 'text' | 'image' | 'input';
  route?: string;
  imageUrl?: string | null;
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

export const businessInfoConfig: Array<FieldConfig> =  withGlobalRoute([
  { id: 'nombreComercial', label: 'businessInfo.name', type: 'input'},
  { id: 'direccion', label: 'businessInfo.address', type: 'input'},
  { id: 'telefono', label: 'businessInfo.phone', type: 'input'},
  { id: 'email', label: 'businessInfo.email', type: 'input'},
  { id: 'base', label: 'businessInfo.businessType', type: 'input'},
], '/Business-info');