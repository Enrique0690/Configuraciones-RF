import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const STORAGE_KEY = 'printers';
const SELECTED_PRINTER_KEY = 'selectedPrinterId';  // Agregamos una clave para almacenar el ID de la impresora seleccionada

const EditPrinterScreen: React.FC = () => {
  const [name, setName] = useState<string>(''); // Estado para el nombre de la impresora
  const [model, setModel] = useState<string>(''); // Estado para el modelo
  const [status, setStatus] = useState<string>(''); // Estado para el estado de la impresora
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const buttonColor = useThemeColor({}, 'buttonColor');
  
  // Cargar datos de impresora desde AsyncStorage
  const loadPrinterData = async () => {
    try {
      const printerId = await AsyncStorage.getItem(SELECTED_PRINTER_KEY);  // Obtenemos el ID de la impresora seleccionada
      if (!printerId) {
        alert('No se seleccionó una impresora');
        return;
      }

      const storedPrinters = await AsyncStorage.getItem(STORAGE_KEY);
      const printers = storedPrinters ? JSON.parse(storedPrinters) : [];

      const printer = printers.find((printer: any) => printer.id === printerId);  // Buscamos la impresora por ID

      if (printer) {
        setName(printer.name);
        setModel(printer.model);
        setStatus(printer.status);

        // Una vez que los datos han sido cargados, eliminamos el ID de la impresora seleccionada
        await AsyncStorage.removeItem(SELECTED_PRINTER_KEY);
      } else {
        alert('Impresora no encontrada');
      }
    } catch (error) {
      console.error('Error al cargar los datos de la impresora:', error);
      alert('Hubo un error al cargar los datos de la impresora');
    }
  };

  useEffect(() => {
    loadPrinterData();  // Llamamos a la función para cargar la impresora
  }, []);

  const handleSave = async () => {
    try {
      const storedPrinters = await AsyncStorage.getItem(STORAGE_KEY);
      const printers = storedPrinters ? JSON.parse(storedPrinters) : [];
      const printerIndex = printers.findIndex((printer: any) => printer.id === name); // Encontramos la impresora por su id

      if (printerIndex !== -1) {
        // Actualizamos los datos de la impresora
        printers[printerIndex] = { id: name, model, status };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(printers));

        alert('Impresora actualizada');
        router.push('./printerlist'); // Redirigimos a la lista de impresoras
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un error al guardar los cambios');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>EDITAR IMPRESORA</Text>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Nombre"
        placeholderTextColor={textColor}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Modelo"
        placeholderTextColor={textColor}
        value={model}
        onChangeText={setModel}
      />
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Estado"
        placeholderTextColor={textColor}
        value={status}
        onChangeText={setStatus}
      />

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  saveButton: {
    backgroundColor: '#2C7B9A',
    borderRadius: 8,
    paddingVertical: 12,
  },
  saveButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
});

export default EditPrinterScreen;
