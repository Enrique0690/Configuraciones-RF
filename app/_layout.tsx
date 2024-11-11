import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, Platform, BackHandler } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from '@/components/navigation/SearchBar';
import '@/i18n';
import { useTranslation } from "react-i18next";

const MenuItem = ({ item, router, setIsFullScreen }: { item: { text: string, route: string, icon: string }, router: any, setIsFullScreen: Function }) => (
    <TouchableOpacity onPress={() => {
        router.push(item.route);
        setIsFullScreen(true);
    }}>
        <Text style={styles.menuItem}>{item.icon} {item.text}</Text>
    </TouchableOpacity>
);

const MenuSection = ({ items, router, borderColor, setIsFullScreen }: { items: any[], router: any, borderColor: string, setIsFullScreen: Function }) => (
    <View style={[styles.section, { borderColor }]}>
        {items.map(item => <MenuItem key={item.text} item={item} router={router} setIsFullScreen={setIsFullScreen} />)}
    </View>
);

export default function Layout() {
    const { t } = useTranslation();
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const segments = useSegments();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const borderColor = useThemeColor({}, 'border');
    const secondaryTextColor = useThemeColor({}, 'textsecondary');

    useEffect(() => {
        setIsMobile(Platform.OS === 'android' || Platform.OS === 'ios');
    }, []);

    useEffect(() => {
        if (Number(segments.length) === 0) {
            setIsFullScreen(false);
        }
    }, [segments]);

    useEffect(() => {
        if (isMobile && isFullScreen) {
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
    }, [isMobile, isFullScreen, segments]);

    const menuItems = [
        { text: t("layout.menuItems.businessInfo"), route: "/Business-info", icon: "👁️" },
        { text: t("layout.menuItems.printers"), route: "/Printers", icon: "🖨️" },
        { text: t("layout.menuItems.paymentMethods"), route: "/Payment-methods", icon: "💳" },
        { text: t("layout.menuItems.integrations"), route: "/Integrations", icon: "🔗" },
        { text: t("layout.menuItems.tabletConfiguration"), route: "/Tablet-configuration", icon: "🍽️" },
        { text: t("layout.menuItems.security"), route: "/Security", icon: "🔒" },
        { text: t("layout.menuItems.advancedOptions"), route: "/Advanced-options", icon: "⚙️" },
        { text: t("layout.menuItems.taxConfigurationEC"), route: "/Tax-configuration-ec", icon: "📝" }
    ];

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.container}>
                {/* Panel izquierdo (Menú) */}
                {(!isFullScreen || !isMobile) && (
                    <View style={[styles.sidebar, { backgroundColor, width: isMobile ? '100%' : 300 }]}>
                        <Text style={[styles.header, { color: secondaryTextColor }]}>{t("layout.header")}</Text>
                        <ScrollView contentContainerStyle={styles.itemsContainer}>
                            <View style={styles.searchBarContainer}>
                                <SearchBar setIsFullScreen={setIsFullScreen} />
                            </View>
                            <MenuSection items={menuItems.slice(0, 4)} router={router} borderColor={borderColor} setIsFullScreen={setIsFullScreen} />
                            <MenuSection items={menuItems.slice(4)} router={router} borderColor={borderColor} setIsFullScreen={setIsFullScreen} />
                        </ScrollView>
                    </View>
                )}

                {/* Panel derecho (Contenido dinámico) */}
                <View style={[styles.content, isFullScreen && isMobile && styles.fullScreenContent]}>
                    <Slot />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    container: {
        flex: 1,
        flexDirection: 'row',
        zIndex: 1,
    },
    sidebar: {
        padding: 16,
        backgroundColor: Colors.background,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: Colors.text,
    },
    menuItem: {
        fontSize: 16,
        paddingVertical: 8,
        color: Colors.textsecondary,
    },
    content: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
        borderRadius: 8,
    },
    fullScreenContent: {
        width: '100%',
        height: '100%',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 12,
    },
    searchInput: {
        flex: 1,
        paddingVertical: 8,
        marginLeft: 8,
    },
    itemsContainer: {
        paddingBottom: 16,
    },
    section: {
        borderWidth: 1,
        borderRadius: 8,
        padding: 10,
        marginBottom: 16,
    },
    searchBarContainer: {
        zIndex: 10,
        marginBottom: 16,
    },
});
