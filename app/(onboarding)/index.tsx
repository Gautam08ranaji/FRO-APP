import { useTheme } from '@/theme/ThemeContext';
import { useRouter } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { MotiImage, MotiText, MotiView } from 'moti';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// ✅ Keep splash visible until onboarding layout is ready
SplashScreen.preventAutoHideAsync();

export default function OnboardingScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [appReady, setAppReady] = useState(false);

  // ✅ Simulate initial load (fonts, async data, etc.)
  useEffect(() => {
    const prepare = async () => {
      try {
        // loadFonts(), restoreState(), etc.
        await new Promise(resolve => setTimeout(resolve, 800));
      } finally {
        setAppReady(true);
      }
    };
    prepare();
  }, []);

  // ✅ Hide splash after layout + trigger navigation
  const onLayout = useCallback(async () => {
    if (appReady) {
      // wait one frame for React Native to paint UI
      setTimeout(async () => {
        await SplashScreen.hideAsync(); // hide splash once ready
      }, 100);

      // navigate after logo/text animation finishes
      setTimeout(() => {
        router.push('/(onboarding)/languageSelect');
      }, 2500);
    }
  }, [appReady]);

  // ⛔ Keep showing native splash until ready
  if (!appReady) return null;

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      onLayout={onLayout}
    >
      {/* Fade-in wrapper for smoother transition */}
      <MotiView
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: 'timing', duration: 500 }}
        style={{ alignItems: 'center' }}
      >
        {/* Animated Logo */}
        <MotiImage
          from={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'timing', duration: 1000 }}
          source={require('../../assets/images/welcomeAppIcon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* Animated Titles */}
        <MotiText
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 400, duration: 800 }}
          style={[
            theme.typography.fontH1,
            {
              color: theme.colors.colorSuccess600,
              textAlign: 'center',
              marginBottom: 6,
            },
          ]}
        >
          {t('OnboardingScreen.title1') || 'National Senior Citizen'}
        </MotiText>

        <MotiText
          from={{ opacity: 0, translateY: 15 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ delay: 700, duration: 800 }}
          style={[
            theme.typography.fontH2,
            {
              color: theme.colors.colorSuccess600,
              textAlign: 'center',
            },
          ]}
        >
          {t('OnboardingScreen.title2') || 'Help Desk'}
        </MotiText>
      </MotiView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 140, height: 140, marginBottom: 30 },
});
