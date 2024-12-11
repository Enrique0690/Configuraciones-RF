import React, { createContext, useContext, useEffect, useState } from "react";
import DataContext from ".";

interface AppContextProps {
  dataContext: DataContext | null;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextProps>({
  dataContext: null,
  isLoading: true,
  error: null,
});

interface AppProviderProps {
  connectionName: string;
  children: React.ReactNode;
}

export const AppProvider = ({ children, connectionName }: AppProviderProps) => {
  const [dataContext, setDataContext] = useState<DataContext | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDataContext = async () => {
      try {
        const context = new DataContext(connectionName);
        await context.Configuracion.download();
        setDataContext(context);
      } catch (error: any) {
        setError(error.message || "Error al descargar los datos");
      } finally {
        setIsLoading(false);
      }
    };
    initializeDataContext();
  }, [connectionName]);

  return (
    <AppContext.Provider value={{ dataContext, isLoading, error }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext debe ser usado dentro de AppProvider");
  }
  return context;
};