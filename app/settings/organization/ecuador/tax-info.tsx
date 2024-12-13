import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';
import DataRenderer from '@/components/DataRenderer';
import { infoTributariaConfig } from '@/constants/DataConfig/organization';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import withDataFetch from '@/components/HOC/withDataFetch';

const InfoTributariaScreen = ({ data }: { data: any }) => {
  const { t } = useTranslation();
  const { highlight } = useLocalSearchParams();
  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {infoTributariaConfig.map(({ label, id, type, list }) => (
          <DataRenderer
            key={id}
            label={t(label)}
            value={data?.Configuracion.DATA[id]}
            type={type}
            onSave={async (newValue) => {
              await data?.Configuracion.Set(id, newValue);
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
  }
});

export default withDataFetch(InfoTributariaScreen, 'download');