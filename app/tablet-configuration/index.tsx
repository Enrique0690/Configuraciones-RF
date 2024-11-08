import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const TabletConfigurationScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'textsecondary');

  const [showUser, setShowUser] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showCommercialName, setShowCommercialName] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Editor Mesa</Text>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Información Tributaria */}
        <View style={styles.tributaryContainer}>
          <Text style={[styles.sectionTitle, { color: textColor }]}>Información tributaria (Ecuador)</Text>

          {/* Buscador */}
          <View style={styles.searchBar}>
            <Text style={[styles.searchIcon, { color: textColor }]}>🔍</Text>
          </View>
          
          {/* Cuadro con nombre de usuario */}
          <View style={styles.tableBox}>
            <Text style={[styles.tableUser, { color: textColor }]}>PEPE PEREZ</Text>
          </View>
        </View>

        {/* Configuraciones con interruptores */}
        <View style={styles.switchContainer}>
          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>Mostrar usuario</Text>
            <Switch value={showUser} onValueChange={setShowUser} />
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>Mostrar tiempo que la mesa lleva ocupada</Text>
            <Switch value={showTime} onValueChange={setShowTime} />
          </View>

          <View style={styles.switchRow}>
            <Text style={[styles.switchLabel, { color: textColor }]}>Mostrar "Nombre Comercial" del cliente</Text>
            <Switch value={showCommercialName} onValueChange={setShowCommercialName} />
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 16,
  },
  tributaryContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  searchBar: {
    height: 40,
    backgroundColor: '#e0e0e0', // Puedes cambiar esto según el tema
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  searchIcon: {
    fontSize: 20,
  },
  tableBox: {
    height: 100,
    width: 100,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  tableUser: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 4,
    backgroundColor: '#4CAF50', // Color verde para el fondo del nombre
    borderRadius: 4,
  },
  switchContainer: {
    paddingHorizontal: 16,
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
});

export default TabletConfigurationScreen;