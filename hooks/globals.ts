import { useTranslation } from "react-i18next";
import { useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";

export const usehooksGlobals = () => {
    const { t } = useTranslation();
    const router = useRouter();
    const { width } = useWindowDimensions();
    const isSmallScreen = width <= 768;

    return { t, router, isSmallScreen };
};