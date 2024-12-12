import { useState, useEffect } from 'react';
import { useAppContext } from '@/components/Data/AppContext';

interface FetchState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

export function useFetch<T>(fetchFunction: (dataContext: any) => Promise<T>): FetchState<T> {
  const { dataContext } = useAppContext();
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataContext) return;
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchFunction(dataContext); 
        setData(result);
      } catch (err: any) {
        setError(err.message || 'Error al obtener los datos');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dataContext, fetchFunction]);

  return { data, isLoading, error };
}