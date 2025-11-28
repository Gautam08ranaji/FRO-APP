import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);

  // Accept TextInput OR null
  const inputRefs = useRef<(TextInput | null)[]>([]);

  /* ---------------- TIMER ---------------- */
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
    router.push('/(onboarding)/profile')
    // TODO: Verify OTP with API before navigating
    // Example: router.push("/(tabs)/(profile)");
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
    // TODO: trigger resend API call
  };

  /* ---------------- MAIN OTP SCREEN ---------------- */
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.colorBgPage }]}
    >
      {/* HEADER */}
      <View style={styles.iconWrapper}>
        <RemixIcon name="shield-line" size={28} color={theme.colors.btnPrimaryBg} />
      </View>

      <View style={styles.header}>
        <Text style={[styles.headingHindi, { color: theme.colors.colorPrimary700 }]}>
          OTP दर्ज करें
        </Text>

        <Text style={[styles.subtitle, { color: theme.colors.colorTextSecondary }]}>
          हमने 6-अंकों का OTP भेजा है +91-XXXXXXXXXX पर
        </Text>
      </View>

      {/* OTP INPUTS */}
      <View style={styles.otpRow}>
        {Array.from({ length: 3 }).map((_, index) => (
          <TextInput
            key={index}
            ref={(r) => {
              inputRefs.current[index] = r;
            }}
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
              ref={(r) => {
                inputRefs.current[index] = r;
              }}
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
        <Text style={[styles.verifyText, { color: theme.colors.btnPrimaryText }]}>
          सत्यापित करें
        </Text>
        <RemixIcon name="arrow-right-line" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* RESEND OTP */}
      <View style={styles.resendWrapper}>
        {timer > 0 ? (
          <Text style={{ color: theme.colors.colorTextSecondary }}>
            {timer} सेकंड बाद{" "}
            <Text style={{ color: theme.colors.colorPrimary700, fontWeight: "700" }}>
              फिर से OTP भेजें
            </Text>
          </Text>
        ) : (
          <Text style={{ color: theme.colors.colorTextSecondary }}>
            30 सेकंड बाद{" "}
            <Text
              onPress={handleResend}
              style={{
                color: theme.colors.colorPrimary700,
                fontWeight: "700",
                textDecorationLine: "underline",
              }}
            >
              फिर से OTP भेजें
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
  headingEnglish: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
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
