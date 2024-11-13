import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import tinycolor from 'tinycolor2';
import Slider from '@react-native-community/slider';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import UUID from 'react-native-uuid';
import { useTranslation } from 'react-i18next';

const NewUserScreen: React.FC = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const buttonColor = useThemeColor({}, 'buttonColor');
  
  const [color, setColor] = useState<string>('#000000');
  const [hue, setHue] = useState<number>(tinycolor(color).toHsv().h);
  const [saturation, setSaturation] = useState<number>(tinycolor(color).toHsv().s);
  const [lightness, setLightness] = useState<number>(tinycolor(color).toHsv().v);
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>(''); 
  const [loading, setLoading] = useState<boolean>(false); 

  const updateColor = () => {
    const newColor = tinycolor({ h: hue, s: saturation, v: lightness }).toHexString();
    setColor(newColor);
  };

  const handleSave = async () => {
    setLoading(true); 

    const userId = UUID.v4();  
    const newUser = { id: userId, name, email, password, color };
    
    try {
      const storedUsers = await AsyncStorage.getItem('users');
      const users = storedUsers ? JSON.parse(storedUsers) : [];
      users.push(newUser);
      await AsyncStorage.setItem('users', JSON.stringify(users));

      alert(t('security.newUser.userSaved'));
      router.push('./userlist');
    } catch (error) {
      alert(t('security.newUser.saveError'));
    } finally {
      setLoading(false); 
    }
  };

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{t('security.newUser.header')}</Text>

      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder={t('security.newUser.namePlaceholder')}
        placeholderTextColor={textColor}
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder={t('security.newUser.emailPlaceholder')}
        placeholderTextColor={textColor}
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder={t('security.newUser.passwordPlaceholder')}
        placeholderTextColor={textColor}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Text style={[styles.label, { color: textColor }]}>{t('security.newUser.colorLabel')}</Text>

      <View style={[styles.colorBox, { backgroundColor: color }]} />

      <Text style={[styles.sliderLabel, { color: textColor }]}>{t('security.newUser.hue')}</Text>
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

      <Text style={[styles.sliderLabel, { color: textColor }]}>{t('security.newUser.saturation')}</Text>
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

      <Text style={[styles.sliderLabel, { color: textColor }]}>{t('security.newUser.lightness')}</Text>
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
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.saveButtonText}>{t('security.newUser.saveButton')}</Text>
        )}
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