import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next"; // 👈 added
import {
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function OtpVerificationScreen() {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation(); // 👈 i18n hook

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  /* TIMER */
  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

  const handleChange = (value: string, index: number) => {
    const cleaned = value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = cleaned.slice(-1);
    setOtp(newOtp);

    if (cleaned && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    Keyboard.dismiss();
    router.push("/(onboarding)/profile");
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    // API call to resend
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.colorBgPage }]}
    >
      {/* HEADER ICON */}
      <View style={styles.iconWrapper}>
        <RemixIcon name="shield-line" size={28} color={theme.colors.btnPrimaryBg} />
      </View>

      {/* HEADER TEXT */}
      <View style={styles.header}>
        <Text style={[styles.headingHindi, { color: theme.colors.colorPrimary700 }]}>
          {t("otp.enterOtp")}
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.colorTextSecondary }]}>
          {t("otp.sentTo")} +91-XXXXXXXXXX
        </Text>
      </View>

      {/* OTP INPUTS */}
      <View style={styles.otpRow}>
        {Array.from({ length: 3 }).map((_, index) => (
          <TextInput
            key={index}
            ref={(r) => (inputRefs.current[index] = r)}
            style={[
              styles.otpInput,
              {
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                color: theme.colors.inputText,
              },
            ]}
            keyboardType="number-pad"
            maxLength={1}
            value={otp[index]}
            onChangeText={(t) => handleChange(t, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            textAlign="center"
          />
        ))}

        <Text style={[styles.hyphen, { color: theme.colors.colorTextTertiary }]}>-</Text>

        {Array.from({ length: 3 }).map((_, offset) => {
          const index = offset + 3;
          return (
            <TextInput
              key={index}
              ref={(r) => (inputRefs.current[index] = r)}
              style={[
                styles.otpInput,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              keyboardType="number-pad"
              maxLength={1}
              value={otp[index]}
              onChangeText={(t) => handleChange(t, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              textAlign="center"
            />
          );
        })}
      </View>

      {/* VERIFY BUTTON */}
      <TouchableOpacity
        style={[styles.verifyButton, { backgroundColor: theme.colors.btnPrimaryBg }]}
        onPress={handleVerify}
      >
        <Text style={[styles.verifyText, { color: theme.colors.colorBgSurface }]}>
          {t("otp.verify")}
        </Text>
        <RemixIcon
          name="arrow-right-line"
          size={20}
          color={theme.colors.colorBgSurface}
        />
      </TouchableOpacity>

      {/* RESEND */}
      <View style={styles.resendWrapper}>
        {timer > 0 ? (
          <Text style={{ color: theme.colors.colorTextSecondary }}>
            {timer} {t("otp.resendAfter")}{" "}
            <Text style={{ color: theme.colors.colorPrimary700, fontWeight: "700" }}>
              {t("otp.resendOtp")}
            </Text>
          </Text>
        ) : (
          <Text style={{ color: theme.colors.colorTextSecondary }}>
            30 {t("otp.resendAfter")}{" "}
            <Text
              onPress={handleResend}
              style={{
                color: theme.colors.colorPrimary700,
                fontWeight: "700",
                textDecorationLine: "underline",
              }}
            >
              {t("otp.resendOtp")}
            </Text>
          </Text>
        )}
      </View>
    </SafeAreaView>
  );
}

/* ---------------- STYLES ---------------- */

const BOX_SIZE = 52;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  header: {
    marginTop: 24,
  },
  headingHindi: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 20,
  },
  otpRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 40,
    alignItems: "center",
  },
  otpInput: {
    width: BOX_SIZE,
    height: BOX_SIZE,
    borderWidth: 1,
    borderRadius: 12,
    marginHorizontal: 4,
    fontSize: 20,
    fontWeight: "600",
  },
  hyphen: {
    fontSize: 26,
    marginHorizontal: 6,
    fontWeight: "600",
  },
  verifyButton: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 28,
    marginTop: 40,
    alignItems: "center",
  },
  verifyText: {
    fontSize: 16,
    fontWeight: "700",
    marginRight: 8,
  },
  resendWrapper: {
    marginTop: 32,
    alignItems: "center",
  },
  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#E5F4EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
});
