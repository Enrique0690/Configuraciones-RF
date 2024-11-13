import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from '@/hooks/useThemeColor';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next'; 

type IoniconName = 'cash-outline' | 'card-outline' | 'wallet-outline' | 'barcode-outline' | 'pricetags-outline';

const iconOptions: IoniconName[] = [
  'cash-outline',
  'card-outline',
  'wallet-outline',
  'barcode-outline',
  'pricetags-outline',
];

const NewPaymentScreen: React.FC = () => {
  const { t } = useTranslation(); 
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const [paymentName, setPaymentName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IoniconName | null>(null);
  const [isIconPickerVisible, setIconPickerVisible] = useState(false);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 

  const handleSave = async () => {
    if (!paymentName || !selectedIcon) {
      Alert.alert(t('paymentMethods.validationError'), t('paymentMethods.selectNameIcon'));
      return;
    }

    setLoading(true);
    setError('');

    const newPaymentMethod = {
      id: Math.random().toString(),
      name: paymentName,
      icon: selectedIcon,
      isActive: true,
    };

    try {
      const existingMethods = await AsyncStorage.getItem('paymentMethods');
      const updatedMethods = existingMethods ? JSON.parse(existingMethods) : [];
      updatedMethods.push(newPaymentMethod);

      await AsyncStorage.setItem('paymentMethods', JSON.stringify(updatedMethods));
      Alert.alert(t('paymentMethods.successTitle'), t('paymentMethods.successMessage'));
      setPaymentName('');
      setSelectedIcon(null);
      router.push('/Payment-methods');
    } catch (error) {
      console.error('Error al guardar el método de pago', error);
      setError(t('paymentMethods.saveError'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>{t('paymentMethods.newpayment')}</Text>
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder={t('paymentMethods.paymentNamePlaceholder')}
        placeholderTextColor="#aaa"
        value={paymentName}
        onChangeText={setPaymentName}
      />
      <Text style={[styles.label, { color: textColor }]}>{t('paymentMethods.iconLabel')}</Text>
      <TouchableOpacity
        style={styles.iconSelector}
        onPress={() => setIconPickerVisible(!isIconPickerVisible)}
      >
        {selectedIcon ? (
          <Ionicons name={selectedIcon} size={24} color={textColor} />
        ) : (
          <Text style={{ color: textColor }}>{t('paymentMethods.selectIcon')}</Text>
        )}
      </TouchableOpacity>

      {isIconPickerVisible && (
        <FlatList
          data={iconOptions}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.iconOption}
              onPress={() => {
                setSelectedIcon(item);
                setIconPickerVisible(false);
              }}
            >
              <Ionicons name={item} size={24} color={textColor} />
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item}
          numColumns={5}
          style={styles.iconPicker}
        />
      )}

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('paymentMethods.saveButtonText')}</Text>
        </TouchableOpacity>
      )}

      {error && <Text style={[styles.errorText, { color: textColor }]}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  iconSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 16,
  },
  iconPicker: {
    marginBottom: 16,
  },
  iconOption: {
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default NewPaymentScreen;