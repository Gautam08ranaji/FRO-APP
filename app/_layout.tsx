// app/_layout.tsx

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Provider } from "react-redux";

import { persistor, store } from "@/store";

import { AudioRecorderProvider } from "@/hooks/AudioRecorderProvider";
import { CameraPermissionProvider } from "@/hooks/CameraPermissionProvider";
import { LocationProvider } from "@/hooks/LocationContext";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      await new Promise(r => setTimeout(r, 800));
      setAppIsReady(true);
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
    }
  }, [appIsReady]);

  if (!appIsReady) return null;

  return (
    // ✅ REDUX PROVIDER (TOP LEVEL)
    <Provider store={store}>
       <PersistGate loading={null} persistor={persistor}>
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
      </PersistGate>
    </Provider>
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
      <Stack screenOptions={{ headerShown: false }}>
        {/* ✅ ONBOARDING FLOW */}
        <Stack.Screen name="(onboarding)" />

        {/* ✅ ROLE-BASED TAB LAYOUTS */}
        <Stack.Screen name="(fro)" />
        <Stack.Screen name="(frl)" />

        {/* ✅ MODAL */}
        <Stack.Screen
          name="modal"
          options={{ presentation: "modal" }}
        />
      </Stack>

      <StatusBar
        style={isDarkMode ? "light" : "dark"}
        translucent={false}
        backgroundColor={theme.colors.colorAccent500}
      />
    </>
  );
}
