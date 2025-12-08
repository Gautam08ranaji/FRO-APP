import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function SelectRoleScreen() {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      {/* ✅ TOP HEADER */}
      <View
        style={[
          styles.header,
          { backgroundColor: theme.colors.colorPrimary600 },
        ]}
      >
        <Text style={styles.headerTitle}>Select Your Role</Text>
        <Text style={styles.headerSubtitle}>
          Choose your designation to continue
        </Text>
      </View>

      {/* ✅ ROLE CARDS */}
      <View style={styles.body}>
        {/* ✅ FRO CARD */}
        <TouchableOpacity
          style={[
            styles.roleCard,
            { borderColor: theme.colors.colorPrimary600 },
          ]}
          onPress={() => router.push("/(tabs)/(dashboard)")}
        >
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: "#e3f2fd" },
              ]}
            >
              <RemixIcon name="user-3-line" size={22} color="#2563eb" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.roleTitle}>Field Response Officer</Text>
              <Text style={styles.roleDesc}>
                Handle cases and provide field support
              </Text>
            </View>

            <RemixIcon
              name="arrow-right-s-line"
              size={22}
              color="#9ca3af"
            />
          </View>

          <View style={styles.metaRow}>
            <MetaItem label="Role" value="FRO" />
            <MetaItem label="Access" value="Zone" />
            <MetaItem label="Type" value="Officer" />
          </View>
        </TouchableOpacity>

        {/* ✅ FRL CARD */}
        <TouchableOpacity
          style={[
            styles.roleCard,
            { borderColor: theme.colors.colorPrimary600 },
          ]}
          onPress={() => router.push("/(frl)/(dashboard)")}
        >
          <View style={styles.cardTopRow}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: "#f3e8ff" },
              ]}
            >
              <RemixIcon name="shield-user-line" size={22} color="#7c3aed" />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={styles.roleTitle}>Field Response Leader</Text>
              <Text style={styles.roleDesc}>
                Manage team and monitor operations
              </Text>
            </View>

            <RemixIcon
              name="arrow-right-s-line"
              size={22}
              color="#9ca3af"
            />
          </View>

          <View style={styles.metaRow}>
            <MetaItem label="Role" value="FRL" />
            <MetaItem label="Access" value="Zone" />
            <MetaItem label="Type" value="Leader" />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* ---------------- SMALL META COMPONENT ---------------- */

const MetaItem = ({ label, value }: any) => (
  <View style={styles.metaItem}>
    <Text style={styles.metaLabel}>{label}</Text>
    <Text style={styles.metaValue}>{value}</Text>
  </View>
);

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  /* Header */

  header: {
    paddingTop: 48,
    paddingBottom: 18,
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    alignItems: "center",
  },

  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "800",
  },

  headerSubtitle: {
    color: "#e5e7eb",
    fontSize: 12,
    marginTop: 4,
  },

  /* Body */

  body: {
    padding: 16,
  },

  roleCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    marginBottom: 16,
  },

  cardTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  roleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  roleDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  /* Meta Info */

  metaRow: {
    flexDirection: "row",
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
    justifyContent: "space-between",
  },

  metaItem: {
    alignItems: "center",
    flex: 1,
  },

  metaLabel: {
    fontSize: 11,
    color: "#6b7280",
  },

  metaValue: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 2,
    color: "#111827",
  },
});
