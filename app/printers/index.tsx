import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/navigation/SearchBar';

const PrintersScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');

  const handleAddPrinter = () => {
    router.push('./newprinter');
  };

  const handleEditPrinter = () => {
    router.push('./editprinter');
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>{t('printers.header')}</Text>
        {/* Botón de agregar nueva impresora */}
        <TouchableOpacity onPress={handleAddPrinter} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={30} color={textColor} />
        </TouchableOpacity>
      </View>
      <View style={styles.searchBarContainer}>
          <SearchBar />
      </View>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {/* Lista de impresoras */}
        <TouchableOpacity onPress={handleEditPrinter}>
          <Text style={[{ color: textColor }]}>COCINA - USB</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEditPrinter}>
          <Text style={[{ color: textColor }]}>TERRAZA PB - Ethernet</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEditPrinter}>
          <Text style={[{ color: textColor }]}>CAJA - USB</Text>
        </TouchableOpacity>
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
  searchBarContainer: {
    display: Platform.select({
      ios: 'flex', 
      android: 'flex', 
      default: 'none', 
    }),
  },
});

export default PrintersScreen;