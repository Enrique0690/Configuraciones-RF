import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import tinycolor from 'tinycolor2';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { v4 as uuidv4 } from 'uuid';  // Importamos la función para generar IDs únicos

const STORAGE_KEY = 'users';

const NewUserScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const buttonColor = useThemeColor({}, 'buttonColor');
  
  const [color, setColor] = useState<string>('#000000'); // Se usa un valor hex por defecto
  const [hue, setHue] = useState<number>(tinycolor(color).toHsv().h);
  const [saturation, setSaturation] = useState<number>(tinycolor(color).toHsv().s);
  const [lightness, setLightness] = useState<number>(tinycolor(color).toHsv().v);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const updateColor = () => {
    const newColor = tinycolor({ h: hue, s: saturation, v: lightness }).toHexString(); // Convierte a hex
    setColor(newColor);
  };

  const handleSave = async () => {
    const userId = uuidv4();  // Generamos un ID único para el usuario

    // Guardamos el nuevo usuario con el color en formato hexadecimal y un ID único
    const newUser = { id: userId, name, email, color };
    
    try {
      const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push(newUser);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      
      alert('Usuario guardado');
      router.push('./userlist');
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
      alert('Hubo un error al guardar el usuario');
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

export default NewUserScreen;