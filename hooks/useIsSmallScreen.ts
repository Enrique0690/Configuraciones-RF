import { useWindowDimensions } from "react-native";

export const useIsSmallScreen = (): boolean => {
    const { width } = useWindowDimensions();
    return width <= 768;
};
