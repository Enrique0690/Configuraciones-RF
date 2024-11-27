import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface TooltipProps {
  text: string;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ text, visible }) => {
  if (!visible) return null;

  return (
    <View style={styles.tooltip}>
      <Text style={styles.tooltipText}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tooltip: {
    position: 'absolute',
    top: 25, 
    left: 50, 
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
