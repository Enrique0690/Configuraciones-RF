import React from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { Colors } from '@/constants/Colors';

const SearchBar: React.FC = () => {
  return (
    <View style={styles.searchContainer}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        placeholder="Buscar..."
        placeholderTextColor={Colors.text}
        style={styles.searchInput}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: Colors.itemBackground,
  },
  icon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text, 
  },
});

export default SearchBar;
