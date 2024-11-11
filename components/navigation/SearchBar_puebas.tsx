// src/components/SearchBar.tsx
import React, { useState, useMemo } from "react";
import { View, TextInput, StyleSheet, TouchableOpacity, Text, FlatList, Platform } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import useDynamicRoutes from "@/constants/searchData";

const SearchBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('Moneda');  // Forzamos la búsqueda por "Moneda"
  const { t } = useTranslation();
  const textColor = useThemeColor({}, 'textsecondary');
  const placeholderColor = useThemeColor({}, 'placeholder');
  const router = useRouter();
  
  // Obtener rutas dinámicas
  const dynamicRoutes = useDynamicRoutes();

  // Filtrar rutas basadas en la búsqueda, considerando tanto el nameKey como la traducción
  const filteredData = useMemo(() => {
  console.log("dynamicRoutes:", dynamicRoutes); // Ver los datos de las rutas
  return dynamicRoutes.filter(route =>
    route.nameKey.toLowerCase().includes(searchQuery.toLowerCase()) || 
    route.translation.toLowerCase().includes(searchQuery.toLowerCase())
  );
}, [searchQuery, dynamicRoutes]);


  const handleResultSelect = (result: any) => {
    router.push(result.route);
  };

  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color={textColor} style={styles.searchIcon} />
        <TextInput
          style={[styles.searchInput, { color: textColor }]}
          placeholder={t('search.placeholder') || "Buscar..."}
          placeholderTextColor={placeholderColor}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {searchQuery && filteredData.length > 0 ? (
        <View style={styles.resultsContainer}>
          <FlatList
            data={filteredData}
            keyExtractor={(item) => item.route}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.resultItem}
                onPress={() => handleResultSelect(item)}
              >
                <Text style={[styles.resultText, { color: textColor }]}>
                  {item.translation || t(item.nameKey)} {/* Mostrar la traducción si existe */}
                </Text>
              </TouchableOpacity>
            )}
          />
        </View>
      ) : (
        <View style={styles.noResultsContainer}>
          <Text style={[styles.resultText, { color: textColor }]}>No se encontraron resultados</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    borderRadius: 8,
    backgroundColor: '#fff',
    zIndex: 1050,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    padding: 8,
  },
  resultsContainer: {
    position: 'absolute',
    top: Platform.select({ ios: 48, android: 48, web: 56 }),
    left: 0,
    right: 0,
    zIndex: Platform.select({ ios: 2000, android: 2000, web: 9999 }),
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 8,
    maxHeight: 200,
    overflow: 'hidden',
  },
  resultItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  resultText: {
    fontSize: 16,
  },
  noResultsContainer: {
    padding: 12,
  }
});

export default SearchBar;
