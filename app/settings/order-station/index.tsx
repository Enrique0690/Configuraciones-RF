import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import EditDialog from '@/components/modals/EditDialog';
import { Colors } from '@/constants/Colors';
import withDataFetch from '@/components/HOC/withDataFetch';
import { useEditManager } from '@/hooks/useEditManager';

interface StationData {
  Configuracion: any;
  stations: string[];
}

const OrderingStationsScreen = ({ data }: { data: StationData }) => {
  const { t } = useTranslation();
  const stations = data?.stations || [];
  const { isDialogVisible, tempValue: newStation, setTempValue: setNewStation, isLoading, errorMessage,
    openDialog, closeDialog, handleSave, } = useEditManager('',
      async (station) => {
        if (!station.trim()) {
          throw new Error(t('common.fieldCannotBeEmpty'));
        }
        const updatedStations = [...stations, station];
        await data?.Configuracion.Set('stations', updatedStations);
      }
    );
  const handleDeleteStation = (index: number) => {
    const updatedStations = stations.filter((_, i) => i !== index);
    data?.Configuracion.Set('stations', updatedStations);
  };
  return (
    <View style={[styles.container]}>
      <View style={styles.descriptionBox}>
        <TouchableOpacity style={styles.addButton} onPress={openDialog}>
          <Ionicons name="add-circle-outline" size={28} color={Colors.text} />
        </TouchableOpacity>
        <View style={styles.imagePlaceholder} />
        <Text style={[styles.descriptionText, { color: Colors.text }]}>
          {t('stations.description1')}
        </Text>
        <Text style={[styles.descriptionText, { color: Colors.text }]}>
          {t('stations.description2')}
        </Text>
      </View>
      {stations.length === 0 ? (
        <TouchableOpacity onPress={openDialog} style={styles.noStationsContainer}>
          <Text style={[styles.noStationsText, { color: Colors.text }]}>
            {t('stations.noStations')}
          </Text>
        </TouchableOpacity>
      ) : (
        <ScrollView contentContainerStyle={styles.contentContainer}>
          {stations.map((station, index) => (
            <View key={index} style={styles.stationContainer}>
              <Text style={[styles.stationName, { color: Colors.text }]}>{station}</Text>
              <TouchableOpacity onPress={() => handleDeleteStation(index)}>
                <Ionicons name="trash-outline" size={24} color="#FF0000" />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
      <EditDialog
        visible={isDialogVisible}
        value={newStation}
        onChangeText={setNewStation}
        onSave={handleSave}
        onClose={closeDialog}
        title={t('stations.addStationTitle')}
        errorMessage={errorMessage}
        isLoading={isLoading}
      />
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
  addButton: {
    position: 'absolute',
    right: 16,
    marginTop: 10,
  },
  descriptionBox: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 100,
    height: 100,
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
    borderRadius: 10,
  },
  descriptionText: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  stationContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 8,
  },
  stationName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  noStationsContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginVertical: 5,
  },
  noStationsText: {
    fontSize: 20,
    textAlign: 'center',
  },
});

const fetchOrderStationsData = async (dataContext: any) => {
  if (!dataContext?.Configuracion?.download) throw new Error('El método download no está disponible en Configuracion');
  await dataContext.Configuracion.download();
  return dataContext.Configuracion.DATA;
};

export default withDataFetch(OrderingStationsScreen, fetchOrderStationsData);