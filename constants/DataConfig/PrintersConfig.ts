function withGlobalRoute<T>(config: T[], route: string): (T & { route: string })[] {
    return config.map(item => ({ ...item, route }));
  }
  export const PrintersConfig = [
    { label: 'printers.header', route: '/printers' },
    { label: 'printers.addPrinter', route: '/printers/newprinter' },
  ];