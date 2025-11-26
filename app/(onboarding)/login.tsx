// LoginScreen - Full updated code
// UI & logic unchanged. Applied theme.typography & theme.colors consistently (including OTP verified UI).

import ReusableButton from "@/components/reusables/ReusableButton";
import i18n from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// OTP library
import {
  CodeField,
  Cursor,
  useBlurOnFulfill,
  useClearByFocusCell,
} from "react-native-confirmation-code-field";

const CELL_COUNT = 6;

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const [inputValue, setInputValue] = useState("");
  const [isExistingUser, setIsExistingUser] = useState<boolean | null>(null);
  const [otpSent, setOtpSent] = useState(false);

  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");

  const [inputErrorBorder, setinputErrorBorder] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(30);

  const ref = useBlurOnFulfill({ value: otp, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value: otp,
    setValue: setOtp,
  });
  const [otpVerified, setOtpVerified] = useState(false);

  // Mock existing user check
  const checkUserExists = async (value: string) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    const exists = value.endsWith("5") || value.endsWith("0");
    setIsExistingUser(exists);
    setLoading(false);
  };

  const handleSendOtp = async () => {
    setinputErrorBorder(null);
    setLoading(true);

    await new Promise((r) => setTimeout(r, 800)); // mock API

    setOtpSent(true);
    setTimer(30);
    setOtp("");

    setLoading(false);
  };

  const handleLogin = async () => {
    setinputErrorBorder(null);
    if (password.trim().length < 4) {
      setinputErrorBorder(
        t("LoginScreen.invalidPassword") || "Please enter a valid password."
      );
      return;
    }
  };

  const handleVerifyOtp = async () => {
    setinputErrorBorder(null);

    if (otp.length !== 6) {
      setinputErrorBorder(
        t("LoginScreen.invalidOtp") || "Please enter a valid 6-digit OTP."
      );
      return;
    }

    // OTP Verified
    setOtpVerified(true);
    console.log("OTP verified successfully");
  };

  const handleContinue = async () => {
    setinputErrorBorder(null);

    if (!inputValue.trim()) {
      setinputErrorBorder(t("LoginScreen.enterPhone"));
      return;
    }
    if (inputValue.length !== 10 && inputValue.length !== 12) {
      setinputErrorBorder(t("LoginScreen.invalidNumber"));
      return;
    }

    await checkUserExists(inputValue.trim());
  };

  const handleForgotPassword = () => {
    setinputErrorBorder(null);
    setinputErrorBorder(t("LoginScreen.forgotComing"));
  };

  // TIMER EFFECT
  useEffect(() => {
    if (otpSent) {
      setTimer(30);
      const interval = setInterval(() => {
        setTimer((prev) => {
          if (prev <= 1) clearInterval(interval);
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [otpSent]);

  const handleResendOtp = () => {
    handleSendOtp();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* HEADER (hidden when OTP verified) */}
          {!otpVerified && (
            <View style={styles.header}>
              <View style={{ width: "100%", alignItems: "center" }}>
                {/* Title */}
                <Text
                  style={[
                    theme.typography.fontH1,
                    {
                      color: theme.colors.btnPrimaryBg,
                      marginTop: 10,
                      textAlign: "center",
                      width: "100%",
                      lineHeight: 34,
                    },
                  ]}
                >
                  {otpSent ? t("LoginScreen.otpTitle") : t("LoginScreen.title")}
                </Text>

                {/* English fallback */}
                {i18n.language !== "en" && (
                  <Text
                    style={[
                      theme.typography.fontH1,
                      {
                        color: theme.colors.btnPrimaryBg,
                        marginTop: 5,
                        textAlign: "center",
                        width: "100%",
                        lineHeight: 34,
                      },
                    ]}
                  >
                    {otpSent ? "Enter the Code" : "Login or Register"}
                  </Text>
                )}
              </View>

              {/* Subtitle */}
              <Text
                style={[
                  theme.typography.fontBodySmall,
                  {
                    color: theme.colors.colorTextSecondary,
                    textAlign: "center",
                    marginTop: 25,
                    width: "100%",
                    lineHeight: 22,
                  },
                ]}
              >
                {otpSent
                  ? `${t("LoginScreen.otpSentTo")} +91-${inputValue}`
                  : t("LoginScreen.subtitle")}
              </Text>
            </View>
          )}

          {/* PHONE INPUT */}
          {!otpSent && (
            <View style={styles.inputContainer}>
              <TextInput
                style={[
                  styles.input,
                  theme.typography.fontBody,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                  },
                ]}
                value={inputValue}
                onChangeText={(t) => {
                  setInputValue(t.replace(/[^0-9]/g, ""));
                  setinputErrorBorder(null);
                }}
                placeholder={t("LoginScreen.placeholder")}
                placeholderTextColor={theme.colors.inputPlaceholder}
                keyboardType="numeric"
                maxLength={12}
              />

              {inputErrorBorder && isExistingUser === null && (
                <Text
                  style={[
                    styles.inputErrorBorderText,
                    theme.typography.fontBodySmall,
                    { color: theme.colors.inputErrorBorder },
                  ]}
                >
                  {inputErrorBorder}
                </Text>
              )}
            </View>
          )}

          {/* STEP: Identify User */}
          {!otpSent && isExistingUser === null && (
            <ReusableButton title="Send OTP" onPress={handleContinue} />
          )}

          {/* EXISTING USER */}
          {!otpSent && isExistingUser === true && (
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text
                style={[
                  theme.typography.fontBodySmall,
                  {
                    color: theme.colors.colorTextSecondary,
                    textAlign: "center",
                  },
                ]}
              >
                {t("LoginScreen.existingUser")}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  theme.typography.fontBody,
                  {
                    borderColor: theme.colors.border,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.text,
                  },
                ]}
                secureTextEntry
                value={password}
                onChangeText={(t) => {
                  setPassword(t);
                  setinputErrorBorder(null);
                }}
                placeholder={t("LoginScreen.password")}
                placeholderTextColor={theme.colors.colorTextSecondary}
              />

              {inputErrorBorder && (
                <Text
                  style={[
                    styles.inputErrorBorderText,
                    theme.typography.fontBodySmall,
                    { color: theme.colors.inputErrorBorder },
                  ]}
                >
                  {inputErrorBorder}
                </Text>
              )}

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.btnPrimaryBg, marginTop: 20 },
                ]}
                onPress={handleLogin}
              >
                <Text
                  style={[
                    theme.typography.fontButton,
                    styles.buttonText,
                    { color: theme.colors.btnPrimaryText },
                  ]}
                >
                  {loading
                    ? t("LoginScreen.loggingIn")
                    : t("LoginScreen.login")}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity onPress={handleForgotPassword}>
                <Text
                  style={[
                    theme.typography.fontBodySmall,
                    { color: theme.colors.primary, marginTop: 15 },
                  ]}
                >
                  {t("LoginScreen.forgot")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* NEW USER */}
          {!otpSent && isExistingUser === false && (
            <View style={{ width: "100%", alignItems: "center" }}>
              <Text
                style={[
                  theme.typography.fontBodySmall,
                  {
                    color: theme.colors.colorTextSecondary,
                    textAlign: "center",
                  },
                ]}
              >
                {t("LoginScreen.newUser")}
              </Text>

              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.btnPrimaryBg },
                ]}
                onPress={handleSendOtp}
              >
                <Text
                  style={[
                    theme.typography.fontButton,
                    styles.buttonText,
                    { color: theme.colors.btnPrimaryText },
                  ]}
                >
                  {loading
                    ? t("LoginScreen.sendingOtp")
                    : t("LoginScreen.sendOtp")}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* OTP SCREEN */}
          {otpSent && !otpVerified && (
            <View style={{ width: "100%", alignItems: "center" }}>
              <CodeField
                ref={ref}
                {...props}
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  setinputErrorBorder(null);
                }}
                cellCount={CELL_COUNT}
                rootStyle={{ marginTop: 20 }}
                keyboardType="number-pad"
                renderCell={({ index, symbol, isFocused }) => (
                  <View
                    key={index}
                    style={[
                      styles.otpCell,
                      {
                        borderColor: isFocused
                          ? theme.colors.primary
                          : theme.colors.border,
                        backgroundColor: theme.colors.card,
                      },
                    ]}
                    onLayout={getCellOnLayoutHandler(index)}
                  >
                    <Text
                      style={[
                        styles.otpText,
                        theme.typography.fontH2,
                        { color: theme.colors.text },
                      ]}
                    >
                      {symbol || (isFocused ? <Cursor /> : null)}
                    </Text>
                  </View>
                )}
              />

              {inputErrorBorder && (
                <Text
                  style={[
                    styles.inputErrorBorderText,
                    theme.typography.fontBodySmall,
                    {
                      color: theme.colors.inputErrorBorder,
                      textAlign: "center",
                    },
                  ]}
                >
                  {inputErrorBorder}
                </Text>
              )}

              {/* VERIFY OTP */}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.btnPrimaryBg, width: "80%" },
                ]}
                onPress={handleVerifyOtp}
              >
                <Text
                  style={[
                    theme.typography.fontButton,
                    styles.buttonText,
                    { color: theme.colors.btnPrimaryText },
                  ]}
                >
                  {t("LoginScreen.verifyOtp")}
                </Text>
              </TouchableOpacity>

              {/* TIMER / RESEND */}
              {timer > 0 ? (
                <Text
                  style={[
                    theme.typography.fontBodySmall,
                    {
                      color: theme.colors.colorTextSecondary,
                      marginTop: 20,
                    },
                  ]}
                >
                  {timer}s {t("LoginScreen.resendIn")}
                </Text>
              ) : (
                <TouchableOpacity onPress={handleResendOtp}>
                  <Text
                    style={[
                      theme.typography.fontBodySmall,
                      {
                        color: theme.colors.primary,
                        marginTop: 20,
                        fontWeight: "600",
                      },
                    ]}
                  >
                    {t("LoginScreen.resendOtp")}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}

          {/* OTP VERIFIED SUCCESS SCREEN */}
          {otpVerified && (
            <View
              style={{ width: "100%", alignItems: "center", marginTop: 120 }}
            >
              {/* Tick Icon */}
              <View
                style={[
                  styles.tickWrapper,
                  { backgroundColor: theme.colors.btnPrimaryBg + "22" },
                ]}
              >
                <Text
                  style={[
                    theme.typography.fontH1,
                    { fontSize: 48, color: theme.colors.btnPrimaryBg },
                  ]}
                >
                  ✓
                </Text>
              </View>

              {/* Title */}
              <Text
                style={[
                  theme.typography.fontH2,
                  {
                    color: theme.colors.btnPrimaryBg,
                    textAlign: "center",
                    lineHeight: 30,
                    marginBottom: 20,
                  },
                ]}
              >
                {t("LoginScreen.verifiedTitle") || "आपका नंबर सफलतापूर्वक सत्यापित हुआ।"}
              </Text>

              {/* Continue Button */}
              <TouchableOpacity
                style={[
                  styles.button,
                  { backgroundColor: theme.colors.btnPrimaryBg, width: "80%" },
                ]}
                onPress={() => {
                  console.log("jbsjz");
                  
                  router.push("/(onboarding)/profile")
                }}
              >
                <Text
                  style={[
                    theme.typography.fontButton,
                    styles.buttonText,
                    { color: theme.colors.btnPrimaryText },
                  ]}
                >
                  {t("LoginScreen.startProfile") || "अपनी प्रोफ़ाइल बनाना शुरू करें"}
                </Text>
              </TouchableOpacity>

              {/* Skip Link */}
              <TouchableOpacity
                onPress={() => router.push("/(onboarding)/profile")}
                style={{ marginTop: 20 }}
              >
                <Text
                  style={[
                    theme.typography.fontBodySmall,
                    {
                      color: theme.colors.primary,
                      textDecorationLine: "underline",
                      textAlign: "center",
                    },
                  ]}
                >
                  {t("LoginScreen.skipProfile") || "प्रोफ़ाइल बाद में बनाएँ, सीधे डैशबोर्ड पर जाएँ।"}
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: {
    alignItems: "center",
    padding: 20,
    paddingBottom: 50,
  },
  header: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 40,
    marginBottom: 30,
  },
  inputContainer: { width: "100%", marginBottom: 10 },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 18,
    fontSize: 16,
  },
  button: {
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 40,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  inputErrorBorderText: {
    fontSize: 13,
    marginTop: 5,
    width: "100%",
  },

  // OTP styles
  otpCell: {
    width: 48,
    height: 55,
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 3,
  },
  otpText: {
    fontSize: 22,
    textAlign: "center",
  },
  tickWrapper: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
});