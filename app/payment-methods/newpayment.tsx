import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeColor } from '@/hooks/useThemeColor';

// Definimos el tipo para los nombres de íconos
type IoniconName = 'cash-outline' | 'card-outline' | 'wallet-outline' | 'barcode-outline' | 'pricetags-outline';

// Array de íconos con el tipo definido
const iconOptions: IoniconName[] = [
  'cash-outline',
  'card-outline',
  'wallet-outline',
  'barcode-outline',
  'pricetags-outline',
];

const NewPaymentScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');

  const [paymentName, setPaymentName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState<IoniconName | null>(null);
  const [isIconPickerVisible, setIconPickerVisible] = useState(false);

  const handleSave = async () => {
    if (paymentName && selectedIcon) {
      const newPaymentMethod = { name: paymentName, icon: selectedIcon };
      try {
        await AsyncStorage.setItem(
          'paymentMethod',
          JSON.stringify(newPaymentMethod)
        );
        alert('Método de pago guardado exitosamente.');
      } catch (error) {
        console.error('Error al guardar el método de pago', error);
      }
    } else {
      alert('Por favor, ingrese un nombre y seleccione un ícono.');
    }
  };

  const renderIconOption = ({ item }: { item: IoniconName }) => (
    <TouchableOpacity
      style={styles.iconOption}
      onPress={() => {
        setSelectedIcon(item);
        setIconPickerVisible(false);
      }}
    >
      <Ionicons name={item} size={24} color={textColor} />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.label, { color: textColor }]}>Nombre del método de pago</Text>
      <TextInput
        style={[styles.input, { color: textColor, borderColor: textColor }]}
        placeholder="Ingrese el nombre"
        placeholderTextColor="#aaa"
        value={paymentName}
        onChangeText={setPaymentName}
      />

      <Text style={[styles.label, { color: textColor }]}>Seleccione su ícono</Text>
      <TouchableOpacity
        style={styles.iconSelector}
        onPress={() => setIconPickerVisible(!isIconPickerVisible)}
      >
        {selectedIcon ? (
          <Ionicons name={selectedIcon} size={24} color={textColor} />
        ) : (
          <Text style={{ color: textColor }}>Elegir un ícono</Text>
        )}
      </TouchableOpacity>

      {isIconPickerVisible && (
        <FlatList
          data={iconOptions}
          renderItem={renderIconOption}
          keyExtractor={(item) => item}
          numColumns={5}
          style={styles.iconPicker}
        />
      )}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Guardar método de pago</Text>
      </TouchableOpacity>
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
});

export default NewPaymentScreen;