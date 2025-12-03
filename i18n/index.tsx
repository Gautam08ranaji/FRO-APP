
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Localization from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { DevSettings, I18nManager } from 'react-native';


import bn from './locales/bn.json';
import en from './locales/en.json';
import hi from './locales/hi.json';
import mr from './locales/mr.json';
import pn from './locales/pn.json';
import ta from './locales/ta.json';
import te from './locales/te.json';
import ur from './locales/ur.json';

import as from './locales/as.json';
import brx from './locales/brx.json';
import doi from './locales/doi.json';
import gom from './locales/gom.json';
import gu from './locales/gu.json';
import kn from './locales/kn.json';
import ks from './locales/ks.json';
import mai from './locales/mai.json';
import ml from './locales/ml.json';
import mni from './locales/mni.json';
import ne from './locales/ne.json';
import orLang from './locales/or.json';
import sa from './locales/sa.json';
import sat from './locales/sat.json';
import sd from './locales/sd.json';

export const RTL_LANGUAGES = ['ur', 'ar', 'he', 'fa', 'ks'];

// -------------------------------------------------------------
// 🌍 All languages registered
// -------------------------------------------------------------
const resources = {
  en: { translation: en },
  hi: { translation: hi },
  mr: { translation: mr },
  pn: { translation: pn },
  bn: { translation: bn },
  ta: { translation: ta },
  te: { translation: te },
  ur: { translation: ur },

  // Newly Added
  as: { translation: as },
  brx: { translation: brx },
  doi: { translation: doi },
  gu: { translation: gu },
  kn: { translation: kn },
  ks: { translation: ks },
  gom: { translation: gom },
  mai: { translation: mai },
  ml: { translation: ml },
  mni: { translation: mni },
  ne: { translation: ne },
  or: { translation: orLang },
  sa: { translation: sa },
  sat: { translation: sat },
  sd: { translation: sd },
};


const fallbackLng = 'en';

const deviceLanguage =
  Localization.getLocales()?.[0]?.languageCode ?? fallbackLng;


export const applyRTL = async (lng: string) => {
  const isRTL = RTL_LANGUAGES.includes(lng);

  if (I18nManager.isRTL !== isRTL) {
    I18nManager.allowRTL(isRTL);
    I18nManager.forceRTL(isRTL);

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
