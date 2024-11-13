import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import useStorage from '@/hooks/useStorage';
import { handleChange } from '@/hooks/handleChange';
import SearchBar from '@/components/navigation/SearchBar';
import DataRenderer from '@/components/DataRenderer';
import { securityConfig, defaultData } from '@/constants/DataConfig/SecurityConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SecurityScreen: React.FC = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const { data, saveData } = useStorage('securityData', defaultData);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const savedData = await AsyncStorage.getItem('securityData');
        if (savedData) {
          saveData(JSON.parse(savedData));
        }
        setLoading(false); 
      } catch (error) {
        console.error('Error al cargar los datos:', error);
        setLoadError(true);
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('security.loading')}</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('security.loadError')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t('security.header')}</Text>
        {securityConfig.map(({ label, field, type, iconName, finalText }) => (
          <DataRenderer
            key={label}
            label={t(label)}
            value={data[field]}
            type={type}
            onSave={(newValue) => handleChange(field, newValue, data, saveData)}
            textColor={textColor}
            finalText={t(finalText as any)}
            iconName={iconName} 
          />
        ))}
        <TouchableOpacity style={styles.button} onPress={() => router.push('./Security/users/userlist')}>
          <Ionicons name="people-outline" size={20} color={textColor} />
          <Text style={[styles.buttonLabel, { color: textColor }]}>
            {t('security.users')} (5 {t('security.users')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('./Security/rols/rollist')}>
          <Ionicons name="briefcase-outline" size={20} color={textColor} />
          <Text style={[styles.buttonLabel, { color: textColor }]}>
            {t('security.roles')} (3 {t('security.roles')})
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
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
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginVertical: 8,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
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

export default SecurityScreen;
