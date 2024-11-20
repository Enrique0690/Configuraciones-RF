import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import useStorage from '@/hooks/useStorage';
import SearchBar from '@/components/navigation/SearchBar';

interface User {
  id: string;
  name: string;
  email: string;
  color: string;
}

const UserListScreen: React.FC = () => {
  const { data: users, loading, error, reloadData} = useStorage<User[]>('users', []);
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const router = useRouter();
  const { t } = useTranslation();

  const handleCreateNewUser = () => {
    router.push('./newuser');
  };

  const handleUserClick = (id: string) => {
    router.push(`./${id}`);
  };

  if (loading) {
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
        <Text style={styles.errorMessage}>{t('security.user.loadError')}</Text>
        <TouchableOpacity onPress={reloadData} style={styles.goBackButton}>
          <Text style={styles.goBackButtonText}>{t('security.user.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{t('security.user.header')}</Text>
        <TouchableOpacity onPress={handleCreateNewUser} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {users.length === 0 ? (
          <TouchableOpacity onPress={handleCreateNewUser}>
            <Text style={[styles.noUsersText, { color: textColor }]}>
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
                <Text style={[styles.userText, { color: textColor }]}>{user.name}</Text>
                <Text style={[styles.userEmail, { color: textColor }]}>{user.email}</Text>
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