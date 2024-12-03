import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import UUID from 'react-native-uuid';
import DataRenderer from '@/components/DataRenderer';
import useStorage from '@/hooks/useStorage';
import { Colors } from '@/constants/Colors';

const NewUserScreen: React.FC = () => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { data: roles, loading: rolesLoading } = useStorage('roles', []);
  const roleNames = roles.map((role: { name: string }) => role.name);  

  const handleSave = async () => {
    setLoading(true); 
    const userId = UUID.v4();
    const newUser = { id: userId, name, email, password, role };
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));
      router.push('./userlist');
    } catch (error) {
      setError(t('security.user.saveError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading || rolesLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
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
    <ScrollView contentContainerStyle={[styles.container]}>
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
    paddingTop: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
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
  colorPickerContainer: {
    alignItems: 'center',
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

export default NewUserScreen;