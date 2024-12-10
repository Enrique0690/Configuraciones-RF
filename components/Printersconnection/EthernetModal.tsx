import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';

type EthernetModalProps = {
  visible: boolean;
  onSave: (data: { ip: string; port: string }) => Promise<void>;
  onClose: () => void;
  title: string;
};

type IpState = {
  octet1: string;
  octet2: string;
  octet3: string;
  octet4: string;
};

const isValidIpOctet = (octet: string): boolean => {
  const num = parseInt(octet, 10);
  return num >= 0 && num <= 255 && octet.length <= 3;
};

const isValidPort = (port: string): boolean => {
  const portNumber = parseInt(port, 10);
  return portNumber >= 1 && portNumber <= 65535;
};

const EthernetModal = ({ visible, onSave, onClose, title }: EthernetModalProps) => {
  const [ip, setIp] = useState<IpState>({
    octet1: '',
    octet2: '',
    octet3: '',
    octet4: '',
  });
  const [port, setPort] = useState('');

  const handleIpChange = (octet: keyof IpState, text: string) => {
    if (isValidIpOctet(text) || text === '') {
      setIp(prevState => ({
        ...prevState,
        [octet]: text,
      }));
    }
  };

  const handlePortChange = (text: string) => {
    if (isValidPort(text) || text === '') {
      setPort(text);
    }
  };

  const handleSave = () => {
    const fullIp = `${ip.octet1}.${ip.octet2}.${ip.octet3}.${ip.octet4}`;

    if (!isValidIpOctet(ip.octet1) || !isValidIpOctet(ip.octet2) || !isValidIpOctet(ip.octet3) || !isValidIpOctet(ip.octet4)) {
      alert('Dirección IP inválida');
      return;
    }
    if (!isValidPort(port)) {
      alert('Puerto inválido');
      return;
    }

    onSave({ ip: fullIp, port })
      .then(() => onClose()) 
      .catch((error) => {
        console.error('Error al guardar:', error);
        alert('Hubo un problema al guardar los datos.');
      });
  };

  const moveToNextInput = (currentField: string, nextField: string) => {
    if (ip[currentField as keyof IpState].length === 3) {
      const nextInput = document.getElementById(nextField) as HTMLInputElement;
      nextInput?.focus();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>IP Address</Text>
            <View style={styles.ipContainer}>
              {['octet1', 'octet2', 'octet3', 'octet4'].map((octet, index) => (
                <React.Fragment key={index}>
                  <TextInput
                    id={`ip-${octet}`}
                    style={styles.input}
                    value={ip[octet as keyof IpState]}
                    onChangeText={(text) => handleIpChange(octet as keyof IpState, text)}
                    keyboardType="numeric"
                    maxLength={3}
                    onEndEditing={() => moveToNextInput(octet as string, `ip-${['octet2', 'octet3', 'octet4'][index]}`)}
                  />
                  {index < 3 && <Text style={styles.separator}>.</Text>}
                </React.Fragment>
              ))}
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Port</Text>
            <TextInput
              style={styles.input}
              value={port}
              onChangeText={handlePortChange}
              placeholder="Port"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={styles.button}>
              <Text style={styles.buttonTextSave}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
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
  inputContainer: {
    marginBottom: 10,
  },
  inputLabel: {
    fontSize: 14,
    color: '#333',
    marginBottom: 5,
  },
  ipContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 16,
    borderBottomColor: '#ccc',
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    paddingHorizontal: 10,
    color: '#333',
    height: 40,
    width: 70,
    textAlign: 'center',
  },
  separator: {
    fontSize: 16,
    color: '#333',
    paddingTop: 10,
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
});

export default EthernetModal;