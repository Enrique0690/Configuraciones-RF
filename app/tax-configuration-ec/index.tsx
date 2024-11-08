import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView} from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import InfoTributaria from '@/components/tax-configuration(Ecuador)/InfoTributaria';
import SecuenciaFactura from '@/components/tax-configuration(Ecuador)/SecuenciaFactura';
import Reglas from '@/components/tax-configuration(Ecuador)/Reglas';

const TaxConfiguration = () => {
  const backgroundColor = useThemeColor({}, 'backgroundsecondary');

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <ScrollView contentContainerStyle={styles.contentContainer}>        
        <InfoTributaria />
        <SecuenciaFactura />
        <Reglas />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    borderRadius: 10,
  },
  contentContainer: {
    paddingBottom: 16,
  }
});

export default TaxConfiguration;
