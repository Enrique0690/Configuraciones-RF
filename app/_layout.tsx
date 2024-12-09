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
import { menuconfig } from "@/constants/menuconfig";
import MenuSection from "@/components/MenuComponents";

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
                            <SearchBar />
                        </View>
                        <ScrollView>
                            {menuconfig.map((group, index) => (
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
                            contentStyle: { backgroundColor: "white" },
                            header: () => (
                                <View>
                                    <View style={styles.headerContainer}>
                                        <View style={styles.headerLeft}>
                                            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                                                <Ionicons name="arrow-back" size={24} color={Colors.text} />
                                            </TouchableOpacity>
                                        </View>
                                        <Text style={styles.headerTitle}>{t(routeConfig.title)}</Text>
                                        {routeConfig.showAddButton && routeConfig.navigate && (
                                            <TouchableOpacity
                                                onPress={() => routeConfig.navigate!(router)}
                                                style={styles.addButton}
                                            >
                                                <Ionicons name="add-circle-outline" size={28} color={Colors.text} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                    {routeConfig.title !== "common.searchtitle" && width < 768 && (
                                        <View style={styles.searchBarContainer}>
                                            <SearchBar />
                                        </View>
                                    )}
                                </View>
                            ),
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
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "white",
        marginHorizontal: 16,
        paddingVertical: 10,
    },
    activeMenuItem: {
        backgroundColor: '#eaeaea',
        borderRadius: 8,
    },
    menuItemText: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 15,
        paddingVertical: 10,
        backgroundColor: "white",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
    },
    headerLeft: {
        flexDirection: "row",
        alignItems: "center",
    },
    backButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: "bold",
        flex: 1,
        textAlign: "center",
    },
    addButton: {
        marginRight: 10,
    },
});
