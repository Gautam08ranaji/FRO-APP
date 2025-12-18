import ConfirmationAlert from "@/components/reusables/ConfirmationAlert";
import { logout } from "@/features/auth/authSlice";
import { logoutUser } from "@/features/auth/logoutApi";
import { RootState } from "@/store";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { useSelector } from "react-redux";

type AvailabilityStatus =
  | "available"
  | "busy"
  | "in_meeting"
  | "unavailable";

export default function ProfileScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
    const authState = useAppSelector((state) => state.auth);
      const dispatch = useAppDispatch();
  
  
    const antiforgeryToken = useSelector(
      (state: RootState) => state.antiForgery.antiforgeryToken
    );

  const [showAlert, setShowAlert] = useState(false);
  const [showAvailability, setShowAvailability] = useState(false);
  const [availability, setAvailability] =
    useState<AvailabilityStatus>("available");


       const logOutApi = async () => {
        try {
          const response = await logoutUser(
            String(authState.userId),
            String(authState.token),
            String(antiforgeryToken)
          );
    
          console.log("Logout API response:", response);
    
          dispatch(logout());
          router.replace("/login");
        } catch (error: any) {
          console.error("Logout failed:", error.message);
        }
      };
    

  const availabilityOptions = [
    {
      key: "available" as AvailabilityStatus,
      label: "Available",
      color: theme.colors.colorSuccess600,
      icon: "checkbox-circle-line",
    },
    {
      key: "busy" as AvailabilityStatus,
      label: "Busy",
      color: theme.colors.colorWarning600,
      icon: "time-line",
    },
    {
      key: "in_meeting" as AvailabilityStatus,
      label: "In Meeting",
      color: theme.colors.validationInfoText,
      icon: "group-line",
    },
    {
      key: "unavailable" as AvailabilityStatus,
      label: "Unavailable",
      color: theme.colors.colorError600,
      icon: "close-circle-line",
    },
  ];

  const selectedAvailability = availabilityOptions.find(
    a => a.key === availability
  );

  const renderItem = (
    label: string,
    icon: string,
    onPress: () => void,
    iconColor?: string
  ) => (
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
            color={iconColor || theme.colors.colorPrimary600}
          />
        </View>

        <Text
          style={[
            styles.itemText,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          {label}
        </Text>
      </View>

      <RemixIcon
        name="arrow-right-s-line"
        size={26}
        color={theme.colors.colorPrimary600}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.colorBgSurface },
      ]}
    >
      {/* ================= HEADER ================= */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.colorPrimary600 },
        ]}
      >
        <View
          style={[
            styles.avatarContainer,
            { backgroundColor: theme.colors.colorBgSurface },
          ]}
        >
          <RemixIcon
            name="user-3-line"
            size={38}
            color={theme.colors.colorPrimary600}
          />
        </View>

        <Text style={[styles.name, { color: theme.colors.colorBgPage }]}>
          {t("profile.name")}
        </Text>
        <Text style={[styles.code, { color: theme.colors.colorBgPage }]}>
          {t("profile.code")}
        </Text>
        <Text style={[styles.role, { color: theme.colors.colorBgPage }]}>
          {t("profile.role")}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Availability Dropdown Card ===== */}
        <View>
          <TouchableOpacity
            onPress={() => setShowAvailability(!showAvailability)}
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
                  name="user-settings-line"
                  size={26}
                  color={selectedAvailability?.color}
                />
              </View>

              <View>
                <Text
                  style={[
                    styles.itemText,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Availability
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    marginTop: 2,
                    color: selectedAvailability?.color,
                  }}
                >
                  {selectedAvailability?.label}
                </Text>
              </View>
            </View>

            <RemixIcon
              name={
                showAvailability
                  ? "arrow-up-s-line"
                  : "arrow-down-s-line"
              }
              size={26}
              color={theme.colors.colorPrimary600}
            />
          </TouchableOpacity>

          {showAvailability && (
            <View
              style={{
                marginTop: -8,
                marginBottom: 12,
                backgroundColor: theme.colors.colorBgPage,
                borderRadius: 12,
                elevation: 3,
                overflow: "hidden",
              }}
            >
              {availabilityOptions.map(option => (
                <TouchableOpacity
                  key={option.key}
                  onPress={() => {
                    setAvailability(option.key);
                    setShowAvailability(false);
                  }}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    padding: 14,
                    borderBottomWidth: 0.5,
                    borderColor: theme.colors.colorBorder,
                  }}
                >
                  <RemixIcon
                    name={option.icon as any}
                    size={22}
                    color={option.color}
                  />
                  <Text
                    style={{
                      fontSize: 15,
                      color: theme.colors.colorTextPrimary,
                    }}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {renderItem(
          t("profile.menuOfficerDetails"),
          "user-settings-line",
          () => router.push("/profileDetails"),
          theme.colors.validationInfoText
        )}

        {renderItem(
          "Your Performance",
          "bar-chart-line",
          () => router.push("/(fro)/(profile)/teamOverView"),
          theme.colors.colorWarning400
        )}

        {renderItem(
          t("profile.menuWorkArea"),
          "map-pin-line",
          () => router.push("/location"),
          theme.colors.colorPrimary600
        )}

        {renderItem(
          t("profile.menuLanguage"),
          "translate-2",
          () => router.push("/languageSelect"),
          theme.colors.validationInfoText
        )}

        {renderItem(
          t("profile.menuSettings"),
          "settings-3-line",
          () => router.push("/setting"),
          theme.colors.colorError400
        )}

        {renderItem(
          t("profile.menuChangePassword"),
          "lock-password-line",
          () => router.push("/changePassword"),
          theme.colors.colorError600
        )}

        {/* ===== Logout ===== */}
        <TouchableOpacity
          onPress={() => setShowAlert(true)}
          style={[
            styles.logoutBtn,
            { backgroundColor: theme.colors.colorError100 },
          ]}
        >
          <View style={{ flexDirection: "row", gap: 10 }}>
            <RemixIcon
              name="login-box-line"
              size={26}
              color={theme.colors.colorError600}
            />
            <Text
              style={[
                styles.logoutText,
                { color: theme.colors.colorError600 },
              ]}
            >
              {t("profile.logout")}
            </Text>
          </View>
        </TouchableOpacity>

        <ConfirmationAlert
          visible={showAlert}
          icon="login-box-line"
          title={t("profile.logoutTitle")}
          description={t("profile.logoutDescription")}
          confirmText={t("profile.logoutConfirm")}
          cancelText={t("profile.logoutCancel")}
          onConfirm={() => {
            setShowAlert(false)
            logOutApi()
          }}
          onCancel={() => setShowAlert(false)}
          confirmColor={theme.colors.colorPrimary600}
          cancelColor={theme.colors.colorBgPage}
          subtitleColor={theme.colors.colorTextSecondary}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

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

  name: { fontSize: 20, fontWeight: "600", marginTop: 5 },
  code: { fontSize: 14, marginTop: 2 },
  role: { fontSize: 14, marginTop: 2 },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },

  itemText: { fontSize: 16 },

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
