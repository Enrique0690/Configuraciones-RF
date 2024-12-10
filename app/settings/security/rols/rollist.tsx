import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAppContext } from '@/components/Data/AppContext';
import { Colors } from '@/constants/Colors';

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

const RoleListScreen = () => {
  const { dataContext, isLoading } = useAppContext();
  const roles: Role[] = dataContext?.Configuracion.DATA['roles'] || [];
  const router = useRouter();
  const { t } = useTranslation();

  const handleCreateNewRole = () => {
    router.push('./newrol');
  };

  const handleRoleClick = (id: string) => {
    router.push(`./${id}`);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {roles.length === 0 ? (
          <TouchableOpacity onPress={handleCreateNewRole}>
            <Text style={[styles.noRolesText, { color: Colors.text }]}>
              {t('security.role.noRoles')}
            </Text>
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
  addButton: {
    position: 'absolute',
    right: 16,
    marginTop: 16,
  },
  contentContainer: {
    marginVertical: 16,
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