import ReusableButton from "@/components/reusables/ReusableButton";
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

  const [showSuccess, setShowSuccess] = useState(false);  // ✅ NEW

  // Accept TextInput OR null
  const inputRefs = useRef<(TextInput | null)[]>([]);

  /* ---------------- TIMER ---------------- */
  useEffect(() => {
    if (timer === 0) return;
    const id = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(id);
  }, [timer]);

//   /* ---------------- SUCCESS AUTO-REDIRECT ---------------- */
//   useEffect(() => {
//     if (showSuccess) {
//       const timeout = setTimeout(() => {
//         router.push("/(tabs)/(profile)");
//       }, 1500);

//       return () => clearTimeout(timeout);
//     }
//   }, [showSuccess]);

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

    // TODO: Verify OTP with API before showing success
    setShowSuccess(true); // ✅ SHOW SUCCESS SCREEN
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(30);
  };

  /* ---------------- SUCCESS SCREEN ---------------- */
  if (showSuccess) {
    return (
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: theme.colors.colorBgPage, justifyContent: "center", alignItems: "center" },
        ]}
      >
        <View style={{ width: "100%", alignItems: "center", marginTop: -200 }}>
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
                marginTop: 20,
              },
            ]}
          >
            आपका नंबर सफलतापूर्वक सत्यापित हुआ।
          </Text>

          <ReusableButton title={"प्रोफ़ाइल पर वापस जाएँ"}
          onPress={()=>{
             router.push("/(tabs)/(profile)");
          }}
          />
        </View>
      </SafeAreaView>
    );
  }

  /* ---------------- MAIN OTP SCREEN ---------------- */
  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.colorBgPage }]}
    >
      {/* HEADER */}
      <View style={styles.header}>
        <Text
          style={[styles.headingHindi, { color: theme.colors.colorPrimary700 }]}
        >
          OTP दर्ज करें
        </Text>

        <Text
          style={[
            styles.headingEnglish,
            { color: theme.colors.colorPrimary700 },
          ]}
        >
          Enter the Code
        </Text>

        <Text
          style={[styles.subtitle, { color: theme.colors.colorTextSecondary }]}
        >
          हमने आपके पंजीकृत मोबाइल नंबर +91-9453416629 पर{"\n"}ओटीपी भेजा है।
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

        <Text style={[styles.hyphen, { color: theme.colors.colorTextTertiary }]}>
          -
        </Text>

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
        style={[
          styles.verifyButton,
          { backgroundColor: theme.colors.btnPrimaryBg },
        ]}
        onPress={handleVerify}
      >
        <Text
          style={[styles.verifyText, { color: theme.colors.btnPrimaryText }]}
        >
          सत्यापित करें
        </Text>
        <RemixIcon name="arrow-right-line" size={20} color="#FFFFFF" />
      </TouchableOpacity>

      {/* RESEND OTP */}
      <View style={styles.resendWrapper}>
        {timer > 0 ? (
          <Text style={{ color: theme.colors.colorTextSecondary }}>
            {timer} सेकंड बाद{" "}
            <Text
              style={{
                color: theme.colors.colorPrimary700,
                fontWeight: "700",
              }}
            >
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
    alignItems: "center",
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
    textAlign: "center",
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

  tickWrapper: {
    width: 110,
    height: 110,
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
});
