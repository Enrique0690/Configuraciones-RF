import { useState, useEffect, useCallback } from "react";
import { useRouter, useSegments } from "expo-router";

export const useNavigation = () => {
    const router = useRouter();
    const segments = useSegments();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState('');

    const handleNavigation = useCallback((route: string) => {
        router.push(route as any);
        setIsFullScreen(true);
        setSelectedRoute(route);
    }, [router]);

    useEffect(() => {
        const currentRoute = `/${segments.join('/')}`;
        setIsFullScreen(window.innerWidth <= 768 && currentRoute !== '/');
        setSelectedRoute(currentRoute);
    }, [segments]);

    useEffect(() => {
        if (window.innerWidth <= 768 && isFullScreen) {
            const handleBackPress = () => {
                if (Number(segments.length) === 0) {
                    setIsFullScreen(false);
                    return true;
                }
                return false;
            };
            window.addEventListener("hardwareBackPress", handleBackPress);
            return () => window.removeEventListener("hardwareBackPress", handleBackPress);
        }
    }, [isFullScreen, segments]);

    return {
        isFullScreen,
        selectedRoute,
        handleNavigation,
    };
};
