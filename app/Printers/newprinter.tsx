import React, { useEffect, useState } from 'react'; 
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import UUID from 'react-native-uuid';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; 
import useStorage from '@/hooks/useStorage'; 
import DataRenderer from '@/components/DataRenderer';

interface Printer {
  id: string;
  name: string;
  options: {
    deliveryNote: boolean;
    invoice: boolean;
    preInvoice: boolean;
    reports: boolean;
    order: boolean;
  };
  stations: {
    noStation: boolean;
    selectedStations: string[];
  };
  connection: 'USB' | 'Ethernet' | 'Bluetooth' | '';
}

const NewPrinterScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data: stationsData, loading: stationsLoading, error: stationsError, reloadData: reloadStations } = useStorage<string[]>('stations', []);
  const { data: printersData, saveData: savePrintersData } = useStorage<Printer[]>('printers', []);
  const [printerName, setPrinterName] = useState('');
  const [connection, setConnection] = useState<'USB' | 'Ethernet' | 'Bluetooth' | ''>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Opciones de impresión
  const [printOptions, setPrintOptions] = useState({
    deliveryNote: false,
    invoice: false,
    preInvoice: false,
    reports: false,
    order: false,
  });

  // Estados para estaciones
  const [noStation, setNoStation] = useState(false);
  const [stations, setStations] = useState<{ name: string; enabled: boolean }[]>([]);

  // Cargar datos iniciales de las estaciones
  useEffect(() => {
    if (!stationsLoading && !stationsError) {
      const initializedStations = (stationsData || []).map((station) => ({
        name: station,
        enabled: false,
      }));
      setStations(initializedStations);
    }
  }, [stationsData, stationsLoading, stationsError]);

  // Maneja el guardado de la impresora
  const handleSave = async () => {
    setLoading(true);
    setError('');

    const newPrinter = {
      id: UUID.v4(),
      name: printerName,
      options: printOptions,
      stations: {
        noStation,
        selectedStations: stations.filter(s => s.enabled).map(s => s.name),
      },
      connection,
    };

    try {
      const updatedPrinters: Printer[] = [...(printersData || []), newPrinter];
      await savePrintersData(updatedPrinters);
      router.push('/Printers');
    } catch (error) {
      console.error('Error saving printer data:', error);
      setError(t('printers.errorSaving'));
    } finally {
      setLoading(false);
    }
  };

  // Función para renderizar opciones de conexión
  const renderConnectionOption = (label: string, value: 'USB' | 'Ethernet' | 'Bluetooth') => (
    <TouchableOpacity
      style={[styles.connectionButton, connection === value && styles.selectedButton]}
      onPress={() => setConnection(value)}
    >
      <Text style={[styles.buttonText, connection === value && styles.selectedButtonText]}>{label}</Text>
    </TouchableOpacity>
  );

  // Renderizado condicional según estados
  if (loading || stationsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('printers.loading')}</Text>
      </View>
    );
  }

  if (error || stationsError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || stationsError}</Text>
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
          value={printerName}
          type="input"
          textColor="#333"
          onSave={(newValue) => setPrinterName(newValue as string)}
        />

        <Text style={styles.label}>{t('printers.printingSettings')}</Text>
        {Object.keys(printOptions).map((optionKey) => (
          <DataRenderer
            key={optionKey}
            label={t(`printers.${optionKey}`)}
            value={printOptions[optionKey as keyof typeof printOptions]}
            type="switch"
            textColor="#333"
            onSave={(newValue) =>
              setPrintOptions((prev) => ({
                ...prev,
                [optionKey]: newValue as boolean,
              }))
            }
          />
        ))}

        {printOptions.order && (
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
