import BodyLayout from "@/components/layout/BodyLayout";
import { useLocation } from "@/hooks/LocationContext";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import { Alert, Linking, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function SettingsScreen() {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const { hasPermission, requestPermission, revokePermission } = useLocation();

  const [notifications, setNotifications] = useState(true);
  const [locationToggle, setLocationToggle] = useState(hasPermission);
  const [textSize, setTextSize] = useState("medium");

  useEffect(() => {
    setLocationToggle(hasPermission); // sync with context
  }, [hasPermission]);

  const textSizeOptions = [
    { key: "small", label: "छोटा" },
    { key: "medium", label: "मध्यम" },
    { key: "large", label: "बड़ा" }
  ];

  // 🔥 MAIN LOCATION TOGGLE HANDLER
  const handleLocationToggle = async (value: boolean) => {
    if (value) {
      const granted = await requestPermission();
      setLocationToggle(granted);
    } else {
      revokePermission();
      setLocationToggle(false);

      Alert.alert(
        "लोकेशन बंद करें",
        "लोकेशन परमिशन बंद करने के लिए ऐप सेटिंग्स खोलें।",
        [
          { text: "रद्द करें", style: "cancel" },
          {
            text: "सेटिंग्स खोलें",
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
    }
  };

  return (
    <BodyLayout type="screen" screenName="सेटिंग्स">
      <View style={[styles.container, { backgroundColor: theme.colors.colorBgSurface }]}>

        {/* NOTIFICATION */}
        <View style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}>
          <View style={styles.rowBetween}>
            <View style={styles.leftRow}>
              <View style={[styles.iconBox, { backgroundColor: "#E8F3FF" }]}>
                <RemixIcon name="notification-3-line" size={20} color="#147AD6" />
              </View>

              <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
                नोटिफिकेशन
              </Text>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ true: theme.colors.colorPrimary600, false: "#ccc" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* LOCATION PERMISSION */}
        <View style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}>
          <View style={styles.rowBetween}>
            <View style={styles.leftRow}>
              <View style={[styles.iconBox, { backgroundColor: "#E9F7EC" }]}>
                <RemixIcon name="map-pin-line" size={20} color="#1C9A52" />
              </View>

              <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
                लोकेशन अनुमति
              </Text>
            </View>

            <Switch
              value={locationToggle}
              onValueChange={handleLocationToggle}
              trackColor={{ true: theme.colors.colorPrimary600, false: "#ccc" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* THEME */}
        <View style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}>
          <View style={styles.rowBetween}>
            <View style={styles.leftRow}>
              <View style={[styles.iconBox, { backgroundColor: "#E9F7EC" }]}>
                <RemixIcon name="moon-line" size={20} color="#1C9A52" />
              </View>

              <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
                थीम बदलें
              </Text>
            </View>

            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ true: theme.colors.colorPrimary600, false: "#ccc" }}
              thumbColor="#fff"
            />
          </View>
        </View>

        {/* TEXT SIZE */}
        <View style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}>
          <View style={styles.rowBetween}>
            <View style={styles.leftRow}>
              <View style={[styles.iconBox, { backgroundColor: "#EBF3FB" }]}>
                <RemixIcon name="text" size={20} color="#0F6DB4" />
              </View>

              <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
                टेक्स्ट साइज़
              </Text>
            </View>
          </View>

          <View style={styles.textSizeRow}>
            {textSizeOptions.map((item) => (
              <TouchableOpacity
                key={item.key}
                onPress={() => setTextSize(item.key)}
                style={[
                  styles.sizeBox,
                  {
                    backgroundColor:
                      textSize === item.key ? theme.colors.colorPrimary600 : theme.colors.colorPrimary50,
                  },
                ]}
              >
                <Text
                  style={{
                    color:
                      textSize === item.key
                        ? theme.colors.colorBgPage
                        : theme.colors.colorTextSecondary,
                    fontWeight: "600",
                  }}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* HELP */}
        <View style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}>
          <View style={styles.leftRow}>
            <View style={[styles.iconBox, { backgroundColor: "#FFF2E8" }]}>
              <RemixIcon name="question-line" size={20} color="#E6742B" />
            </View>

            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              हेल्प & सपोर्ट
            </Text>
          </View>
        </View>

      </View>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, gap: 16 },
  card: { padding: 16, borderRadius: 12, elevation: 2, gap: 12 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  leftRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  label: { fontSize: 16, fontWeight: "600" },
  textSizeRow: { flexDirection: "row", gap: 10, marginTop: 8, marginLeft: 48 },
  sizeBox: { paddingVertical: 6, paddingHorizontal: 20, borderRadius: 8 },
});
