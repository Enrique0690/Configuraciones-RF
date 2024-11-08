import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { useAsyncStorage } from '../Save';
import { useThemeColor } from '@/hooks/useThemeColor';

const STORAGE_KEY = 'secuenciaFacturaData';

const SecuenciaFactura: React.FC = () => {
    const textColor = useThemeColor({}, 'textsecondary');

    const [data, saveData] = useAsyncStorage(STORAGE_KEY, {
        secuencia: '',
        secuenciadispositivo1: '',
        secuenciadispositivo2: '',
        secuenciadispositivo3: '',
        secuenciaespecifica: '',
    });

    const updateField = <K extends keyof typeof data>(field: K, value: typeof data[K]) => {
        const newData = { ...data, [field]: value };
        saveData(newData);
    };

    const handleNumericInput = (value: string, field: keyof typeof data) => {
        const numericValue = value.replace(/[^0-9-]/g, '');
        updateField(field, numericValue);
    };

    return (
        <View>
            <Text style={[styles.sectionTitle, { color: textColor }]}>SECUENCIA DE FACTURA</Text>

            <View style={styles.deviceInputContainer}>
                <Text style={[styles.label, { color: textColor }]}>Todos los dispositivos:</Text>
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={data.secuencia}
                    onChangeText={(value) => handleNumericInput(value, 'secuencia')}
                    keyboardType="numeric"
                />
            </View>
            <View style={styles.infoContainer}>
                <Text style={[styles.label, { color: textColor }]}>Asigna una secuencia para dispositivos específicos:</Text>
                <View style={styles.deviceInputContainer}>
                    <Text style={[styles.deviceLabel, { color: textColor }]}>Caja 1:</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        value={data.secuenciadispositivo1}
                        onChangeText={(value) => handleNumericInput(value, 'secuenciadispositivo1')}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.deviceInputContainer}>
                    <Text style={[styles.deviceLabel, { color: textColor }]}>Caja 2:</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        value={data.secuenciadispositivo2}
                        onChangeText={(value) => handleNumericInput(value, 'secuenciadispositivo2')}
                        keyboardType="numeric"
                    />
                </View>
                <View style={styles.deviceInputContainer}>
                    <Text style={[styles.deviceLabel, { color: textColor }]}>Caja 3:</Text>
                    <TextInput
                        style={[styles.input, { color: textColor }]}
                        value={data.secuenciadispositivo3}
                        onChangeText={(value) => handleNumericInput(value, 'secuenciadispositivo3')}
                        keyboardType="numeric"
                    />
                </View>
            </View>
            <View style={styles.deviceInputContainer}>
                <Text style={[styles.label, { color: textColor }]}>
                    Cambia la secuencia de las facturas cuando se facture con: -Tarjeta/Efectivo a:
                </Text>
                <TextInput
                    style={[styles.input, { color: textColor }]}
                    value={data.secuenciaespecifica}
                    onChangeText={(value) => handleNumericInput(value, 'secuenciaespecifica')}
                    keyboardType="numeric"
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginVertical: 16,
        textAlign: 'center',
    },
    infoContainer: {
        marginBottom: 12,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    input: {
        fontSize: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        paddingVertical: 4,
        width: 100,
        textAlign: 'center',
    },
    deviceInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    deviceLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginRight: 8,
    },
});

export default SecuenciaFactura;