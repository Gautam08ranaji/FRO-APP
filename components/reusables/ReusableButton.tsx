// components/ReusableButton.tsx
import { useTheme } from "@/theme/ThemeContext"; // 🌿 Sahara Theme System
import { Href, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

interface ReusableButtonProps {
  title: string; // Will be translated automatically
  route?: Href;
  onPress?: () => void;
  containerStyle?: any;
  textStyle?: any;
}

const ReusableButton: React.FC<ReusableButtonProps> = ({
  title,
  route,
  onPress,
  containerStyle,
  textStyle,
}) => {
  const router = useRouter();
  const { t } = useTranslation(); // 🌍 i18n translate
  const { theme } = useTheme(); // 🎨 get Sahara theme

  const handlePress = () => {
    if (route) router.push(route);
    if (onPress) onPress();
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={[
        styles.button,
        { backgroundColor: theme.colors.btnPrimaryBg }, // 🎨 theme color
        containerStyle,
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.text,
          theme.typography.fontButtonLarge, // 🎨 theme font
          { color: theme.colors.btnPrimaryText }, // 🎨 theme text
          textStyle,
        ]}
      >
        {t(title)} {/* 🌍 auto translate */}
      </Text>
    </TouchableOpacity>
  );
};

export default ReusableButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    elevation: 3,
    width: "100%",
  },
  text: {
    textAlign: "center",
  },
});
