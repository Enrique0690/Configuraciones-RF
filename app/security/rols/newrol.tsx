import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DataRenderer from '@/components/DataRenderer';
import { rolePermissions } from '@/constants/DataConfig/SecurityConfig';
import { Colors } from 'react-native/Libraries/NewAppScreen';

const Checkbox: React.FC<{ value: boolean, onChange: (newValue: boolean) => void }> = ({ value, onChange }) => (
  <TouchableOpacity style={styles.checkbox} onPress={() => onChange(!value)}>
    <View style={[styles.checkboxSquare, value && styles.checkboxChecked]}>
      {value && <Text style={styles.checkboxIcon}>✔️</Text>}
    </View>
  </TouchableOpacity>
);

const NewRoleScreen: React.FC = () => {
  const { t } = useTranslation();;
  const [name, setName] = useState<string>('');
  const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
  const [activeCategory, setActiveCategory] = useState<string>(t('security.role.SALES'));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initialPermissions = Object.fromEntries(
      Object.entries(rolePermissions).map(([category, items]) => [
        category, Object.fromEntries(items.map(item => [item, false]))
      ])
    );
    setPermissions(initialPermissions);
  }, [t]);

  const updatePermission = (category: string, item: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [item]: value
      }
    }));
  };

  const updateCategoryPermissions = (category: string, value: boolean) => {
    setPermissions(prev => ({
      ...prev,
      [category]: Object.fromEntries(
        Object.entries(prev[category]).map(([item, _]) => [item, value])
      )
    }));
  };

  const updateAllPermissions = (value: boolean) => {
    setPermissions(prev => Object.fromEntries(
      Object.entries(prev).map(([category, items]) => [
        category, Object.fromEntries(Object.keys(items).map(item => [item, value]))
      ])
    ));
  };

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      const storedRoles = await AsyncStorage.getItem('roles');
      const parsedRoles = storedRoles ? JSON.parse(storedRoles) : [];
      const newRole = { id: Date.now().toString(), name, permissions };
      const updatedRoles = [...parsedRoles, newRole];
      await AsyncStorage.setItem('roles', JSON.stringify(updatedRoles));
      router.push('./rollist');
    } catch (error) {
      setError(t('security.role.saveError'));
      console.error('Error saving role:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('security.role.saving')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{error}</Text>
        <TouchableOpacity onPress={() => router.push('./rollist')} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('security.role.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container]}>
      <Text style={styles.header}>{t('security.role.addNewRole')}</Text>
      
      <DataRenderer
        label={t('security.role.roleName')}
        value={name}
        type="input"
        textColor="#333"
        onSave={(newValue) => setName(newValue as string)}
      />

      <View style={styles.selectAllContainer}>
        <Checkbox
          value={Object.values(permissions).every(category =>
            Object.values(category).every(isSelected => isSelected)
          )}
          onChange={updateAllPermissions}
        />
        <Text style={styles.selectAllLabel}>{t('security.role.selectAllPermissions')}</Text>
      </View>

      <View style={styles.categoryNav}>
        {Object.keys(rolePermissions).map(category => {
          const allSelected = Object.values(permissions[category] || {}).every(isSelected => isSelected);
          return (
            <TouchableOpacity
              key={category}
              style={[
                styles.categoryNavButton, 
                activeCategory === category && styles.categoryNavButtonActive,
                allSelected && styles.categoryNavButtonSelected
              ]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={styles.categoryNavText}>{t(`security.role.${category.toUpperCase()}`)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={styles.permissionsContainer}>
        {Object.entries(rolePermissions).map(([category, items]) => {
          if (category === activeCategory) {
            return (
              <View key={category} style={styles.categoryContainer}>
                <View style={styles.categoryHeader}>
                  <Checkbox
                    value={Object.values(permissions[category] || {}).every(isSelected => isSelected)}
                    onChange={(value) => updateCategoryPermissions(category, value)}
                  />
                  <Text style={styles.categoryTitle}>{t(`security.role.${category.toUpperCase()}`)}</Text>
                </View>
                <ScrollView style={styles.permissionList} nestedScrollEnabled>
                  {items.map((item) => (
                    <View key={item} style={styles.permissionRow}>
                      <Checkbox
                        value={permissions[category]?.[item] || false}
                        onChange={(value) => updatePermission(category, item, value)}
                      />
                      <Text style={styles.permissionText}>{t(`security.role.${category}.${item}`)}</Text>
                    </View>
                  ))}
                </ScrollView>
              </View>
            );
          }
        })}
      </View>

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: Colors.buttonColor }]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>{t('security.role.save')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
    color: '#333',
    textAlign: 'center',
  },
  selectAllContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
    maxWidth: 400,
  },
  selectAllLabel: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  categoryNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    maxWidth: 400,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  categoryNavButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    margin: 4,
  },
  categoryNavButtonActive: {
    backgroundColor: '#007bff',
  },
  categoryNavButtonSelected: {
    backgroundColor: '#4CAF50',
  },
  categoryNavText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  permissionsContainer: {
    width: '100%',
    maxWidth: 400,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  saveButton: {
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
    width: '100%',
    maxWidth: 400,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSquare: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 4,
    borderWidth: 2,  
    borderColor: '#000'
  },
  checkboxChecked: {
    backgroundColor: '#4CAF50',
  },
  checkboxIcon: {
    fontSize: 16,
    color: '#fff',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  permissionText: {
    marginLeft: 8,
    fontSize: 16,
  },
  categoryTitle: {
    marginLeft: 8,
    fontSize: 18,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 18,
    color: '#4CAF50',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorMessage: {
    color: 'red',
    fontSize: 16,
  },
  goBackButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  goBackButtonText: {
    fontSize: 16,
    color: '#007bff',
  },
  permissionList: {
    maxHeight: 200,
  },
});

export default NewRoleScreen;
