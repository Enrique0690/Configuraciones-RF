import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, ScrollView } from 'react-native';
import { Colors } from '@/constants/Colors';
import { handleChange } from '@/hooks/handleChange';
import useStorage from '@/hooks/useStorage';
import { useTranslation } from 'react-i18next';
import { TableConfig, defaultData } from '@/constants/DataConfig/tablelayout';
import DataRenderer from '@/components/DataRenderer';
import SearchBar from '@/components/navigation/SearchBar';
import { useLocalSearchParams } from 'expo-router';
import TabletConfiguration from '@/components/Table-layout/tablelayout';

const TabletConfigurationScreen: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading, error, saveData, reloadData } = useStorage('tabletConfiguration', defaultData);
  const { highlight } = useLocalSearchParams();
  const { Mesa_mostrarCliente, PedidoEnMesa_MostrarReloj, showCommercialName } = data;

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('tabletConfiguration.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('tablelayout.loadError')}</Text>
        <TouchableOpacity onPress={reloadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('tablelayout.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.sectionTitle, { color: Colors.text }]}>
        {t('tablelayout.header')}
      </Text>
      <ScrollView>
        <TabletConfiguration
          showUser={Mesa_mostrarCliente}
          showTime={PedidoEnMesa_MostrarReloj}
          showCommercialName={showCommercialName}
        />
        <View style={styles.groupContainer}>
          {TableConfig.map(({ id, label, type }) => (
            <DataRenderer
              key={id}
              label={t(label)}
              value={data[id]}
              type={type}
              onSave={(newValue) => handleChange(id, newValue, data, saveData)}
              textColor={Colors.text}
              highlight={highlight === id}
            />
          ))}
        </View>
      </ScrollView>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex',
      android: 'flex',
      default: 'none',
    }),
  },
  groupContainer: {
    paddingTop: 40,
    marginBottom: 20,
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
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
  },
});

export default TabletConfigurationScreen;
