import React from 'react';
import { ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import EditableFieldRow from '@/components/Renders/EditableFieldRow';
import { infoTributariaConfig } from '@/constants/DataConfig/organization';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import withDataFetch from '@/components/HOC/withDataFetch';

const InfoTributariaScreen = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  const { highlight } = useLocalSearchParams();
  return (
    <ScrollView>
      {infoTributariaConfig.map(({ label, id, type, list, validation }) => (
        <EditableFieldRow
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
    </ScrollView>
  );
};

const fetchTaxInfoData = async (dataContext: any) => {
  if (!dataContext?.Configuracion?.download) throw new Error('El método download no está disponible en Configuracion');
  await dataContext.Configuracion.download();
  return dataContext.Configuracion.DATA;
};

export default withDataFetch(InfoTributariaScreen, fetchTaxInfoData);