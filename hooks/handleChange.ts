export const handleChange = (
    field: keyof typeof data,
    newValue: string | boolean,
    data: any,
    saveData: (updatedData: any) => void
  ) => {
    const updatedData = { ...data, [field]: newValue };
    saveData(updatedData);
  };