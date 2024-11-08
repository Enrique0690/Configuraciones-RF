import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function CatchAll() {
    const backgroundColor = useThemeColor({}, 'background');
    return (
        <>
            <Stack.Screen options={{ title: 'Oops! Not Found' }} />
            <View style={[styles.container, { backgroundColor }]}>
                <Link href="/" style={styles.button}>
                    Pagina no encontrada, Regresar al Inicio
                </Link>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      button: {
        fontSize: 20,
        textDecorationLine: 'underline',
        color: '#black',
      },
});
