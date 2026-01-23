import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';

i18n
  .use(Backend)
  .use(initReactI18next)
  .init({
    lng: 'sp',
    fallbackLng: 'en',
    
    ns: ['common', 'auth', 'user', 'ingredient', 'dish', 'grocerylist', 'cart'],
    defaultNS: 'common',

    debug: false,

    interpolation: {
      escapeValue: false,
    },

    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
  });

export default i18n;