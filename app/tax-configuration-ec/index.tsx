import React from 'react';
import { View, StyleSheet, ScrollView, Platform, Text } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor'; 
import SearchBar from '@/components/navigation/SearchBar';
import { useTranslation } from 'react-i18next'; 
import { taxConfig } from '@/constants/DataConfig/TaxConfig'; 
import DataRenderer from '@/components/DataRenderer'; 

const TaxConfiguration: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const { t } = useTranslation();

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {t('taxConfigurationEC.infoTributaria.sectionTitle')}
      </Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {taxConfig.map(({ label, type, route, iconName }) => (
          <DataRenderer
            key={label}
            label={t(label)} 
            value={route}
            type={type} 
            iconName={iconName} 
            textColor={textColor} 
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
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex',
      android: 'flex',
      default: 'none', 
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
});

export default TaxConfiguration;