import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/SearchBar';
import EditDialog from '@/components/modals/EditDialog';
import useStorage from '@/hooks/useStorage';
import { useTranslation } from 'react-i18next';

// Definir el tipo de datos de la información del negocio
interface BusinessInfo {
  name: string;
  address: string;
  phone: string;
  email: string;
  businessType: string;
  currency: string;
}

const BusinessInfoScreen: React.FC = () => {
  const { t } = useTranslation();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const borderColor = useThemeColor({}, 'border');
  const buttonColor = useThemeColor({}, 'buttonColor');

  // Usamos el hook useStorage para manejar los datos de la información del negocio
  const { data: businessInfo, saveData: saveBusinessInfo } = useStorage<BusinessInfo>('businessInfo', {
    name: 'REYES DEL CHOCLO S.A.S.',
    address: 'Av los ceibos y plaza dañín N 35-875 A, Quito, Ecuador',
    phone: '0999999999',
    email: 'my-email-account@hotmail.com',
    businessType: 'RESTAURANTE',
    currency: 'USD',
  });

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentField, setCurrentField] = useState<string>('');
  const [currentValue, setCurrentValue] = useState<string>('');

  const handleEdit = (field: string, value: string) => {
    setCurrentField(field);
    setCurrentValue(value);
    setIsModalVisible(true);
  };

  const handleSaveEdit = async (newValue: string) => {
    if (businessInfo) {
      const updatedBusinessInfo = {
        ...businessInfo,
        [currentField]: newValue,
      };
      saveBusinessInfo(updatedBusinessInfo); // Guardar los datos con el hook
    }
    setIsModalVisible(false);
  };

  const isMobile = Dimensions.get('window').width <= 768;

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.sectionTitle, { color: textColor }]}>{t('businessInfo.header')}</Text>

        <Image
          style={styles.image}
          source={{ uri: 'https://abellagraphicdesign.com/wp-content/uploads/2023/02/DESTACADA_0014_Fondo-copia-6.jpg' }}
          resizeMode="contain"
        />

        {businessInfo && (
          <>
            <View style={styles.inputGroup}>
              <Text style={[styles.infoText, { color: textColor }]}>
                
              </Text>
              <TouchableOpacity onPress={() => handleEdit('name', businessInfo.name)}>
                <Text style={[styles.label, { color: textColor }]}>{t('businessInfo.inputs.name')}:</Text>
                <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.name}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity onPress={() => handleEdit('address', businessInfo.address)}>
                <Text style={[styles.label, { color: textColor }]}>{t('businessInfo.inputs.address')}:</Text>
                <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.address}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity onPress={() => handleEdit('phone', businessInfo.phone)}>
                <Text style={[styles.label, { color: textColor }]}>{t('businessInfo.inputs.phone')}:</Text>
                <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.phone}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity onPress={() => handleEdit('email', businessInfo.email)}>
                <Text style={[styles.label, { color: textColor }]}>{t('businessInfo.inputs.email')}:</Text>
                <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.email}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity onPress={() => handleEdit('businessType', businessInfo.businessType)}>
                <Text style={[styles.label, { color: textColor }]}>{t('businessInfo.inputs.businessType')}:</Text>
                <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.businessType}</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.inputGroup}>
              <TouchableOpacity onPress={() => handleEdit('currency', businessInfo.currency)}>
                <Text style={[styles.label, { color: textColor }]}>{t('businessInfo.inputs.currency')}:</Text>
                <Text style={[styles.textValue, { color: textColor }]}>{businessInfo.currency}</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </ScrollView>

      <EditDialog
        visible={isModalVisible}
        field={currentField}
        value={currentValue}
        onSave={handleSaveEdit}
        onCancel={() => setIsModalVisible(false)}
        textColor={textColor}
        borderColor={borderColor}
        buttonColor={buttonColor}
      />
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
    fontSize: 18
  },
  textValue: {
    fontSize: 16,
    color: '#000',
    paddingVertical: 4,
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
