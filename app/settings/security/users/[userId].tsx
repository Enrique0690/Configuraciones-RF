import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router, useLocalSearchParams } from 'expo-router';
import DataRenderer from '@/components/DataRenderer';
import useStorage from '@/hooks/useStorage';
import { Colors } from '@/constants/Colors';

const EditUserScreen: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useLocalSearchParams();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: roles, loading: rolesLoading } = useStorage('roles', []);
  const roleNames = roles.map((role: { name: string }) => role.name);

  useEffect(() => {
    const loadUserData = async () => {
      if (!userId) {
        setError(t('security.user.userNotFound'));
        return;
      }

      setLoading(true);
      try {
        const storedUsers = await AsyncStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];
        const user = users.find((user: { id: string }) => user.id === userId);

        if (user) {
          setName(user.name);
          setEmail(user.email);
          setRole(user.role);
          setPassword(user.password || '');
        } else {
          setError(t('security.user.userNotFound'));
        }
      } catch (error) {
        setError(t('security.user.loadError'));
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [userId, t]);

  const handleSave = async () => {
    setLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex((user: { id: string }) => user.id === userId);

      if (userIndex !== -1) {
        users[userIndex] = { id: userId, name, email, role, password };
        await AsyncStorage.setItem('users', JSON.stringify(users));
        router.push('./userlist');
      }
    } catch (error) {
      setError(t('security.user.saveError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading || rolesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.buttonColor} />
        <Text style={styles.loadingText}>{t('security.user.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('security.user.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <DataRenderer
        label={t('security.user.namePlaceholder')}
        value={name}
        type="input"
        textColor={Colors.text}
        onSave={(newValue) => setName(newValue as string)}
      />

      <DataRenderer
        label={t('security.user.emailPlaceholder')}
        value={email}
        type="input"
        textColor={Colors.text}
        onSave={(newValue) => setEmail(newValue as string)}
      />

      <DataRenderer
        label={t('security.user.rolePlaceholder')}
        value={role}
        type="inputlist"
        textColor={Colors.text}
        dataList={roleNames}
        onSave={(selectedRole) => setRole(selectedRole as string)}
      />

      <DataRenderer
        label={t('security.user.passwordPlaceholder')}
        value={password}
        type="input"
        textColor={Colors.text}
        onSave={(newValue) => setPassword(newValue as string)}
      />

      <View style={styles.colorPickerContainer}>
        <TouchableOpacity
          style={[styles.saveButton, { backgroundColor: Colors.buttonColor }]}
          onPress={handleSave}
        >
          <Text style={styles.saveButtonText}>{t('common.save')}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 16
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  colorPickerContainer: {
    alignItems: 'center',
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    maxWidth: 100,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
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
});

export default EditUserScreen;