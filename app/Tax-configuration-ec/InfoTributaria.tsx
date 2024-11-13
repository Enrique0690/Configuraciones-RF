import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { handleChange } from '@/hooks/handleChange';
import useStorage from '@/hooks/useStorage';
import { useTranslation } from 'react-i18next';
import { infoTributariaConfig, defaultInfoTributariaData } from '@/constants/DataConfig/TaxConfig'; 
import DataRenderer from '@/components/DataRenderer'; 
import SearchBar from '@/components/navigation/SearchBar';

const STORAGE_KEY = 'infoTributariaData';

const InfoTributaria: React.FC = () => {
  const textColor = useThemeColor({}, 'textsecondary');
  const { t } = useTranslation();
  const { data, saveData } = useStorage(STORAGE_KEY, defaultInfoTributariaData);

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {t('taxConfigurationEC.infoTributaria.sectionTitle')}
      </Text>

      {infoTributariaConfig.map(({ label, field, type }) => (
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  searchBarContainer: {
    display: Platform.select({ ios: 'flex', android: 'flex', default: 'none' }),
  },
});

export default InfoTributaria;
