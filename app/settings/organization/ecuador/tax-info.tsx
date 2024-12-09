import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/navigation/SearchBar';
import DataRenderer from '@/components/DataRenderer';
import { infoTributariaConfig } from '@/constants/DataConfig/organization';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useConfig } from '@/components/Data/ConfigContext';

const InfoTributaria: React.FC = () => {
  const { t } = useTranslation();
  const { dataContext, isLoading } = useConfig();
  const { highlight } = useLocalSearchParams();
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading', { value: t('organization.taxinfo.header') })}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>
        {infoTributariaConfig.map(({ label, id, type, list }) => (
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
  contentContainer: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
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