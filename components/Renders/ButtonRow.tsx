import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface ButtonProps {
  label: string;
  route: string;
  iconName?: string;
  textColor?: string;
  dynamicContent?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ label, route, iconName, textColor = 'black', dynamicContent }) => {
  const router = useRouter();

  return (
    <TouchableOpacity
      style={[styles.button]}
      onPress={() => router.push(route as any)}
    >
      {iconName && <Ionicons name={iconName as any} size={20} color={textColor} style={styles.icon} />}
      <Text style={[styles.buttonLabel, { color: textColor }]}>
        {label}
        {dynamicContent && ' '}
        {dynamicContent}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    borderWidth: 1,
    borderColor: '#ddd',
    marginVertical: 8
  },
  buttonLabel: {
    fontSize: 16,
    marginLeft: 12,
    fontWeight: '600',
  },
  icon: {
    marginRight: 8,
  },
});

export default Button;