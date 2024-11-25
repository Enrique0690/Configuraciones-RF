import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, BackHandler, useWindowDimensions } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors';
import SearchBar from '@/components/navigation/SearchBar';
import '@/i18n';
import { useTranslation } from "react-i18next";

// Componente para un elemento de menú
const MenuItem = ({ item, onPress, isActive }: {
    item: { text: string},
    onPress: () => void,
    isActive: boolean
}) => (
    <TouchableOpacity onPress={onPress} style={[styles.menuItem, isActive && styles.activeMenuItem]}>
        <Text style={styles.menuItemText}>{item.text}</Text>
    </TouchableOpacity>
);

// Componente para una sección de menú
const MenuSection = ({ items, onItemPress, selectedRoute }: {
    items: { text: string, route: string}[],
    onItemPress: (route: string) => void,
    selectedRoute: string
}) => (
    <View style={styles.section}>
        {items.map(item => (
            <MenuItem
                key={item.text}
                item={item}
                isActive={selectedRoute.startsWith(item.route)}
                onPress={() => onItemPress(item.route)}
            />
        ))}
    </View>
);

export default function Layout() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const segments = useSegments();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState('');
    const { width } = useWindowDimensions();
    const isTabletOrMobile = width <= 768;

    // Función para manejar la navegación y actualización del estado
    const handleNavigation = useCallback((route: string) => {
        router.push(route as any);
        setIsFullScreen(true);
        setSelectedRoute(route);
    }, [router]);

    useEffect(() => {
        // Actualiza el estado de la pantalla completa según la ruta y el tamaño del dispositivo
        const currentRoute = `/${segments.join('/')}`;
        setIsFullScreen(isTabletOrMobile && currentRoute !== '/');
        setSelectedRoute(currentRoute);
    }, [isTabletOrMobile, segments]);

    useEffect(() => {
        // Manejo del botón de retroceso en dispositivos móviles
        if (isTabletOrMobile && isFullScreen) {
            const handleBackPress = () => {
                if (Number(segments.length) === 0) {
                    setIsFullScreen(false);
                    return true;
                }
                return false;
            };
            BackHandler.addEventListener("hardwareBackPress", handleBackPress);
            return () => BackHandler.removeEventListener("hardwareBackPress", handleBackPress);
        }
    }, [isTabletOrMobile, isFullScreen, segments]);

    const menuGroups = [
        [
            { text: t("layout.categorys.businessInfo"), route: "/organization"},
        ],
        [
            { text: t("layout.categorys.orderingstations"), route: "/order-station"},
            { text: t("layout.categorys.printers"), route: "/printers"},
            { text: t("layout.categorys.tabletConfiguration"), route: "/table-layout"},
        ],
        [
            { text: t("layout.categorys.security"), route: "/security"},
            { text: t("layout.categorys.advancedOptions"), route: "/advanced"},
        ],
    ];

    // Muestra un loader mientras carga la interfaz
    if (!selectedRoute) {
        return (
            <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={[styles.sidebarLoading, { width: isTabletOrMobile ? '100%' : 300 }]} />
            </View>
        );
    }

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {(!isFullScreen || !isTabletOrMobile) && (
                <View style={[styles.sidebar, { width: isTabletOrMobile ? '100%' : 300 }]}>
                    <Text style={styles.header}>{t("layout.header")}</Text>
                    <View style={styles.searchBarContainer}>
                        <SearchBar setIsFullScreen={setIsFullScreen} />
                    </View>
                    <ScrollView>
                        {menuGroups.map((group, index) => (
                            <MenuSection
                                key={index}
                                items={group}
                                onItemPress={handleNavigation}
                                selectedRoute={selectedRoute}
                            />
                        ))}
                    </ScrollView>
                </View>
            )}
            <View style={[styles.content, isFullScreen && styles.fullScreenContent]}>
                <Stack
                    screenOptions={{
                        headerShown: false,
                        contentStyle: { backgroundColor: 'white' },
                    }}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        flexDirection: 'row',
    },
    sidebar: {
        padding: 16,
    },
    sidebarLoading: {
        height: '100%',
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: Colors.text,
    },
    menuItem: {
        paddingVertical: 12,
        paddingHorizontal: 20,
        fontSize: 16,
    },
    content: {
        flex: 1,
        maxWidth: 900,
        marginHorizontal: 'auto',
    },
    fullScreenContent: {
        width: '100%',
        height: '100%',
    },
    section: {
        paddingVertical: 10,
    },
    searchBarContainer: {
        zIndex: 10,
    },
    activeMenuItem: {
        backgroundColor: '#eaeaea',
        borderRadius: 8,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
    },
});
