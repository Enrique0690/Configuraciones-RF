import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTranslation } from 'react-i18next';
import { LoadingErrorState } from './Data/LoadingErrorState';

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
        setImageUri(initialUri || null);
    }, [initialUri]);
    const openImagePicker = async () => {
        setError(null);
        const hasPermission = await ensurePermission();
        if (!hasPermission) return;
        const result = await pickImage();
        if (!result) return;
        setIsLoading(true);
        try {
            await onSave(result);
            setImageUri(result);
        } catch (e: any) {
            setError(e.message || t('common.error'));
        } finally {
            setIsLoading(false);
        }
    };
    const ensurePermission = async () => {
        const { status } = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            const { status: requestStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (requestStatus !== 'granted') {
                setError(t('common.permissionDenied'));
                return false;
            }
        }
        return true;
    };
    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            quality: 1,
        });
        return result.assets?.[0]?.uri || null;
    };
    return (
        <View>
            {!isLoading && !imageUri && (
                <TouchableOpacity style={styles.uploadButton} onPress={openImagePicker}>
                    <Text style={styles.uploadButtonText}>{buttonText}</Text>
                </TouchableOpacity>
            )}
            {imageUri && (
                <TouchableOpacity style={styles.imageContainer} onPress={openImagePicker}>
                    <Image source={{ uri: imageUri }} style={styles.imagePreview} />
                </TouchableOpacity>
            )}
            <LoadingErrorState isLoading={isLoading} error={error} />
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
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
        color: '#FFF',
        fontSize: 16,
        textAlign: 'center',
    },
    imageContainer: {
        marginVertical: 10,
        alignItems: 'center',
    },
    imagePreview: {
        resizeMode: 'cover',
    }
});

export default ImageUploader;