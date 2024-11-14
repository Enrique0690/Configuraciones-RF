import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import UUID from 'react-native-uuid';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; 
import DataRenderer from '@/components/DataRenderer';
import EthernetModal from '@/components/modals/EthernetModal';
import ListModal from '@/components/modals/ListModal';

const NewPrinterScreen = () => {
  const { t } = useTranslation(); 
  const router = useRouter();
  const [name, setName] = useState('');
  const [deliveryNote, setDeliveryNote] = useState(false);
  const [invoice, setInvoice] = useState(false);
  const [preInvoice, setPreInvoice] = useState(false);
  const [reports, setReports] = useState(false);
  const [order, setOrder] = useState(false);
  const [noStation, setNoStation] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState('');
  const [stations, setStations] = useState<{ name: string; enabled: boolean }[]>([]);
  const [connection, setConnection] = useState<'USB' | 'Ethernet' | 'Bluetooth' | ''>('');
  const [showListModal, setShowListModal] = useState(false);
const [showEthernetModal, setShowEthernetModal] = useState(false);
const [selectedUSB, setSelectedUSB] = useState('');  // Para almacenar la opción seleccionada en el modal de USB
const [selectedEthernet, setSelectedEthernet] = useState('');  // Para almacenar la opción seleccionada en el modal de Ethernet
const [selectedBluetooth, setSelectedBluetooth] = useState('');  // Si tienes un modal para Bluetooth


  useEffect(() => {
    const loadStations = async () => {
      try {
        const storedStations = await AsyncStorage.getItem('stations');
        if (storedStations) {
          const parsedStations = JSON.parse(storedStations);
          const initializedStations = parsedStations.map((station: string) => ({
            name: station,
            enabled: false,
          }));
          setStations(initializedStations);
        }
      } catch (error) {
        setError(t('stations.loadError'));
      } finally {
        setLoading(false);
      }
    };
    loadStations();
  }, []);

  const handleSave = async () => {
    setLoading(true); 
    setError(''); 
    const id = UUID.v4();
    const printerData = {
      id,
      name,
      options: { deliveryNote, invoice, preInvoice, reports, order },
      stations: { noStation, selectedStations: stations.filter(s => s.enabled).map(s => s.name) },
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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('printers.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('printers.goBackHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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
        <DataRenderer
          label={t('printers.order')}
          value={order}
          type="switch"
          textColor="#333"
          onSave={(newValue) => setOrder(newValue as boolean)}
        />

        {order && (
          <>
            <Text style={styles.label}>{t('printers.stations')}</Text>
            <DataRenderer
              label={t('printers.noStation')}
              value={noStation}
              type="switch"
              textColor="#333"
              onSave={(newValue) => setNoStation(newValue as boolean)}
            />
            {stations.length > 0 && (
              <>
                {stations.map((station, index) => (
                  <DataRenderer
                    key={index}
                    label={station.name}
                    value={station.enabled}
                    type="switch"
                    textColor="#333"
                    onSave={(newValue) =>
                      setStations((prevStations) =>
                        prevStations.map((s, i) =>
                          i === index ? { ...s, enabled: newValue as boolean } : s
                        )
                      )
                    }
                  />
                ))}
              </>
            )}
          </>
        )}

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
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: { flexGrow: 1 },
  container: { flex: 1, padding: 20, backgroundColor: '#f9f9f9' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 16, color: '#333' },
  label: { fontSize: 16, color: '#666', marginTop: 20, marginBottom: 8 },
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
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { fontSize: 18, color: '#4CAF50', marginTop: 10 },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  goBackButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  goBackButtonText: { color: 'white', fontSize: 16 },
});

export default NewPrinterScreen;
