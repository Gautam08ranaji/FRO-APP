import { useTheme } from "@/theme/ThemeContext";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  ColorValue,
  Platform,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type CardProps = {
  title?: string;
  children?: React.ReactNode;
  backgroundColor?: string;
  gradientColors?: [ColorValue, ColorValue, ...ColorValue[]];
  shadowColor?: string;
  style?: StyleProp<ViewStyle>;
  cardStyle?: StyleProp<ViewStyle>;
  onPress?: () => void; // ✅ onPress support added
};

export default function Card({
  title,
  children,
  backgroundColor,
  gradientColors,
  shadowColor = "#000",
  style,
  cardStyle,
  onPress,
}: CardProps) {
  const { theme } = useTheme();

  // Select wrapper: TouchableOpacity or View
  const Wrapper = onPress ? TouchableOpacity : View;

  const cardContent = (
    <>
      {title && (
        <Text style={[styles.title, { color: theme.colors.inputText }]}>
          {title}
        </Text>
      )}
      {children}
    </>
  );

  return (
    <Wrapper
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.wrapper, { shadowColor }, style]}
    >
      {gradientColors ? (
        <LinearGradient
          colors={gradientColors}
          style={[styles.card, cardStyle]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {cardContent}
        </LinearGradient>
      ) : (
        <View
          style={[
            styles.card,
            { backgroundColor: backgroundColor || theme.colors.btnSecondaryBg },
            cardStyle,
          ]}
        >
          {cardContent}
        </View>
      )}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    maxWidth: 360,
    alignSelf: "center",
    borderRadius: 20,
    marginTop: 15,
    overflow: "hidden",
    elevation: 4,

    ...Platform.select({
      ios: {
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  card: {
    borderRadius: 20,
    padding: 16,
    minHeight: 220,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
});
