import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Platform, BackHandler } from "react-native";
import { Slot, useRouter, useSegments } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';
import SearchBar from "@/components/SearchBar";

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
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const segments = useSegments();
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const backgroundColor = useThemeColor({}, 'background');
    const itemBackgroundColor = useThemeColor({}, 'itemBackground');
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');
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
        { text: "Información del Negocio", route: "/business-info", icon: "👁️" },
        { text: "Impresoras", route: "/printers", icon: "🖨️" },
        { text: "Métodos de Cobro", route: "/payment-methods", icon: "💳" },
        { text: "Integración con otras apps", route: "/integrations", icon: "🔗" },
        { text: "Configuración de mesas", route: "/tablet-configuration", icon: "🍽️" },
        { text: "Seguridad", route: "/security", icon: "🔒" },
        { text: "Opciones avanzadas", route: "/advanced-options", icon: "⚙️" },
        { text: "Configuración tributaria (Ecuador)", route: "/tax-configuration-ec", icon: "📝" }
    ];

    return (
        <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
            <View style={styles.container}>
                {/* Panel izquierdo (Menú) */}
                {(!isFullScreen || !isMobile) && (
                    <View style={[styles.sidebar, { backgroundColor, width: isMobile ? '100%' : 300 }]}>
                        <Text style={[styles.header, { color: secondaryTextColor }]}>Configuraciones</Text>
                        <SearchBar  />
                        <ScrollView contentContainerStyle={styles.itemsContainer}>
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
});