import React, { ComponentType, useEffect, useState } from 'react';
import { LoadingErrorState } from '@/components/Data/LoadingErrorState';
import { useAppContext } from '@/components/Data/AppContext';

const fetchData = async (dataContext: any, downloadMethod: string) => {
  if (dataContext?.Configuracion?.[downloadMethod]) {
    await dataContext.Configuracion[downloadMethod]();
  } else {
    throw new Error(`El método ${downloadMethod} no existe en Configuracion`);
  }
  return dataContext.Configuracion.DATA;
};

function withDataFetch<T>(WrappedComponent: ComponentType<T & { data: any }>, fetchMethod: string) {
  return function WithDataFetchWrapper(props: T) {
    const { dataContext } = useAppContext();
    const [data, setData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
      const loadData = async () => {
        if (!dataContext) return;
        setIsLoading(true);
        setError(null);
        try {
          const result = await fetchData(dataContext, fetchMethod);
          setData(result);
        } catch (err: any) {
          setError(err.message || 'Error al obtener los datos');
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }, [dataContext]);
    if (isLoading || error) return <LoadingErrorState isLoading={isLoading} error={error} />;
    return <WrappedComponent {...props} data={data} />;
  };
}

export default withDataFetch;