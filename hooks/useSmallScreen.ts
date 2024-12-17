
import { useWindowDimensions } from "react-native";

export const useSmallScreen = () => {
    const { width } = useWindowDimensions();
    const isSmallScreen = width <= 768;

    return {isSmallScreen };
};