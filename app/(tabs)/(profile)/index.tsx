import ConfirmationAlert from "@/components/reusables/ConfirmationAlert";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [showAlert, setShowAlert] = useState(false);

  // -------------------------
  // Render Item Function
  // -------------------------
  const renderItem = (label: string, icon: string, onPress: () => void) => (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.item, { backgroundColor: theme.colors.colorBgPage }]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            padding: 10,
            borderRadius: 10,
            backgroundColor: theme.colors.colorBgSurface,
          }}
        >
          <RemixIcon
            name={icon as any}
            size={26}
            color={theme.colors.colorPrimary600}
          />
        </View>
        <Text style={[styles.itemText, { color: theme.colors.colorTextSecondary }]}>{label}</Text>
      </View>

      <RemixIcon
        name={"arrow-right-s-line" as any}
        size={26}
        color={theme.colors.colorPrimary600}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.colorBgSurface }]}
    >
      {/* ================= HEADER ================= */}
      <View style={[styles.header, { backgroundColor: theme.colors.colorPrimary600 }]}>
        <View style={[styles.avatarContainer, { backgroundColor: theme.colors.colorBgSurface }]}>
          <RemixIcon
            name="user-3-line"
            size={38}
            color={theme.colors.colorPrimary600}
          />
        </View>

        <Text style={[styles.name, { color: theme.colors.colorBgPage }]}>
          राजेश कुमार
        </Text>
        <Text style={[styles.code, { color: theme.colors.colorBgPage }]}>
          FRO-14567-001
        </Text>
        <Text style={[styles.role, { color: theme.colors.colorBgPage }]}>
          FRO - फील्ड रिस्पॉन्स ऑफिसर
        </Text>
      </View>

      {/* ================= BODY ================= */}
      <View style={styles.body}>
        {renderItem("अधिकारी विवरण", "user-settings-line", () =>
          router.push("/profileDetails")
        )}

        {renderItem(
          "कार्यक्षेत्र",
          "map-pin-line",
          () => router.push("/location")
          // console.log("कार्यक्षेत्र pressed")
        )}

        {renderItem("भाषा", "translate-2", () =>
          router.push("/languageSelect")
        )}

        {renderItem("सेटिंग्स", "settings-3-line", () =>
          router.push("/setting")
        )}

        {renderItem("पासवर्ड बदलें", "lock-password-line", () =>
          router.push("/changePassword")
        )}

        <TouchableOpacity
          onPress={() => setShowAlert(true)}
          style={[styles.logoutBtn, { backgroundColor: theme.colors.colorError100 }]}
        >
          <View style={{ flexDirection: "row", justifyContent: "center",gap:10 }}>
            <RemixIcon
              name={"login-box-line"}
              size={26}
              color={theme.colors.colorError600}
            />
            <Text
              style={[
                styles.logoutText,
                { color: theme.colors.colorError600 },
              ]}
            >
              लॉगआउट
            </Text>
          </View>
        </TouchableOpacity>

        <ConfirmationAlert
          visible={showAlert}
          icon="login-box-line"
          title={"क्या आप लॉगआउट करना चाहते हैं?"}
          description="आप अपने खाते से बाहर हो जाएंगे।"
          confirmText={"हाँ, लॉगआउट करें"}
          cancelText={"रद्द करें"}
          onConfirm={() => {
            setShowAlert(false);
            // router.push("/(tabs)/(dashboard)/confirmLocationScreen");
          }}
          onCancel={() => setShowAlert(false)}
          cancelColor={theme.colors.colorBgPage}
          subtitleColor={theme.colors.colorTextSecondary}
          confirmColor={theme.colors.colorPrimary600}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    paddingVertical: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: "center",
    elevation: 6,
  },

  avatarContainer: {
    width: 90,
    height: 90,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  name: {
    fontSize: 20,
    fontWeight: "600",
    marginTop: 5,
  },
  code: {
    fontSize: 14,
    marginTop: 2,
  },
  role: {
    fontSize: 14,
    marginTop: 2,
  },

  body: {
    padding: 20,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  itemText: {
    fontSize: 16,
  },

  logoutBtn: {
    marginTop: 15,
    padding: 18,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
