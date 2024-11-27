import React, { useState, useRef, useEffect } from 'react';
import { TextInput, View, Text, TouchableOpacity, ScrollView, StyleSheet, Keyboard, Platform, BackHandler, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { allConfigs } from '@/constants/DataConfig';
import { Ionicons } from '@expo/vector-icons';
import useSearch from '@/hooks/useSearch';

const ICON_COLOR = '#A1A1A1';
const SEARCH_BAR_HEIGHT = 54;

const SearchBar: React.FC = () => {
  const searchBarRef = useRef<View>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const router = useRouter();
  const { t } = useTranslation();
  const { query, setQuery, filteredResults } = useSearch(allConfigs);
  const flatResults = Object.values(filteredResults).flat();
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const { width } = useWindowDimensions();

  const handleSearchFocus = () => {
    if (width < 768) {
      Keyboard.dismiss();
      router.push('/searchscreen');
    }
  };
  

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

  const handleSelectResult = (route?: string, id?: string): void => {
    if (route) {
      Keyboard.dismiss();
      setQuery('');
      router.push(id ? { pathname: route, params: { highlight: id } } : route as any);
    }
  };
  
  const clearSearch = (): void => {
    setQuery('');
    setSelectedIndex(null);
  };

  useEffect(() => {
    if (selectedIndex !== null && (selectedIndex < 0 || selectedIndex >= flatResults.length)) {
      setSelectedIndex(null); 
    }
  }, [flatResults, selectedIndex]);  

  const handleKeyDown = (event: any): void => {
    if (event.key === 'Escape') clearSearch();
    if (flatResults.length === 0) return; 
  
    switch (event.key) {
      case 'ArrowDown':
        updateSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === flatResults.length - 1 ? 0 : prevIndex + 1
        );
        break;
      case 'ArrowUp':
        updateSelectedIndex((prevIndex) =>
          prevIndex === null || prevIndex === 0 ? flatResults.length - 1 : prevIndex - 1
        );
        break;
      case 'Enter':
        if (selectedIndex !== null && flatResults[selectedIndex]) {
          const { route, id } = flatResults[selectedIndex];
          handleSelectResult(route, id);
        }
        break;
    }
  };  

  const updateSelectedIndex = (calculateIndex: (prevIndex: number | null) => number): void => {
    if (flatResults.length === 0) return; 
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
        {items.map((item, index) => {
          const globalIndex = flatResults.indexOf(item);
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
                {highlightMatchedText(item.label)}
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
          onChangeText={setQuery}
          placeholder={t('common.search')}
          style={styles.input}
          placeholderTextColor={ICON_COLOR}
          onKeyPress={handleKeyDown}
          onFocus={handleSearchFocus}
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
            keyboardShouldPersistTaps="handled"
          >
            {flatResults.length > 0 ? renderSearchResults() : (
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
    width: '100%',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,  
    borderColor: '#000',  
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#333333',
    backgroundColor: 'transparent',
    borderRadius: 8,  
    marginLeft: 10,
  },
  searchIcon: {
    marginLeft: 10,
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
  noResultsText: {
    color: '#A1A1A1',  
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
