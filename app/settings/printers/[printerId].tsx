import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, TouchableWithoutFeedback } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@/components/Data/ConfigContext';
import DataRenderer from '@/components/DataRenderer';
import BluetoothModal from '@/components/Printersconnection/BluetoohModal';
import EthernetModal from '@/components/Printersconnection/EthernetModal';
import UsbModal from '@/components/Printersconnection/USBModal';
import Tooltip from '@/components/elements/tooltip';

const EditPrinterScreen = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { printerId } = useLocalSearchParams();
  const { dataContext, isLoading } = useConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [printerName, setPrinterName] = useState('');
  const [connection, setConnection] = useState<'USB' | 'Ethernet' | 'Bluetooth' | ''>('');
  const [isBluetoothModalVisible, setBluetoothModalVisible] = useState(false);
  const [isUsbModalVisible, setUsbModalVisible] = useState(false);
  const [isEthernetModalVisible, setEthernetModalVisible] = useState(false);
  const [usbConnectionStatus, setUsbConnectionStatus] = useState<string | null>(null);
  const [ethernetConnectionStatus, setEthernetConnectionStatus] = useState<string | null>(null);
  const [bluetoothConnectionStatus, setBluetoothConnectionStatus] = useState<string | null>(null);
  const [noStation, setNoStation] = useState(false);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [stations, setStations] = useState<{ name: string; enabled: boolean }[]>([]);

  const [printOptions, setPrintOptions] = useState({
    deliveryNote: false,
    invoice: false,
    preInvoice: false,
    reports: false,
    order: false,
  });

  useEffect(() => {
    if (dataContext && !isLoading) {
      const printers = dataContext.Configuracion.DATA['printers'] || [];
      const printer = printers.find((p: { id: string | string[]; }) => p.id === printerId);

      if (printer) {
        setPrinterName(printer.name);
        setPrintOptions(printer.options);
        setNoStation(printer.stations.noStation);
        setStations(
          (dataContext.Configuracion.DATA['stations'] || []).map((station: string) => ({
            name: station,
            enabled: printer.stations.selectedStations.includes(station),
          }))
        );
        setConnection(printer.connection);

        if (printer.connection === 'USB') setUsbConnectionStatus(t('printers.connectedToUsb'));
        if (printer.connection === 'Ethernet') setEthernetConnectionStatus(t('printers.connectedToEthernet'));
        if (printer.connection === 'Bluetooth') setBluetoothConnectionStatus(t('printers.connectedToBluetooth'));
      } else {
        setError(t('printers.errorLoadingData'));
      }
    }
  }, [dataContext, printerId, isLoading, t]);

  const handleSave = async () => {
    setLoading(true);
    setError('');

    const updatedPrinter = {
      id: String(printerId),
      name: printerName,
      options: printOptions,
      stations: {
        noStation,
        selectedStations: stations.filter((s) => s.enabled).map((s) => s.name),
      },
      connection,
    };

    try {
      const printers = dataContext?.Configuracion.DATA['printers'] || [];
      const updatedPrinters = printers.map((printer: { id: string; }) =>
        printer.id === String(printerId) ? updatedPrinter : printer
      );
      await dataContext?.Configuracion.Set('printers', updatedPrinters);
      router.push('/settings/printers');
    } catch (error) {
      console.error('Error saving printer data:', error);
      setError(t('common.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleBluetoothSelect = async (device: { id: string; name: string }) => {
    try {
      setBluetoothConnectionStatus(`Conectado a ${device.name}`);
      setBluetoothModalVisible(false);
    } catch (error) {
      console.error("Error al conectar al dispositivo Bluetooth", error);
    }
  };

  const handleUsbSelect = async (device: { id: string; name: string }) => {
    try {
      setUsbConnectionStatus(`Conectado a ${device.name}`);
      setUsbModalVisible(false);
    } catch (error) {
      console.error("Error al conectar al dispositivo USB", error);
    }
  };

  const handleEthernetSelect = async (data: { ip: string; port: string }) => {
    try {
      setEthernetConnectionStatus(`Conectado a IP ${data.ip}, Puerto ${data.port}`);
      setEthernetModalVisible(false);
    } catch (error) {
      console.error("Error en la configuración de Ethernet", error);
    }
  };

  const renderConnectionOption = (label: string, value: 'USB' | 'Ethernet' | 'Bluetooth') => {
    const handlePress = () => {
      setConnection(value);
      if (value === 'Bluetooth') {
        setUsbConnectionStatus(null);
        setEthernetConnectionStatus(null);
        setBluetoothModalVisible(true);
      } else if (value === 'USB') {
        setBluetoothConnectionStatus(null);
        setEthernetConnectionStatus(null);
        setUsbModalVisible(true);
      } else if (value === 'Ethernet') {
        setBluetoothConnectionStatus(null);
        setUsbConnectionStatus(null);
        setEthernetModalVisible(true);
      }
    };

    const connectionStatus =
      value === 'USB' ? usbConnectionStatus :
        value === 'Ethernet' ? ethernetConnectionStatus :
          bluetoothConnectionStatus;

    return (
      <View style={styles.connectionOptionContainer}>
        <TouchableOpacity
          style={[styles.connectionButton, connection === value && styles.selectedButton]}
          onPress={handlePress}
        >
          <Text style={[styles.buttonText, connection === value && styles.selectedButtonText]}>{label}</Text>
        </TouchableOpacity>
        {connectionStatus && <Text style={styles.connectionStatusText}>{connectionStatus}</Text>}
      </View>
    );
  };

  const toggleTooltip = () => {
    setTooltipVisible(!tooltipVisible);
  };

  const handleCloseTooltip = () => {
    setTooltipVisible(false);
  };

  if (loading || isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading, { value: t("printers.header") }')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={() => router.push('/settings/printers')} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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
          <View style={styles.stationsContainer}>
            <View style={styles.labelContainer}>
              <Text style={styles.label}>{t('printers.stations')}</Text>
              <TouchableOpacity
                style={styles.helpIconContainer}
                onPress={toggleTooltip}
              >
                <Text style={styles.helpIcon}>?</Text>
              </TouchableOpacity>
            </View>
            <Tooltip text={t('stations.description1')} visible={tooltipVisible} onClose={handleCloseTooltip} />
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
          </View>
        )}

        <Text style={styles.label}>{t('printers.connection')}</Text>
        <View style={styles.buttonContainer}>
          {renderConnectionOption(t('printers.usb'), 'USB')}
          {renderConnectionOption(t('printers.ethernet'), 'Ethernet')}
          {renderConnectionOption(t('printers.bluetooth'), 'Bluetooth')}
        </View>

        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>
      {isBluetoothModalVisible && (
        <BluetoothModal
          visible={isBluetoothModalVisible}
          onClose={() => setBluetoothModalVisible(false)}
          onSelect={handleBluetoothSelect}
          title="Seleccionar Dispositivo Bluetooth"
        />
      )}
      {isUsbModalVisible && (
        <UsbModal
          visible={isUsbModalVisible}
          onClose={() => setUsbModalVisible(false)}
          onSelect={handleUsbSelect}
          title="Seleccionar Dispositivo USB"
        />
      )}
      {isEthernetModalVisible && (
        <EthernetModal
          visible={isEthernetModalVisible}
          onSave={handleEthernetSelect}
          onClose={() => setEthernetModalVisible(false)}
          title="Configuración Ethernet"
        />
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333'
  },
  label: {
    fontSize: 16,
    color: '#666',
    marginTop: 20,
    marginBottom: 8
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16
  },
  connectionButton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#007AFF',
    minWidth: 80,
    alignItems: 'center',
  },
  selectedButton: {
    backgroundColor: '#007AFF'
  },
  buttonText: {
    fontSize: 14,
    color: '#007AFF'
  },
  selectedButtonText: {
    color: '#fff'
  },
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
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8
  },
  errorText: {
    color: 'red',
    marginTop: 10,
    fontSize: 16
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  loadingText: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 10
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20
  },
  goBackButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  goBackButtonText: {
    color: 'white',
    fontSize: 16
  },
  connectionOptionContainer: {
    alignItems: 'center',
  },
  connectionStatusText: {
    marginTop: 5,
    fontSize: 12,
    color: '#333',
  },
  stationsContainer: {
    marginTop: -20,
    paddingLeft: 40,
    borderRadius: 8,
  },
  helpIconContainer: {
    marginLeft: 10,
    paddingTop: 10,
  },
  helpIcon: {
    fontSize: 18,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  tooltip: {
    position: 'absolute',
    top: 50,
    left: 50,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default EditPrinterScreen;
