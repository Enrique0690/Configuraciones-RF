import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';

interface ImageUploaderProps {
    initialUri?: string;
    onSave: (uri: string) => void;
    buttonText: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ initialUri, onSave, buttonText }) => {
    const [imageUri, setImageUri] = useState<string | null>(initialUri || null);
    const { t } = useTranslation();
    useEffect(() => {
        if (initialUri) {
            setImageUri(initialUri);
        }
    }, [initialUri]);

    const openImagePicker = async () => {
        const permission = await requestImagePickerPermission();
        if (permission) {
            const result = await pickImage();
            if (result) {
                setImageUri(result);
                onSave(result);
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

    return (
        <View>
            {!imageUri ? (
                <TouchableOpacity style={styles.uploadButton} onPress={openImagePicker}>
                    <Text style={styles.uploadButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity style={styles.imageContainer} onPress={openImagePicker}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                </TouchableOpacity>
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
});

export default ImageUploader;