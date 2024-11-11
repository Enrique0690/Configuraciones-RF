import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import useStorage from '@/hooks/useStorage';
import { handleChange } from '@/hooks/handleChange';
import SearchBar from '@/components/navigation/SearchBar';
import DataRenderer from '@/components/DataRenderer';
import { securityConfig, defaultData } from '@/constants/DataConfig/SecurityConfig';

const STORAGE_KEY = 'securityData';

const SecurityScreen: React.FC = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const { data, saveData } = useStorage(STORAGE_KEY, defaultData);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t('security.header')}</Text>
        {securityConfig.map(({ label, field, type, route, iconName }) => (
          <DataRenderer
            key={label}
            label={t(label)}
            value={data[field]}
            type={type}
            onSave={(newValue) => handleChange(field, newValue, data, saveData)}
            textColor={textColor}
            finalText={t('security.characters')}
            iconName={iconName} 
          />
        ))}
        <TouchableOpacity style={styles.button} onPress={() => router.push('./users/userlist')}>
          <Ionicons name="people-outline" size={20} color={textColor} />
          <Text style={[styles.buttonLabel, { color: textColor }]}>
            {t('security.users')} (5 {t('security.users')})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => router.push('./rols/rollist')}>
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
});

export default SecurityScreen;