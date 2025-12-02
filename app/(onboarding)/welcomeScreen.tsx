import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

type Props = {
  onContinue?: () => void;
  title?: string;
  subtitle?: string;
};

export default function OtpSuccessScreen({
  onContinue,
  title,
  subtitle,
}: Props) {
  const { theme } = useTheme();
  const router = useRouter();
  const { width, height } = useWindowDimensions();

  // Responsive circle & tick size
  const circleSize = Math.min(width, height) * 0.22;
  const checkFontSize = circleSize * 0.46;

  const handleContinue = () => {
    if (onContinue) return onContinue();
    router.push("/(onboarding)/login");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        { backgroundColor: theme.colors.colorBgPage, paddingHorizontal: width * 0.06 },
      ]}
    >
      <View style={styles.flexCenter}>
        <View style={[styles.cardWrapper, { maxWidth: 520 }]}>

          {/* Success Circle */}
          <View
            style={[
              styles.circle,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: theme.colors.btnPrimaryBg + "22",
              },
            ]}
          >
            <Text
              style={{
                fontSize: checkFontSize,
                color: theme.colors.btnPrimaryBg,
                fontWeight: "bold",
              }}
            >
              ✓
            </Text>
          </View>

          {/* Title */}
          <Text
            style={[
              theme.typography.fontH2,
              styles.title,
              { color: theme.colors.btnPrimaryBg ,paddingHorizontal:1 },
            ]}
          >
            {title ?? "स्वागत है, फील्ड रिस्पॉन्स ऑफिसर"}
          </Text>

          {/* Subtitle */}
          <Text
            style={[
              theme.typography.fontBody,
              styles.subtitle,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {subtitle ??
              "आपको सौंपे गए मामलों को देखने, अपडेट करने और सहायता प्रदान करने के लिए इस ऐप का उपयोग किया जाता है।"}
          </Text>

          {/* Primary Button */}
          <TouchableOpacity
            onPress={handleContinue}
            style={[
              styles.primaryButton,
              { backgroundColor: theme.colors.btnPrimaryBg },
            ]}
          >
            <Text
              style={[
                theme.typography.fontButton,
                { color: theme.colors.btnPrimaryText ,paddingHorizontal:1},
              ]}
            >
              लॉगिन करें
            </Text>
          </TouchableOpacity>

          {/* Bottom Link */}
          <TouchableOpacity style={{ marginTop: 28 }}>
            <Text
              style={[
                theme.typography.fontLink,
                { color: theme.colors.btnPrimaryBg, textAlign: "center" },
              ]}
            >
              ऐप के बारे में जानें
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 20,
  },
  flexCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardWrapper: {
    alignItems: "center",
    paddingVertical: 24,
    width: "100%",
  },
  circle: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    marginTop: 20,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 12,
    textAlign: "center",
    paddingHorizontal: 8,
  },
  primaryButton: {
    width: "100%",
    alignItems: "center",
    paddingVertical: 15,
    borderRadius: 10,
    marginTop: 20,
  },
});
