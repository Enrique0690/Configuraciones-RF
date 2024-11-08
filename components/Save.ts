import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useAsyncStorage<T>(storageKey: string, initialValue: T) {
  const [data, setData] = useState<T>(initialValue);

  useEffect(() => {
    const loadData = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem(storageKey);
        if (jsonValue != null) {
          setData(JSON.parse(jsonValue));
        }
      } catch (error) {
        console.error("Error al cargar los datos", error);
      }
    };

    loadData();
  }, [storageKey]);

  const saveData = async (newData: T) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newData));
      setData(newData);
    } catch (error) {
      console.error("Error al guardar los datos", error);
    }
  };

  return [data, saveData] as const; 
}
