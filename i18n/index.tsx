if (typeof Intl.PluralRules === 'undefined')  require('@formatjs/intl-pluralrules');
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './languages/en.json';
import es from './languages/es.json';

i18n
  .use(initReactI18next) 
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
      escapeValue: false
    },
    pluralSeparator: '_',
    compatibilityJSON: 'v3',
  });
