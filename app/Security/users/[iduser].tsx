import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import tinycolor from 'tinycolor2';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router'; // Para manejar la ID de la ruta dinámica
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'users';

const EditUserScreen: React.FC = () => {
    const { t } = useTranslation();
  const { userId } = useLocalSearchParams(); // Esto captura la ID de usuario de la URL

  // Estados para el color, tonalidad, saturación y luminosidad
  const [color, setColor] = useState<string>('#000000');
  const [hue, setHue] = useState<number>(0);
  const [saturation, setSaturation] = useState<number>(1);
  const [lightness, setLightness] = useState<number>(1);

  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const buttonColor = useThemeColor({}, 'buttonColor');

  // Estados para los campos de usuario
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>(''); // Nuevo campo para la contraseña

  // Estado de carga
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false); // Estado de guardado
  const [userNotFound, setUserNotFound] = useState<boolean>(false); // Estado para cuando no se encuentra el usuario

  // Función para actualizar el color
  const updateColor = () => {
    const newColor = tinycolor({ h: hue, s: saturation, v: lightness }).toHexString();
    setColor(newColor);
  };

  // Cargar datos de usuario desde AsyncStorage
  const loadUserData = async () => {
    if (!userId) {
      alert(t('userNotFound')); // Usando i18n para la alerta
      return;
    }

    setIsLoading(true);
    try {
      const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];

      const user = users.find((user: any) => user.id === userId);

      if (user) {
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setPassword(user.password || ''); // Cargar la contraseña si está disponible
        const { h, s, v } = tinycolor(user.color).toHsv();
        setHue(h);
        setSaturation(s);
        setLightness(v);
        setColor(user.color);
      } else {
        setUserNotFound(true); // Establecer que el usuario no fue encontrado
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
      alert(t('loadError'));
    } finally {
      setIsLoading(false);
    }
  };

  // Llamar a loadUserData cuando el componente se monta
  useEffect(() => {
    loadUserData();
  }, [userId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex((user: any) => user.id === userId); // Encontramos al usuario por su ID

      if (userIndex !== -1) {
        // Actualizamos los datos del usuario
        users[userIndex] = { id: userId, name, email, role, password, color };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));

        alert(t('userUpdated'));
        router.push('./userlist');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
      alert(t('saveError'));
    } finally {
      setIsSaving(false);
    }
  };

  // Si no se encuentra el usuario, mostramos un mensaje y un botón para regresar
  if (userNotFound) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{t('userNotFound')}</Text>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={() => router.back()}>
          <Text style={styles.saveButtonText}>{t('goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{t('editUser')}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={buttonColor} />
      ) : (
        <>
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor }]}
            placeholder={t('namePlaceholder')}
            placeholderTextColor={textColor}
            value={name}
            onChangeText={setName}
          />
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor }]}
            placeholder={t('emailPlaceholder')}
            placeholderTextColor={textColor}
            value={email}
            onChangeText={setEmail}
          />
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor }]}
            placeholder={t('rolePlaceholder')}
            value={role}
            onChangeText={setRole}
          />
          <TextInput
            style={[styles.input, { color: textColor, borderColor: textColor }]}
            placeholder={t('passwordPlaceholder')}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={[styles.label, { color: textColor }]}>{t('colorIdentifier')}</Text>
          <View style={[styles.colorBox, { backgroundColor: color }]} />

          <Text style={[styles.sliderLabel, { color: textColor }]}>{t('hue')}</Text>
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

          <Text style={[styles.sliderLabel, { color: textColor }]}>{t('saturation')}</Text>
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

          <Text style={[styles.sliderLabel, { color: textColor }]}>{t('lightness')}</Text>
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

          <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveButtonText}>{isSaving ? t('saving') : t('save')}</Text>
          </TouchableOpacity>
        </>
      )}
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
