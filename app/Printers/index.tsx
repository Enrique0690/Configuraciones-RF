import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Printer {
  id: string;
  name: string;
  connection: string;
  deliveryNotes: boolean;
  invoice: boolean;
  preInvoice: boolean;
  kitchen: boolean;
  bar: boolean;
  noStation: boolean;
}

const PrintersListScreen: React.FC = () => {
  const [printers, setPrinters] = useState<Printer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'textsecondary');
  const router = useRouter();
  const { t } = useTranslation();

  useEffect(() => {
    const loadPrinters = async () => {
      try {
        setLoading(true);
        const storedPrinters = await AsyncStorage.getItem('printers');
        if (storedPrinters) {
          setPrinters(JSON.parse(storedPrinters));
        }
      } catch (err) {
        setError(t('printers.errorLoadingData')); 
      } finally {
        setLoading(false);
      }
    };

    loadPrinters();
  }, []);

  const handleCreateNewPrinter = () => {
    router.push('./Printers/newprinter');
  };

  const handlePrinterClick = async (id: string) => {
    try {
      await AsyncStorage.setItem('selectedPrinterId', id);
      router.push(`./Printers/${id}`);
    } catch (err) {
      setError(t('printers.errorStoringPrinterId'));
    }
  };

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
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('printers.goBackHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{t('printers.titleindex')}</Text>
        <TouchableOpacity onPress={handleCreateNewPrinter} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {printers.length === 0 ? (
          <Text style={[styles.noPrintersText, { color: textColor }]}>{t('printers.noPrinters')}</Text>
        ) : (
          printers.map((printer) => (
            <TouchableOpacity 
              key={printer.id} 
              style={styles.printerItem} 
              onPress={() => handlePrinterClick(printer.id)}
            >
              <View style={[styles.colorCircle, { backgroundColor: printer.connection === 'wifi' ? '#4CAF50' : '#FF5722' }]} />
              <View style={styles.printerDetails}>
                <Text style={[styles.printerText, { color: textColor }]}>{printer.name}</Text>
                <Text style={[styles.printerConnection, { color: textColor }]}>{printer.connection}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  printerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  printerDetails: {
    flex: 1,
  },
  printerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  printerConnection: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noPrintersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default PrintersListScreen;