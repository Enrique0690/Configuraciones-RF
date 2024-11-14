import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/navigation/SearchBar';
import { useTranslation } from 'react-i18next';

const OrderingstationsScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const { t } = useTranslation();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor }]}>
    <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>Estaciones de pedido</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
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
    width: '100%',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 16,
    textAlign: 'center',
  },
  integrationContainer: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    elevation: 2,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  },
  integrationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  integrationName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 8,
  },
  moreText: {
    fontSize: 12,
    color: '#007BFF',
  },
  integrationDetails: {
    marginTop: 10,
  },
  integrationDescription: {
    fontSize: 14,
    color: '#333',
  },
  connectButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  connectButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default OrderingstationsScreen;
