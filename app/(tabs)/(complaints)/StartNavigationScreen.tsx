import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { JSX } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RemixIcon, { IconName } from "react-native-remix-icon";

export default function StartNavigationScreen(): JSX.Element {
  const { theme } = useTheme();
  const colors = theme.colors;

  return (
    <BodyLayout
      type="screen"
      screenName="लोकेशन पर जाएँ"
      scrollContentStyle={{ paddingHorizontal: 0 }}
    >
      {/* MAP PREVIEW */}
      <View
        style={[
          styles.mapBox,
          {
            backgroundColor: colors.btnPrimaryBg + "22", // 13% transparent
            borderColor: colors.colorBorder,
          },
        ]}
      >
        <RemixIcon
          name={"map-pin-line" as IconName}
          size={40}
          color={colors.colorPrimary500}
        />
      </View>

      {/* DETAILS CARD */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.colorBgSurface,
            borderColor: colors.colorBorder,
          },
        ]}
      >
        <Text style={[styles.name, { color: colors.colorTextPrimary }]}>
          रामलाल शर्मा
        </Text>

        {/* Distance */}
        <View style={styles.row}>
          <RemixIcon
            name={"map-pin-2-line" as IconName}
            size={18}
            color={colors.colorTextSecondary}
          />
          <Text style={[styles.rowText, { color: colors.colorTextSecondary }]}>
            दूरी: 2.3 km
          </Text>
        </View>

        {/* ETA */}
        <View style={styles.row}>
          <RemixIcon
            name={"navigation-line" as IconName}
            size={18}
            color={colors.colorTextSecondary}
          />
          <Text style={[styles.rowText, { color: colors.colorTextSecondary }]}>
            अनुमानित समय: 8 मिनट
          </Text>
        </View>

        {/* Address */}
        <Text style={[styles.label, { color: colors.colorTextSecondary }]}>
          पता:
        </Text>

        <Text style={[styles.address, { color: colors.colorTextPrimary }]}>
          123, गांधी नगर, सेक्टर 5, मुंबई, महाराष्ट्र - 400001
        </Text>
      </View>

      {/* OPEN GOOGLE MAPS */}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.btnPrimaryBg }]}
        onPress={()=>{
          router.push('/StatusUpdateScreen')
        }}
      >
        <RemixIcon
          name={"navigation-fill" as IconName}
          size={18}
          color={colors.btnPrimaryText}
          style={{ marginRight: 6 }}
        />
        <Text style={[styles.primaryBtnText, { color: colors.btnPrimaryText }]}>
          Google Maps में खोलें
        </Text>
      </TouchableOpacity>

      {/* I AM ON THE WAY */}
      <TouchableOpacity
        style={[
          styles.secondaryBtn,
          {
            borderColor: colors.btnSecondaryBorder,
            backgroundColor: colors.colorBgSurface,
          },
        ]}
      >
        <Text
          style={[styles.secondaryBtnText, { color: colors.colorPrimary500 }]}
        >
          मैं रास्ते में हूँ
        </Text>
      </TouchableOpacity>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  mapBox: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  rowText: {
    marginLeft: 6,
    fontSize: 14,
  },

  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "500",
  },

  address: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },

  primaryBtn: {
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },

  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },

  secondaryBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },

  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
