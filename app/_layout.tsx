import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet} from "react-native";
import { Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from '@/constants/Colors';
import SearchBar from '@/components/navigation/SearchBar';
import '@/i18n';
import { AppProvider, useAppContext } from "@/components/Data/AppContext";
import { routeTitles } from "@/constants/routetitles";
import { menuconfig } from "@/constants/menuconfig";
import MenuSection from "@/components/MenuComponents";
import { usehooksGlobals } from "@/hooks/globals";
import { useNavigation } from "@/hooks/useNavigation";
import { useBackHandler } from "@/hooks/useBackHandler";
import StackHeader from "@/components/navigation/StackHeader";
import { LoadingErrorState } from "@/components/Data/LoadingErrorState";

function LayoutContent() {
    const { t, router, isSmallScreen } = usehooksGlobals();
    const insets = useSafeAreaInsets();
    const { selectedRoute, isFullScreen, setIsFullScreen, handleNavigation, segments } = useNavigation(isSmallScreen);
    const routeConfig = useMemo(() => routeTitles[selectedRoute as keyof typeof routeTitles] || { title: null }, [selectedRoute]);
    useBackHandler(isSmallScreen, isFullScreen, segments, () => setIsFullScreen(false));
    const { isLoading, error } = useAppContext();
    const loadingErrorState = <LoadingErrorState isLoading={isLoading} error={error}/>;
    if (isLoading || error) return loadingErrorState;
    return (
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
                <Stack screenOptions={StackHeader({ routeConfig, isSmallScreen, t, router })} />
            </View>
        </View>
    );
}

export default function Layout() {
    return (
        <AppProvider connectionName="RunFood">
            <LayoutContent />
        </AppProvider>
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
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
        textAlign: 'center',
        color: Colors.text,
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
    searchBarContainer: {
        zIndex: 10,
    }
});