// src/context/ActiveConfigContext.tsx
import React, { createContext, useState, useContext, ReactNode } from 'react';

// Define el tipo de la configuración activa
interface Config {
  id: string;
  label: string;
  route?: string;
  // Puedes agregar más campos dependiendo de lo que tenga cada configuración
}

// Crear el contexto con un valor por defecto (null o un objeto vacío)
const ActiveConfigContext = createContext<{ activeConfig: Config | null, setActiveConfig: (config: Config) => void } | undefined>(undefined);

// Proveedor del contexto
export const ActiveConfigProvider = ({ children }: { children: ReactNode }) => {
  const [activeConfig, setActiveConfig] = useState<Config | null>(null);

  return (
    <ActiveConfigContext.Provider value={{ activeConfig, setActiveConfig }}>
      {children}
    </ActiveConfigContext.Provider>
  );
};

// Custom Hook para usar el contexto
export const useActiveConfig = () => {
  const context = useContext(ActiveConfigContext);
  if (!context) {
    throw new Error('useActiveConfig debe usarse dentro de un ActiveConfigProvider');
  }
  return context;
};
