import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import useStorage from '@/hooks/useStorage';
import { useTranslation } from 'react-i18next';
import { reglasConfig, defaultReglasData } from '@/constants/DataConfig/TaxConfig';
import DataRenderer from '@/components/DataRenderer';
import { handleChange } from '@/hooks/handleChange';
import SearchBar from '@/components/navigation/SearchBar';

const Reglas: React.FC = () => {
  const { t } = useTranslation();
  const textColor = useThemeColor({}, 'textsecondary');
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const { data, loading, error, saveData, reloadData } = useStorage('reglasNotasEntregaFacturaData', defaultReglasData);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('taxConfigurationEC.reglas.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('taxConfigurationEC.reglas.loadError')}</Text>
        <TouchableOpacity onPress={reloadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('taxConfigurationEC.reglas.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {t('taxConfigurationEC.reglas.sectionTitle')}
      </Text>
      <View style={styles.groupContainer}>
        {reglasConfig.map(({ label, field, type }) => (
          <DataRenderer
            key={field}
            label={t(label)}
            value={data[field]}
            type={type}
            onSave={(newValue) => handleChange(field, newValue, data, saveData)}
            textColor={textColor}
          />
        ))}
      </View>
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
    marginVertical: 16,
    textAlign: 'center',
  },
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex',
      android: 'flex',
      default: 'none',
    }),
  },
  groupContainer: {
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
});

export default Reglas;