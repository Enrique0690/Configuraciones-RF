// hooks/useStorage.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const useStorage = <T>(key: string, initialValue: T) => {
  const [data, setdata] = useState<T>(initialValue);

  const loadData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(key);
      if (savedData) {
        setdata(JSON.parse(savedData));
      } else {
        setdata(initialValue); 
      }
    } catch (error) {
      console.error('Error loading data from AsyncStorage:', error);
    }
  };

  const saveData = async (value: T) => {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
      setdata(value);
    } catch (error) {
      console.error('Error saving data to AsyncStorage:', error);
    }
  };

  const clearData = async () => {
    try {
      await AsyncStorage.removeItem(key);
      setdata(initialValue); 
    } catch (error) {
      console.error('Error clearing data from AsyncStorage:', error);
    }
  };

  useEffect(() => {
    loadData();
  }, [key]); 

  return {
    data,
    saveData,
    clearData,
  };
};

export default useStorage;