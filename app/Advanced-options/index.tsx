import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/navigation/SearchBar';

const AdvancedOptionsScreen: React.FC = () => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'textsecondary');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.title, { color: textColor }]}>Configuración de Configuraciones Avanzadas</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Aquí puedes agregar componentes y ajustes específicos de esta categoría */}
        <Text style={[styles.description, { color: textColor }]}>
          Aquí puedes configurar las opciones de Configuraciones Avanzadas.
        </Text>
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
  description: {
    fontSize: 16,
    lineHeight: 24,
  },
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex', 
      android: 'flex', 
      default: 'none', 
    }),
    marginBottom: 16,
  },
});

export default AdvancedOptionsScreen;
