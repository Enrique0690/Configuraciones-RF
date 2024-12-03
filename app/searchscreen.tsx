import React, { useRef } from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, StyleSheet, Keyboard } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import useSearch from '@/hooks/useSearch';
import { allConfigs } from '@/constants/DataConfig';

const ScreenSearch: React.FC = () => {
  const { t } = useTranslation();
  const { query, setQuery, filteredResults } = useSearch(allConfigs);
  const flatResults = Object.values(filteredResults).flat();
  const router = useRouter();
  const scrollViewRef = useRef<ScrollView>(null);

  const clearSearch = (): void => {
    setQuery('');
    Keyboard.dismiss();
  };

  const handleSelectResult = (route?: string, id?: string): void => {
    if (route) {
      Keyboard.dismiss();
      setQuery('');
      router.push(id ? { pathname: route, params: { highlight: id } } : route as any);
    }
  };

  const highlightMatchedText = (text: string) => {
    const normalizedQuery = query.toLowerCase();
    const startIndex = text.toLowerCase().indexOf(normalizedQuery);

    if (startIndex === -1) return <Text>{text}</Text>;

    const endIndex = startIndex + normalizedQuery.length;
    return (
      <>
        <Text>{text.slice(0, startIndex)}</Text>
        <Text style={styles.highlightedText}>{text.slice(startIndex, endIndex)}</Text>
        <Text>{text.slice(endIndex)}</Text>
      </>
    );
  };

  const renderSearchResults = () => {
    return Object.entries(filteredResults).map(([category, items]) => (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryHeader}>{category}</Text>
        {items.map((item, index) => (
          <TouchableOpacity
            key={item.id || index}
            onPress={() => handleSelectResult(item.route, item.id)}
            style={styles.resultContainer}
          >
            <Text style={styles.resultText}>{highlightMatchedText(item.label)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.resultsHeader}>Resultados de búsqueda</Text>

      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={20} color="#A1A1A1" style={styles.searchIcon} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder={t('common.search')}
          style={styles.input}
          placeholderTextColor="#A1A1A1"
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.resultsContainer}
        keyboardShouldPersistTaps="handled"
      >
        {query.length > 0 ? (
          flatResults.length > 0 ? (
            renderSearchResults()
          ) : (
            <Text style={styles.noResultsText}>{t('common.noResults')}</Text>
          )
        ) : (
          <Text style={styles.placeholderText}>{t('common.search.placeholder')}</Text>
        )}
      </ScrollView>
    </View>
  );
};

export default ScreenSearch;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,  
  },
  resultsHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    marginBottom: 16,  
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    maxWidth: 350,
    borderWidth: 1, 
    borderColor: '#000',
  },
  searchIcon: {
    marginHorizontal: 10,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333333',
    borderRadius: 8, 
  },
  clearButton: {
    backgroundColor: '#DDDDDD',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  clearButtonText: {
    color: '#555',
    fontSize: 12,
  },
  resultsContainer: {
    padding: 10,
  },
  categoryContainer: {
    marginBottom: 20,
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  resultContainer: {
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  resultText: {
    fontSize: 14,
    color: '#333333',
  },
  highlightedText: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
  noResultsText: {
    fontSize: 16,
    color: '#A1A1A1',
    textAlign: 'center',
    marginTop: 20,
  },
  placeholderText: {
    fontSize: 16,
    color: '#A1A1A1',
    textAlign: 'center',
    marginTop: 20,
  },
});
