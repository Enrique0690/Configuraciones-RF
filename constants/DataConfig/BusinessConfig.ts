type FieldConfig = {
  label: string;
  field: keyof typeof defaultData;
  type: 'text' | 'image' | 'input';
  route?: string;
};

export const defaultData = {
  name: '',
  address: '',
  phone: '',
  email: '',
  businessType: '',
  currency: '',
  pruebas: '',
  imageUrl: 'Presione e ingrese la URL de la empresa',
};

export const businessInfoConfig: Array<FieldConfig> = [
  { label: 'businessInfo.header', field: 'imageUrl', type: 'image', route: '/Business-info' },
  { label: 'businessInfo.name', field: 'name', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.address', field: 'address', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.phone', field: 'phone', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.email', field: 'email', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.businessType', field: 'businessType', type: 'input', route: '/Business-info' },
  { label: 'businessInfo.currency', field: 'currency', type: 'input', route: '/Business-info' },
];