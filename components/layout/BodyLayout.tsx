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
  type: "dashboard" | "screen" | "frl"; // ✅ frl added
  screenName?: string;
  children: React.ReactNode;
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
      {type === "dashboard" || type === "frl" ? (
        <View
          style={[
            styles.dashboardHeader,
            { backgroundColor: theme.colors.colorPrimary600, paddingVertical: 24 },
          ]}
        >
          <View style={styles.topRow}>
            <View>
              <Text
                style={[
                  theme.typography.fontH2,
                  { color: theme.colors.colorBgPage, paddingHorizontal: 1 },
                ]}
              >
                नमस्ते, राजेश जी
              </Text>

              <Text
                style={[
                  theme.typography.fontBodySmall,
                  styles.subId,
                  { color: theme.colors.colorBgPage, fontSize: width * 0.035 },
                ]}
              >
                FRO-14567-001
              </Text>
            </View>

            <View style={styles.iconRow}>
              <TouchableOpacity
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.colors.colorBgSurface },
                ]}
                onPress={() => {
                  router.push("/notification");
                }}
              >
                <RemixIcon
                  name="notification-line"
                  size={22}
                  color={theme.colors.colorPrimary600}
                />
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.iconCircle,
                  { backgroundColor: theme.colors.colorBgSurface },
                ]}
                onPress={() => {
                  router.push("/escalation");
                }}
              >
                <RemixIcon
                  name="alert-line"
                  size={22}
                  color={theme.colors.colorPrimary600}
                />
              </TouchableOpacity>

              {/* ✅ Call icon hidden for frl */}
              {type !== "frl" && (
                <TouchableOpacity
                  style={[
                    styles.iconCircle,
                    { backgroundColor: theme.colors.colorBgSurface },
                  ]}
                >
                  <RemixIcon
                    name="phone-line"
                    size={22}
                    color={theme.colors.colorPrimary600}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* ✅ Bottom section hidden for frl */}
          {type !== "frl" && (
            <View
              style={[
                styles.bottomSection,
                { backgroundColor: theme.colors.colorPrimary50 },
              ]}
            >
              <View style={styles.row}>
                <Text
                  style={[
                    theme.typography.fontBody,
                    { color: theme.colors.colorPrimary600 },
                  ]}
                >
                  आज की ड्यूटी
                </Text>

                <Text
                  style={[
                    theme.typography.fontBody,
                    { color: theme.colors.colorPrimary600, paddingHorizontal: 1 },
                  ]}
                >
                  कुल मामले
                </Text>
              </View>

              <View style={styles.row}>
                <Text
                  style={[
                    theme.typography.fontH4,
                    { color: theme.colors.colorPrimary600 },
                  ]}
                >
                  12
                </Text>

                <Text
                  style={[
                    theme.typography.fontH4,
                    { color: theme.colors.colorPrimary600 },
                  ]}
                >
                  04
                </Text>
              </View>
            </View>
          )}
        </View>
      ) : (
        <View
          style={[
            styles.dashboardHeader,
            {
              backgroundColor: theme.colors.colorPrimary600,
              flexDirection: "row",
              paddingVertical: 20,
            },
          ]}
        >
          <TouchableOpacity onPress={() => router.back()}>
            <RemixIcon
              name="arrow-left-line"
              size={26}
              color={theme.colors.colorBgPage}
            />
          </TouchableOpacity>

          <Text
            style={[
              theme.typography.fontH3,
              styles.screenTitle,
              {
                color: theme.colors.colorBgPage,
                fontSize: width * 0.05,
                paddingHorizontal: 1,
              },
            ]}
          >
            {screenName}
          </Text>
        </View>
      )}

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          styles.bodyContainer,
          scrollViewStyle,
          { backgroundColor: theme.colors.colorBgSurface },
        ]}
        contentContainerStyle={[
          styles.contentPadding,
          scrollContentStyle,
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    elevation: 1,
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
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    padding: 16,
    marginTop: 10,
  },

  contentPadding: {
    paddingBottom: 60,
  },
});
