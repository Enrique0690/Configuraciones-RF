import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useThemeColor } from '@/hooks/useThemeColor';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next'; 

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  isActive: boolean;
};

const PaymentMethodsScreen: React.FC = () => {
  const { t } = useTranslation(); 
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(''); 
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');
  const blackColor = '#000'; 

  useEffect(() => {
  const loadPaymentMethods  = async () => {
    setLoading(true);
    setError('');
    try {
      const storedMethods = await AsyncStorage.getItem('paymentMethods');
      if (storedMethods) {
        setPaymentMethods(JSON.parse(storedMethods));
      }
    } catch (error) {
      setError(t('paymentMethods.errorLoading'));
    } finally {
      setLoading(false);
    }
  };
  loadPaymentMethods();
  }, []);

  const savePaymentMethods = async (methods: PaymentMethod[]) => {
    try {
      await AsyncStorage.setItem('paymentMethods', JSON.stringify(methods));
    } catch (error) {
      setError(t('paymentMethods.errorSaving'));
    }
  };

  const togglePaymentMethod = async (id: string) => {
    const updatedMethods = paymentMethods.map((method) =>
      method.id === id ? { ...method, isActive: !method.isActive } : method
    );
    setPaymentMethods(updatedMethods);
    await savePaymentMethods(updatedMethods);
  };

  const removePaymentMethod = async (id: string) => {
    const updatedMethods = paymentMethods.filter((method) => method.id !== id);
    setPaymentMethods(updatedMethods);
    await savePaymentMethods(updatedMethods);
  };

  const renderItem = ({ item }: { item: PaymentMethod }) => (
    <View style={[styles.paymentMethodItem, { backgroundColor }]}>
      <Switch
        value={item.isActive}
        onValueChange={() => togglePaymentMethod(item.id)}
        thumbColor={item.isActive ? '#4caf50' : '#f44336'}
      />
      <Ionicons name={item.icon as any} size={24} color={blackColor} style={styles.icon} />
      <Text style={[styles.paymentMethodName, { color: blackColor }]}>{item.name}</Text>
      <TouchableOpacity onPress={() => removePaymentMethod(item.id)}>
        <Ionicons name="trash-bin" size={24} color="#f44336" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <View style={styles.header}>
        <Text style={[styles.headerText, { color: blackColor }]}>{t('paymentMethods.header')}</Text>
        <TouchableOpacity onPress={() => router.push('/Payment-methods/newpayment')}>
          <Ionicons name="add-circle-outline" size={30} color={blackColor} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : error ? (
        <Text style={[styles.errorText, { color: blackColor }]}>{error}</Text>
      ) : (
        <>
          {paymentMethods.length > 0 ? (
            <FlatList
              data={paymentMethods}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.flatListContainer}
            />
          ) : (
            <Text style={[styles.emptyText, { color: blackColor }]}>
              {t('paymentMethods.emptyList')}
            </Text>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: 'transparent',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  paymentMethodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    elevation: 1,
    justifyContent: 'space-between',
  },
  icon: {
    marginLeft: 16,
  },
  paymentMethodName: {
    flex: 1,
    fontSize: 16,
  },
  flatListContainer: {
    backgroundColor: 'transparent',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
    fontSize: 16,
  },
});

export default PaymentMethodsScreen;
