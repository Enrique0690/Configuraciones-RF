import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { useAsyncStorage } from '@/components/Save';
import { useTranslation } from 'react-i18next';

const STORAGE_KEY = 'securityData';

const SecurityScreen: React.FC = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const placeholderColor = useThemeColor({}, 'placeholder');

  const [data, saveData] = useAsyncStorage(STORAGE_KEY, {
    eliminarMotivo: '',
    anularFacturaMotivo: '',
    anularPedidoMotivo: '',
  });
  
  const updateField = <K extends keyof typeof data>(field: K, value: typeof data[K]) => {
    const newData = { ...data, [field]: value };
    saveData(newData);
  };

  const handleNumericInput = (value: string, field: keyof typeof data) => {
    const numericValue = value.replace(/[^0-9]/g, '');
    updateField(field, numericValue);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.title, { color: textColor }]}>{t('security.header')}</Text>

        <View style={styles.inputRow}>
          <Text style={[styles.optionText, { color: textColor }]}>
            {t('security.deleteProductReason')}
          </Text>
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={data.eliminarMotivo}
            onChangeText={(value) => handleNumericInput(value, 'eliminarMotivo')}
            keyboardType="numeric"
            maxLength={3}
            placeholder="0"
            placeholderTextColor={placeholderColor}
          />
          <Text style={[styles.optionText, { color: textColor }]}>
            {t('security.characters')}
          </Text>
        </View>

        <View style={styles.inputRow}>
          <Text style={[styles.optionText, { color: textColor }]}>
            {t('security.cancelInvoiceReason')}
          </Text>
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={data.anularFacturaMotivo}
            onChangeText={(value) => handleNumericInput(value, 'anularFacturaMotivo')}
            keyboardType="numeric"
            maxLength={3}
            placeholder="0"
            placeholderTextColor={placeholderColor}
          />
          <Text style={[styles.optionText, { color: textColor }]}>
            {t('security.characters')}
          </Text>
        </View>

        <View style={styles.inputRow}>
          <Text style={[styles.optionText, { color: textColor }]}>
            {t('security.cancelOrderReason')}
          </Text>
          <TextInput
            style={[styles.input, { color: textColor }]}
            value={data.anularPedidoMotivo}
            onChangeText={(value) => handleNumericInput(value, 'anularPedidoMotivo')}
            keyboardType="numeric"
            maxLength={3}
            placeholder="0"
            placeholderTextColor={placeholderColor}
          />
          <Text style={[styles.optionText, { color: textColor }]}>
            {t('security.characters')}
          </Text>
        </View>

        <TouchableOpacity style={styles.option} onPress={() => router.push('./users/userlist')}>
          <Ionicons name="people-outline" size={20} color={textColor} />
          <Text style={[styles.optionLabel, { color: textColor }]}>{t('security.users')} (5 {t('security.users')})</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option} onPress={() => router.push('./rols/rollist')}>
          <Ionicons name="briefcase-outline" size={20} color={textColor} />
          <Text style={[styles.optionLabel, { color: textColor }]}>{t('security.roles')} (3 {t('security.roles')})</Text>
        </TouchableOpacity>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  optionText: {
    fontSize: 14,
    marginBottom: 8,
    lineHeight: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16, 
    flexWrap: 'wrap',   
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
    minWidth: 80, 
    maxWidth: 120,
    textAlign: 'center',
    marginHorizontal: 8, 
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  optionLabel: {
    fontSize: 16,
    marginLeft: 8,
  },
});

export default SecurityScreen;