import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/navigation/SearchBar';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import EditDialog from '@/components/modals/EditModal';

const OrderingStationsScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const { t } = useTranslation();
  const router = useRouter();
  const [stations, setStations] = useState<string[]>([]);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [newStation, setNewStation] = useState('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStations = async () => {
      try {
        setLoading(true);
        const storedStations = await AsyncStorage.getItem('stations');
        if (storedStations) {
          setStations(JSON.parse(storedStations));
        }
      } catch (err) {
        setError(t('stations.loadError'));
      } finally {
        setLoading(false);
      }
    };
    loadStations();
  }, []);

  const saveStations = async (updatedStations: string[]) => {
    try {
      await AsyncStorage.setItem('stations', JSON.stringify(updatedStations));
      setStations(updatedStations);
    } catch (err) {
      setError(t('stations.saveError'));
    }
  };

  const handleAddStation = () => {
    if (newStation.trim()) {
      const updatedStations = [...stations, newStation];
      saveStations(updatedStations);
      setNewStation('');
      setDialogVisible(false);
    }
  };

  const handleDeleteStation = (index: number) => {
    const updatedStations = stations.filter((_, i) => i !== index);
    saveStations(updatedStations);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('stations.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('stations.loadError')}</Text>
        <TouchableOpacity onPress={() => router.push('/')} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('stations.goBackHome')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <View style={styles.titleContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t('stations.header')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => setDialogVisible(true)}>
          <Ionicons name="add-circle-outline" size={28} color={textColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.descriptionBox}>
        <View style={styles.imagePlaceholder} />
        <Text style={[styles.descriptionText, { color: textColor }]}>
          {t('stations.description1')}
        </Text>
        <Text style={[styles.descriptionText, { color: textColor }]}>
          {t('stations.description2')}
        </Text>
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {stations.map((station, index) => (
          <View key={index} style={styles.stationContainer}>
            <Text style={[styles.stationName, { color: textColor }]}>{station}</Text>
            <TouchableOpacity onPress={() => handleDeleteStation(index)}>
              <Ionicons name="trash-outline" size={24} color="#FF0000" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <EditDialog
        visible={dialogVisible}
        value={newStation}
        onChangeText={setNewStation}
        onSave={handleAddStation}
        onClose={() => setDialogVisible(false)}
        title="Agregar Nueva Estación"
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
    })
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
    marginLeft: 10,
  },
  descriptionBox: {
    backgroundColor: '#f9f9f9',
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
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  goBackButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  goBackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default OrderingStationsScreen;