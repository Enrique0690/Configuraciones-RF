import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import DataRenderer from '@/components/DataRenderer';
import { organizationConfig } from '@/constants/DataConfig/organization';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import ImageUploader from '@/components/ImageUploader';
import { LoadingErrorState } from '@/components/Data/LoadingErrorState';
import { useFetch } from '@/hooks/useFetch';

const fetchOrganizationData = async (dataContext: any) => {
  await dataContext.Configuracion.download();
  return dataContext.Configuracion.DATA;
};

const OrganizationScreen = () => {
  const { t } = useTranslation();
  const { highlight } = useLocalSearchParams();
  const { data, isLoading, error } = useFetch(fetchOrganizationData);
  if (isLoading || error) return <LoadingErrorState isLoading={isLoading} error={error} />;
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <ImageUploader
          initialUri={data?.imageUrl} 
          onSave={async (uri) => {
            await data?.Configuracion.Set('imageUrl', uri);
          }}
          buttonText={t('common.uploadImage')}
        />
        {organizationConfig.map(({ label, id, type, list, validation }) => (
          <DataRenderer
            key={id}
            label={t(label)}
            value={data?.[id]} 
            type={type}
            onSave={async (newValue) => {
              await data?.Configuracion.Set(id, newValue);
            }}
            textColor={Colors.text}
            dataList={list}
            highlight={highlight === id}
            validation={validation}
          />
        ))}
        <DataRenderer
          label={t('organization.taxinfo.header')}
          value="/settings/organization/ecuador/tax-info"
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