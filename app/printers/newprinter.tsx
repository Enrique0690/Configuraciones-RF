import React, { useState } from 'react';
import { View, Text, TextInput, Switch, TouchableOpacity, StyleSheet, Alert, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import UUID from 'react-native-uuid';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; 
import DataRenderer from '@/components/DataRenderer';

const NewPrinterScreen = () => {
  const { t } = useTranslation(); 
  const router = useRouter();
  const [name, setName] = useState('');
  const [deliveryNote, setDeliveryNote] = useState(false);
  const [invoice, setInvoice] = useState(false);
  const [preInvoice, setPreInvoice] = useState(false);
  const [reports, setReports] = useState(false);
  const [kitchen, setKitchen] = useState(false);
  const [bar, setBar] = useState(false);
  const [noStation, setNoStation] = useState(false);
  const [connection, setConnection] = useState<'USB' | 'Ethernet' | 'Bluetooth'>('USB');
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 

  // Guardar impresora
  const handleSave = async () => {
    setLoading(true); 
    setError(''); 
    const id = UUID.v4();
    const printerData = {
      id,
      name,
      options: { deliveryNote, invoice, preInvoice, reports },
      stations: { kitchen, bar, noStation },
      connection,
    };

    try {
      const savedPrinters = await AsyncStorage.getItem('printers');
      const printers = savedPrinters ? JSON.parse(savedPrinters) : [];
      printers.push(printerData);
      await AsyncStorage.setItem('printers', JSON.stringify(printers));
      router.push('/printers');
    } catch (error) {
      console.error("Error saving printer data:", error);
      setError(t('printers.errorSaving')); 
    } finally {
      setLoading(false); 
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
        {loading && <ActivityIndicator size="large" color="#007AFF" />}
        {error && <Text style={styles.errorText}>{error}</Text>}

        {!loading && (
          <>
            <Text style={styles.title}>{t('printers.addPrinter')}</Text>

            <DataRenderer
              label={t('printers.printerName')}
              value={name}
              type="input"
              textColor="#333"
              onSave={(newValue) => setName(newValue as string)}
            />

            <Text style={styles.label}>{t('printers.printingSettings')}</Text>
            <DataRenderer
              label={t('printers.deliveryNote')}
              value={deliveryNote}
              type="switch"
              textColor="#333"
              onSave={(newValue) => setDeliveryNote(newValue as boolean)}
            />
            <DataRenderer
              label={t('printers.invoice')}
              value={invoice}
              type="switch"
              textColor="#333"
              onSave={(newValue) => setInvoice(newValue as boolean)}
            />
            <DataRenderer
              label={t('printers.preInvoice')}
              value={preInvoice}
              type="switch"
              textColor="#333"
              onSave={(newValue) => setPreInvoice(newValue as boolean)}
            />
            <DataRenderer
              label={t('printers.reports')}
              value={reports}
              type="switch"
              textColor="#333"
              onSave={(newValue) => setReports(newValue as boolean)}
            />

            <Text style={styles.label}>{t('printers.stations')}</Text>
            <DataRenderer
              label={t('printers.kitchen')}
              value={kitchen}
              type="switch"
              textColor="#333"
              onSave={(newValue) => setKitchen(newValue as boolean)}
            />
            <DataRenderer
              label={t('printers.bar')}
              value={bar}
              type="switch"
              textColor="#333"
              onSave={(newValue) => setBar(newValue as boolean)}
            />
            <DataRenderer
              label={t('printers.noStation')}
              value={noStation}
              type="switch"
              textColor="#333"
              onSave={(newValue) => setNoStation(newValue as boolean)}
            />

            <Text style={styles.label}>{t('printers.connection')}</Text>
            <View style={styles.buttonContainer}>
              {renderConnectionOption(t('printers.usb'), 'USB')}
              {renderConnectionOption(t('printers.ethernet'), 'Ethernet')}
              {renderConnectionOption(t('printers.bluetooth'), 'Bluetooth')}
            </View>

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <MaterialIcons name="save" size={24} color="white" />
              <Text style={styles.saveButtonText}>{t('printers.savePrinter')}</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  );
};

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
  errorText: { color: 'red', marginTop: 10, fontSize: 16 },
});

export default NewPrinterScreen;