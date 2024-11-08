import React, { useEffect, useRef } from 'react';
import { Modal, Text, TextInput, View, StyleSheet, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

interface EditModalProps {
  isVisible: boolean;
  field: string;
  value: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ isVisible, field, value, onSave, onCancel }) => {
  const textColor = useThemeColor({}, 'textsecondary');
  const borderColor = useThemeColor({}, 'border');
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (Platform.OS !== 'web') {
          inputRef.current?.setSelection(0, value.length);
        }
      }, 200);
    }
  }, [isVisible, value]);

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          <Text style={[styles.modalTitle, { color: textColor }]}>Editar {field}</Text>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: textColor, borderColor }]}
            value={value}
            onChangeText={onSave}
            placeholder={`Ingrese el nuevo ${field}`}
            placeholderTextColor={textColor}
          />
          <View style={styles.modalButtons}>
            <Text onPress={onCancel} style={styles.cancelButton}>
              Cancelar
            </Text>
            <Text onPress={() => onSave(value)} style={styles.saveButton}>
              Guardar
            </Text>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '90%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  input: {
    fontSize: 16,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cancelButton: {
    fontSize: 16,
    color: '#999',
    padding: 10,
  },
  saveButton: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
});

export default EditModal;