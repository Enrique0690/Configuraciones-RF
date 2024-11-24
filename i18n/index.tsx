if (typeof Intl.PluralRules === 'undefined')  require('@formatjs/intl-pluralrules');
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import commonEn from './languages/en/common.json';
import integrationsEn from './languages/en/integrations.json';
import layoutEn from './languages/en/layout.json';
import organizationEn from './languages/en/organization.json';
import paymentmethodsEn from './languages/en/paymentmethods.json';
import printersEn from './languages/en/printers.json';
import securityEn from './languages/en/security.json';
import stationsEn from './languages/en/stations.json';
import tablelayoutEn from './languages/en/tablelayout.json';

import commonEs from './languages/es/common.json';
import integrationsEs from './languages/es/integrations.json';
import layoutEs from './languages/es/layout.json';
import organizationEs from './languages/es/organization.json';
import paymentmethodsEs from './languages/es/paymentmethods.json';
import printersEs from './languages/es/printers.json';
import securityEs from './languages/es/security.json';
import stationsEs from './languages/es/stations.json';
import tablelayoutEs from './languages/es/tablelayout.json';

const en = {
  common: commonEn,
  integrations: integrationsEn,
  layout: layoutEn,
  organization: organizationEn,
  paymentmethods: paymentmethodsEn,
  printers: printersEn,
  security: securityEn,
  stations: stationsEn,
  tablelayout: tablelayoutEn,
};

const es = {
  common: commonEs,
  integrations: integrationsEs,
  layout: layoutEs,
  organization: organizationEs,
  paymentmethods: paymentmethodsEs,
  printers: printersEs,
  security: securityEs,
  stations: stationsEs,
  tablelayout: tablelayoutEs,
};

i18n
  .use(initReactI18next) 
  .init({
    resources: {
      en: {
        translation: en, 
      },
      es: {
        translation: es, 
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
