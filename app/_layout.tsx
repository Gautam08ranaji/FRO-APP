// app/_layout.tsx
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { AudioRecorderProvider } from "@/hooks/AudioRecorderProvider";
import { CameraPermissionProvider } from "@/hooks/CameraPermissionProvider";
import { LocationProvider } from "@/hooks/LocationContext";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";

SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(onboarding)",
};

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise((r) => setTimeout(r, 1000));
      setAppIsReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) await SplashScreen.hideAsync();
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <SafeAreaProvider>
        <LocationProvider>
          <CameraPermissionProvider>
            <ThemeProvider>
              <AudioRecorderProvider>
                <ThemedStack />
              </AudioRecorderProvider>
            </ThemeProvider>
          </CameraPermissionProvider>
        </LocationProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

function ThemedStack() {
  const { theme, isDarkMode } = useTheme();

  useEffect(() => {
    if (Platform.OS === "android") {
      RNStatusBar.setBackgroundColor(theme.colors.btnPrimaryBg);
      RNStatusBar.setBarStyle(isDarkMode ? "light-content" : "dark-content");
    }
  }, [theme, isDarkMode]);

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="(onboarding)/index" />
        <Stack.Screen name="(onboarding)/login" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>

      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        translucent={false}
        backgroundColor={theme.colors.colorAccent500}
      />
    </>
  );
}
