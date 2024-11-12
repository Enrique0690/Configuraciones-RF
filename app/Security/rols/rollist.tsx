import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

const RoleListScreen: React.FC = () => {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'textsecondary');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>LISTADO DE ROLES</Text>
      <ScrollView contentContainerStyle={styles.contentContainer}>
        {['Admin', 'Manager', 'Staff'].map((role, index) => (
          <View key={index} style={styles.roleItem}>
            <Text style={[styles.roleText, { color: textColor }]}>{role}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  contentContainer: {
    paddingBottom: 16,
  },
  roleItem: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  roleText: {
    fontSize: 16,
  },
});

export default RoleListScreen;