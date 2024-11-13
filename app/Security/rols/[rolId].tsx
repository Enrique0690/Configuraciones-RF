import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import DataRenderer from '@/components/DataRenderer';

  const EditRoleScreen: React.FC = () => {
    const { t } = useTranslation();
    const { id } = useLocalSearchParams<{ id: string }>(); 
    const { rolId } = useLocalSearchParams();
    const backgroundColor = useThemeColor({}, 'backgroundsecondary');
    const buttonColor = useThemeColor({}, 'buttonColor');
    const [name, setName] = useState<string>('');
    const [permissions, setPermissions] = useState<Record<string, Record<string, boolean>>>({});
    const [activeCategory, setActiveCategory] = useState<string>('Ventas');
    const [loading, setLoading] = useState<boolean>(true);

    const permissionCategories: Record<string, string[]> = {
      [t('security.role.SALES')]: [
        t('security.role.sales.directSale'), 
        t('security.role.sales.tableOrder'), 
        t('security.role.sales.cashRegister'), 
        t('security.role.sales.expenseRecord'), 
        t('security.role.sales.closureQuery')
      ],
      [t('security.role.INVENTORY')]: [
        t('security.role.inventory.articles'), 
        t('security.role.inventory.inventoryEntry'), 
        t('security.role.inventory.inventoryExit'), 
        t('security.role.inventory.kardex'), 
        t('security.role.inventory.viewMovements'), 
        t('security.role.inventory.transformation'), 
        t('security.role.inventory.production')
      ],
      [t('security.role.CONFIGURATION')]: [t('security.role.configuration.config')],
      [t('security.role.SPECIALPERMISSIONS')]: [
        t('security.role.specialPermissions.cancelTables'), 
        t('security.role.specialPermissions.cancelCashClosures'), 
        t('security.role.specialPermissions.cancelSales'), 
        t('security.role.specialPermissions.cancelInventoryMovements'),
        t('security.role.specialPermissions.removeItemsFromOrder'), 
        t('security.role.specialPermissions.verifyCashClosures'), 
        t('security.role.specialPermissions.chargePendingOrders'), 
        t('security.role.specialPermissions.accessAnyTable'), 
        t('security.role.specialPermissions.reprintSalesDocuments'), 
        t('security.role.specialPermissions.modifySalesData'), 
        t('security.role.specialPermissions.moveOrderItems')
      ],
      [t('security.role.CLIENTS')]: [t('security.role.clients.clientQuery')],
      [t('security.role.REPORTS')]: [
        t('security.role.report.salesReport'), 
        t('security.role.report.inventoryReport')
      ]
    };

      useEffect(() => {
        const loadRoleData = async () => {
          if (rolId) {
            setLoading(true);
            try {
              const storedRoles = await AsyncStorage.getItem('roles');
              const roles = storedRoles ? JSON.parse(storedRoles) : [];
              const roleToEdit = roles.find((role: any) => role.id === rolId);
    
              if (roleToEdit) {
                setName(roleToEdit.name);
                setPermissions(roleToEdit.permissions);
              } else {
                console.log(t('security.role.errorLoadingData'));
              }
            } catch (err) {
              console.error(err);
            } finally {
              setLoading(false);
            }
          }
        };
    
        loadRoleData();
      }, [rolId, t]);

      const handleSave = async () => {
        setLoading(true);
        if (rolId) {
          try {
            const storedRoles = await AsyncStorage.getItem('roles');
            const roles = storedRoles ? JSON.parse(storedRoles) : [];
            const updatedRoles = roles.map((role: any) =>
              role.id === rolId
                ? { ...role, name, permissions }
                : role
            );
    
            await AsyncStorage.setItem('roles', JSON.stringify(updatedRoles));
            router.push('/Security/rols/rollist');
          } catch (error) {
            console.log(t('security.role.errorSaving'));
            console.error(error);
          } finally {
            setLoading(false);
          }
        }
      };
  
      const handlePermissionChange = (category: string, item: string, value: boolean) => {
        setPermissions(prev => ({
          ...prev,
          [category]: {
            ...prev[category],
            [item]: value
          }
        }));
      };
  
    const handleCategoryChange = (category: string, value: boolean) => {
      setPermissions(prev => ({
        ...prev,
        [category]: Object.fromEntries(
          Object.entries(prev[category]).map(([item, _]) => [item, value])
        )
      }));
    };
    
  
    const handleSelectAll = (value: boolean) => {
      setPermissions(prev => Object.fromEntries(
        Object.entries(prev).map(([category, items]) => [
          category, Object.fromEntries(Object.keys(items).map(item => [item, value]))
        ])
      ));
    };

  
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>{t('roles.loading')}</Text>
        </View>
      );
    }
  
    const CustomCheckbox = ({ value, onValueChange }: { value: boolean; onValueChange: (newValue: boolean) => void }) => (
      <TouchableOpacity style={styles.checkbox} onPress={() => onValueChange(!value)}>
        <View style={[styles.checkboxSquare, value && styles.checkboxChecked]}>
          {value && <Text style={styles.checkboxIcon}>✔️</Text>}
        </View>
      </TouchableOpacity>
    );
  
    return (
      <ScrollView contentContainerStyle={[styles.container, { backgroundColor }]}>
        <Text style={styles.header}>{t('security.role.editRole')}</Text>
        
        <DataRenderer
          label={t('security.role.roleName')}
          value={name}
          type="input"
          textColor="#333"
          onSave={(newValue) => setName(newValue as string)}
        />
        <View style={styles.selectAllContainer}>
          <CustomCheckbox
            value={Object.values(permissions).every(category =>
              Object.values(category).every(isSelected => isSelected)
            )}
            onValueChange={(value) => handleSelectAll(value)}
          />
          <Text style={styles.selectAllLabel}>{t('security.role.selectAllPermissions')}</Text>
        </View>
        <View style={styles.categoryNav}>
          {Object.keys(permissionCategories).map(category => {
            const allSelected = Object.values(permissions[category] || {}).every(isSelected => isSelected);
            return (
              <TouchableOpacity
                key={category}
                style={[
                  styles.categoryNavButton,
                  activeCategory === category && styles.categoryNavButtonActive,
                  allSelected && styles.categoryNavButtonSelected
                ]}
                onPress={() => setActiveCategory(category)}
              >
                <Text style={styles.categoryNavText}>{t(`${category}`)}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={styles.permissionsContainer}>
          {Object.entries(permissionCategories).map(([category, items]) => {
            if (category === activeCategory) {
              return (
                <View key={category} style={styles.categoryContainer}>
                  <View style={styles.categoryHeader}>
                    <CustomCheckbox
                      value={Object.values(permissions[category] || {}).every(isSelected => isSelected)}
                      onValueChange={(value) => handleCategoryChange(category, value)}
                    />
                    <Text style={styles.categoryLabel}>{t(`${category}`)}</Text>
                  </View>
                  
                  <ScrollView style={styles.permissionList} nestedScrollEnabled>
                    {items.map((item) => (
                      <View key={item} style={styles.permissionItem}>
                        <CustomCheckbox
                          value={permissions[category]?.[item] || false}
                          onValueChange={(value) => handlePermissionChange(category, item, value)}
                        />
                        <Text style={styles.permissionLabel}>{t(`${item}`)}</Text>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              );
            }
            return null;
          })}
        </View>
  
        <TouchableOpacity style={[styles.saveButton, { backgroundColor: buttonColor }]} onPress={handleSave}>
          <Text style={styles.saveButtonText}>{t('security.role.saveButton')}</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      paddingTop: Platform.OS === 'ios' ? 20 : 0,
      alignItems: 'center',
    },
    header: {
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 16,
      color: '#333',
      textAlign: 'center',
    },
    selectAllContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 16,
      width: '100%',
      maxWidth: 400,
    },
    selectAllLabel: {
      marginLeft: 8,
      fontSize: 18,
      fontWeight: '600',
    },
    categoryNav: {
      flexDirection: 'row',
      justifyContent: 'center',
      width: '100%',
      maxWidth: 400,
      marginBottom: 16,
      flexWrap: 'wrap',
    },
    categoryNavButton: {
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderRadius: 8,
      backgroundColor: '#f0f0f0',
      margin: 4,
    },
    categoryNavButtonActive: {
      backgroundColor: '#007bff',
    },
    categoryNavButtonSelected: {
      backgroundColor: '#4CAF50',
    },
    categoryNavText: {
      fontSize: 16,
      fontWeight: '600',
      color: '#333',
    },
    permissionsContainer: {
      width: '100%',
      maxWidth: 400,
      padding: 10,
      borderRadius: 8,
      backgroundColor: '#f9f9f9',
      marginBottom: 16,
    },
    categoryContainer: {
      marginBottom: 20,
    },
    categoryHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    categoryLabel: {
      fontSize: 20,
      fontWeight: '600',
      marginLeft: 8,
    },
    permissionList: {
      maxHeight: 200,
    },
    permissionItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 8,
    },
    permissionLabel: {
      fontSize: 16,
      marginLeft: 8,
    },
    saveButton: {
      paddingVertical: 12,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
      width: '100%',
      maxWidth: 400,
    },
    saveButtonText: {
      color: '#fff',
      fontSize: 16,
      fontWeight: '600',
    },
    checkbox: {
      width: 24,
      height: 24,
      borderRadius: 4,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 8,
    },
    checkboxSquare: {
      borderColor: '#007bff',
    },
    checkboxChecked: {
      backgroundColor: '#4CAF50',
    },
    checkboxIcon: {
      color: '#fff',
      fontSize: 16,
    },loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#4CAF50',
  },
  });

  export default EditRoleScreen;