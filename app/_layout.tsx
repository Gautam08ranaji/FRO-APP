// app/_layout.tsx
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useEffect, useState } from 'react';
import { Platform, StatusBar as RNStatusBar, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// 🧩 App Providers
import { CameraPermissionProvider } from '@/hooks/CameraPermissionProvider';
import { LocationProvider } from '@/hooks/LocationContext';

// 🟩 Sahara Theme System
import { ThemeProvider, useTheme } from '@/theme/ThemeContext';

// ✅ Keep splash visible until we’re ready
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: '(onboarding)',
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  // Simulate loading (you can await fonts/theme initialization here)
  useEffect(() => {
    async function prepare() {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
      } finally {
        setAppIsReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) {
    return null; // 👈 keep splash visible until ready
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <LocationProvider>
          <CameraPermissionProvider>
            <ThemeProvider>
              <ThemedStack />
            </ThemeProvider>
          </CameraPermissionProvider>
        </LocationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

/**
 * 🧭 Themed Stack that uses our ThemeContext
 * (Expo Router already handles NavigationContainer)
 */
function ThemedStack() {
  const { theme, isDarkMode } = useTheme();

  return (
    <>
      {Platform.OS === 'android' && (
        <View
          style={{
            height: RNStatusBar.currentHeight,
            backgroundColor: theme.colors.background,
          }}
        />
      )}

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: theme.colors.background },
        }}
      >
        <Stack.Screen name="(onboarding)/index" /> {/* ✅ Make sure your onboarding screen is here */}
        <Stack.Screen name="(onboarding)/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{ presentation: 'modal', title: 'Modal' }}
        />
      </Stack>

      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
    </>
  );
}
