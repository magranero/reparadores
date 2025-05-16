import React, { useState, useEffect } from 'react';
import { LanguageContext, initializeI18n } from '@/utils/i18n';
import i18n from '@/utils/i18n';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState(i18n.locale);

  useEffect(() => {
    const loadLocale = async () => {
      try {
        const initializedLocale = await initializeI18n();
        setLocaleState(initializedLocale);
      } catch (error) {
        console.error('Error initializing i18n:', error);
      }
    };
    
    loadLocale();
  }, []);

  const setLocale = async (newLocale: string) => {
    try {
      await AsyncStorage.setItem('userLocale', newLocale);
      i18n.locale = newLocale;
      setLocaleState(newLocale);
    } catch (error) {
      console.error('Error saving locale:', error);
    }
  };

  const t = (key: string, params?: object) => {
    return i18n.t(key, params);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}