import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  name: string;
  email: string;
  color: string;
}

const UserListScreen: React.FC = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]); 
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const router = useRouter(); 

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('users'); 
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers)); 
        }
        setLoading(false); 
      } catch (error) {
        setLoadError(true); 
        setLoading(false);
      }
    };
    loadUsers(); 
  }, []); 

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

  if (loadError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('security.user.loadError')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{t('security.user.header')}</Text>
        <TouchableOpacity onPress={handleCreateNewUser} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {users.length === 0 ? (
          <Text style={[styles.noUsersText, { color: textColor }]}>{t('security.user.noUsers')}</Text>
        ) : (
          users.map((user, index) => (
            <TouchableOpacity 
              key={index} 
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
    backgroundColor: '#000', 
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
});

export default UserListScreen;
