import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  ScrollView,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

interface BodyLayoutProps {
  type: "dashboard" | "screen";
  screenName?: string;
  children: React.ReactNode;

  /** NEW — accept external style */
  scrollViewStyle?: StyleProp<ViewStyle>;
  scrollContentStyle?: StyleProp<ViewStyle>;
}

export default function BodyLayout({
  type,
  screenName,
  children,
  scrollViewStyle,
  scrollContentStyle,
}: BodyLayoutProps) {
  const { theme } = useTheme();
  const router = useRouter();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.colors.background }]}
    >
      {type === "dashboard" ? (
        <View
          style={[
            styles.dashboardHeader,
            { backgroundColor: theme.colors.primary },
          ]}
        >
          {/* TOP */}
          <View style={styles.topRow}>
            <View>
              <Text
                style={[
                  theme.typography.fontH2,
                  { color: "#fff", paddingHorizontal: 1 },
                ]}
              >
                नमस्ते, राजेश जी
              </Text>

              <Text
                style={[
                  theme.typography.fontBodySmall,
                  styles.subId,
                  { color: "#d9f6f2", fontSize: width * 0.035 },
                ]}
              >
                FRO-14567-001
              </Text>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => {
                  router.push("/notification");
                }}
              >
                <RemixIcon name="notification-line" size={22} color="#fff" />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.iconCircle}
                onPress={() => {
                  router.push("/escalation");
                }}
              >
                <RemixIcon name="alert-line" size={22} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.iconCircle}>
                <RemixIcon name="phone-line" size={22} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>

          {/* BOTTOM */}
          <View
            style={[styles.bottomSection, { backgroundColor: "#079f8dff" }]}
          >
            <View style={styles.row}>
              <Text
                style={[
                  theme.typography.fontBody,
                  { color: theme.colors.colorTextInverse },
                ]}
              >
                आज की ड्यूटी
              </Text>

              <Text
                style={[
                  theme.typography.fontBody,
                  { color: theme.colors.card, paddingHorizontal: 1 },
                ]}
              >
                कुल मामले
              </Text>
            </View>

            <View style={styles.row}>
              <Text
                style={[
                  theme.typography.fontH4,
                  { color: theme.colors.colorTextInverse },
                ]}
              >
                12
              </Text>

              <Text
                style={[
                  theme.typography.fontH4,
                  { color: theme.colors.colorTextInverse },
                ]}
              >
                04
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.dashboardHeader,
            {
              backgroundColor: theme.colors.primary,
              flexDirection: "row",
              paddingVertical: 40,
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <RemixIcon
              name="arrow-left-line"
              size={26}
              color={theme.colors.colorBgSurface}
            />
          </TouchableOpacity>

          <Text
            style={[
              theme.typography.fontH3,
              styles.screenTitle,
              {
                color: theme.colors.colorBgSurface,
                fontSize: width * 0.05,
                paddingHorizontal: 1,
              },
            ]}
          >
            {screenName}
          </Text>
        </View>
      )}

      {/* BODY */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[styles.bodyContainer, scrollViewStyle]} // ⬅️ external style merged
        contentContainerStyle={[
          styles.contentPadding,
          scrollContentStyle, // ⬅️ external style merged
        ]}
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  dashboardHeader: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 3,
    flexDirection: "column",
    gap: 16,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subId: {
    marginTop: 2,
  },

  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  iconCircle: {
    backgroundColor: "rgba(255,255,255,0.15)",
    padding: 8,
    borderRadius: 20,
    position: "relative",
  },

  badge: {
    position: "absolute",
    top: -6,
    right: -8,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },

  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },

  bottomSection: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },

  screenTitle: {
    fontWeight: "700",
    marginLeft: 10,
  },

  bodyContainer: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    marginTop: 10,
  },

  contentPadding: {
    paddingBottom: 60,
  },
});
