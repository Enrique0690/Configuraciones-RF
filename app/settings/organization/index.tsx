import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import DataRenderer from '@/components/DataRenderer';
import { organizationConfig } from '@/constants/DataConfig/organization';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useAppContext } from '@/components/Data/AppContext';
import ImageUploader from '@/components/ImageUploader';
import { LoadingErrorState } from '@/components/Data/LoadingErrorState';

const OrganizationScreen = () => {
  const { t } = useTranslation();
  const { dataContext, isLoading, error } = useAppContext();
  const { highlight } = useLocalSearchParams();
  const loadingErrorState = <LoadingErrorState isLoading={isLoading} error={error} />;
  if (isLoading || error) return loadingErrorState;
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
});

export default OrganizationScreen;