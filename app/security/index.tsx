import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { handleChange } from '@/hooks/handleChange';
import useStorage from '@/hooks/useStorage';
import { useTranslation } from 'react-i18next';
import { securityConfig, defaultData } from '@/constants/DataConfig/SecurityConfig'; 
import DataRenderer from '@/components/DataRenderer'; 
import SearchBar from '@/components/navigation/SearchBar';
import { useLocalSearchParams, useRouter } from 'expo-router';

const SecurityScreen: React.FC = () => {
  const textColor = useThemeColor({}, 'textsecondary');
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const { t } = useTranslation();
  const router = useRouter();
  const { data, loading, error, saveData, reloadData } = useStorage('securityData', defaultData);
  const { highlight } = useLocalSearchParams();
  const { data: usersData, loading: usersLoading, error: usersError } = useStorage('users', []);
  const { data: rolesData, loading: rolesLoading, error: rolesError } = useStorage('roles', []);

  if (loading || usersLoading || rolesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('security.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('security.loadError')}</Text>
        <TouchableOpacity onPress={reloadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('security.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        {t('security.header')}
      </Text>
      <View style={styles.groupContainer}>
      {securityConfig.map(({ label, field, type, finalText }) => (
          <DataRenderer
            key={label}
            label={t(label)}
            value={data[field]}
            type={type}
            onSave={(newValue) => handleChange(field, newValue, data, saveData)}
            textColor={textColor}
            finalText={t(finalText as string)}
            highlight={highlight === label}
          />
        ))}
      </View>
      
      <TouchableOpacity style={styles.button} onPress={() => router.push('./Security/users/userlist')}>
        <Ionicons name="people-outline" size={24} color={textColor} />
        <Text style={[styles.buttonLabel, { color: textColor }]}>
          {t('security.users')}{' '}
          {!usersError && usersData && usersData.length > 0 ? `(${usersData.length})` : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('./Security/rols/rollist')}>
        <Ionicons name="briefcase-outline" size={24} color={textColor} />
        <Text style={[styles.buttonLabel, { color: textColor }]}>
          {t('security.roles')}{' '}
          {!rolesError && rolesData && rolesData.length > 0 ? `(${rolesData.length})` : ''}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex',
      android: 'flex',
      default: 'none',
    }),
  },
  groupContainer: {
    marginBottom: 20,
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
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
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