import { useTheme } from "@/theme/ThemeContext";
import React, { PropsWithChildren } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import TextTicker from "react-native-text-ticker";

type BodyLayoutProps = PropsWithChildren<{
  containerStyle?: ViewStyle;
  headerStyle?: ViewStyle;
  marqueeContainerStyle?: ViewStyle;
  marqueeTextStyle?: TextStyle;
  scrollContentStyle?: ViewStyle;
}>;

export default function BodyLayout({
  children,
  containerStyle,
  headerStyle,
  marqueeContainerStyle,
  marqueeTextStyle,
  scrollContentStyle
}: BodyLayoutProps) {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors.background },
        containerStyle,
      ]}
    >
      {/* HEADER */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.colorPrimary50 },
          headerStyle,
        ]}
      >
        <Image
          source={require("@/assets/images/appIcon.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity
          style={[
            styles.emergencyBtn,
            { backgroundColor: theme.colors.btnSosBg },
          ]}
        >
          <RemixIcon name="alarm-warning-line" size={18} color="#fff" />
          <Text style={styles.emergencyText}>Emergency</Text>
        </TouchableOpacity>
      </View>

      {/* MARQUEE TEXT */}
      <View
        style={[
          styles.marqueeContainer,
          { backgroundColor: theme.colors.colorPrimary50 },
          marqueeContainerStyle,
        ]}
      >
        <TextTicker
          style={[
            styles.marqueeText,
            { color: theme.colors.colorPrimary700 },
            marqueeTextStyle,
          ]}
          duration={8000}
          loop
          bounce={false}
          repeatSpacer={50}
          marqueeDelay={1000}
        >
          ⚠️ किसी भी आपातस्थिति में आपातकाल बटन दबाएँ या सीधे 14567 पर कॉल करें।
        </TextTicker>
      </View>

      {/* CONTENT */}
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { backgroundColor: theme.colors.colorBgPage },
          scrollContentStyle,
        ]}
      >
        {children}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 0,
  },

  logo: { width: 140, height: 100 },

  emergencyBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 30,
    borderRadius: 8,
  },

  emergencyText: {
    color: "#fff",
    marginLeft: 6,
    fontWeight: "600",
  },

  marqueeContainer: {
    paddingHorizontal: 10,
  },

  marqueeText: {
    fontSize: 14,
    fontWeight: "500",
  },

  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
});
