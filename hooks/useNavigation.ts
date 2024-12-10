// hooks/useNavigationHandler.ts
import { useState, useEffect, useCallback } from "react";
import { useSegments, useRouter } from "expo-router";

export function useNavigation(isSmallScreen: boolean) {
    const router = useRouter();
    const segments = useSegments();
    const [selectedRoute, setSelectedRoute] = useState('');
    const [isFullScreen, setIsFullScreen] = useState(false);

    const handleNavigation = useCallback((route: string) => {
        router.push(route as any);
        setIsFullScreen(true);
        setSelectedRoute(route);
    }, [router]);

    useEffect(() => {
        const currentRoute = `/${segments.join('/')}`;
        setIsFullScreen(isSmallScreen && currentRoute !== '/');
        setSelectedRoute(currentRoute);
    }, [isSmallScreen, segments]);

    return { selectedRoute, isFullScreen, setIsFullScreen, handleNavigation, segments };
}
