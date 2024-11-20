import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import useStorage from '@/hooks/useStorage';
import SearchBar from '@/components/navigation/SearchBar';
import DataRenderer from '@/components/DataRenderer';
import { businessInfoConfig, defaultData } from '@/constants/DataConfig/BusinessConfig';
import * as ImagePicker from 'expo-image-picker';
import { handleChange } from '@/hooks/handleChange';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const IMAGE_PREVIEW_SIZE = 250;

const BusinessInfoScreen: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const { data, loading, error, saveData, reloadData } = useStorage('businessInfo', defaultData);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { highlight } = useLocalSearchParams();

  useEffect(() => {
    if (data?.imageUrl) {
      setImageUri(data.imageUrl);
    }
  }, [data]);

  const openImagePicker = async () => {
    const permission = await requestImagePickerPermission();
    if (permission) {
      const result = await pickImage();
      if (result) {
        saveImage(result);
      }
    } else {
      alert(t('businessInfo.permissionDenied'));
    }
  };

  const requestImagePickerPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    return status === 'granted';
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: 'images',
      quality: 1,
    });
    return !result.canceled ? result.assets[0].uri : null;
  };

  const saveImage = (uri: string) => {
    setImageUri(uri);
    saveData({ ...data, imageUrl: uri });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('businessInfo.loading')}</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorMessage}>{t('businessInfo.loadError')}</Text>
        <TouchableOpacity onPress={reloadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>{t('businessInfo.retry')}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View>

        <Text style={[styles.sectionTitle, { color: Colors.text }]}>
          {t('businessInfo.header')}
        </Text>

        <ImageUploadSection
          imageUri={imageUri}
          onSelectImage={openImagePicker}
          buttonText={t('businessInfo.uploadImage')}
        />

        {businessInfoConfig.map(({ id, label, type }) => (
          <DataRenderer
            key={id}
            label={t(label)}
            value={data[id]}
            type={type}
            onSave={(newValue) => handleChange(id, newValue, data, saveData)}
            textColor={Colors.text}
            highlight={highlight === id}
          />
        ))}
        <DataRenderer 
          label={t('taxConfigurationEC.infoTributaria.sectionTitle')}
          type='buttonlist'
          textColor={Colors.text}
          value='./organization/ecuador/tax-info'
          iconName='document-text'
        />
      </ScrollView>
    </View>
  );
};

const ImageUploadSection: React.FC<{
  imageUri: string | null;
  onSelectImage: () => void;
  buttonText: string;
}> = ({ imageUri, onSelectImage, buttonText }) => (
  <>
    {!imageUri ? (
      <TouchableOpacity style={styles.uploadButton} onPress={onSelectImage}>
        <Text style={styles.uploadButtonText}>{buttonText}</Text>
      </TouchableOpacity>
    ) : (
      <TouchableOpacity onPress={onSelectImage}>
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
      </TouchableOpacity>
    )}
  </>
);

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
    display: Platform.select({ ios: 'flex', android: 'flex', default: 'none' }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  imagePreview: {
    width: '100%',
    height: IMAGE_PREVIEW_SIZE,
    resizeMode: 'contain',
    borderRadius: 10,
    marginBottom: 16,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 16,
    elevation: 5,
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  errorMessage: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default BusinessInfoScreen;