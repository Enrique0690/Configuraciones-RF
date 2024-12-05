import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, BackHandler, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

type EditDialogProps = {
  visible: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onSave: () => void;
  onClose: () => void;
  title: string;
  validation?: string[];
};

const EditDialog: React.FC<EditDialogProps> = ({ visible, value, onChangeText, onSave, onClose, title, validation }) => {
  const inputRef = useRef<TextInput>(null);
  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    const handleBackPress = () => {
      if (visible) {
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
  }, [visible, onClose]);

  const handleKeyPress = (event: any) => {
    if (event.nativeEvent.key === 'Enter') {
      handleSave();
    }
    if (event.nativeEvent.key === 'Escape') {
      onClose();
    }
  };

  const validateInput = (): boolean => {
    if (!validation) return true;
    const validationRules: Record<string, (value: string) => string | null> = {
      text: (value) => {
        const textRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
        return textRegex.test(value.trim()) ? null : 'Solo se permiten letras.';
      },
      number: (value) => {
        const numberRegex = /^[0-9]*$/;
        return numberRegex.test(value.trim()) ? null : 'Solo se permiten números.';
      },
      email: (value) => {
        const trimmedEmail = value.trim();
        const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!EMAIL_FORMAT.test(trimmedEmail)) return 'Correo electrónico inválido.';
        if (trimmedEmail.length > 254) return 'Correo electrónico demasiado largo.';
        if (/[^\x00-\x7F]/.test(trimmedEmail)) return 'El correo electrónico no puede contener caracteres Unicode.';
        return null;
      },
      phone: (value) => {
        let telefono = value.replace(/[\s#().-]/g, '');
        if (!/^\+?\d+$/.test(telefono)) return 'Número de teléfono inválido. El número contiene caracteres no permitidos.';
        if (telefono.length < 7 || telefono.length > 15) return 'Número de teléfono inválido. La longitud no es correcta.';
        return null;
      },
      IDNumber: (value) => {
        const trimmedValue = value.trim();
        const idRegex = /^(?:\d{10}|\d{13}|\d{9,12})$/; // 10 para cédula, 13 para RUC, 9-12 para pasaporte
        if (!idRegex.test(trimmedValue)) return 'Número de identificación inválido.';
        return null;
      }
    };
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
  }

  const handleInputChange = (text: string) => {
    setError(null);
    if (!validation) {
      onChangeText(text);
      return;
    }
    let filteredText = text;
    for (const rule of validation) {
      if (rule === 'number') {
        filteredText = filteredText.replace(/[^0-9]/g, '');
      } else if (rule === 'text') {
        filteredText = filteredText.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
      }
    }
    onChangeText(filteredText);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss(); onClose(); }}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <Text style={styles.title}>{title}</Text>
              {error && <Text style={styles.errorText}>{error}</Text>}
              <TextInput
                ref={inputRef}
                style={styles.input}
                value={value}
                onChangeText={handleInputChange}
                onKeyPress={handleKeyPress}
                onSubmitEditing={handleSave}
                autoFocus
                placeholderTextColor="#999"
                keyboardType={validation?.includes('number') ? 'numeric' : 'default'}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.button}>
                  <Text style={styles.buttonTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={handleSave} style={styles.button}>
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
    marginTop: 10,
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
    marginBottom: 10,
  },
});

export default EditDialog;
