import React from 'react';
import { View, Text, TextInput, Switch, Alert, StyleSheet } from 'react-native';
import { useAsyncStorage } from '../Save';
import { useThemeColor } from '@/hooks/useThemeColor'; 

type InfoTributariaProps = {};

const STORAGE_KEY = 'infoTributariaData';

const InfoTributaria: React.FC = ({}: InfoTributariaProps) => {
  const textColor = useThemeColor({}, 'textsecondary'); 

  const [data, saveData] = useAsyncStorage(STORAGE_KEY, {
    ruc: '',
    razonSocial: '',
    direccionMatriz: '',
    obligadollevarcontabilidad: false,
    agenteRetencion: false,
    regimenContribuyente: '',
    numeroCalificacionArtesanal: '',
    sitioWebFacturaElectronica: '',
    correoEnvioComprobantes: '',
  });

  const updateField = <K extends keyof typeof data>(field: K, value: typeof data[K]) => {
    const newData = { ...data, [field]: value };
    saveData(newData); 
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  return (
    <View>
      <Text style={[styles.sectionTitle, { color: textColor }]}>INFORMACION TRIBUTARIA</Text>

      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: textColor }]}>RUC:</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={data.ruc}
          onChangeText={(value) => updateField('ruc', value)}
          keyboardType="numeric"
          maxLength={13}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: textColor }]}>Razón Social:</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={data.razonSocial}
          onChangeText={(value) => updateField('razonSocial', value)}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: textColor }]}>Dirección Matriz:</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={data.direccionMatriz}
          onChangeText={(value) => updateField('direccionMatriz', value)}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: textColor }]}>Obligado a llevar contabilidad:</Text>
        <Switch
          value={data.obligadollevarcontabilidad}
          onValueChange={(value) => updateField('obligadollevarcontabilidad', value)}
        />
      </View>

      <View style={styles.switchContainer}>
        <Text style={[styles.label, { color: textColor }]}>Agente de Retención:</Text>
        <Switch
          value={data.agenteRetencion}
          onValueChange={(value) => updateField('agenteRetencion', value)}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: textColor }]}>Regimen del contribuyente:</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={data.regimenContribuyente}
          onChangeText={(value) => updateField('regimenContribuyente', value)}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: textColor }]}>Número de Calificación Artesanal:</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={data.numeroCalificacionArtesanal}
          onChangeText={(value) => updateField('numeroCalificacionArtesanal', value)}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: textColor }]}>Sitio Web Factura Electrónica:</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={data.sitioWebFacturaElectronica}
          onChangeText={(value) => updateField('sitioWebFacturaElectronica', value)}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text style={[styles.label, { color: textColor }]}>Correo Electrónico para Envío de Comprobantes:</Text>
        <TextInput
          style={[styles.input, { color: textColor }]}
          value={data.correoEnvioComprobantes}
          onChangeText={(value) => updateField('correoEnvioComprobantes', value)}
          keyboardType="email-address"
          onBlur={() => {
            if (!validateEmail(data.correoEnvioComprobantes)) {
              Alert.alert("Error", "Por favor, ingrese un correo válido.");
            }
          }}
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
    width: 400
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
});

export default InfoTributaria;
