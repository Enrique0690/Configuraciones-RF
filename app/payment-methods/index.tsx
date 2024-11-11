import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import DraggableFlatList, { RenderItemParams } from 'react-native-draggable-flatlist'; 
import SearchBar from '@/components/navigation/SearchBar';

const PaymentMethodsScreen: React.FC = () => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');

  const [isCashEnabled, setIsCashEnabled] = useState(false);
  const [isCardEnabled, setIsCardEnabled] = useState(false);
  const [isTransferEnabled, setIsTransferEnabled] = useState(false);

  // Datos para los métodos de pago
  const [paymentMethods, setPaymentMethods] = useState([
    { id: '1', label: 'EFECTIVO', value: isCashEnabled, setter: setIsCashEnabled },
    { id: '2', label: 'TARJETA DE CREDITO/DEBITO', value: isCardEnabled, setter: setIsCardEnabled },
    { id: '3', label: 'TRANSFERENCIA', value: isTransferEnabled, setter: setIsTransferEnabled }
  ]);

  const handleDragEnd = ({ data }: { data: any[] }) => {
    setPaymentMethods(data);
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      
      {/* Encabezado con título y botón */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>MÉTODOS DE COBRO</Text>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>
        <TouchableOpacity onPress={() => router.push('./newpayment')} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      {/* Lista de métodos de pago con arrastrar y soltar */}
      <DraggableFlatList
        data={paymentMethods}
        renderItem={({ item, drag, isActive }: RenderItemParams<typeof paymentMethods[0]>) => (
          <TouchableOpacity
            style={[
              styles.methodContainer,
              { backgroundColor: isActive ? '#e0e0e0' : 'transparent' },
            ]}
            onLongPress={drag} // Permite arrastrar el ítem
          >
            <Ionicons
              name="reorder-three-outline"
              size={20}
              color={textColor}
              style={styles.methodIcon}
            />
            <Text style={[styles.methodLabel, { color: textColor }]}>{item.label}</Text>
            <Switch
              value={item.value}
              onValueChange={() => item.setter(!item.value)}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
        onDragEnd={handleDragEnd}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  addButton: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  methodContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 16,
  },
  methodIcon: {
    marginRight: 8,
  },
  methodLabel: {
    flex: 1,
    fontSize: 16,
  },
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex', 
      android: 'flex', 
      default: 'none', 
    }),
  },
});

export default PaymentMethodsScreen;
