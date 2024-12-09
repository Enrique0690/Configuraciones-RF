import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { handleChange } from '@/hooks/handleChange';
import { useConfig } from '@/components/Data/ConfigContext';
import { useTranslation } from 'react-i18next';
import { securityConfig} from '@/constants/DataConfig/SecurityConfig';
import DataRenderer from '@/components/DataRenderer';
import SearchBar from '@/components/navigation/SearchBar';
import { useLocalSearchParams, useRouter } from 'expo-router';

const SecurityScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { highlight } = useLocalSearchParams();
  const { dataContext, isLoading } = useConfig();

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
      <View style={styles.groupContainer}>
        {securityConfig.map(({ label, id, type}) => (
          <DataRenderer
            key={label}
            label={t(label)}
            value={dataContext?.Configuracion.DATA[id]}
            type={type}
            onSave={async (newValue) => {
              await dataContext?.Configuracion.Set(id, newValue);
            }
            }
            textColor={Colors.text}
            highlight={highlight === id}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.button} onPress={() => router.push('./security/users/userlist')}>
        <Ionicons name="people-outline" size={24} color={Colors.text} />
        <Text style={[styles.buttonLabel, { color: Colors.text }]}>
          {t('security.users')}{' '}
          {dataContext?.Configuracion.DATA['users']?.length
              ? `(${dataContext?.Configuracion.DATA['users'].length})`
              : ''}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('./security/rols/rollist')}>
        <Ionicons name="briefcase-outline" size={24} color={Colors.text} />
        <Text style={[styles.buttonLabel, { color: Colors.text }]}>
          {t('security.roles')}{' '}
          {dataContext?.Configuracion.DATA['roles']?.length
              ? `(${dataContext?.Configuracion.DATA['roles'].length})`
              : ''}
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
    marginBottom: 16,
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