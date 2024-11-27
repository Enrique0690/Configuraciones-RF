import React, { useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, StyleSheet, BackHandler, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';

type ListModalProps<T> = {
  visible: boolean;
  data: T[];
  renderItem: (item: T) => React.ReactNode;
  onSelect: (item: T) => void;
  onClose: () => void;
  title: string;
};

const ListModal = <T extends {}>({ visible, data, renderItem, onSelect, onClose, title }: ListModalProps<T>) => {
  useEffect(() => {
    const handleBackPress = () => {
      if (visible) {
        onClose(); 
        return true; 
      }
      return false;
    };

    if (visible) {
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

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.modalContainer}>
          <TouchableWithoutFeedback>
            <View style={styles.dialog}>
              <Text style={styles.title}>{title}</Text>
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity style={styles.item} onPress={() => onSelect(item)}>
                    {renderItem(item)}
                  </TouchableOpacity>
                )}
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.button}>
                  <Text style={styles.buttonTextCancel}>Cancelar</Text>
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
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
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

export default ListModal;
