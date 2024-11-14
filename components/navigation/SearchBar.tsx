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

  const handleSelectResult = (route: string, label: string) => {
    Keyboard.dismiss();
    setIsFullScreen?.(true);
    setQuery('');
    setFilteredResults(allConfigs);
  
    router.push({
      pathname: route as any,
      params: { highlight: label },  
    });
  };
  
  const renderSearchResult = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      onPress={() => handleSelectResult(item.route, item.label)}  
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
      <TextInput
        value={query}
        onChangeText={handleSearch}
        placeholder={t('search.placeholder')}
        style={styles.input}
        placeholderTextColor="#A1A1A1"
        onSubmitEditing={() => handleSearch(query)} 
      />
      {query.length > 0 && (
        <View style={styles.overlay}>
          <ScrollView
            style={styles.scrollContainer}
            contentContainerStyle={styles.resultsContainer}
          >
            {filteredResults.map(renderSearchResult)}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 20,
    marginTop: 5,
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
});
