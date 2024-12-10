import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useTranslation } from 'react-i18next';

const Checkbox = ({ value, onChange }: { value: boolean, onChange: (value: boolean) => void }) => (
  <TouchableOpacity onPress={() => onChange(!value)} style={styles.checkbox}>
    {value && <Text style={styles.checkboxIcon}>✔️</Text>}
  </TouchableOpacity>
);

interface PermissionsListProps {
  rolePermissions: Record<string, string[]>;
  permissions: Record<string, Record<string, boolean>>;
  activeCategory: string;
  updatePermission: (category: string, item: string, value: boolean) => void;
  updateCategoryPermissions: (category: string, value: boolean) => void;
  onCategoryChange: (category: string) => void;
}

const PermissionsList = ({ rolePermissions, permissions, activeCategory, updatePermission, updateCategoryPermissions, onCategoryChange }: PermissionsListProps) => {
  const { t } = useTranslation();

  return (
    <>
      <View style={styles.categoryNav}>
        {Object.keys(rolePermissions).map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryNavButton,
              activeCategory === category && styles.categoryNavButtonActive,
            ]}
            onPress={() => onCategoryChange(category)}
          >
            <Text style={styles.categoryNavText}>
              {t(`security.role.${category.toUpperCase()}`)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View style={styles.permissionsContainer}>
        {Object.entries(rolePermissions).map(([category, items]) => {
          if (category === activeCategory) {
            return (
              <View key={category} style={styles.categoryContainer}>
                <View style={styles.categoryHeader}>
                  <Checkbox
                    value={Object.values(permissions[category] || {}).every(
                      (isSelected) => isSelected
                    )}
                    onChange={(value) => updateCategoryPermissions(category, value)}
                  />
                  <Text style={styles.categoryTitle}>
                    {t(`security.role.${category.toUpperCase()}`)}
                  </Text>
                </View>
                <View style={styles.permissionList}>
                  <ScrollView>
                    {items.map((item) => (
                      <TouchableOpacity
                        key={item}
                        style={styles.permissionRow}
                        onPress={() =>
                          updatePermission(category, item, !permissions[category]?.[item])
                        }
                        activeOpacity={0.8}
                      >
                        <Checkbox
                          value={permissions[category]?.[item] || false}
                          onChange={(value) => updatePermission(category, item, value)}
                        />
                        <Text style={styles.permissionText}>
                          {t(`security.role.${category}.${item}`)}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            );
          }
        })}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  categoryNav: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  categoryNavButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#e0e0e0',
    margin: 4,
  },
  categoryNavButtonActive: {
    backgroundColor: '#d9ffe6',
  },
  categoryNavText: {
    fontSize: 14,
    color: '#333',
  },
  permissionsContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  categoryContainer: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxIcon: {
    fontSize: 16,
    color: '#ffffff',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  permissionText: {
    marginLeft: 20,
    fontSize: 14,
    color: '#555',
  },
  categoryTitle: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  permissionList: {
    maxHeight: 300,
    paddingVertical: 10,
  },
});

export default PermissionsList;