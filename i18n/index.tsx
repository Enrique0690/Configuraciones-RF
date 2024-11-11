// Verifica si el polyfill está cargado correctamente
if (typeof Intl.PluralRules === 'undefined')  require('@formatjs/intl-pluralrules');
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './languages/en.json';
import es from './languages/es.json';

// Inicialización de i18next
i18n
  .use(initReactI18next) // habilita el uso de i18next con react-i18next
  .init({
    resources: {
      en: {
        translation: en
      },
      es: {
        translation: es
      }
    },
    lng: 'es',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React ya escapa las variables de manera segura
    },
    pluralSeparator: '_', // Agrega un separador si es necesario para plurales
    compatibilityJSON: 'v3', // Asegura que uses el formato de compatibilidad JSON v3
  });
