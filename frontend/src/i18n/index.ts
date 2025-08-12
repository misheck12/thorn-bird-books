import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import enCommon from './locales/en/common.json';
import enNavigation from './locales/en/navigation.json';
import enBooks from './locales/en/books.json';
import enEvents from './locales/en/events.json';
import enAuth from './locales/en/auth.json';
import enCart from './locales/en/cart.json';

import esCommon from './locales/es/common.json';
import esNavigation from './locales/es/navigation.json';
import esBooks from './locales/es/books.json';
import esEvents from './locales/es/events.json';
import esAuth from './locales/es/auth.json';
import esCart from './locales/es/cart.json';

import frCommon from './locales/fr/common.json';
import frNavigation from './locales/fr/navigation.json';
import frBooks from './locales/fr/books.json';
import frEvents from './locales/fr/events.json';
import frAuth from './locales/fr/auth.json';
import frCart from './locales/fr/cart.json';

const resources = {
  en: {
    common: enCommon,
    navigation: enNavigation,
    books: enBooks,
    events: enEvents,
    auth: enAuth,
    cart: enCart,
  },
  es: {
    common: esCommon,
    navigation: esNavigation,
    books: esBooks,
    events: esEvents,
    auth: esAuth,
    cart: esCart,
  },
  fr: {
    common: frCommon,
    navigation: frNavigation,
    books: frBooks,
    events: frEvents,
    auth: frAuth,
    cart: frCart,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    lng: localStorage.getItem('language') || 'en',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    
    // Separate namespace handling
    ns: ['common', 'navigation', 'books', 'events', 'auth', 'cart'],
    defaultNS: 'common',
    
    // Development settings
    debug: process.env.NODE_ENV === 'development',
    
    // Performance settings
    load: 'languageOnly', // Don't load country-specific variants
    preload: ['en', 'es', 'fr'],
  });

export default i18n;