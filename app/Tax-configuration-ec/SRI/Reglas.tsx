import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import useStorage from '@/hooks/useStorage';
import { useTranslation } from 'react-i18next';
import { reglasConfig, defaultReglasData } from '@/constants/DataConfig/TaxConfig';
import DataRenderer from '@/components/DataRenderer';
import { handleChange } from '@/hooks/handleChange';
import SearchBar from '@/components/navigation/SearchBar';

const STORAGE_KEY = 'reglasNotasEntregaFacturaData';

const Reglas: React.FC = () => {
  const { t } = useTranslation();
  const textColor = useThemeColor({}, 'textsecondary');
  const { data, saveData } = useStorage(STORAGE_KEY, defaultReglasData);

  return (
    <View>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {t('taxConfigurationEC.reglas.sectionTitle')}
      </Text>
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
  );
};

const styles = StyleSheet.create({
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

export default Reglas;
