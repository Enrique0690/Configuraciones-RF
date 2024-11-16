import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import useStorage from '@/hooks/useStorage';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import { secuenciaFacturaConfig, defaultSecuenciaFacturaData } from '@/constants/DataConfig/TaxConfig';
import DataRenderer from '@/components/DataRenderer';
import { handleChange } from '@/hooks/handleChange';
import SearchBar from '@/components/navigation/SearchBar';

const STORAGE_KEY = 'secuenciaFacturaData';

const SecuenciaFactura: React.FC = () => {
    const { t } = useTranslation();
    const textColor = useThemeColor({}, 'textsecondary');
    const { data, saveData } = useStorage(STORAGE_KEY, defaultSecuenciaFacturaData);

    return (
        <View>
            <View style={styles.searchBarContainer}>
                <SearchBar />
            </View>
            <Text style={[styles.sectionTitle, { color: textColor }]}>{t('taxConfigurationEC.secuenciaFactura.sectionTitle')}</Text>

            {secuenciaFacturaConfig.map(({ label, field, type }) => (
                <DataRenderer
                    key={field}
                    label={t(label)}
                    value={data[field]}
                    type={type}
                    textColor={textColor}
                    onSave={(newValue) => handleChange(field, newValue, data, saveData)}
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

export default SecuenciaFactura;
