import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function EndRequestConfirmation() {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.colorBgPage },
      ]}
    >
      {/* Title */}
      <Text style={[styles.title, { color: theme.colors.btnPrimaryBg }]}>
        FRO टीम से मदद माँगें
      </Text>

      {/* Description */}
      <Text
        style={[
          styles.description,
          { color: theme.colors.colorTextSecondary },
        ]}
      >
        भविष्य में किसी भी तरह की मदद के लिए हमारी टीम से बिना हिचकिचाए
        संपर्क करें। कृपया बताएं, यह मदद अस्थायी है या स्थायी, और आप आगे की
        मदद और समर्थन के लिए हमारी टीम से जुड़ सकते हैं।
      </Text>

      {/* Buttons */}
      <View style={styles.buttonWrapper}>
        {/* Confirm */}
        <TouchableOpacity
          style={[
            styles.buttonPrimary,
            { backgroundColor: theme.colors.btnPrimaryBg },
          ]}
          onPress={() => router.push("/(tabs)/(dashboard)")}
        >
          <Text style={[styles.buttonText, { color: "#fff" }]}>
            हमारी टीम से मदद माँगें
          </Text>
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={[
            styles.buttonSecondary,
            { borderColor: theme.colors.border, backgroundColor: theme.colors.colorBgPage },
          ]}
          onPress={() => router.push("/(tabs)/(dashboard)")}
        >
          <Text style={[styles.buttonText, { color: theme.colors.btnPrimaryBg }]}>
            मुख्य स्क्रीन पर वापस जाएँ
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 16,
  },
  description: {
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 30,
  },
  buttonWrapper: {
    width: "100%",
    gap: 14,
  },
  buttonPrimary: {
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonSecondary: {
    paddingVertical: 16,
    borderWidth: 1.3,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
