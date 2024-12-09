import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, BackHandler, useWindowDimensions } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors';
import SearchBar from '@/components/navigation/SearchBar';
import '@/i18n';
import { useTranslation } from "react-i18next";
import { ConfigProvider } from "@/components/Data/ConfigContext";
import { routeTitles } from "@/constants/routetitles";
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const segments = useSegments();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [selectedRoute, setSelectedRoute] = useState('');
    const { width } = useWindowDimensions();
    const isSmallScreen = width <= 768;
    const routeConfig = routeTitles[selectedRoute as keyof typeof routeTitles] || { title: null };

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

    useEffect(() => {
        if (isSmallScreen && isFullScreen) {
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
    }, [isSmallScreen, isFullScreen, segments]);

    const MenuItem = ({ item, onPress, isActive }: {
        item: { text: string},
        onPress: () => void,
        isActive: boolean
    }) => (
        <TouchableOpacity onPress={onPress} style={[styles.menuItem, { paddingVertical: isSmallScreen ? 20 : 10 }, isActive && styles.activeMenuItem]}>
            <Text style={styles.menuItemText}>{item.text}</Text>
        </TouchableOpacity>
    );
    
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

    const menuGroups = [
        [
            { text: t("layout.categorys.businessInfo"), route: "/settings/organization"},
        ],
        [
            { text: t("layout.categorys.orderingstations"), route: "/settings/order-station"},
            { text: t("layout.categorys.printers"), route: "/settings/printers"},
            { text: t("layout.categorys.tabletConfiguration"), route: "/settings/table-layout"},
        ],
        [
            { text: t("layout.categorys.security"), route: "/settings/security"},
            { text: t("layout.categorys.advancedOptions"), route: "/settings/advanced"},
        ],
    ];

    if (!selectedRoute) {
        return (
            <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={[styles.sidebarLoading, { width: isSmallScreen ? '100%' : 300 }]} />
            </View>
        );
    }

    return (
        <ConfigProvider connectionName="RunFood">
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            {(!isFullScreen || !isSmallScreen) && (
                <View style={[styles.sidebar, { width: isSmallScreen ? '100%' : 300 }]}>
                    <Text style={styles.header}>{t("layout.header")}</Text>
                    <View style={styles.searchBarContainer}>
                        <SearchBar/>
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
                        headerShown: !!routeConfig.title,
                        headerTitle: t(routeConfig.title),
                        contentStyle: { backgroundColor: "white" },
                        headerRight: () =>
                            routeConfig.showAddButton && routeConfig.navigate ? (
                                <TouchableOpacity onPress={() => routeConfig.navigate!(router)} style={{ marginRight: 20 }}>
                                    <Ionicons name="add-circle-outline" size={28} color={Colors.text} />
                                </TouchableOpacity>
                            ) : null,
                    }}
                />
            </View>
        </View>
        </ConfigProvider>
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
