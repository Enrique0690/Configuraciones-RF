import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useTranslation } from 'react-i18next';
import SearchBar from '@/components/navigation/SearchBar';
import DataRenderer from '@/components/DataRenderer';
import { organizationConfig } from '@/constants/DataConfig/organization';
import * as ImagePicker from 'expo-image-picker';
import { handleChange } from '@/hooks/handleChange';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useConfig } from '@/components/Data/ConfigContext';

const BusinessInfoScreen: React.FC = () => {
  const { t } = useTranslation();
  const { dataContext, isLoading } = useConfig(); 
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { highlight } = useLocalSearchParams();

  useEffect(() => {
    if (dataContext?.Configuracion.DATA?.imageUrl) {
      setImageUri(dataContext.Configuracion.DATA.imageUrl);
    }
  }, [dataContext?.Configuracion.DATA]);

  const openImagePicker = async () => {
    const permission = await requestImagePickerPermission();
    if (permission) {
      const result = await pickImage();
      if (result) {
        saveImage(result);
      }
    } else {
      alert(t('common.permissionDenied'));
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
    if (dataContext) {
      dataContext.Configuracion.Set('imageUrl', uri);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.loadingText}>{t('common.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.searchBarContainer}>
          <SearchBar />
        </View> 

        <ImageUploadSection 
          imageUri={imageUri}
          onSelectImage={openImagePicker}
          buttonText={t('common.uploadImage')}
        />

        {organizationConfig.map(({ label, id, type, list }) => (
          <DataRenderer
            key={id}
            label={t(label)}
            value={dataContext?.Configuracion.DATA[id]} 
            type={type}
            onSave={(newValue) => 
              handleChange(id, newValue, dataContext?.Configuracion.DATA, (updatedData) => 
                dataContext?.Configuracion.Set(id, updatedData[id])
              )
            }
            textColor={Colors.text}
            dataList={list}
            highlight={highlight === id}
          />
        ))}
        <DataRenderer
          label={t('organization.taxinfo.header')} 
          value="/organization/ecuador/tax-info"
          type='buttonlist'
          iconName='document-text' 
          textColor={Colors.text} 
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
      <TouchableOpacity style={styles.imageContainer} onPress={onSelectImage}>
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
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  imagePreview: {
    width: '100%',
    height: undefined,
    aspectRatio: 1,
    maxWidth: 500,
    maxHeight: 300,
    resizeMode: 'contain',
    borderRadius: 15,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginVertical: 16,
    maxWidth: 300,
    marginHorizontal: 'auto',
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
});

export default BusinessInfoScreen;
