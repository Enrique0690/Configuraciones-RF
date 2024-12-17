import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import EditModal from '@/components/modals/EditDialog';  
import ListModal from '../modals/ListModal';
import { useFocusEffect } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useSmallScreen } from '@/hooks/useSmallScreen';
import { DataRendererConstants } from '@/components/Renders/TypeRenderers';
import { useEditManager } from '@/hooks/useEditManager';

interface EditableFieldRowProps {
  label: string;
  value?: string | boolean;
  type: 'input' | 'image' | 'switch' | 'buttonlist' | 'inputinterpolation' | 'inputlist'; 
  onPress?: () => void;
  textColor?: string;
  iconName?: string;
  onSave?: (value: string | boolean) => void; 
  highlight?: boolean;
  dataList?: string[]; 
  validation?: string[];
}
const EditableFieldRow= ({label, value, type, textColor, onSave, highlight, dataList, validation}: EditableFieldRowProps) => {
  const [switchValue, setSwitchValue] = useState(value as boolean);
  const [isHighlighted, setHighlighted] = useState(highlight);
  const [isListModalVisible, setListModalVisible] = useState(false);
  const { t } = useTranslation();
  const interpolatedLabel = t(label, { value: value || '_____' });
  const {isSmallScreen } = useSmallScreen();
  const {
    isDialogVisible,
    tempValue,
    isLoading,
    errorMessage,
    setTempValue,
    openDialog,
    closeDialog,
    handleSave
  } = useEditManager<string>(value as string, async (value: string) => {
    if (onSave) {
      await onSave(value); 
    }
  }, validation?.map((val) => (value: string) => val));
  if (Platform.OS === 'web' || Platform.OS === 'windows') {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isHighlighted && event.key === 'Enter') {
        if (type === 'input' || type === 'inputinterpolation') {
          openDialog();
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
  const handleSwitchChange = async (newValue: boolean) => {
    setTempValue(newValue ? 'true' : 'false'); 
    await handleSave(); 
  };
  const handleSelectItem = async (selectedItem: string) => {
    setTempValue(selectedItem); 
    await handleSave(); 
    setListModalVisible(false);
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
  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color={'#4CAF50'} />
        </View>
      );
    }
    switch (type) {
      case 'input': return DataRendererConstants.renderInput(label, value as string, openDialog, isSmallScreen);
      case 'inputinterpolation': return DataRendererConstants.renderInputInterpolation(interpolatedLabel, textColor || 'black', openDialog);
      case 'inputlist': return DataRendererConstants.renderInputList(label, value as string, () => setListModalVisible(true), textColor || 'black');
      case 'switch': return DataRendererConstants.renderSwitch(label, switchValue, handleSwitchChange, textColor || 'black');      default: return null;
    }
  };
  return (
    <View style={[styles.inputGroup, isHighlighted && styles.highlightedContainer]}>
      {renderContent()}
      {errorMessage && type !== 'input' && type !== 'inputinterpolation' && <Text style={styles.errorText}>{errorMessage}</Text>}
      {isDialogVisible && (
        <EditModal
          visible={isDialogVisible}
          value={tempValue}
          onChangeText={setTempValue}
          onSave={handleSave}
          onClose={closeDialog} 
          title={type === 'inputinterpolation' ? interpolatedLabel : label}
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
  errorText: { 
    color: 'red', 
    fontSize: 12, 
    marginTop: 4 
  },
  loadingContainer: { 
    alignItems: 'center', 
    justifyContent: 'center' },
});

export default EditableFieldRow;