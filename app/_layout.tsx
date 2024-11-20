import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, BackHandler, Dimensions, useWindowDimensions } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors';
import SearchBar from '@/components/navigation/SearchBar';
import '@/i18n';
import { useTranslation } from "react-i18next";

const MenuItem = ({ item, router, setIsFullScreen, selectedRoute, setSelectedRoute }: {
    item: { text: string, route: string, icon: string },
    router: any, setIsFullScreen: Function, selectedRoute: string, setSelectedRoute: (route: string) => void
}) => {
    const isActive = selectedRoute.startsWith(item.route);

    return (
        <TouchableOpacity
            onPress={() => {
                router.push(item.route);
                setIsFullScreen(true);
                setSelectedRoute(item.route);
            }}
            style={[styles.menuItem, isActive && styles.activeMenuItem]}>
            <Text style={styles.menuItemText}>{item.icon} {item.text}</Text>
        </TouchableOpacity>
    );
};

const MenuSection = ({ items, router, setIsFullScreen, selectedRoute, setSelectedRoute }: {
    items: any[], router: any, setIsFullScreen: Function, selectedRoute: string, setSelectedRoute: (route: string) => void
}) => (
    <View style={[styles.section]}>
        {items.map(item => (
            <MenuItem
                key={item.text}
                item={item}
                router={router}
                setIsFullScreen={setIsFullScreen}
                selectedRoute={selectedRoute}
                setSelectedRoute={setSelectedRoute}
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
    useEffect(() => {
        setIsFullScreen(isTabletOrMobile);
    }, [isTabletOrMobile]);
    useEffect(() => {
        if (segments && segments.length > 0) {
            const currentRoute = `/${segments.join('/')}`;
            setSelectedRoute(currentRoute);
        }
    }, [segments]);

    useEffect(() => {
        if (Number(segments.length) === 0) {
            setIsFullScreen(isTabletOrMobile);
            setSelectedRoute('');
        }
    }, [segments, isTabletOrMobile]);

    useEffect(() => {
        if (isTabletOrMobile && isFullScreen) {
            const backAction = () => {
                if (Number(segments.length) === 0) {
                    setIsFullScreen(false);
                    return true;
                }
                return false;
            };
            BackHandler.addEventListener("hardwareBackPress", backAction);
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }
    }, [isTabletOrMobile, isFullScreen, segments]);

    const menuItems = [
        { text: t("layout.menuItems.businessInfo"), route: "/organization", icon: "👁️" },
        { text: t("layout.menuItems.orderingstations"), route: "/order-station", icon: "👨‍🍳" },
        { text: t("layout.menuItems.printers"), route: "/printers", icon: "🖨️" },
        { text: t("layout.menuItems.tabletConfiguration"), route: "/table-layout", icon: "🍽️" },
        { text: t("layout.menuItems.security"), route: "/security", icon: "🔒" },
        { text: t("layout.menuItems.advancedOptions"), route: "/advanced", icon: "⚙️" }
    ];

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {(!isFullScreen || !isTabletOrMobile) && (
                <View style={[styles.sidebar, { width: isTabletOrMobile ? '100%' : 300 }]}>
                    <Text style={styles.header}>{t("layout.header")}</Text>
                    <View style={styles.searchBarContainer}>
                        <SearchBar setIsFullScreen={setIsFullScreen} />
                    </View>
                    <ScrollView>
                        <MenuSection items={menuItems.slice(0, 1)} router={router} setIsFullScreen={setIsFullScreen} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
                        <MenuSection items={menuItems.slice(1, 4)} router={router} setIsFullScreen={setIsFullScreen} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
                        <MenuSection items={menuItems.slice(4)} router={router} setIsFullScreen={setIsFullScreen} selectedRoute={selectedRoute} setSelectedRoute={setSelectedRoute} />
                    </ScrollView>
                </View>
            )}
            <View style={[styles.content, isFullScreen && !isTabletOrMobile && styles.fullScreenContent]}>
                <Stack
                    screenOptions={{
                        headerShown: false
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
        zIndex: 1,
    },
    sidebar: {
        padding: 16,
        paddingRight: 20,
        paddingLeft: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: Colors.text,
        display: Platform.select({ ios: 'flex', android: 'flex', default: 'none' }),
    },
    menuItem: {
        fontSize: 16,
        paddingVertical: 7,
        color: Colors.text,
    },
    content: {
        flex: 1,
        maxWidth: 800,
        marginHorizontal: 'auto',
    },
    fullScreenContent: {
        width: '100%',
        height: '100%',
    },
    section: {
        paddingVertical: 15,
    },
    searchBarContainer: {
        zIndex: 10,
    },
    activeMenuItem: {
        backgroundColor: '#eaeaea',
        borderRadius: 8,
    },
    menuItemText: {
        paddingLeft: 15,
        fontSize: 16,
        fontWeight: 600,
    },
});
