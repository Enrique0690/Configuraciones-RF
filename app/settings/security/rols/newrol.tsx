import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DataRenderer from '@/components/DataRenderer';
import PermissionsList from '@/components/security/rol/permissionslist';
import { rolePermissions } from '@/constants/DataConfig/SecurityConfig';
import { useAppContext } from '@/components/Data/AppContext';

const NewRoleScreen = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const buttonColor = useThemeColor({}, 'buttonColor');
  const { dataContext } = useAppContext();
  const router = useRouter();
  const [name, setName] = useState<string>('');
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [activeCategory, setActiveCategory] = useState<string>(t('security.role.SALES'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialPermissions = Object.fromEntries(
      Object.entries(rolePermissions).map(([category, items]) => [
        category,
        Object.fromEntries(items.map((item) => [item, false])),
      ])
    );
    setPermissions(initialPermissions);
  }, [t]);

  const updatePermission = (category: string, item: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: value,
      },
    }));
  };

  const updateCategoryPermissions = (category: string, value: boolean) => {
    setPermissions((prev) => ({
      ...prev,
      [category]: Object.fromEntries(
        Object.entries(prev[category]).map(([item, _]) => [item, value])
      ),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const roles = dataContext?.Configuracion.DATA['roles'] || [];
      const newRole = { id: Date.now().toString(), name, permissions };
      const updatedRoles = [...roles, newRole];
      await dataContext?.Configuracion.Set('roles', updatedRoles);
      router.push('./rollist');
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
        <TouchableOpacity onPress={() => router.push('./rollist')} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('common.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <DataRenderer
        label={t('security.role.roleName')}
        value={name}
        type="input"
        textColor="#333"
        onSave={(newValue) => setName(newValue as string)}
      />

      <PermissionsList
        rolePermissions={rolePermissions}
        permissions={permissions}
        activeCategory={activeCategory}
        updatePermission={updatePermission}
        updateCategoryPermissions={updateCategoryPermissions}
        onCategoryChange={setActiveCategory}
      />

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('security.role.save')}</Text>
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
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  saveButtonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingText: {
    fontSize: 18,
    marginTop: 10,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  errorMessage: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  goBackButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#3A86FF',
  },
  goBackButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default NewRoleScreen;