import React from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';

const PrintersScreen: React.FC = () => {
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
        <Text style={[styles.title, { color: textColor }]}>IMPRESORAS</Text>
        {/* Botón de agregar nueva impresora */}
        <TouchableOpacity onPress={handleAddPrinter} style={styles.addButton}>
          <Ionicons name="add-circle" size={30} color={textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color={textColor} style={styles.searchIcon} />
          <TextInput
            style={[styles.searchInput, { color: textColor }]}
            placeholder="Buscar"
            placeholderTextColor={textColor}
          />
        </View>

        {/* Lista de impresoras */}
        <TouchableOpacity onPress={handleEditPrinter}>
          <Text style={[styles.printerItem, { color: textColor }]}>COCINA - USB</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEditPrinter}>
          <Text style={[styles.printerItem, { color: textColor }]}>TERRAZA PB - Ethernet</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleEditPrinter}>
          <Text style={[styles.printerItem, { color: textColor }]}>CAJA - USB</Text>
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  printerItem: {
    fontSize: 16,
    marginBottom: 16,
  },
});

export default PrintersScreen;