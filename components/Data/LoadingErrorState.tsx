import { View, Text, ActivityIndicator,StyleSheet} from 'react-native';
import { Colors } from '@/constants/Colors';
interface LoadingErrorStateProps {
    isLoading: boolean;
    error: string | null;
  }
export const LoadingErrorState = ({ isLoading, error }: LoadingErrorStateProps) => {
    if (isLoading) {
        return (
            <View style={[styles.container]}>
                <ActivityIndicator size="large" color={Colors.primary} />
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container]}>
                <Text style={styles.errorText}>{`Error: ${error}`}</Text>
            </View>
        );
    }

    return null;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      },
      errorText: {
        color: Colors.error,
        fontSize: 14,
        textAlign: "center",
        marginHorizontal: 20,
        marginBottom: 15,
      }
});