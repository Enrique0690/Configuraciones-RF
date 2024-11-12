import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router'; // Usar el router para la navegación
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importar AsyncStorage

// Definir el tipo de impresora
interface Printer {
  id: string;
  name: string;
  connection: string;
  deliveryNotes: boolean;
  invoice: boolean;
  preInvoice: boolean;
  kitchen: boolean;
  bar: boolean;
  noStation: boolean;
}

const PrintersListScreen: React.FC = () => {
  const [printers, setPrinters] = useState<Printer[]>([]); // Usamos un arreglo de impresoras
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'textsecondary');
  const router = useRouter(); // Usar el router para la navegación

  useEffect(() => {
    // Función para cargar las impresoras desde AsyncStorage
    const loadPrinters = async () => {
      try {
        const storedPrinters = await AsyncStorage.getItem('printers'); // Obtener las impresoras guardadas
        if (storedPrinters) {
          setPrinters(JSON.parse(storedPrinters)); // Si existen, actualizamos el estado
        }
      } catch (error) {
        console.error('Error loading printers from AsyncStorage:', error);
      }
    };

    loadPrinters(); // Cargar las impresoras al inicio
  }, []); // Solo se ejecuta una vez al cargar el componente

  const handleCreateNewPrinter = () => {
    router.push('./newprinter'); // Redirigir a la pantalla de creación de impresora
  };

  const handlePrinterClick = async (id: string) => {
    try {
      await AsyncStorage.setItem('selectedPrinterId', id); // Guardar el ID en AsyncStorage
      router.push(`./${id}`); // Navegar a la pantalla de edición
    } catch (error) {
      console.error('Error storing printer ID in AsyncStorage:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>LISTA DE IMPRESORAS</Text>
        {/* Botón para crear nueva impresora */}
        <TouchableOpacity onPress={handleCreateNewPrinter} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {printers.length === 0 ? (
          <Text style={[styles.noPrintersText, { color: textColor }]}>No hay impresoras registradas</Text>
        ) : (
          printers.map((printer, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.printerItem} 
              onPress={() => handlePrinterClick(printer.id)} // Al hacer clic, pasamos solo el id
            >
              {/* Círculo de color junto al nombre */}
              <View style={[styles.colorCircle, { backgroundColor: printer.connection === 'wifi' ? '#4CAF50' : '#FF5722' }]} />
              <View style={styles.printerDetails}>
                <Text style={[styles.printerText, { color: textColor }]}>{printer.name}</Text>
                <Text style={[styles.printerConnection, { color: textColor }]}>{printer.connection}</Text>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  addButton: {
    padding: 8,
  },
  contentContainer: {
    paddingBottom: 16,
  },
  printerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    marginBottom: 10,
    backgroundColor: '#f9f9f9', // Fondo ligeramente gris para cada item
    borderRadius: 8, // Bordes redondeados para el item
    paddingLeft: 10,
    paddingRight: 10,
  },
  colorCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#000', // Color por defecto en caso de que no haya un color específico
    marginRight: 12,
  },
  printerDetails: {
    flex: 1,
  },
  printerText: {
    fontSize: 18,
    fontWeight: '600',
  },
  printerConnection: {
    fontSize: 14,
    marginTop: 4,
    fontStyle: 'italic',
  },
  noPrintersText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 16,
  },
});

export default PrintersListScreen;