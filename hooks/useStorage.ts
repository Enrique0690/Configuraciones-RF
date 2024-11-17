import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStorage = <T>(key: string, initialValue: T) => {
  const [data, setData] = useState<T>(initialValue);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const savedData = await AsyncStorage.getItem(key);
      if (savedData) {
        setData(JSON.parse(savedData));
      } else {
        setData(initialValue);
      }
    } catch (error) {
      setError('Error al cargar los datos');
      console.error('Error al cargar los datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (value: T) => {
    try {
      setError(null);
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setData(value);
    } catch (error) {
      setError('Error al guardar los datos');
      console.error('Error al guardar los datos:', error);
    }
  };

  const clearData = async () => {
    try {
      setError(null);
      await AsyncStorage.removeItem(key);
      setData(initialValue);
    } catch (error) {
      setError('Error al eliminar los datos');
      console.error('Error al eliminar los datos:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [key]);

  return {
    data,
    loading,
    error,
    saveData,
    clearData,
    reloadData: loadData, 
  };
};

export default useStorage;