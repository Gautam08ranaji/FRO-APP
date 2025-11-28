import ReusableButton from "@/components/reusables/ReusableButton";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    Text,
    View,
    useWindowDimensions,
} from "react-native";

type Props = {
  /** Called when user taps the button. If omitted the screen will navigate to the profile tab. */
  onContinue?: () => void;
  /** Optional title to show on the main heading (in Hindi by default) */
  title?: string;
  /** Optional subtitle shown below the heading */
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

  // Responsive sizes based on screen dimensions
  const containerPadding = Math.max(16, Math.min(32, width * 0.06));
  const circleSize = Math.round(Math.min(width, height) * 0.22); // 22% of smaller axis
  const checkFontSize = Math.round(circleSize * 0.44); // checkmark size relative to circle
  const titleFontSize = Math.round(Math.min(22, width * 0.055));
  const subtitleFontSize = Math.round(Math.min(16, width * 0.038));

  const handleContinue = () => {
    if (onContinue) return onContinue();
    router.push("/(onboarding)/login");
  };

  return (
    <SafeAreaView
      style={[
        styles.safeArea,
        {
          backgroundColor: theme.colors.colorBgPage,
          paddingHorizontal: containerPadding,
        },
      ]}
    >
      <View style={styles.outerCenter}>
        <View
          style={[
            styles.inner,
            // keep items centered and constrained so the UI stays in the middle
            { maxWidth: 520, width: "100%" },
          ]}
        >
          <View
            style={[
              styles.tickWrapper,
              {
                width: circleSize,
                height: circleSize,
                borderRadius: circleSize / 2,
                backgroundColor: theme.colors.btnPrimaryBg + "22",
              },
            ]}
          >
            <Text
              style={[
                theme.typography.fontH1,
                { fontSize: checkFontSize, color: theme.colors.btnPrimaryBg },
              ]}
            >
              ✓
            </Text>
          </View>

          <Text
            style={[
              theme.typography.fontH2,
              styles.title,
              { color: theme.colors.btnPrimaryBg, fontSize: titleFontSize },
            ]}
          >
            {title ?? "स्वागत है, फील्ड रिस्पॉन्स ऑफिसर"}
          </Text>
          <Text
            style={[
              theme.typography.fontLink,
              styles.title,
              { color: theme.colors.colorTextSecondary,  },
            ]}
          >
            आपको सौंपे गए मामलों को देखने, अपडेट करने और सहायता प्रदान करने के
            लिए इस ऐप का उपयोग किया जाता है।{" "}
          </Text>


          <View style={{ width: "100%", marginTop: 28 }}>
            <ReusableButton
              title={"लॉगिन करें"}
              onPress={handleContinue}
            />
          </View>
          
        </View>
                 <Text
              style={[
                ,
                {
                  color: theme.colors.btnPrimaryBg,
                  fontSize: subtitleFontSize,
                },
              ]}
            >
              ऐप के बारे में जानें
            </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    paddingTop: 16,
  },
  outerCenter: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inner: {
    alignItems: "center",
    justifyContent: "center",
    // no negative margins — rely on flexbox centering
    paddingVertical: 24,
  },
  tickWrapper: {
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    textAlign: "center",
    marginTop: 20,
    
  },
  subtitle: {
    marginTop: 12,
    textAlign: "center",
  },
});
