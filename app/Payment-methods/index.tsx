import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
};

const PaymentMethodsScreen: React.FC = () => {
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const blackColor = '#000'; // Color negro para iconos y texto

  // Cargar los métodos de pago guardados desde AsyncStorage
  const loadPaymentMethods = async () => {
    try {
      const storedMethods = await AsyncStorage.getItem('paymentMethods');
      if (storedMethods) {
        setPaymentMethods(JSON.parse(storedMethods));
      }
    } catch (error) {
      console.error('Error al cargar métodos de pago:', error);
    }
  };

  // Guardar los métodos de pago en AsyncStorage
  const savePaymentMethods = async (methods: PaymentMethod[]) => {
    try {
      await AsyncStorage.setItem('paymentMethods', JSON.stringify(methods));
    } catch (error) {
      console.error('Error al guardar métodos de pago:', error);
    }
  };

  // Manejar el cambio de estado activo de los métodos de pago
  const togglePaymentMethod = async (id: string) => {
    const updatedMethods = paymentMethods.map((method) =>
      method.id === id ? { ...method, isActive: !method.isActive } : method
    );
    setPaymentMethods(updatedMethods);
    await savePaymentMethods(updatedMethods);
  };

  // Eliminar un método de pago (opcional)
  const removePaymentMethod = async (id: string) => {
    const updatedMethods = paymentMethods.filter((method) => method.id !== id);
    setPaymentMethods(updatedMethods);
    await savePaymentMethods(updatedMethods);
  };

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  // Renderizar cada ítem de la lista
  const renderItem = ({ item }: { item: PaymentMethod }) => (
    <View style={[styles.paymentMethodItem, { backgroundColor }]}>
      {/* Mover el Switch al lado izquierdo */}
      <Switch
        value={item.isActive}
        onValueChange={() => togglePaymentMethod(item.id)}
        thumbColor={item.isActive ? '#4caf50' : '#f44336'}
      />
      {/* Ícono y nombre del método de pago */}
      <Ionicons name={item.icon as any} size={24} color={blackColor} style={styles.icon} />
      <Text style={[styles.paymentMethodName, { color: blackColor }]}>{item.name}</Text>
      {/* Botón de eliminar */}
      <TouchableOpacity onPress={() => removePaymentMethod(item.id)}>
        <Ionicons name="trash-bin" size={24} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      {/* Contenedor superior con el botón para agregar un nuevo método de pago */}
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: blackColor }]}>Métodos de Pago</Text>
        <TouchableOpacity onPress={() => router.push('/Payment-methods/newpayment')}>
          <Ionicons name="add-circle-outline" size={30} color={blackColor} />
        </TouchableOpacity>
      </View>

      {/* Lista de métodos de pago */}
      {paymentMethods.length > 0 ? (
        <FlatList
          data={paymentMethods}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer}
        />
      ) : (
        <Text style={[styles.emptyText, { color: blackColor }]}>
          No hay métodos de pago disponibles.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent', // Sin fondo de color
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    justifyContent: 'space-between', // Asegura que el icono, texto y switch estén alineados
  },
  icon: {
    marginLeft: 16, // Colocar margen para separar el ícono del switch
  },
  paymentMethodName: {
    flex: 1,
    fontSize: 16,
  },
  flatListContainer: {
    backgroundColor: 'transparent', // Sin color de fondo
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
});

export default PaymentMethodsScreen;
