import React, { createContext, useContext, useEffect, useState } from "react";
import DataContext from ".";

interface ConfigContextProps {
  dataContext: DataContext | null;
  isLoading: boolean;
}

const ConfigContext = createContext<ConfigContextProps>({
  dataContext: null,
  isLoading: true,
});

interface ConfigProviderProps {
  connectionName: string;
}

export const ConfigProvider: React.FC<React.PropsWithChildren<ConfigProviderProps>> = ({ children, connectionName }) => {
  const [dataContext, setDataContext] = useState<DataContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDataContext = async () => {
      try {
        const context = new DataContext(connectionName);
        await context.Configuracion.download();
        setDataContext(context);
      } catch (error) {
        console.error("Error al inicializar DataContext:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDataContext();
  }, [connectionName]);

  return (
    <ConfigContext.Provider value={{ dataContext, isLoading }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(ConfigContext);
  if (!context) {
    throw new Error("appContext debe ser usado dentro de ConfigProvider");
  }
  return context;
};