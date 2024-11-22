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
  iconName?: string;
  onSave?: (value: string | boolean) => void; 
  highlight?: boolean;
  dataList?: string[]; 
}

const DataRenderer: React.FC<DataRendererProps> = ({label, value = '', type, onPress, textColor, iconName, onSave, highlight, dataList}) => {
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
            </Text>
          </TouchableOpacity>
        );

        case 'inputlist': 
        return (
          <TouchableOpacity onPress={() => setListModalVisible(true)}>
            <Text style={[styles.textValue, { color: textColor }]}>
              <Text style={styles.label}>{label}:</Text> {value || 'Seleccione una opcion'}
            </Text>
          </TouchableOpacity>
        );

        case 'switch':
          return (
            <TouchableOpacity 
              style={styles.switchContainer} 
              onPress={() => handleSwitchChange(!switchValue)}
            >
              <Text style={[styles.label, { color: textColor }]}>{label}:</Text>
              <Switch value={switchValue} onValueChange={handleSwitchChange} />
            </TouchableOpacity>
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
    borderWidth: 2,            
    borderColor: 'transparent',
    borderRadius: 10,          
  },
  highlightedContainer: {
    borderColor: '#4CAF50',     
  },
  label: {
    fontWeight: 600,
    fontSize: 16,
    marginRight: 8,
  },
  textValue: {
    fontWeight: 400,
    fontSize: 16,
    paddingVertical: 4,
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
});

export default DataRenderer;