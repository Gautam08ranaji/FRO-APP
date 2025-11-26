// app/i18n.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DevSettings, I18nManager } from 'react-native';

// 📌 Import translations
import bn from './locales/bn.json';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import pn from './locales/pn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ur from './locales/ur.json';

export const RTL_LANGUAGES = ['ur', 'ar', 'he', 'fa'];

// All languages
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  ta: { translation: ta },
  te: { translation: te },
  bn: { translation: bn },
  pn: { translation: pn },
  ur: { translation: ur },
};

// Default language
const fallbackLng = 'hi';

const deviceLanguage =
  Localization.getLocales()?.[0]?.languageCode ?? fallbackLng;

// -------------------------------------------------------------
// ⭐ RTL handling (without expo-updates)
// -------------------------------------------------------------
export const applyRTL = async (lng: string) => {
  const isRTL = RTL_LANGUAGES.includes(lng);

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

    // 🔄 Reload app safely
    try {
      DevSettings.reload();
    } catch (e) {
      console.log("RTL reload failed", e);
    }
  }
};


i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: fallbackLng,
    fallbackLng,
    interpolation: { escapeValue: false },
  })
  .then(async () => {
    try {
      const savedLang = await AsyncStorage.getItem('appLanguage');
      const lang = savedLang ?? fallbackLng;

      await i18n.changeLanguage(lang);
      applyRTL(lang);
    } catch {
      await i18n.changeLanguage(fallbackLng);
    }
  });


i18n.on('languageChanged', async (lng) => {
  await AsyncStorage.setItem('appLanguage', lng);
  applyRTL(lng);
});

export default i18n;
