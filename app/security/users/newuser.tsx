import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@/components/Data/ConfigContext';
import { useRouter } from 'expo-router';
import DataRenderer from '@/components/DataRenderer';

const NewUserScreen: React.FC = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const buttonColor = useThemeColor({}, 'buttonColor');
  const { dataContext } = useConfig();
  const router = useRouter();

  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const roles = dataContext?.Configuracion.DATA['roles'] || [];
  const roleNames = roles.map((role: { name: string }) => role.name);

  const handleSave = async () => {
    setLoading(true);
    setError(null);

    try {
      const users = dataContext?.Configuracion.DATA['users'] || [];
      const newUser = { id: Date.now().toString(), name, email, password, role };
      const updatedUsers = [...users, newUser];
      await dataContext?.Configuracion.Set('users', updatedUsers);
      router.push('./userlist');
    } catch (error) {
      setError(t('common.saveError'));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.saving')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity onPress={() => router.push('./userlist')} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <DataRenderer
        label={t('security.user.namePlaceholder')}
        value={name}
        type="input"
        textColor="#333"
        onSave={(newValue) => setName(newValue as string)}
      />

      <DataRenderer
        label={t('security.user.emailPlaceholder')}
        value={email}
        type="input"
        textColor="#333"
        onSave={(newValue) => setEmail(newValue as string)}
      />

      <DataRenderer
        label={t('security.user.rolePlaceholder')}
        value={role}
        type="inputlist"
        textColor="#333"
        dataList={roleNames}
        onSave={(selectedRole) => setRole(selectedRole as string)}
      />

      <DataRenderer
        label={t('security.user.passwordPlaceholder')}
        value={password}
        type="input"
        textColor="#333"
        onSave={(newValue) => setPassword(newValue as string)}
      />

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('common.save')}</Text>
      </TouchableOpacity>
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

export default NewUserScreen;