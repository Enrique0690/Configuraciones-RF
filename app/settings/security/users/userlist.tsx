import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useConfig } from '@/components/Data/ConfigContext';
import { Colors } from '@/constants/Colors';

interface User {
  id: string;
  name: string;
  email: string;
  color: string;
}

const UserListScreen: React.FC = () => {
  const { dataContext, isLoading } = useConfig();
  const users: User[] = dataContext?.Configuracion.DATA['users'] || [];
  const router = useRouter();
  const { t } = useTranslation();

  const handleCreateNewUser = () => {
    router.push('./newuser');
  };

  const handleUserClick = (id: string) => {
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
        {users.length === 0 ? (
          <TouchableOpacity onPress={handleCreateNewUser}>
            <Text style={[styles.noUsersText, { color: Colors.text }]}>
              {t('security.user.noUsers')}
            </Text>
          </TouchableOpacity>
        ) : (
          users.map((user) => (
            <TouchableOpacity
              key={user.id}
              style={styles.userItem}
              onPress={() => handleUserClick(user.id)}
            >
              <View style={[styles.colorCircle, { backgroundColor: user.color }]} />
              <View style={styles.userDetails}>
                <Text style={[styles.userText, { color: Colors.text }]}>{user.name}</Text>
                <Text style={[styles.userEmail, { color: Colors.text }]}>{user.email}</Text>
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
    marginTop: 8,
  },
  contentContainer: {
    marginVertical: 16,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingLeft: 10,
    paddingRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 12,
  },
  userDetails: {
    flex: 1,
  },
  userText: {
    fontSize: 18,
    fontWeight: '600',
  },
  userEmail: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noUsersText: {
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

export default UserListScreen;