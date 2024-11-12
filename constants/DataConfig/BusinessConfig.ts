function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
  return config.map(item => ({ ...item, route }));
}

type FieldConfig = {
  label: string;
  field: keyof typeof defaultData;
  type: 'text' | 'image' | 'input';
  route?: string;
  imageUrl?: string | null;
};

export const defaultData = {
  name: '',
  address: '',
  phone: '',
  email: '',
  businessType: '',
  currency: '',
  pruebas: '',
  imageUrl: '',
};

export const businessInfoConfig: Array<FieldConfig> =  withGlobalRoute([
  { label: 'businessInfo.name', field: 'name', type: 'input'},
  { label: 'businessInfo.address', field: 'address', type: 'input'},
  { label: 'businessInfo.phone', field: 'phone', type: 'input'},
  { label: 'businessInfo.email', field: 'email', type: 'input'},
  { label: 'businessInfo.businessType', field: 'businessType', type: 'input'},
  { label: 'businessInfo.currency', field: 'currency', type: 'input'},
], '/Business-info');