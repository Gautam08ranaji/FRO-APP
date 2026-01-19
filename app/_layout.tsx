// app/_layout.tsx

import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import React, { useCallback, useEffect, useState } from "react";
import { Platform, StatusBar as RNStatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";

import { useThemedToastConfig } from "@/components/reusables/ThemedToast";
import { AudioRecorderProvider } from "@/hooks/AudioRecorderProvider";
import { CameraPermissionProvider } from "@/hooks/CameraPermissionProvider";
import { LocationProvider } from "@/hooks/LocationContext";
import { persistor, store } from "@/store";
import { ThemeProvider, useTheme } from "@/theme/ThemeContext";
import { PersistGate } from "redux-persist/integration/react";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);
  const toastConfig = useThemedToastConfig();

  useEffect(() => {
    async function prepare() {
      await new Promise((resolve) => setTimeout(resolve, 800));
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
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <GestureHandlerRootView style={{ flex: 1 }} onLayout={onLayoutRootView}>
          <SafeAreaProvider>
            <LocationProvider>
              <CameraPermissionProvider>
                <ThemeProvider>
                  <AudioRecorderProvider>
                    <>
                      <ThemedStack />

                      {/* ✅ THEMED BOTTOM TOAST */}
                      <Toast
                        config={toastConfig}
                        position="bottom"
                        bottomOffset={70}
                      />
                    </>
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
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(fro)" />
        <Stack.Screen name="(frl)" />
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
