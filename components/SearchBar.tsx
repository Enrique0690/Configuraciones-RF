// components/SearchBar.tsx
import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useTranslation } from 'react-i18next';
import { useSearch } from '@/context/SearchContext';  // Importamos el hook de búsqueda

const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const { searchQuery, setSearchQuery } = useSearch();  // Usamos el contexto global
  const textColor = useThemeColor({}, 'textsecondary');
  const placeholderColor = useThemeColor({}, 'placeholder');

  return (
    <View style={styles.searchContainer}>
      <Ionicons name="search-outline" size={20} color={textColor} style={styles.searchIcon} />
      <TextInput
        style={[styles.searchInput, { color: textColor }]}
        placeholder={t('search.placeholder')}
        placeholderTextColor={placeholderColor}
        value={searchQuery}
        onChangeText={setSearchQuery}  // Actualizamos el valor de búsqueda global
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
});

export default SearchBar;
