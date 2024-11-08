import React from 'react';
import { View, Text, Switch, StyleSheet, TextInput } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useAsyncStorage } from '../Save';

const STORAGE_KEY = 'reglasNotasEntregaFacturaData';

const Reglas: React.FC = () => {
  const textColor = useThemeColor({}, 'textsecondary');
  const placeholderTextColor = useThemeColor({}, 'placeholder');

  const [data, saveData] = useAsyncStorage(STORAGE_KEY, {
    habilitarNotasEntrega: false,
    cambiarFacturaMetodo: false,
    cambiarFacturaDatos: false,
    cambiarNotaEntregaMonto: false,
    cambiarNotaEntregaFecha: false,
    notaEntregaHora: ''
  });

  const updateField = <K extends keyof typeof data>(field: K, value: typeof data[K]) => {
    const newData = { ...data, [field]: value };
    saveData(newData); 
  };

  const handleTimeInput = (field: 'hora' | 'minutos', value: string) => {
    const validValue = value.replace(/[^0-9]/g, ''); // Elimina caracteres no numéricos
    
    if (field === 'hora') {
      updateField('notaEntregaHora', validValue + ':' + data.notaEntregaHora.split(':')[1]);
    } else if (field === 'minutos') {
      updateField('notaEntregaHora', data.notaEntregaHora.split(':')[0] + ':' + validValue);
    }
  };

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>
        REGLAS PARA NOTAS DE ENTREGA Y FACTURAS
      </Text>
      <View style={styles.switchContainer}>
        <View style={styles.switchLabelContainer}>
          <Text style={[styles.label, { color: textColor }]}>
            Cambiar factura para "tarjeta" o "transferencia"
          </Text>
        </View>
        <Switch
          value={data.cambiarFacturaMetodo}
          onValueChange={(value) => updateField('cambiarFacturaMetodo', value)}
        />
      </View>
      <View style={styles.switchContainer}>
        <View style={styles.switchLabelContainer}>
          <Text style={[styles.label, { color: textColor }]}>
            Cambiar factura con datos de venta
          </Text>
        </View>
        <Switch
          value={data.cambiarFacturaDatos}
          onValueChange={(value) => updateField('cambiarFacturaDatos', value)}
        />
      </View>
      <View style={styles.switchContainer}>
        <View style={styles.switchLabelContainer}>
          <Text style={[styles.label, { color: textColor }]}>
            Cambiar nota de entrega si el monto es menor
          </Text>
        </View>
        <Switch
          value={data.cambiarNotaEntregaMonto}
          onValueChange={(value) => updateField('cambiarNotaEntregaMonto', value)}
        />
      </View>
      <View style={styles.switchContainer}>
        <View style={styles.switchLabelContainer}>
          <Text style={[styles.label, { color: textColor }]}>
            Cambiar nota de entrega si se genera después de
          </Text>
        </View>
        <View style={styles.timeInputContainer}>
          <TextInput
            style={[styles.timeInput, { color: textColor }]}
            value={data.notaEntregaHora.split(':')[0]}
            onChangeText={(value) => handleTimeInput('hora', value)}
            placeholder="HH"
            placeholderTextColor={placeholderTextColor}
            keyboardType="numeric"
            maxLength={2} 
          />
          <Text style={[styles.colon, { color: textColor }]}>:</Text>
          <TextInput
            style={[styles.timeInput, { color: textColor }]}
            value={data.notaEntregaHora.split(':')[1] || ''} 
            onChangeText={(value) => handleTimeInput('minutos', value)}
            placeholder="MM"
            placeholderTextColor={placeholderTextColor}
            keyboardType="numeric"
            maxLength={2} 
          />
        </View>
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  switchLabelContainer: {
    flex: 1,
    paddingRight: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  timeInputContainer: {
    flexDirection: 'row',  
    justifyContent: 'flex-start', 
    alignItems: 'center',
  },
  timeInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 4,
    width: 40, 
    textAlign: 'center',
  },
  colon: {
    fontSize: 16,
    marginHorizontal: 4,  
    fontWeight: 'bold',
  },
});

export default Reglas;