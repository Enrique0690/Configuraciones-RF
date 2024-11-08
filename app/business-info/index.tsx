import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, TextInput, Dimensions, Platform, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/SearchBar';

const BusinessInfoScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const borderColor = useThemeColor({}, 'border');
  const buttonColor = useThemeColor({}, 'buttonColor');

  const [businessInfo, setBusinessInfo] = useState({
    name: 'REYES DEL CHOCLO S.A.S.',
    address: 'Av los ceibos y plaza dañín N 35-875 A, Quito, Ecuador',
    phone: '0999999999',
    email: 'my-email-account@hotmail.com',
    businessType: 'RESTAURANTE',
    currency: 'USD',
  });

  const [saveMessage, setSaveMessage] = useState<string>('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('');

  const inputRef = useRef<TextInput>(null); // Ref para el TextInput

  const loadBusinessInfo = async () => {
    try {
      const savedData = await AsyncStorage.getItem('businessInfo');
      if (savedData) {
        setBusinessInfo(JSON.parse(savedData));
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const handleEdit = (field: string, value: string) => {
    setCurrentField(field);
    setCurrentValue(value);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async () => {
    // Actualiza el estado del negocio
    setBusinessInfo((prevState) => {
      const updatedBusinessInfo = {
        ...prevState,
        [currentField]: currentValue,
      };

      // Guardar en AsyncStorage
      AsyncStorage.setItem('businessInfo', JSON.stringify(updatedBusinessInfo))
        .then(() => {
          console.log('Datos guardados correctamente');
          setSaveMessage('La información se ha guardado correctamente');
          setTimeout(() => {
            setSaveMessage('');
          }, 3000);
        })
        .catch((error) => {
          console.error('Error guardando los datos:', error);
          setSaveMessage('Hubo un problema al guardar la información');
          setTimeout(() => {
            setSaveMessage('');
          }, 3000);
        });

      return updatedBusinessInfo;
    });

    // Cierra el modal después de guardar
    setIsModalVisible(false);
  };

  useEffect(() => {
    loadBusinessInfo();
  }, []);

  useEffect(() => {
    if (isModalVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus(); // Enfocar el TextInput cuando el modal se abre
        if (Platform.OS !== 'web') {
          // Solo selecciona el texto si no es en la web
          inputRef.current?.setSelection(0, currentValue.length);
        }
      }, 200); // Pequeño retraso de 200 ms para asegurar que el TextInput esté completamente visible
    }
  }, [isModalVisible]);

  const isMobile = Dimensions.get('window').width <= 768;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <SearchBar />
        <Text style={[styles.sectionTitle, { color: textColor }]}>INFORMACIÓN DEL NEGOCIO</Text>

        <Image
          style={styles.image}
          source={{ uri: 'https://abellagraphicdesign.com/wp-content/uploads/2023/02/DESTACADA_0014_Fondo-copia-6.jpg' }}
          resizeMode="contain"
        />

        {/* Campo Nombre del Negocio */}
        <View style={styles.inputGroup}>
          <Text style={[styles.infoText, { color: textColor }]}>
            <Text style={styles.label}>Nombre del Negocio:</Text>
          </Text>
          <TouchableOpacity onPress={() => handleEdit('name', businessInfo.name)}>
            <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.name}</Text>
          </TouchableOpacity>
        </View>

        {/* Campo Dirección */}
        <View style={styles.inputGroup}>
          <Text style={[styles.infoText, { color: textColor }]}>
            <Text style={styles.label}>Dirección:</Text>
          </Text>
          <TouchableOpacity onPress={() => handleEdit('address', businessInfo.address)}>
            <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.address}</Text>
          </TouchableOpacity>
        </View>

        {/* Campo Teléfono */}
        <View style={styles.inputGroup}>
          <Text style={[styles.infoText, { color: textColor }]}>
            <Text style={styles.label}>Número de teléfono:</Text>
          </Text>
          <TouchableOpacity onPress={() => handleEdit('phone', businessInfo.phone)}>
            <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.phone}</Text>
          </TouchableOpacity>
        </View>

        {/* Campo Correo */}
        <View style={styles.inputGroup}>
          <Text style={[styles.infoText, { color: textColor }]}>
            <Text style={styles.label}>Correo:</Text>
          </Text>
          <TouchableOpacity onPress={() => handleEdit('email', businessInfo.email)}>
            <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.email}</Text>
          </TouchableOpacity>
        </View>

        {/* Campo Tipo de Negocio */}
        <View style={styles.inputGroup}>
          <Text style={[styles.infoText, { color: textColor }]}>
            <Text style={styles.label}>Tipo de Negocio:</Text>
          </Text>
          <TouchableOpacity onPress={() => handleEdit('businessType', businessInfo.businessType)}>
            <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.businessType}</Text>
          </TouchableOpacity>
        </View>

        {/* Campo Moneda */}
        <View style={styles.inputGroup}>
          <Text style={[styles.infoText, { color: textColor }]}>
            <Text style={styles.label}>Moneda:</Text>
          </Text>
          <TouchableOpacity onPress={() => handleEdit('currency', businessInfo.currency)}>
            <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.currency}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal de edición */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalBackground}>
          <View style={[styles.modalContainer, { width: isMobile ? '90%' : 400 }]}>
            <Text style={[styles.modalTitle, { color: textColor }]}>Editar {currentField}</Text>
            <TextInput
              ref={inputRef} // Asociar el ref al TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={currentValue}
              onChangeText={setCurrentValue}
              placeholder={`Ingrese el nuevo ${currentField}`}
              placeholderTextColor={textColor}
              onFocus={() => {
                if (Platform.OS === 'web') {
                  // Si es web, seleccionamos el texto utilizando el método estándar de HTML
                  const inputElement = inputRef.current as any;
                  inputElement?.select();
                } else {
                  // Si no es web, seleccionamos el texto de forma nativa en móvil
                  if (inputRef.current) {
                    inputRef.current.setSelection(0, currentValue.length);
                  }
                }
              }}
            />
            <View style={styles.modalButtons}>
              <Text onPress={() => setIsModalVisible(false)} style={styles.cancelButton}>
                Cancelar
              </Text>
              <Text onPress={handleSaveEdit} style={[styles.saveButton, { backgroundColor: buttonColor }]}>
                Guardar
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontWeight: 'bold',
  },
  textValue: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 4,
  },
  saveButtonContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
  },
  saveMessage: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    fontSize: 16,
    color: '#999',
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 16,
    color: '#000',
  },
});

export default BusinessInfoScreen;
