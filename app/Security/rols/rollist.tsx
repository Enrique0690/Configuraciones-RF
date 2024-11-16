import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const RoleListScreen: React.FC = () => {
  const { t } = useTranslation();
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const router = useRouter();

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const storedRoles = await AsyncStorage.getItem('roles');
        const parsedRoles = storedRoles ? JSON.parse(storedRoles) : [];
        
        if (Array.isArray(parsedRoles)) {
          setRoles(parsedRoles);
        } else {
          console.error('El valor de roles no es un array, se restablece a un array vacío');
          setRoles([]); 
        }
        
        setLoading(false);
      } catch (error) {
        setLoadError(true);
        setLoading(false);
      }
    };
    loadRoles();
  }, []);

  const handleCreateNewRole = () => {
    router.push('./newrol');
  };

  const handleRoleClick = (id: string) => {
    router.push(`./${id}`);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('security.role.loading')}</Text>
      </View>
    );
  }

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('security.role.loadError')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{t('security.role.header')}</Text>
        <TouchableOpacity onPress={handleCreateNewRole} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {roles.length === 0 ? (
          <Text style={[styles.noRolesText, { color: textColor }]}>{t('security.role.noRoles')}</Text>
        ) : (
          roles.map((role, index) => (
            <TouchableOpacity
              key={index}
              style={styles.roleItem}
              onPress={() => handleRoleClick(role.id)}
            >
              <View style={styles.roleDetails}>
                <Text style={[styles.roleText, { color: textColor }]}>{role.name}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  roleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  roleDetails: {
    flex: 1,
  },
  roleText: {
    fontSize: 18,
    fontWeight: '600',
  },
  rolePermissions: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noRolesText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
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

export default RoleListScreen;
