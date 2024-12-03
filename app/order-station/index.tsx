import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import SearchBar from '@/components/navigation/SearchBar';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import EditDialog from '@/components/modals/EditModal';
import { Colors } from '@/constants/Colors';
import { useConfig } from '@/components/DataContext/ConfigContext';

interface StationData {
  stations: string[];
}

const OrderingStationsScreen: React.FC = () => {
  const { t } = useTranslation();
  const { dataContext, isLoading } = useConfig();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newStation, setNewStation] = useState('');
  const stations: StationData['stations'] = dataContext?.Configuracion.DATA?.stations || [];
  const handleAddStation = () => {
    if (newStation.trim()) {
      const updatedStations = [...stations, newStation];
      dataContext?.Configuracion.Set('stations', updatedStations);
      setNewStation('');
      setDialogVisible(false);
    }
  };

  const handleDeleteStation = (index: number) => {
    const updatedStations = stations.filter((_, i) => i !== index);
    dataContext?.Configuracion.Set('stations', updatedStations);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <View style={styles.descriptionBox}>
        <TouchableOpacity style={styles.addButton} onPress={() => setDialogVisible(true)}>
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
        <TouchableOpacity onPress={() => setDialogVisible(true)} style={styles.noStationsContainer}>
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
        visible={dialogVisible}
        value={newStation}
        onChangeText={setNewStation}
        onSave={handleAddStation}
        onClose={() => setDialogVisible(false)}
        title={t('stations.addStationTitle')}
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
  searchBarContainer: {
    marginBottom: 20,
    display: Platform.select({
      ios: 'flex',
      android: 'flex',
      default: 'none',
    }),
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
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

export default OrderingStationsScreen;