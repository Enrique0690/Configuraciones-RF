import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditDialog from '@/components/modals/EditModal';  
import { router } from 'expo-router';

interface DataRendererProps {
  label: string;
  value?: string | boolean;
  type: 'input' | 'image' | 'switch' | 'buttonlist' | 'text'; 
  onPress?: () => void;
  textColor: string;
  finalText?: string;
  iconName?: string;
  onSave?: (value: string | boolean) => void; 
}

const DataRenderer: React.FC<DataRendererProps> = ({label, value = '/Security/users/userlist', type, onPress, textColor, finalText, iconName, onSave}) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value as string);
  const [switchValue, setSwitchValue] = useState(value as boolean);

  const openEditDialog = () => {
    if (type === 'input') {
      setTempValue(value as string); 
      setDialogVisible(true);
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(tempValue); 
    }
    setDialogVisible(false);
  };

  const handleSwitchChange = (newValue: boolean) => {
    setSwitchValue(newValue);
    if (onSave) {
      onSave(newValue as any); 
    }
  };

  useEffect(() => {
    if (type === 'switch') {
      setSwitchValue(value as boolean);
    } else {
      setTempValue(value as string);
    }
  }, [value, type]);

  const renderContent = () => {
    switch (type) {
      case 'input':  
        return (
          <TouchableOpacity onPress={openEditDialog}>
            <Text style={[styles.textValue, { color: textColor }]}>
              <Text style={styles.label}>{label}:</Text> {value || 'Editar'}
              {finalText && <Text style={styles.finalText}> {finalText}</Text>}
            </Text>
          </TouchableOpacity>
        );

      case 'switch':
        return (
          <View style={styles.switchContainer}>
            <Text style={[styles.label, { color: textColor }]}>{label}:</Text>
            <Switch value={switchValue} onValueChange={handleSwitchChange} />
            {finalText && <Text style={[styles.finalText, { color: textColor }]}>{finalText}</Text>}
          </View>
        );

      case 'image':
        return (
          <View style={styles.imageContainer}>
            <Image style={styles.image} source={{ uri: value as string }} resizeMode="contain" />
          </View>
        );

      case 'buttonlist':
        return (
          <TouchableOpacity style={styles.button} onPress={() => router.push(value as any)} >
            {iconName && <Ionicons name={iconName as any} size={20} color={textColor} />}
            <Text style={[styles.buttonLabel, { color: textColor }]}>{label}</Text>
          </TouchableOpacity>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.inputGroup}>
      {renderContent()}

      {isDialogVisible && (
        <EditDialog
          visible={isDialogVisible}
          value={tempValue}
          onChangeText={setTempValue}
          onSave={handleSave}
          onClose={() => setDialogVisible(false)}
          title={label}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  inputGroup: {
    marginBottom: 20,
    flexDirection: 'column',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginRight: 8,
  },
  textValue: {
    fontSize: 16,
    paddingVertical: 4,
  },
  finalText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
});

export default DataRenderer;
