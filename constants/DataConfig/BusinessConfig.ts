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

export const businessInfoConfig: Array<FieldConfig> = [
  { label: 'businessInfo.name', field: 'name', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.address', field: 'address', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.phone', field: 'phone', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.email', field: 'email', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.businessType', field: 'businessType', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.currency', field: 'currency', type: 'input', route: '/Business-info' },
];