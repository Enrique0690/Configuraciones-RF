import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/components/Data/AppContext';
import { useLocalSearchParams } from 'expo-router';
import TabletConfiguration from '@/components/Table-layout/tablelayout';
import DataRenderer from '@/components/DataRenderer';
import { Colors } from '@/constants/Colors';
import { TableConfig } from '@/constants/DataConfig/tablelayout';

const TabletConfigurationScreen = () => {
  const { t } = useTranslation();
  const { dataContext, isLoading } = useAppContext();
  const { highlight } = useLocalSearchParams();
  const { Mesa_mostrarCliente, PedidoEnMesa_MostrarReloj, showCommercialName } = dataContext?.Configuracion.DATA || {};
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }
  return (
    <View style={styles.container}>
      <ScrollView>
        <TabletConfiguration
          showUser={Mesa_mostrarCliente}
          showTime={PedidoEnMesa_MostrarReloj}
          showCommercialName={showCommercialName}
        />
        <View style={styles.groupContainer}>
          {TableConfig.map(({ id, label, type, list }) => (
            <DataRenderer
              key={id}
              label={t(label)}
              value={dataContext?.Configuracion.DATA[id]}
              type={type}
              onSave={async (newValue) => {
                await dataContext?.Configuracion.Set(id, newValue);
              }}
              textColor={Colors.text}
              dataList={list}
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
