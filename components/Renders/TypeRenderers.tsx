import React from 'react';
import { Text, TouchableOpacity, Switch, View, Image, StyleSheet } from 'react-native';

export const DataRendererConstants = {
  renderInput: (label: string, value: string | undefined, openEditDialog: () => void, isSmallScreen: boolean) => (
    <TouchableOpacity onPress={openEditDialog}>
      <View style={[styles.inputContainer, isSmallScreen && styles.smallScreenInputContainer]}>
        <Text style={[styles.label, isSmallScreen && styles.smallScreenLabel]}>{label}</Text>
        <Text style={styles.textValue}>{value || 'Editar'}</Text>
      </View>
    </TouchableOpacity>
  ),
  
  renderInputInterpolation: (interpolatedLabel: string, textColor: string, openEditDialog: () => void) => (
    <TouchableOpacity onPress={openEditDialog}>
      <Text style={[styles.textValue, { color: textColor }]}>
        <Text style={styles.label}>{interpolatedLabel}</Text>
      </Text>
    </TouchableOpacity>
  ),

  renderInputList: (label: string, value: string | undefined, onPress: () => void, textColor: string) => (
    <TouchableOpacity onPress={onPress}>
      <Text style={[styles.textValue, { color: textColor }]}>
        <Text style={styles.label}>{label}</Text> {value || 'Seleccione una opción'}
      </Text>
    </TouchableOpacity>
  ),

  renderSwitch: (label: string, switchValue: boolean, handleSwitchChange: (newValue: boolean) => void, textColor: string) => (
    <TouchableOpacity style={styles.switchContainer} onPress={() => handleSwitchChange(!switchValue)}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Switch value={switchValue} onValueChange={handleSwitchChange} />
    </TouchableOpacity>
  ),

  renderImage: (value: string | undefined) => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{ uri: value as string }} resizeMode="contain" />
    </View>
  )
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
    flexDirection: 'column',
    borderWidth: 2,
    borderColor: 'transparent',
    borderRadius: 10,
  },
  highlightedContainer: {
    borderColor: '#4CAF50',
  },
  label: {
    fontWeight: '600',
    fontSize: 16,
    marginRight: 8,
  },
  textValue: {
    fontWeight: '400',
    fontSize: 16,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  imageContainer: {
    marginTop: 10,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallScreenInputContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  smallScreenLabel: {
    marginBottom: 4,
  },
  errorText: { 
    color: 'red', 
    fontSize: 12, 
    marginTop: 4 
  },
  loadingContainer: { 
    alignItems: 'center', 
    justifyContent: 'center' },
});