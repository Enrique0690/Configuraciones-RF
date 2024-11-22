import React, { useState, useRef, useEffect } from 'react';
import {
  TextInput,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Keyboard,
  Platform,
  BackHandler
} from 'react-native';
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
}

const ICON_COLOR = '#A1A1A1';

const normalizeText = (text: string): string =>
  text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

const filterResults = (query: string, configs: ConfigItem[], translate: (key: string) => string): ConfigItem[] => {
  const normalizedQuery = normalizeText(query);
  return configs.filter((item) =>
    normalizeText(translate(item.label)).includes(normalizedQuery)
  );
};

const SearchBar: React.FC<SearchBarProps> = ({ setIsFullScreen }) => {
  const [query, setQuery] = useState<string>('');
  const [filteredResults, setFilteredResults] = useState<ConfigItem[]>(allConfigs);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { t } = useTranslation();
  const router = useRouter();

  const handleSearch = (text: string): void => {
    setQuery(text);
    setFilteredResults(text ? filterResults(text, allConfigs, t) : allConfigs);
    setSelectedIndex(null);
  };

  const handleSelectResult = (route?: string, id?: string): void => {
    if (route && id) {
      Keyboard.dismiss();
      setIsFullScreen?.(true);
      clearSearch();
      router.push({ pathname: route as any, params: { highlight: id } });
    }
  };

  const clearSearch = (): void => {
    setQuery('');
    setFilteredResults(allConfigs);
    setSelectedIndex(null);
  };

  const handleKeyDown = (event: any): void => {
    if (event.key === 'Escape') {
      clearSearch(); // Clear search when Escape key is pressed
    }

    if (filteredResults.length === 0) return;

    switch (event.key) {
      case 'ArrowDown':
        updateSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === filteredResults.length - 1 ? 0 : prevIndex + 1
        );
        break;
      case 'ArrowUp':
        updateSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === 0 ? filteredResults.length - 1 : prevIndex - 1
        );
        break;
      case 'Enter':
        if (selectedIndex !== null && filteredResults[selectedIndex]) {
          const { route, id } = filteredResults[selectedIndex];
          clearSearch();
          handleSelectResult(route, id);
        }
        break;
      default:
        break;
    }
  };

  const updateSelectedIndex = (calculateIndex: (prevIndex: number | null) => number): void => {
    setSelectedIndex((prevIndex) => {
      const newIndex = calculateIndex(prevIndex);
      scrollToIndex(newIndex);
      return newIndex;
    });
  };

  const scrollToIndex = (index: number): void => {
    scrollViewRef.current?.scrollTo({
      y: index * 50,
      animated: true,
    });
  };

  const renderSearchResult = (item: ConfigItem, index: number) => (
    <TouchableOpacity
      key={item.id || index}
      onPress={() => handleSelectResult(item.route, item.id)}
      activeOpacity={0.7}
      style={[
        styles.resultContainer,
        selectedIndex === index && styles.selectedResultContainer,
      ]}
    >
      <Text
        style={[
          styles.resultText,
          selectedIndex === index && styles.selectedResultText,
        ]}
      >
        {t(item.label)}
      </Text>
    </TouchableOpacity>
  );

  // Handle the 'Escape' key press and back button action on mobile
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleEscapePress = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          clearSearch();
        }
      };

      document.addEventListener('keydown', handleEscapePress);

      return () => {
        document.removeEventListener('keydown', handleEscapePress);
      };
    }

    const backAction = () => {
      if (query.length > 0) {
        clearSearch(); // Clear search if the back button is pressed
        return true; // Prevent default back action
      }
      return false; // Allow the default back action
    };

    if (Platform.OS === 'android') {
      BackHandler.addEventListener('hardwareBackPress', backAction);
    }

    return () => {
      if (Platform.OS === 'android') {
        BackHandler.removeEventListener('hardwareBackPress', backAction);
      }
    };
  }, [query]); // Dependency on 'query' to evaluate changes

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <Ionicons
          name="search-outline"
          size={20}
          color={ICON_COLOR}
          style={styles.searchIcon}
        />
        <TextInput
          value={query}
          onChangeText={handleSearch}
          placeholder={t('search.placeholder')}
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
  },
  input: {
    flex: 1,
    height: 40,
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
    marginLeft: 5,
  },
  clearButtonText: {
    color: '#555',
    fontSize: 14,
  },
  overlay: {
    position: 'absolute',
    top: 54,
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    elevation: 5,
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
  resultContainer: {
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  selectedResultContainer: {
    backgroundColor: '#D3D3D3',
    borderRadius: 5,
  },
  resultText: {
    fontSize: 16,
    color: '#333',
  },
  selectedResultText: {
    color: '#333',
  },
  noResultsText: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    fontSize: 16,
    color: '#A1A1A1',
    textAlign: 'center',
  },
});

export default SearchBar;