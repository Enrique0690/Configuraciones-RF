import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Platform, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import BusinessInfo from './Business-info';
import Printers from './Printers';
import PaymentMethods from './Payment-methods';
import Integrations from './Integrations';
import TabletConfiguration from './Tablet-configuration';
import Security from './Security';
import AdvancedOptions from './Advanced-options';
import TaxConfiguration from './Tax-configuration-ec';

const SettingsScreen: React.FC = () => {
  const router = useRouter();
  const backgroundColor = useThemeColor({}, 'background');
  const itemBackgroundColor = useThemeColor({}, 'itemBackground');
  const borderColor = useThemeColor({}, 'border');
  const textColor = useThemeColor({}, 'text');
  const secondaryTextColor = useThemeColor({}, 'textsecondary');

  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [transition] = useState(new Animated.Value(0));

  const navigateTo = (path: string) => {
    setSelectedPath(path);
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      setIsFullscreen(true);
      // Animate the transition
      Animated.timing(transition, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const goBack = () => {
    setIsFullscreen(false);
    setSelectedPath(null); // Reset selected path
    Animated.timing(transition, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const renderSettingsItem = (label: string, icon: string, path: string) => (
    <TouchableOpacity
      onPress={() => navigateTo(path)}
      style={[styles.item, { backgroundColor: itemBackgroundColor }]}
      key={label}
    >
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[styles.itemText, { color: textColor }]}>{label}</Text>
    </TouchableOpacity>
  );

  const renderContent = () => {
    switch (selectedPath) {
      case '/business-info':
        return <BusinessInfo />;
      case '/printers':
        return <Printers />;
      case '/payment-methods':
        return <PaymentMethods />;
      case '/integrations':
        return <Integrations />;
      case '/tablet-configuration':
        return <TabletConfiguration />;
      case '/security':
        return <Security />;
      case '/advanced-options':
        return <AdvancedOptions />;
      case '/tax-configuration(Ecuador)':
        return <TaxConfiguration />;
      default:
        return <Text style={{ color: textColor, fontSize: 18, textAlign: 'center'}}>Selecciona una opción para ver su configuración</Text>;
    }
  };

  return (
    <View style={[styles.container]}>
      {/* Panel Izquierdo (Solo en dispositivos no móviles o si no está en fullscreen) */}
      {(Platform.OS === 'web' || Platform.OS === 'windows' || !isFullscreen) && (
        <View style={[styles.sidebar, { backgroundColor }]}>
          <Text style={[styles.header, { color: secondaryTextColor }]}>Configuraciones</Text>
          <View style={[styles.searchContainer, { backgroundColor: itemBackgroundColor }]}>
            <Text style={{ color: Colors.icon }}>🔍</Text>
            <TextInput 
              placeholder="Buscar..."
              placeholderTextColor={Colors.text}
              style={[styles.searchInput, { color: textColor }]}
            />
          </View>

          <ScrollView contentContainerStyle={styles.itemsContainer}>
            <View style={[styles.section, { borderColor }]}>
              {renderSettingsItem("Información del Negocio", "👁️", "/business-info")}
              {renderSettingsItem("Impresoras", "🖨️", "/printers")}
              {renderSettingsItem("Métodos de cobro", "💳", "/payment-methods")}
              {renderSettingsItem("Integración con otras apps", "🔗", "/integrations")}
            </View>

            <View style={[styles.section, { borderColor }]}>
              {renderSettingsItem("Configuración de mesas", "🍽️", "/tablet-configuration")}
              {renderSettingsItem("Seguridad", "🔒", "/security")}
              {renderSettingsItem("Opciones avanzadas", "⚙️", "/advanced-options")}
              {renderSettingsItem("Configuración tributaria (Ecuador)", "🗑️", "/tax-configuration(Ecuador)")}
            </View>
          </ScrollView>
        </View>
      )}

      {/* Panel Derecho - Contenido del índice seleccionado */}
      <Animated.View
        style={[
          styles.mainContent,
          {
            flex: 1,
            padding: 5,
            backgroundColor: '#0c9540',
            borderRadius: 8,
            marginLeft: isFullscreen ? 0 : 16,
            height: Platform.OS === 'android' || Platform.OS === 'ios' ? '100%' : 'auto',
          },
        ]}
      >
        {renderContent()}
      </Animated.View>

      {/* Botón para volver en móviles */}
      {Platform.OS === 'android' || Platform.OS === 'ios' ? (
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Text style={{ color: Colors.text }}>Volver</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: Platform.OS === 'web' || Platform.OS === 'windows' ? 'row' : 'column', // Dos columnas en Web/Windows, columna única en móviles
    padding: 16,
  },
  sidebar: {
    width: 300,
    paddingRight: 16,
    alignItems:'center'
  },
  mainContent: {
    flex: 1,
    padding: 5,
    backgroundColor: '#F0F0F0',
    borderRadius: 8,
    overflow: 'hidden',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 8,
    marginLeft: 8,
  },
  itemsContainer: {
    paddingBottom: 16,
  },
  section: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 16,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    borderRadius: 8,
    marginBottom: 8,
  },
  icon: {
    fontSize: 20,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
  },
  backButton: {
    position: 'absolute',
    bottom: 16,
    left: '50%',
    transform: [{ translateX: -50 }],
    padding: 5,
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
});

export default SettingsScreen;
