import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

type TabletConfigurationProps = {
  showUser: boolean;
  showTime: boolean;
  showCommercialName: boolean;
};

const TabletConfiguration: React.FC<TabletConfigurationProps> = ({ showUser, showTime, showCommercialName }) => {
  const { t } = useTranslation();
  return (
    <View style={styles.tableBox}>
      {showUser && (
        <Text style={styles.tableLabel}>{t('tablelayout.userName')}</Text>
      )}
      {showCommercialName && (
        <Text style={styles.tableInfo}>{t('tablelayout.commercialName')}</Text>
      )}
      <Text style={styles.tableInfo}>{t('tablelayout.tableNumber')}</Text>
      {showTime && (
        <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{t('tablelayout.time')}</Text>
        <Ionicons name="time-outline" size={16} color="#000" style={styles.timeIcon} />
      </View>
      )}
      <Text style={styles.tableInfo}>{t('tablelayout.totalAmount')}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  tableBox: {
    width: '100%',
    maxWidth: 200,
    height: 200,
    paddingVertical: 16,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 16,
    justifyContent: 'flex-start', 
    alignItems: 'center',
    backgroundColor: '#F4A72C',
    alignSelf: 'center',
    marginTop: 20,
  },
  tableLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: '#fff',
    borderRadius: 4,
    marginBottom: 8, 
    textAlign: 'center',
    width: '80%',
  },
  tableInfo: {
    fontSize: 14,
    marginVertical: 4,
    textAlign: 'center',
    color: '#fff',
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginTop: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#fff',
    marginRight: 4,
  },
  timeIcon: {
    marginLeft: 2,
    color: '#fff',
  },
});


export default TabletConfiguration;