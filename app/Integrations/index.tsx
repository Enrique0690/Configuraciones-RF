import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/navigation/SearchBar';
import { useTranslation } from 'react-i18next';

const IntegrationsScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const textColor = useThemeColor({}, 'textsecondary');
  const { t } = useTranslation();
  const router = useRouter();

  const integrations = [
    { name: 'Mytapp', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', url: 'https://www.mytapp.com' },
    { name: 'Contificio', description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', url: 'https://www.contificio.com' },
  ];

  const [expandedIntegration, setExpandedIntegration] = useState<number | null>(null);

  const handleToggleExpand = (index: number) => {
    setExpandedIntegration(expandedIntegration === index ? null : index);
  };

  const handleConnect = (url: string) => {
    Linking.openURL(url).catch((err) => console.error('Error al abrir el enlace:', err));
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
    <View style={styles.searchBarContainer}>
        <SearchBar />
      </View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>{t('integrations.header')}</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {integrations.map((integration, index) => (
          <View key={integration.name} style={styles.integrationContainer}>
            <View style={styles.integrationHeader}>
              <View style={styles.titleContainer}>
                <Text style={[styles.integrationName, { color: textColor }]}>{integration.name}</Text>
                <TouchableOpacity onPress={() => handleToggleExpand(index)}>
                  <Text style={styles.moreText}>{expandedIntegration === index ? t('integrations.viewLess') : t('integrations.viewMore')}</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.connectButton}
                onPress={() => handleConnect(integration.url)}
              >
                <Text style={styles.connectButtonText}>{t('integrations.connectButton')}</Text>
              </TouchableOpacity>
            </View>
            {expandedIntegration === index && (
              <View style={styles.integrationDetails}>
                <Text style={[styles.integrationDescription, { color: textColor }]}>{integration.description}</Text>
              </View>
            )}
          </View>
        ))}
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

export default IntegrationsScreen;
