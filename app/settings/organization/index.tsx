import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import EditableFieldRow from '@/components/Renders/EditableFieldRow';
import ButtonRow from '@/components/Renders/ButtonRow';
import { organizationConfig } from '@/constants/DataConfig/organization';
import { useLocalSearchParams } from 'expo-router';
import ImageUploader from '@/components/ImageUploader';
import withDataFetch from '@/components/HOC/withDataFetch';

const OrganizationScreen = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  const { highlight } = useLocalSearchParams();
  return (
    <ScrollView>
      <ImageUploader
        initialUri={data?.imageUrl}
        onSave={async (uri) => {
          await data?.Configuracion.Set('imageUrl', uri);
        }}
        buttonText={t('common.uploadImage')}
      />
      {organizationConfig.map(({ label, id, type, list, validation }) => (
        <EditableFieldRow
          key={id}
          label={t(label)}
          value={data?.[id]}
          type={type}
          onSave={async (newValue) => {
            await data?.Configuracion.Set(id, newValue);
          }}
          dataList={list}
          highlight={highlight === id}
          validation={validation}
        />
      ))}
      <ButtonRow
        label={t('organization.taxinfo.header')}
        route="/settings/organization/ecuador/tax-info"
        iconName="document-text"
      />
    </ScrollView>
  );
};

const fetchOrganizationData = async (dataContext: any) => {
  if (!dataContext?.Configuracion?.download) throw new Error('El método download no está disponible en Configuracion');
  await dataContext.Configuracion.download();
  return dataContext.Configuracion.DATA;
};

export default withDataFetch(OrganizationScreen, fetchOrganizationData);