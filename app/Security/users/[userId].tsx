import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import tinycolor from 'tinycolor2';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams } from 'expo-router'; 
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DataRenderer from '@/components/DataRenderer';

const STORAGE_KEY = 'users';

const EditUserScreen: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useLocalSearchParams();
  const [color, setColor] = useState<string>('#000000');
  const hueRef = useRef(0); 
  const saturationRef = useRef(1); 
  const lightnessRef = useRef(1); 
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const buttonColor = useThemeColor({}, 'buttonColor');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [role, setRole] = useState<string>('');
  const [password, setPassword] = useState<string>(''); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false); 
  const [userNotFound, setUserNotFound] = useState<boolean>(false); 

  const updateColor = () => {
    const newColor = tinycolor({ 
      h: hueRef.current, 
      s: saturationRef.current, 
      v: lightnessRef.current 
    }).toHexString();
    setColor(newColor);
  };

  const loadUserData = async () => {
    if (!userId) {
      console.log(t('security.user.userNotFound')); 
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
        setPassword(user.password || ''); 
        const { h = 0, s = 1, v = 1 } = tinycolor(user.color).toHsv();
        hueRef.current = h;
        saturationRef.current = s;
        lightnessRef.current = v;
        setColor(user.color);
      } else {
        setUserNotFound(true);
      }
    } catch (error) {
      console.error('Error al cargar los datos del usuario:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, [userId]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const storedUsers = await AsyncStorage.getItem(STORAGE_KEY);
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      const userIndex = users.findIndex((user: any) => user.id === userId); 

      if (userIndex !== -1) {
        users[userIndex] = { id: userId, name, email, role, password, color };

        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        router.push('./userlist');
      }
    } catch (error) {
      console.error('Error al guardar los cambios:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (userNotFound) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.title, { color: textColor }]}>{t('security.user.userNotFound')}</Text>
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={() => router.back()}>
          <Text style={styles.saveButtonText}>{t('security.user.goBack')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{t('security.user.editUser')}</Text>

      {isLoading ? (
        <ActivityIndicator size="large" color={buttonColor} />
      ) : (
        <>
        <View style={styles.formContainer}>
          <DataRenderer
              label={t('security.user.namePlaceholder')}
              value={name}
              type="input"
              textColor="#333"
              onSave={(newValue) => setName(newValue as string)}
            />
            <DataRenderer
              label={t('security.user.emailPlaceholder')}
              value={email}
              type="input"
              textColor="#333"
              onSave={(newValue) => setEmail(newValue as string)}
            />
            <DataRenderer
              label={t('security.user.rolePlaceholder')}
              value={role}
              type="input"
              textColor="#333"
              onSave={(newValue) => setRole(newValue as string)}
            />
            <DataRenderer
              label={t('security.user.passwordPlaceholder')}
              value={password}
              type="input"
              textColor="#333"
              onSave={(newValue) => setPassword(newValue as string)}
            />
            </View>
          <View style={styles.colorPickerContainer}>
          <Text style={[styles.label, { color: textColor }]}>{t('security.user.colorIdentifier')}</Text>
          <View style={[styles.colorBox, { backgroundColor: color }]} />

          <Text style={[styles.sliderLabel, { color: textColor }]}>{t('security.user.hue')}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={360}
            value={hueRef.current}
            onValueChange={(value) => {
              hueRef.current = value;
              updateColor();
            }}
          />

          <Text style={[styles.sliderLabel, { color: textColor }]}>{t('security.user.saturation')}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={saturationRef.current}
            onValueChange={(value) => {
              saturationRef.current = value;
              updateColor();
            }}
          />

          <Text style={[styles.sliderLabel, { color: textColor }]}>{t('security.user.lightness')}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={1}
            value={lightnessRef.current}
            onValueChange={(value) => {
              lightnessRef.current = value;
              updateColor();
            }}
          />
          <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveButtonText}>{isSaving ? t('security.user.saving') : t('security.user.save')}</Text>
          </TouchableOpacity>
        </View>
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
  },
  formContainer: {
    marginLeft: 20,
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
  colorPickerContainer: {
    alignItems: 'center',
  }
});

export default EditUserScreen;
