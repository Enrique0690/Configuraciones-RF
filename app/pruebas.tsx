import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MyComponent = () => {
  // Estado para determinar si el componente está activo o no
  const [isActive, setIsActive] = useState(false);

  // Función para cambiar el estado
  const toggleActive = () => {
    setIsActive(!isActive);
  };

  return (
    <View style={styles.container}>
      {/* Botón que cambia el estado */}
      <TouchableOpacity onPress={toggleActive} style={styles.button}>
        <Text style={styles.buttonText}>Cambiar Estado</Text>
      </TouchableOpacity>
      
      {/* Componente que cambia visualmente si está activo */}
      <View style={[styles.box, isActive && styles.activeBox]}>
        <Text style={styles.boxText}>
          {isActive ? 'Activo' : 'Inactivo'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  box: {
    width: 100,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ccc',
  },
  activeBox: {
    backgroundColor: '#4caf50', // Cambia el color cuando está activo
  },
  boxText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default MyComponent;