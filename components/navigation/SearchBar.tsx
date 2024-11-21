import React, { useState } from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, Keyboard } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { allConfigs } from '@/constants/DataConfig';

interface SearchBarProps {
  setIsFullScreen?: (value: boolean) => void;
}

const normalizeText = (text: string) =>
  text.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const filterResults = (text: string, allConfigs: any[], t: Function) => {
  const normalizedText = normalizeText(text);
  return allConfigs.filter((item) =>
    normalizeText(t(item.label)).includes(normalizedText)
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ setIsFullScreen }) => {
  const [query, setQuery] = useState<string>('');
  const [filteredResults, setFilteredResults] = useState(allConfigs);
  const { t } = useTranslation();
  const router = useRouter();

  const handleSearch = (text: string) => {
    setQuery(text);
    setFilteredResults(text ? filterResults(text, allConfigs, t) : allConfigs);
  };

  const handleSelectResult = (route: string, id: string) => {
    Keyboard.dismiss();
    setIsFullScreen?.(true);
    setQuery('');
    setFilteredResults(allConfigs);
  
    router.push({
      pathname: route as any,
      params: { highlight: id },  
    });
  };

  const clearSearch = () => {
    setQuery('');
    setFilteredResults(allConfigs);
  };

  const renderSearchResult = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleSelectResult(item.route, item.id)}  
      activeOpacity={0.7}
    >
      <Text
        style={[
          styles.resultText,
          index === filteredResults.length - 1 && styles.resultTextLast,
        ]}
      >
        {t(item.label)}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder={t('search.placeholder')}
          style={styles.input}
          placeholderTextColor="#A1A1A1"
          onSubmitEditing={() => handleSearch(query)} 
        />
        {query.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearSearch}>
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>
      {query.length > 0 && (
        <View style={styles.overlay}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.resultsContainer}
          >
            {filteredResults.length > 0 ? (
              filteredResults.map(renderSearchResult)
            ) : (
              <Text style={styles.noResultsText}>{t('search.noResults')}</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 20,
    width: '100%',
  },
  inputContainer: {
    position: 'relative',
    width: '100%',
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 20,
    fontSize: 16,
    backgroundColor: '#F9F9F9',
    width: '100%',
  },
  clearButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#DDDDDD',
    borderRadius: 15,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearButtonText: {
    color: '#555',
    fontSize: 14,
  },
  overlay: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 20,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
  },
  scrollContainer: {
    maxHeight: 300,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  resultsContainer: {
    paddingVertical: 0,
  },
  resultText: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#333',
    borderBottomColor: '#E0E0E0',
    borderBottomWidth: 1,
  },
  resultTextLast: {
    borderBottomWidth: 0,
  },
  noResultsText: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#A1A1A1',
    textAlign: 'center',
  },
});
