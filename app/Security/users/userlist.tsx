import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router'; // Importar useRouter
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

// Definir el tipo de usuario
interface User {
  id: string;
  name: string;
  email: string;
  color: string;
}

const UserListScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // Cambiar el tipo de estado para que sea un arreglo de objetos User
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'textsecondary');
  const router = useRouter(); // Usar el router para navegar

  useEffect(() => {
    // Función para cargar los usuarios desde AsyncStorage
    const loadUsers = async () => {
      try {
        const storedUsers = await AsyncStorage.getItem('users'); // Obtener los usuarios guardados
        if (storedUsers) {
          setUsers(JSON.parse(storedUsers)); // Si existen, actualizamos el estado
        }
      } catch (error) {
        console.error('Error loading users from AsyncStorage:', error);
      }
    };

    loadUsers(); // Cargar los usuarios al inicio
  }, []); // Solo se ejecuta una vez al cargar el componente

  const handleCreateNewUser = () => {
    router.push('./newuser'); // Redirigir a la pantalla de creación de usuario
  };

  const handleUserClick = async (id: string) => {
    try {
      await AsyncStorage.setItem('selectedUserId', id); // Guardar el ID en AsyncStorage
      router.push('./edituser'); // Navegar a la pantalla de edición
    } catch (error) {
      console.error('Error storing user ID in AsyncStorage:', error);
    }
  };
  

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>LISTA DE USUARIOS</Text>
        {/* Botón para crear nuevo usuario */}
        <TouchableOpacity onPress={handleCreateNewUser} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {users.length === 0 ? (
          <Text style={[styles.noUsersText, { color: textColor }]}>No hay usuarios registrados</Text>
        ) : (
          users.map((user, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.userItem} 
              onPress={() => handleUserClick(user.id)} // Al hacer clic, pasamos solo el id
            >
              {/* Círculo de color junto al nombre */}
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
    backgroundColor: '#f9f9f9', // Fondo ligeramente gris para cada item
    borderRadius: 8, // Bordes redondeados para el item
    paddingLeft: 10,
    paddingRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000', // Color por defecto en caso de que no haya un color específico
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
});

export default UserListScreen;
