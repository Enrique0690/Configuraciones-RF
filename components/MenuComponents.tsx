import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useTranslation } from "react-i18next";
import { Colors } from '@/constants/Colors';

interface MenuItemProps {
  item: { text: string; route: string };
  onPress: () => void;
  isActive: boolean;
}

const MenuItem = ({ item, onPress, isActive }: MenuItemProps) => {
  const { t } = useTranslation();

  return (
    <TouchableOpacity onPress={onPress} style={[styles.menuItem, isActive && styles.activeMenuItem]}>
      <Text style={styles.menuItemText}>{t(item.text)}</Text>
    </TouchableOpacity>
  );
};

interface MenuSectionProps {
  items: { text: string; route: string }[];
  onItemPress: (route: string) => void;
  selectedRoute: string;
}

const MenuSection = ({ items, onItemPress, selectedRoute }: MenuSectionProps) => {
  return (
    <View style={styles.section}>
      {items.map((item) => (
        <MenuItem
          key={item.route}
          item={item}
          isActive={selectedRoute.startsWith(item.route)}
          onPress={() => onItemPress(item.route)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingVertical: 10,
  },
  menuItem: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  activeMenuItem: {
    backgroundColor: '#eaeaea',
    borderRadius: 8,
  },
});

export default MenuSection;