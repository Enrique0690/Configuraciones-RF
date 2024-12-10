import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import DataRenderer from '@/components/DataRenderer';
import { organizationConfig } from '@/constants/DataConfig/organization';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useConfig } from '@/components/Data/ConfigContext';
import ImageUploader from '@/components/ImageUploader';

const OrganizationScreen = () => {
  const { t } = useTranslation();
  const { dataContext, isLoading } = useConfig();
  const { highlight } = useLocalSearchParams();
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading', { value: t('organization.header') })}</Text>
      </View>
    );
  }
  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ImageUploader
          initialUri={dataContext?.Configuracion.DATA?.imageUrl}
          onSave={async (uri) => {
            await dataContext?.Configuracion.Set('imageUrl', uri);
          }}
          buttonText={t('common.uploadImage')}
        />
        {organizationConfig.map(({ label, id, type, list }) => (
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
        <DataRenderer
          label={t('organization.taxinfo.header')}
          value="/organization/ecuador/tax-info"
          type="buttonlist"
          iconName="document-text"
          textColor={Colors.text}
        />
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
});

export default OrganizationScreen;