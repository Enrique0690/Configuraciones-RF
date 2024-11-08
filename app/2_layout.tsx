import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet, TextInput, Platform, BackHandler } from "react-native";
import { Slot, useRouter } from "expo-router";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors';
import { useThemeColor } from '@/hooks/useThemeColor';

// Componente SearchBar
const SearchBar = ({ textColor, backgroundColor, placeholder }: any) => (
    <View style={[styles.searchContainer, { backgroundColor }]} >
        <Text style={{ color: Colors.icon }}>🔍</Text>
        <TextInput 
            placeholder={placeholder}
            placeholderTextColor={Colors.text}
            style={[styles.searchInput, { color: textColor }]} 
        />
    </View>
);

// Componente MenuSection
const MenuSection = ({ items, router, borderColor, setIsFullScreen }: any) => (
    <View style={[styles.section, { borderColor }]}>
        {items.map((item: any) => (
            <TouchableOpacity key={item.text} onPress={() => { 
                router.push(item.route); 
                setIsFullScreen(true); // Activar pantalla completa al seleccionar una opción
            }}>
                <Text style={styles.menuItem}>{item.icon} {item.text}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

export default function Layout() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [isFullScreen, setIsFullScreen] = useState(false); 
    const [isMobile, setIsMobile] = useState(false); 

    const backgroundColor = useThemeColor({}, 'background');
    const itemBackgroundColor = useThemeColor({}, 'itemBackground');
    const borderColor = useThemeColor({}, 'border');
    const textColor = useThemeColor({}, 'text');
    const secondaryTextColor = useThemeColor({}, 'textsecondary');

    // Detectar si es un dispositivo móvil
    useEffect(() => {
        setIsMobile(Platform.OS === 'android' || Platform.OS === 'ios');
    }, []);

    // Función para manejar el retroceso en dispositivos móviles
    useEffect(() => {
        if (isMobile && isFullScreen) {
            const backAction = () => {
                setIsFullScreen(false); // Volver al diseño con el menú visible
                return true; // Evitar que la navegación nativa ocurra
            };
            // Añadir el listener para el retroceso
            BackHandler.addEventListener("hardwareBackPress", backAction);
            // Limpiar el listener cuando el componente se desmonta o cuando no está en fullscreen
            return () => BackHandler.removeEventListener("hardwareBackPress", backAction);
        }
    }, [isMobile, isFullScreen]);

    return (
            <View style={[styles.safeArea, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
                <View style={styles.container}>
                    {/* Panel izquierdo (Menú) */}
                    {!isFullScreen || !isMobile ? ( // Mostrar el menú solo si no está en fullscreen en móviles o si es web
                        <View style={[styles.sidebar, { backgroundColor, width: isMobile ? '100%' : 300, height: isMobile ? '100%' : 'auto' }]}>
                            <Text style={[styles.header, { color: secondaryTextColor }]}>Configuraciones</Text>
                            <SearchBar textColor={textColor} backgroundColor={itemBackgroundColor} placeholder="Buscar..." />
                            <ScrollView contentContainerStyle={styles.itemsContainer}>
                                <View style={[styles.section, { borderColor }]}>
                                    <TouchableOpacity onPress={() => { router.push("/business-info"); setIsFullScreen(isMobile); }}>
                                        <Text style={styles.menuItem}>👁️ Información del Negocio</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { router.push("/printers"); setIsFullScreen(isMobile); }}>
                                        <Text style={styles.menuItem}>🖨️ Impresoras</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { router.push("/payment-methods"); setIsFullScreen(isMobile); }}>
                                        <Text style={styles.menuItem}>💳 Métodos de Cobro</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { router.push("/integrations"); setIsFullScreen(isMobile); }}>
                                        <Text style={styles.menuItem}>🔗 Integración con otras apps</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={[styles.section, { borderColor }]}>
                                    <TouchableOpacity onPress={() => { router.push("/tablet-configuration"); setIsFullScreen(isMobile); }}>
                                        <Text style={styles.menuItem}>🍽️ Configuración de mesas</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { router.push("/security"); setIsFullScreen(isMobile); }}>
                                        <Text style={styles.menuItem}>🔒 Seguridad</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { router.push("/advanced-options"); setIsFullScreen(isMobile); }}>
                                        <Text style={styles.menuItem}>⚙️ Opciones avanzadas</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => { router.push("/tax-configuration(Ecuador)"); setIsFullScreen(isMobile); }}>
                                        <Text style={styles.menuItem}>🗑️ Configuración tributaria (Ecuador)</Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    ) : null}

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
