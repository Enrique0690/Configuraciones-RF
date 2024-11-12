// TabletConfigurationScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/navigation/SearchBar';
import TabletConfiguration from '@/components/Tablet-configuration/Tablet-configuration';

const TabletConfigurationScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'textsecondary');

  const [showUser, setShowUser] = useState(false);
  const [showTime, setShowTime] = useState(false);
  const [showCommercialName, setShowCommercialName] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Editor Mesa</Text>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <TabletConfiguration
          showUser={showUser}
          showTime={showTime}
          showCommercialName={showCommercialName}
        />
        {/* Configuración de Switches */}
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
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex',
      android: 'flex',
      default: 'none',
    }),
  },
  switchContainer: {
    paddingHorizontal: 16,
    marginTop: 24,
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
