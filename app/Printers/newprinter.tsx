import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import UUID from 'react-native-uuid';
import { MaterialIcons } from '@expo/vector-icons';

const NewPrinterScreen = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [deliveryNote, setDeliveryNote] = useState(false);
  const [invoice, setInvoice] = useState(false);
  const [preInvoice, setPreInvoice] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [bar, setBar] = useState(false);
  const [noStation, setNoStation] = useState(false);
  const [connection, setConnection] = useState<'USB' | 'Ethernet' | 'Bluetooth'>('USB');

  const handleSave = async () => {
    const id = UUID.v4();
    const printerData = {
      id,
      name,
      options: { deliveryNote, invoice, preInvoice },
      stations: { kitchen, bar, noStation },
      connection,
    };

    try {
      const savedPrinters = await AsyncStorage.getItem('printers');
      const printers = savedPrinters ? JSON.parse(savedPrinters) : [];
      printers.push(printerData);
      await AsyncStorage.setItem('printers', JSON.stringify(printers));
      router.push('/Printers');
    } catch (error) {
      console.error("Error saving printer data:", error);
      Alert.alert("Error", "No se pudo guardar la impresora. Inténtalo de nuevo.");
    }
  };

  const renderConnectionOption = (label: string, value: 'USB' | 'Ethernet' | 'Bluetooth') => (
    <TouchableOpacity
      style={[styles.connectionButton, connection === value && styles.selectedButton]}
      onPress={() => setConnection(value)}
    >
      <Text style={[styles.buttonText, connection === value && styles.selectedButtonText]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <Text style={styles.title}>Nueva Impresora</Text>
        
        <Text style={styles.label}>Nombre de la Impresora</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Escribe el nombre aquí"
        />

        <Text style={styles.label}>Configuración de Impresión</Text>
        {renderSwitch("Notas de entrega", deliveryNote, setDeliveryNote)}
        {renderSwitch("Factura", invoice, setInvoice)}
        {renderSwitch("Pre Facturas", preInvoice, setPreInvoice)}

        <Text style={styles.label}>Estaciones de Pedido</Text>
        {renderSwitch("Cocina", kitchen, setKitchen)}
        {renderSwitch("Barra", bar, setBar)}
        {renderSwitch("Productos sin Estación Asignada", noStation, setNoStation)}

        <Text style={styles.label}>Conexión</Text>
        <View style={styles.buttonContainer}>
          {renderConnectionOption('USB', 'USB')}
          {renderConnectionOption('Ethernet', 'Ethernet')}
          {renderConnectionOption('Bluetooth', 'Bluetooth')}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <MaterialIcons name="save" size={24} color="white" />
          <Text style={styles.saveButtonText}>Guardar Impresora</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const renderSwitch = (label: string, value: boolean, onValueChange: (val: boolean) => void) => (
  <View style={styles.switchContainer}>
    <Text style={styles.switchLabel}>{label}</Text>
    <Switch value={value} onValueChange={onValueChange} />
  </View>
);

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  label: { fontSize: 16, color: '#666', marginTop: 20, marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 8,
  },
  switchLabel: { fontSize: 16, color: '#333' },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-around', marginVertical: 16 },
  connectionButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedButton: { backgroundColor: '#007AFF' },
  buttonText: { fontSize: 14, color: '#007AFF' },
  selectedButtonText: { color: '#fff' },
  saveButton: {
    flexDirection: 'row',
    backgroundColor: '#28a745',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 8 },
});

export default NewPrinterScreen;
