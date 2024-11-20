import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditDialog from '@/components/modals/EditModal';  
import ListModal from './modals/ListModal';
import { router } from 'expo-router';

interface DataRendererProps {
  label: string;
  value?: string | boolean;
  type: 'input' | 'image' | 'switch' | 'buttonlist' | 'text' | 'inputlist'; 
  onPress?: () => void;
  textColor: string;
  finalText?: string;
  iconName?: string;
  onSave?: (value: string | boolean) => void; 
  highlight?: boolean;
  dataList?: string[]; 
}

const DataRenderer: React.FC<DataRendererProps> = ({label, value = '', type, onPress, textColor, finalText, iconName, onSave, highlight, dataList}) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value as string);
  const [switchValue, setSwitchValue] = useState(value as boolean);
  const [highlightActive, setHighlightActive] = useState(highlight);
  const [isListModalVisible, setListModalVisible] = useState(false);

  const openEditDialog = () => {
    if (type === 'input') {
      setTempValue(value as string); 
      setDialogVisible(true);
    }
  };

  const handleSelectItem = (selectedItem: string) => {
    setTempValue(selectedItem); 
    setListModalVisible(false);  
    if (onSave) {
      onSave(selectedItem); 
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
    if (highlight) {
      setHighlightActive(true);
      const timeout = setTimeout(() => {
        setHighlightActive(false);
      }, 8000); 

      return () => clearTimeout(timeout); 
    }
  }, [highlight]);
  
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
            <Text style={[styles.textValue]}>
              <Text style={styles.label}>{label}</Text> {value || 'Editar'}
              {finalText && <Text style={styles.finalText}> {finalText}</Text>}
            </Text>
          </TouchableOpacity>
        );

        case 'inputlist': 
        return (
          <TouchableOpacity onPress={() => setListModalVisible(true)}>
            <Text style={[styles.textValue, { color: textColor }]}>
              <Text style={styles.label}>{label}:</Text> {value || 'Seleccione una opcion'}
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
    <View style={[styles.inputGroup, highlightActive && styles.highlightedContainer]}>
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
      {isListModalVisible && dataList && (
        <ListModal
          visible={isListModalVisible}
          data={dataList}
          renderItem={(item) => <Text>{item}</Text>}
          onSelect={handleSelectItem}
          onClose={() => setListModalVisible(false)}
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
    fontWeight: 600,
    fontSize: 16,
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
  highlightedContainer: {
    borderColor: '#4CAF50',
    borderWidth: 2,
    padding: 5,
    borderRadius: 10,
  },
  highlightedText: {
    backgroundColor: '#e6ffe6',
  },
  inputListContainer: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
  },
});

export default DataRenderer;
