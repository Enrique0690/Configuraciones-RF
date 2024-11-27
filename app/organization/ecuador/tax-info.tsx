import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { handleChange } from '@/hooks/handleChange';
import useStorage from '@/hooks/useStorage';
import { useTranslation } from 'react-i18next';
import { infoTributariaConfig, defaultInfoTributariaData } from '@/constants/DataConfig/organization';
import DataRenderer from '@/components/DataRenderer'; 
import SearchBar from '@/components/navigation/SearchBar';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';

const InfoTributaria: React.FC = () => {
  const { t } = useTranslation();
  const { data, loading, error, saveData, reloadData } = useStorage('infoTributariaData', defaultInfoTributariaData);
  const { highlight } = useLocalSearchParams();
  const router = useRouter();
  const firstGroup = infoTributariaConfig.slice(0, 3);
  const secondGroup = infoTributariaConfig.slice(3);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('common.loadError')}</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('printers.goBackHome')}</Text>
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
        {t('organization.taxinfo.header')}
      </Text>
      <View style={styles.groupContainer}>
        {firstGroup.map(({ label, id, type, list }) => (
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
      <View style={styles.groupContainer}>
        {secondGroup.map(({ label, id, type, list }) => (
          <DataRenderer
            key={id}
            label={t(label)}
            value={data[id]}
            type={type}
            onSave={(newValue) => handleChange(id, newValue, data, saveData)}
            textColor={Colors.text}
            highlight={highlight === id}
            dataList={list}
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
  goBackButtonText: { color: 'white', fontSize: 16 },
  connectionOptionContainer: {
    alignItems: 'center',
  },
  goBackButton: {
    marginTop: 20,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
});

export default InfoTributaria;