import React from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Modal } from 'react-native';

interface TooltipProps {
  text: string;
  visible: boolean;
  onClose: () => void;
}

const Tooltip: React.FC<TooltipProps> = ({ text, visible, onClose }) => {
  return (
    <Modal
      transparent={true} 
      visible={visible} 
      animationType="fade" 
      onRequestClose={onClose} 
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <View style={styles.tooltip}>
            <Text style={styles.tooltipText}>{text}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tooltip: {
    top: 30,
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 8,
    zIndex: 1,
  },
  tooltipText: {
    color: '#fff',
    fontSize: 14,
  },
});

export default Tooltip;
