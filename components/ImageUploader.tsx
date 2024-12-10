import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

interface ImageUploaderProps {
    initialUri?: string;
    onSave: (uri: string) => Promise<void>;
    buttonText: string;
}

const ImageUploader = ({ initialUri, onSave, buttonText }: ImageUploaderProps) => {
    const [imageUri, setImageUri] = useState<string | null>(initialUri || null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { t } = useTranslation();
    useEffect(() => {
        if (initialUri) {
            setImageUri(initialUri);
        }
    }, [initialUri]);
    const openImagePicker = async () => {
        setError(null);
        const permission = await requestImagePickerPermission();
        if (!permission) {
            setError(t('common.permissionDenied'));
            return;
        }
        const result = await pickImage();
        if (!result) return; 
        setIsLoading(true); 
        try {
            await onSave(result); 
            setImageUri(result); 
        } catch (error: any) {
            setError(error.message); 
        } finally {
            setIsLoading(false); 
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
    return (
        <View>
            {isLoading ? (
                <ActivityIndicator size="large" color="#4CAF50" />
            ) : (
                <>
                    {!imageUri ? (
                        <TouchableOpacity style={styles.uploadButton} onPress={openImagePicker}>
                            <Text style={styles.uploadButtonText}>{buttonText}</Text>
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity style={styles.imageContainer} onPress={openImagePicker}>
                            <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                        </TouchableOpacity>
                    )}
                    {error && <Text style={styles.errorText}>{error}</Text>}
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
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
        color: '#FFF',
        fontSize: 16,
    },
    imageContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    imagePreview: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    errorText: { 
    color: 'red', 
    fontSize: 12,
    marginTop: -5,
    marginBottom: 16,
    textAlign: 'center',
  },
});

export default ImageUploader;