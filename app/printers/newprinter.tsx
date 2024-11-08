import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const NewPrinterScreen = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  
  const [notesEnabled, setNotesEnabled] = useState(false);
  const [invoicesEnabled, setInvoicesEnabled] = useState(false);
  const [preInvoicesEnabled, setPreInvoicesEnabled] = useState(false);
  const [kitchenStation, setKitchenStation] = useState(false);
  const [barStation, setBarStation] = useState(false);
  const [unassignedStation, setUnassignedStation] = useState(false);
  const [connectionType, setConnectionType] = useState('Ethernet'); // "USB", "Ethernet", or "Bluetooth"
  const [printerLanguage, setPrinterLanguage] = useState('Zebra');  // "Zebra", "YAMCA", or "Star"
  const [advancedOptions, setAdvancedOptions] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: textColor }]}>COCINA</Text>
        <Text style={[styles.headerText, { color: textColor }]}>GUARDAR</Text>
      </View>
      
      <View style={styles.iconContainer}>
        {/* Aquí iría un ícono o imagen de impresora */}
      </View>
      
      <TextInput 
        style={[styles.input, { color: textColor, borderColor: textColor }]} 
        placeholder="COCINA" 
        placeholderTextColor={textColor}
      />

      {/* Switches para las opciones */}
      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: textColor }]}>Notas de entrega</Text>
          <Switch value={notesEnabled} onValueChange={setNotesEnabled} />
        </View>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: textColor }]}>Facturas</Text>
          <Switch value={invoicesEnabled} onValueChange={setInvoicesEnabled} />
        </View>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: textColor }]}>Pre facturas</Text>
          <Switch value={preInvoicesEnabled} onValueChange={setPreInvoicesEnabled} />
        </View>
      </View>

      <Text style={[styles.sectionTitle, { color: textColor }]}>Estaciones de pedidos:</Text>

      <View style={styles.switchContainer}>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: textColor }]}>Cocina</Text>
          <Switch value={kitchenStation} onValueChange={setKitchenStation} />
        </View>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: textColor }]}>Barra</Text>
          <Switch value={barStation} onValueChange={setBarStation} />
        </View>
        <View style={styles.switchRow}>
          <Text style={[styles.switchLabel, { color: textColor }]}>Productos sin una estación asignada</Text>
          <Switch value={unassignedStation} onValueChange={setUnassignedStation} />
        </View>
      </View>

      {/* Conexión */}
      <Text style={[styles.sectionTitle, { color: textColor }]}>Conexión</Text>
      <View style={styles.connectionContainer}>
        <TouchableOpacity
          style={[styles.connectionButton, connectionType === 'USB' && styles.selectedConnection]}
          onPress={() => setConnectionType('USB')}
        >
          <Text style={styles.connectionText}>USB</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.connectionButton, connectionType === 'Ethernet' && styles.selectedConnection]}
          onPress={() => setConnectionType('Ethernet')}
        >
          <Text style={styles.connectionText}>Ethernet</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.connectionButton, connectionType === 'Bluetooth' && styles.selectedConnection]}
          onPress={() => setConnectionType('Bluetooth')}
        >
          <Text style={styles.connectionText}>Bluetooth</Text>
        </TouchableOpacity>
      </View>

      {/* Opciones avanzadas */}
      <View style={styles.switchRow}>
        <Text style={[styles.switchLabel, { color: textColor }]}>Opciones avanzadas</Text>
        <Switch value={advancedOptions} onValueChange={setAdvancedOptions} />
      </View>

      {advancedOptions && (
        <View>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Lenguaje de la impresora:</Text>
          <View style={styles.languageContainer}>
            <TouchableOpacity
              style={[styles.languageButton, printerLanguage === 'ESCPOS' && styles.selectedLanguage]}
              onPress={() => setPrinterLanguage('ESCPOS')}
            >
              <Text style={styles.connectionText}>ESCPOS</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, printerLanguage === 'Zebra' && styles.selectedLanguage]}
              onPress={() => setPrinterLanguage('Zebra')}
            >
              <Text style={styles.connectionText}>Zebra</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.languageButton, printerLanguage === 'Star' && styles.selectedLanguage]}
              onPress={() => setPrinterLanguage('Star')}
            >
              <Text style={styles.connectionText}>Star</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  iconContainer: {
    height: 100,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
    // Aquí puedes añadir tu icono de impresora
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  switchContainer: {
    marginBottom: 16,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  switchLabel: {
    fontSize: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  connectionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  connectionButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#e0e0e0', // Color base
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedConnection: {
    backgroundColor: '#4CAF50', // Color cuando está seleccionado
  },
  connectionText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  languageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  languageButton: {
    flex: 1,
    padding: 12,
    backgroundColor: '#e0e0e0',
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedLanguage: {
    backgroundColor: '#4CAF50',
  },
});

export default NewPrinterScreen;
