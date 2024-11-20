import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import tinycolor from 'tinycolor2';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

const STORAGE_KEY = 'users';
const SELECTED_USER_KEY = 'selectedUserId';  // Agregamos una clave para almacenar el ID del usuario seleccionado

const EditUserScreen: React.FC = () => {
  // Estados para el color, tonalidad, saturación y luminosidad
  const [color, setColor] = useState<string>('#000000');
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(1);
  const [lightness, setLightness] = useState<number>(1);
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const buttonColor = useThemeColor({}, 'buttonColor');
  
  // Estados para los campos de usuario
  const [name, setName] = useState<string>('  ');
  const [email, setEmail] = useState<string>('  ');
  const [role, setRole] = useState<string>('  ');

  // Función para actualizar el color
  const updateColor = () => {
    const newColor = tinycolor({ h: hue, s: saturation, v: lightness }).toHexString();
    setColor(newColor);
  };

  // Cargar datos de usuario desde AsyncStorage
  const loadUserData = async () => {
    try {
      const userId = await AsyncStorage.getItem(SELECTED_USER_KEY);  // Obtenemos el ID del usuario seleccionado
      if (!userId) {
        alert('No se seleccionó un usuario');
        return;
      }

      const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const user = users.find((user: any) => user.id === userId);  // Buscamos al usuario por ID

      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);  // Asignamos el rol
        const { h, s, v } = tinycolor(user.color).toHsv();
        setHue(h);
        setSaturation(s);
        setLightness(v);
        setColor(user.color);

        // Una vez que los datos han sido cargados, eliminamos el ID del usuario seleccionado
        await AsyncStorage.removeItem(SELECTED_USER_KEY);
      } else {
        alert('Usuario no encontrado');
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      alert('Hubo un error al cargar los datos del usuario');
    }
  };

  // Llamar a loadUserData cuando el componente se monta
  useEffect(() => {
    loadUserData();  // Llamamos a la función para cargar el usuario
  }, []);

  const handleSave = async () => {
    try {
      const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex((user: any) => user.name === name); // Encontramos al usuario por su nombre

      if (userIndex !== -1) {
        // Actualizamos los datos del usuario
        users[userIndex] = { name, email, role, color };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));

        alert('Usuario actualizado');
        router.push('./userlist'); // Redirigimos a la lista de usuarios
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert('Hubo un error al guardar los cambios');
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>NUEVO USUARIO</Text>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Nombre"
        placeholderTextColor={textColor}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Correo"
        placeholderTextColor={textColor}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Rol"
        value={role}
        onChangeText={setRole}
      />

      <Text style={[styles.label, { color: textColor }]}>Color identificador:</Text>

      <View style={[styles.colorBox, { backgroundColor: color }]} />

      <Text style={[styles.sliderLabel, { color: textColor }]}>Tono (Hue)</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={360}
        value={hue}
        onValueChange={(value) => {
          setHue(value);
          updateColor();
        }}
      />

      <Text style={[styles.sliderLabel, { color: textColor }]}>Saturación</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={saturation}
        onValueChange={(value) => {
          setSaturation(value);
          updateColor();
        }}
      />

      <Text style={[styles.sliderLabel, { color: textColor }]}>Luminosidad</Text>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={lightness}
        onValueChange={(value) => {
          setLightness(value);
          updateColor();
        }}
      />

      <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: Platform.OS === 'ios' ? 20 : 0,
    backgroundColor: '#d9ffe6',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    fontSize: 16,
    width: '100%',
    maxWidth: 400, 
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  colorBox: {
    width: 50,
    height: 50,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#0f6c33', 
  },
  slider: {
    width: '100%',
    maxWidth: 400,
    height: 30, 
    marginBottom: 16,
  },
  sliderLabel: {
    fontSize: 16,
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
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EditUserScreen;
