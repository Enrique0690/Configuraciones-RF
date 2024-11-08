// EditDialog.tsx
import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Modal, TextInput, Platform, TouchableOpacity } from 'react-native';

interface EditDialogProps {
  visible: boolean;
  field: string;
  value: string;
  onSave: (newValue: string) => void;
  onCancel: () => void;
  textColor: string;
  borderColor: string;
  buttonColor: string;
}

const EditDialog: React.FC<EditDialogProps> = ({
  visible,
  field,
  value,
  onSave,
  onCancel,
  textColor,
  borderColor,
  buttonColor
}) => {
  const [currentValue, setCurrentValue] = React.useState(value);
  const inputRef = useRef<TextInput>(null);

  useEffect(() => {
    if (visible && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
        if (Platform.OS !== 'web') {
          inputRef.current?.setSelection(0, currentValue.length);
        }
      }, 200);
    }
  }, [visible, currentValue]);

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContainer, { borderColor }]}>
          <Text style={[styles.modalTitle, { color: textColor }]}>Editar {field}</Text>
          <TextInput
            ref={inputRef}
            style={[styles.input, { color: textColor, borderColor }]}
            value={currentValue}
            onChangeText={setCurrentValue}
            placeholder={`Ingrese el nuevo ${field}`}
            placeholderTextColor={textColor}
            onFocus={() => {
              if (Platform.OS === 'web') {
                const inputElement = inputRef.current as any;
                inputElement?.select();
              } else {
                inputRef.current?.setSelection(0, currentValue.length);
              }
            }}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onCancel}>
              <Text style={styles.cancelButton}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => onSave(currentValue)}>
              <Text style={[styles.saveButton, { backgroundColor: buttonColor }]}>Guardar</Text>
            </TouchableOpacity>
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
    color: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default EditDialog;