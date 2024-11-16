import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Platform, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/navigation/SearchBar';
import TabletConfiguration from '@/components/Tablet-configuration/Tablet-configuration';
import { useTranslation } from 'react-i18next'; 
import AsyncStorage from '@react-native-async-storage/async-storage'; 

const TabletConfigurationScreen: React.FC = () => {
  const { t } = useTranslation(); 
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const [showUser, setShowUser] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showCommercialName, setShowCommercialName] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [loadError, setLoadError] = useState(false); 

  const saveSettings = async () => {
    setLoading(true); 
    const settings = {
      showUser,
      showTime,
      showCommercialName,
    };
    try {
      await AsyncStorage.setItem('tabletConfiguration', JSON.stringify(settings));
      setLoading(false); 
    } catch (error) {
      console.error('Error al guardar la configuración:', error);
      setLoading(false); 
    }
  };
  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await AsyncStorage.getItem('tabletConfiguration');
        if (settings) {
          const parsedSettings = JSON.parse(settings);
          setShowUser(parsedSettings.showUser);
          setShowTime(parsedSettings.showTime);
          setShowCommercialName(parsedSettings.showCommercialName);
        }
        setLoading(false); 
      } catch (error) {
        console.error('Error al cargar la configuración:', error);
        setLoadError(true);
        setLoading(false); 
      }
    };
    loadSettings();
  }, []);

  useEffect(() => {
    if (!loading) {
      saveSettings();
    }
  }, [showUser, showTime, showCommercialName]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('tabletConfiguration.loading')}</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('tabletConfiguration.loadError')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{t('tabletConfiguration.header')}</Text>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TabletConfiguration
          showUser={showUser}
          showTime={showTime}
          showCommercialName={showCommercialName}
        />
        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>{t('tabletConfiguration.showUser')}</Text>
            <Switch value={showUser} onValueChange={setShowUser} />
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>{t('tabletConfiguration.showTime')}</Text>
            <Switch value={showTime} onValueChange={setShowTime} />
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>{t('tabletConfiguration.showCommercialName')}</Text>
            <Switch value={showCommercialName} onValueChange={setShowCommercialName} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
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
  switchContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
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
});

export default TabletConfigurationScreen;