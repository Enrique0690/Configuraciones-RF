function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
    return config.map(item => ({ ...item, route }));
  }
  export const PrintersConfig = [
    { id: 'Printers', label: 'printers.header', route: '/settings/printers', category: 'layout.categorys.printers' },
    { id: 'Printers-AddPrinter', label: 'printers.addPrinter', route: '/settings/printers/newprinter', category: 'layout.categorys.printers' },
  ];