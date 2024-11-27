import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, StyleSheet, Keyboard, Platform, BackHandler } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { allConfigs } from '@/constants/DataConfig';
import { Ionicons } from '@expo/vector-icons';

interface SearchBarProps {
  setIsFullScreen?: (value: boolean) => void;
}

interface ConfigItem {
  label: string;
  route?: string;
  id?: string;
  category?: string;
}

const ICON_COLOR = '#A1A1A1';
const SEARCH_BAR_HEIGHT = 54;

const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const filterResults = (
  query: string,
  configs: ConfigItem[],
  translate: (key: string) => string
): ConfigItem[] => {
  const normalizedQuery = normalizeText(query);
  return configs.filter((item) =>
    normalizeText(translate(item.label)).includes(normalizedQuery) ||
    normalizeText(translate(item.category || '')).includes(normalizedQuery)
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ setIsFullScreen }) => {
  const [query, setQuery] = useState<string>('');
  const [filteredResults, setFilteredResults] = useState<ConfigItem[]>(allConfigs);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const searchBarRef = useRef<View>(null);
  const flatResults = useRef<ConfigItem[]>([]); 
  const scrollViewRef = useRef<ScrollView>(null);
  const { t } = useTranslation();
  const router = useRouter();

  if (Platform.OS === 'web' || Platform.OS === 'windows') {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const node = searchBarRef.current;
      if (node && !(node as any).contains(event.target)) {
        clearSearch();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  }

  const handleSearch = (text: string): void => {
    setQuery(text);
    const results = text ? filterResults(text, allConfigs, t) : allConfigs;
    setFilteredResults(results);
    setSelectedIndex(null);
    flatResults.current = results.flatMap((item) => item); 
  };

  const handleSelectResult = (route?: string, id?: string): void => {
    if (route) {
      Keyboard.dismiss();
      setIsFullScreen?.(true);
      clearSearch();
      router.push(id ? { pathname: route as any, params: { highlight: id } } : route as any);
    }
  };
  
  const clearSearch = (): void => {
    setQuery('');
    setFilteredResults(allConfigs);
    setSelectedIndex(null);
    flatResults.current = allConfigs.flatMap((item) => item); 
  };

  const handleKeyDown = (event: any): void => {
    if (event.key === 'Escape') clearSearch();
    if (flatResults.current.length === 0) return;
    switch (event.key) {
      case 'ArrowDown':
        updateSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === flatResults.current.length - 1 ? 0 : prevIndex + 1
        );
        break;
      case 'ArrowUp':
        updateSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === 0 ? flatResults.current.length - 1 : prevIndex - 1
        );
        break;
      case 'Enter':
        if (selectedIndex !== null && flatResults.current[selectedIndex]) {
          const { route, id } = flatResults.current[selectedIndex];
          handleSelectResult(route, id);
        }
        break;
    }
  };

  const updateSelectedIndex = (calculateIndex: (prevIndex: number | null) => number): void => {
    setSelectedIndex((prevIndex) => {
      const newIndex = calculateIndex(prevIndex);
      scrollToSelectedIndex(newIndex);
      return newIndex;
    });
  };

const scrollToSelectedIndex = (index: number): void => {
  const itemHeight = 50; 
  const scrollViewHeight = 300; 
  const scrollPosition = Math.max(0, (index * itemHeight) - (scrollViewHeight / 2) + (itemHeight / 2));
  scrollViewRef.current?.scrollTo({
    y: scrollPosition,
    animated: true,
  });
};

  const groupResultsByCategory = (results: ConfigItem[]) =>
    results.reduce<{ [key: string]: ConfigItem[] }>((acc, item) => {
      const category = item.category || 'default';
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});

  const highlightMatchedText = (text: string) => {
    const normalizedQuery = normalizeText(query);
    const startIndex = normalizeText(text).indexOf(normalizedQuery);

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
    const groupedResults = groupResultsByCategory(filteredResults);

    return Object.entries(groupedResults).map(([category, items]) => (
      <View key={category} style={styles.categoryContainer}>
        <Text style={styles.categoryHeader}>{t(category)}</Text>
        {items.map((item, index) => {
          const globalIndex = flatResults.current.indexOf(item);
          return (
            <TouchableOpacity
              key={item.id || index}
              onPress={() => handleSelectResult(item.route, item.id)}
              activeOpacity={0.7}
              style={[
                styles.resultContainer,
                selectedIndex === globalIndex && styles.selectedResultContainer,
              ]}
            >
              <Text
                style={[
                  styles.resultText,
                  selectedIndex === globalIndex && styles.selectedResultText,
                ]}
              >
                {highlightMatchedText(t(item.label))}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ));
  };
  
  useEffect(() => {
    const handleEscapePress = (event: KeyboardEvent) => {
      if (event.key === 'Escape') clearSearch();
    };
    const backAction = () => {
      if (query.length > 0) {
        clearSearch();
        return true;
      }
      return false;
    };

    if (Platform.OS === 'web') {
      document.addEventListener('keydown', handleEscapePress);
      return () => document.removeEventListener('keydown', handleEscapePress);
    }

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backAction);
      return () => BackHandler.removeEventListener('hardwareBackPress', backAction);
    }
  }, [query]);

  return (
    <View ref={searchBarRef} style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Ionicons name="search-outline" size={20} color={ICON_COLOR} style={styles.searchIcon} />
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder={t('common.search')}
          style={styles.input}
          placeholderTextColor={ICON_COLOR}
          onKeyPress={handleKeyDown}
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
            ref={scrollViewRef}
            style={styles.scrollContainer}
            contentContainerStyle={styles.resultsContainer}
            keyboardShouldPersistTaps="handled"
          >
            {filteredResults.length > 0 ? renderSearchResults() : (
              <Text style={styles.noResultsText}>{t('search.noResults')}</Text>
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 5,
    marginBottom: 20,
    width: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: ICON_COLOR,
    backgroundColor: '#F9F9F9',
    borderRadius: 15,
  },
  input: {
    flex: 1,
    fontSize: 16,
    backgroundColor: 'transparent',
    marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 5,
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
  overlay: {
    position: 'absolute',
    top: SEARCH_BAR_HEIGHT,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    zIndex: 1,
  },
  scrollContainer: {
    maxHeight: 400,
    borderColor: "#333",
    borderWidth: 1,
    borderRadius: 10,
  },
  resultsContainer: {
    paddingVertical: 10,
  },
  noResultsText: {
    color: ICON_COLOR,
    textAlign: 'center',
    marginVertical: 10,
  },
  categoryContainer: {
    marginBottom: 15,
  },
  categoryHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 5,
  },
  resultContainer: {
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  selectedResultContainer: {
    backgroundColor: '#F0F0F0',
  },
  resultText: {
    fontSize: 14,
    color: '#333',
  },
  selectedResultText: {
    color: '#000',
    fontWeight: 'bold',
  },
  highlightedText: {
    color: 'blue',
  },
});

export default SearchBar;