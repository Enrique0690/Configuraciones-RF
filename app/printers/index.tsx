import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/navigation/SearchBar';
import { useConfig } from '@/components/Data/ConfigContext';
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
  const { dataContext, isLoading } = useConfig();
  const printers: Printer[] = dataContext?.Configuracion.DATA['printers'] || [];
  const router = useRouter();
  const { t } = useTranslation();
  const handleCreateNewPrinter = () => { router.push('./printers/newprinter'); };
  const handlePrinterClick = (id: string) => { router.push(`./printers/${id}`); };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (!printers || printers.length === 0) {
    return (
      <View style={styles.container}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>
        <View style={styles.contentContainer}>
          <TouchableOpacity onPress={handleCreateNewPrinter}>
            <Text style={[styles.noPrintersText, { color: Colors.text }]}>
              {t('printers.noPrinters')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {printers.map((printer) => (
          <TouchableOpacity
            key={printer.id}
            style={styles.printerItem}
            onPress={() => handlePrinterClick(printer.id)}
          >
            <View style={styles.printerDetails}>
              <Text style={[styles.printerText, { color: Colors.text }]}>{printer.name}</Text>
              <Text style={[styles.printerConnection, { color: Colors.text }]}>
                {printer.connection}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  addButton: {
    position: 'absolute',
    right: 16,
    marginTop: 10
  },
  contentContainer: {
    marginTop: 16,
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
  searchBarContainer: {
    display: Platform.select({ ios: 'flex', android: 'flex', default: 'none' }),
    marginBottom: 16,
  },
});

export default PrintersListScreen;