import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, Switch, StyleSheet, useWindowDimensions, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EditDialog from '@/components/modals/EditDialog';  
import ListModal from './modals/ListModal';
import { router, useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';

interface DataRendererProps {
  label: string;
  value?: string | boolean;
  type: 'input' | 'image' | 'switch' | 'buttonlist' | 'text' | 'inputlist'; 
  onPress?: () => void;
  textColor?: string;
  iconName?: string;
  onSave?: (value: string | boolean) => void; 
  highlight?: boolean;
  dataList?: string[]; 
  validation?: string[];
}
const DataRenderer= ({label, value, type, textColor, iconName, onSave, highlight, dataList, validation}: DataRendererProps) => {
  const [isDialogVisible, setDialogVisible] = useState(false);
  const [tempValue, setTempValue] = useState(value as string);
  const [switchValue, setSwitchValue] = useState(value as boolean);
  const [isHighlighted, setHighlighted] = useState(highlight);
  const [isListModalVisible, setListModalVisible] = useState(false);
  const { t } = useTranslation();
  const interpolatedLabel = t(label, { value: value || '_____' });
  const { width } = useWindowDimensions();
  const isSmallScreen = width < 768;
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  if (Platform.OS === 'web' || Platform.OS === 'windows') {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isHighlighted && event.key === 'Enter') {
        if (type === 'input' || type === 'text') {
          openEditDialog();
        } else if (type === 'inputlist' && dataList) {
          setListModalVisible(true);
        } else if (type === 'switch') {
          handleSwitchChange(!switchValue);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isHighlighted, type, dataList, switchValue]); 
} 
  const openEditDialog = () => {
    setTempValue(value as string);
    setDialogVisible(true);
  };
  const handleSave = async () => {
    setIsLoading(true);
    setErrorMessage(null); 
    try {
      await onSave?.(tempValue);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSwitchChange = async (newValue: boolean) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await onSave?.(newValue);
      setSwitchValue(newValue);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  const handleSelectItem = async (selectedItem: string) => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      await onSave?.(selectedItem);
      setTempValue(selectedItem);
    } catch (error: any) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
      setListModalVisible(false);
    }
  };
  useFocusEffect(
    React.useCallback(() => {
      if (highlight) {
        setHighlighted(true);
        const timeout = setTimeout(() => setHighlighted(false), 8000);
        return () => clearTimeout(timeout);
      }
    }, [highlight])
  );
  useEffect(() => {
    type === 'switch' ? setSwitchValue(value as boolean) : setTempValue(value as string);
  }, [value, type]);
  const renderInput = () => (
    <TouchableOpacity onPress={openEditDialog}>
    <View style={[styles.inputContainer, isSmallScreen && styles.smallScreenInputContainer]}>
      <Text style={[styles.label, isSmallScreen && styles.smallScreenLabel]}>{label}</Text>
      <Text style={styles.textValue}>{value || 'Editar'}</Text>
    </View>
  </TouchableOpacity>
  );
  const renderText = () => (
    <TouchableOpacity onPress={openEditDialog}>
      <Text style={[styles.textValue, { color: textColor }]}>
        <Text style={styles.label}>{interpolatedLabel}</Text>
      </Text>
    </TouchableOpacity>
  );
  const renderInputList = () => (
    <TouchableOpacity onPress={() => setListModalVisible(true)}>
      <Text style={[styles.textValue, { color: textColor }]}>
        <Text style={styles.label}>{label}</Text> {value || 'Seleccione una opción'}
      </Text>
    </TouchableOpacity>
  );
  const renderSwitch = () => (
    <TouchableOpacity style={styles.switchContainer} onPress={() => handleSwitchChange(!switchValue)}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      <Switch value={switchValue} onValueChange={handleSwitchChange} />
    </TouchableOpacity>
  );
  const renderImage = () => (
    <View style={styles.imageContainer}>
      <Image style={styles.image} source={{ uri: value as string }} resizeMode="contain" />
    </View>
  );
  const renderButtonList = () => (
    <TouchableOpacity style={styles.button} onPress={() => router.push(value as any)}>
      {iconName && <Ionicons name={iconName as any} size={20} color={textColor} />}
      <Text style={[styles.buttonLabel, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={'#4CAF50'} />
        </View>
      );
    }
    switch (type) {
      case 'input': return renderInput();
      case 'text': return renderText();
      case 'inputlist': return renderInputList();
      case 'switch': return renderSwitch();
      case 'image': return renderImage();
      case 'buttonlist': return renderButtonList();
      default: return null;
    }
  };
  return (
    <View style={[styles.inputGroup, isHighlighted && styles.highlightedContainer]}>
      {renderContent()}
      {isDialogVisible && (
        <EditDialog
          visible={isDialogVisible}
          value={tempValue}
          onChangeText={setTempValue}
          onSave={handleSave}
          onClose={() => setDialogVisible(false)}
          title={type === 'text' ? interpolatedLabel : label}
          validation={validation}
          isLoading={isLoading}
          errorMessage={errorMessage}
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

export default DataRenderer;