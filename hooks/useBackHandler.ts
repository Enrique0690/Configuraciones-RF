import { useEffect } from 'react';
import { BackHandler } from 'react-native';

export const useBackHandler = (onBackPress: () => boolean) => {
    useEffect(() => {
        const handleBackPress = () => {
            return onBackPress();
        };

        BackHandler.addEventListener('hardwareBackPress', handleBackPress);

        return () => {
            BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
        };
    }, [onBackPress]);
};