// TabletConfiguration.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type TabletConfigurationProps = {
  showUser: boolean;
  showTime: boolean;
  showCommercialName: boolean;
};

const TabletConfiguration: React.FC<TabletConfigurationProps> = ({ showUser, showTime, showCommercialName }) => {
  return (
    <View style={styles.tableBox}>
      {showUser && (
        <Text style={styles.tableLabel}>Nombre Usuario</Text>
      )}
      {showCommercialName && (
        <Text style={styles.tableLabel}>Nombre Comercial</Text>
      )}
      <Text style={styles.tableInfo}># Mesa</Text>
      {showTime && (
        <Text style={styles.tableInfo}>Tiempo ⏰</Text>
      )}
      <Text style={styles.tableInfo}>$ Total de mesa</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tableBox: {
    width: '100%',
    maxWidth: 220,
    height: 300,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    alignSelf: 'center',
    marginTop: 20,
  },
  tableLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    padding: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 4,
    marginBottom: 4,
    textAlign: 'center',
    width: '80%',
  },
  tableInfo: {
    fontSize: 14,
    marginVertical: 4,
    textAlign: 'center',
  },
});

export default TabletConfiguration;
