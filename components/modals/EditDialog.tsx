import React, { useEffect, useState, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler, Platform, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import { validationRules } from '@/constants/validationRules';

type EditDialogProps = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
  title: string;
  validation?: string[];
  isLoading?: boolean;
  errorMessage: string | null;
};

const EditModal = ({ visible, value, onChangeText, onSave, onClose, title, validation, isLoading, errorMessage }: EditDialogProps) => {
  const inputRef = useRef<TextInput>(null);
  const [inputValue, setInputValue] = useState(value);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const handleBackPress = () => {
      if (visible && !isLoading) {
        onClose();
        return true;
      }
      return false;
    };
    if (visible) {
      inputRef.current?.focus();
      if (Platform.OS !== 'web') {
        BackHandler.addEventListener('hardwareBackPress', handleBackPress);
      }
    }
    return () => {
      if (Platform.OS !== 'web') {
        BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
      }
    };
  }, [visible, onClose, isLoading]);
  const validateInput = (): boolean => {
    if (!validation) return true;
    for (const rule of validation) {
      const validateRule = validationRules[rule];
      if (validateRule) {
        const error = validateRule(value);
        if (error) {
          setError(error);
          return false;
        }
      }
    }
    setError(null);
    return true;
  };
  const handleSave = () => {
    if (validateInput()) {
      onSave();
    }
  };

  const handleInputChange = (text: string) => {
    if (!validation) {
      onChangeText(text);
      return;
    }
    let filteredText = text;
    for (const rule of validation) {
      if (rule === 'text') filteredText = filteredText.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      if (rule === 'number') filteredText = filteredText.replace(/[^0-9\-]/g, '');
      if (rule === 'phone') filteredText = filteredText.replace(/[^0-9\+\-\(\)\s]/g, '');
    }
    onChangeText(filteredText);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={() => { if (!isLoading) { onClose(); } }}>
      <TouchableWithoutFeedback onPress={() => { if (!isLoading) { Keyboard.dismiss(); onClose(); } }}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <Text style={styles.title}>{title}</Text>
              {isLoading ? (
                <ActivityIndicator size="small" color="#09b048" />
              ) : (
                <TextInput
                  ref={inputRef}
                  style={styles.input}
                  value={value}
                  onChangeText={handleInputChange}
                  onSubmitEditing={handleSave}
                  autoFocus
                  placeholder="Escribe aquí..."
                  placeholderTextColor="#999"
                  keyboardType={validation?.includes('phone') ? 'phone-pad' : validation?.includes('number') ? 'numeric' : 'default'}
                />
              )}
              {(error || errorMessage) && (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{error || errorMessage}</Text>
                </View>
              )}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={() => { if (!isLoading) onClose(); }} style={[styles.button, isLoading && styles.buttonDisabled]}>
                  <Text style={styles.buttonTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={[styles.button, isLoading && styles.buttonDisabled]}>
                  <Text style={styles.buttonTextSave}>Guardar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    paddingHorizontal: 20,
  },
  dialog: {
    width: '100%',
    maxWidth: 400,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    fontSize: 16,
    borderBottomColor: '#ccc',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#333',
    height: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    padding: 10,
    alignItems: 'center',
  },
  buttonTextCancel: {
    fontSize: 16,
    color: '#FF3B30',
  },
  buttonTextSave: {
    fontSize: 16,
    color: '#007AFF',
    fontWeight: '600',
  },
  errorText: {
    color: 'red',
  },
  errorContainer: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#FFDDDD',
    borderRadius: 5,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
});

export default EditModal;