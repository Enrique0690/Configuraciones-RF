import React, { useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet } from 'react-native';

type UsbDevice = {
  id: string;
  name: string;
};

type UsbModalProps = {
  visible: boolean;
  onSelect: (device: UsbDevice) => Promise<void>;
  onClose: () => void;
  title: string;
};

const UsbModal = ({ visible, onSelect, onClose, title }: UsbModalProps) => {
  const [devices, setDevices] = useState<UsbDevice[]>([
    { id: '1', name: 'USB Printer 1' },
    { id: '2', name: 'USB Printer 2' },
  ]);

  
  const handleSelect = async (device: UsbDevice) => {
    try {
      await onSelect(device);
      onClose();
    } catch (error) {
      console.error("Error al seleccionar el dispositivo USB:", error);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.modalContainer}>
        <View style={styles.dialog}>
          <Text style={styles.title}>{title}</Text>
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.item} onPress={() => handleSelect(item)}>
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={onClose} style={styles.button}>
              <Text style={styles.buttonTextCancel}>Cancelar</Text>
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
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
});

export default UsbModal;
