import { useState, useEffect } from 'react';

export const useEditManager = <T>(
  initialValue: T,
  onSave?: (value: T) => Promise<void>,
  validationRules?: ((value: T) => string | null)[] 
) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [tempValue, setTempValue] = useState<T>(initialValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  useEffect(() => {
    setTempValue(initialValue); 
  }, [initialValue]);
  const validate = (): boolean => {
    if (!validationRules) return true;
    for (const rule of validationRules) {
      const error = rule(tempValue);
      if (error) {
        setErrorMessage(error);
        return false;
      }
    }
    setErrorMessage(null); 
    return true;
  };
  const handleSave = async () => {
    setErrorMessage(null); 
    if (!validate()) return;
    setIsLoading(true);
    try {
      await onSave?.(tempValue);
      setDialogVisible(false);
    } catch (error: any) {
      setErrorMessage(error.message || 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  };
  const openDialog = () => {
    setTempValue(initialValue); 
    setDialogVisible(true);
  };
  const closeDialog = () => {
    setTempValue(initialValue); 
    setErrorMessage(null);
    setDialogVisible(false);
  };
  return {
    isDialogVisible,
    tempValue,
    isLoading,
    errorMessage,
    setTempValue,
    openDialog,
    closeDialog,
    handleSave,
  };
};
