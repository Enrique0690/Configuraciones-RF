// i18n/index.tsx

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { I18nextProvider } from 'react-i18next';
import en from './languages/en.json';
import es from './languages/es.json';

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
    lng: 'es', // Idioma por defecto
    fallbackLng: 'en', // Idioma de respaldo
    interpolation: {
      escapeValue: false // React ya escapa las variables de manera segura
    }
  });

export const I18nProvider = ({ children }: { children: React.ReactNode }) => (
  <I18nextProvider i18n={i18n}>{children}</I18nextProvider>
);
