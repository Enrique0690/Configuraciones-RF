// hooks/useBackHandler.ts
import { useEffect } from "react";
import { BackHandler } from "react-native";

export function useBackHandler(isSmallScreen: boolean, isFullScreen: boolean, segments: string[], onExitFullScreen: () => void) {
    useEffect(() => {
        if (isSmallScreen && isFullScreen) {
            const handleBackPress = () => {
                if (segments.length === 0) {
                    onExitFullScreen();
                    return true;
                }
                return false;
            };

            BackHandler.addEventListener("hardwareBackPress", handleBackPress);
            return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
        }
    }, [isSmallScreen, isFullScreen, segments, onExitFullScreen]);
}
