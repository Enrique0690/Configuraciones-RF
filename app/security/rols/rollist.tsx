import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import useStorage from '@/hooks/useStorage';
import SearchBar from '@/components/navigation/SearchBar';
import { Colors } from '@/constants/Colors';

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const RoleListScreen: React.FC = () => {
  const { data: roles, loading, error, reloadData } = useStorage<Role[]>('roles', []);
  const router = useRouter();
  const { t } = useTranslation();

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

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('security.role.loadError')}</Text>
        <TouchableOpacity onPress={reloadData} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('security.role.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: Colors.text }]}>{t('security.role.header')}</Text>
        <TouchableOpacity onPress={handleCreateNewRole} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={Colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {roles.length === 0 ? (
          <TouchableOpacity onPress={handleCreateNewRole}>
            <Text style={[styles.noRolesText, { color: Colors.text }]}>{t('security.role.noRoles')}</Text>
          </TouchableOpacity>
        ) : (
          roles.map((role) => (
            <TouchableOpacity
              key={role.id}
              style={styles.roleItem}
              onPress={() => handleRoleClick(role.id)}
            >
              <View style={styles.roleDetails}>
                <Text style={[styles.roleText, { color: Colors.text }]}>{role.name}</Text>
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
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex',
      android: 'flex',
      default: 'none',
    }),
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

export default RoleListScreen;