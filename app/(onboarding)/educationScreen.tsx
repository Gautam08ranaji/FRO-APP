import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function SelectRoleScreen() {
  return (
    <View style={styles.container}>
      {/* ✅ HEADER */}
      <View style={styles.header}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>
          Choose how you want to continue
        </Text>
      </View>

      {/* ✅ ROLE OPTIONS */}
      <View style={styles.card}>
        {/* ✅ FRO */}
        <TouchableOpacity
          style={styles.roleBox}
          onPress={() => router.push("/(tabs)/(dashboard)")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#e0f2f1" }]}>
            <RemixIcon name="user-3-line" size={26} color="#00695c" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.roleTitle}>FRO Login</Text>
            <Text style={styles.roleDesc}>
              Field Response Officer
            </Text>
          </View>

          <RemixIcon name="arrow-right-s-line" size={24} color="#9ca3af" />
        </TouchableOpacity>

        {/* ✅ FRL */}
        <TouchableOpacity
          style={styles.roleBox}
          onPress={() => router.push("/(frl)/(dashboard)")}
        >
          <View style={[styles.iconCircle, { backgroundColor: "#e3f2fd" }]}>
            <RemixIcon name="shield-user-line" size={26} color="#1565c0" />
          </View>

          <View style={{ flex: 1 }}>
            <Text style={styles.roleTitle}>FRL Login</Text>
            <Text style={styles.roleDesc}>
              Field Response Leader
            </Text>
          </View>

          <RemixIcon name="arrow-right-s-line" size={24} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      {/* ✅ FOOTER TEXT */}
      <Text style={styles.footerText}>
        Please select the appropriate role to proceed
      </Text>
    </View>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
    padding: 20,
    justifyContent: "center",
  },

  header: {
    alignItems: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 6,
  },

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },

  roleBox: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    marginBottom: 12,
  },

  iconCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  roleTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  roleDesc: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 2,
  },

  footerText: {
    marginTop: 24,
    textAlign: "center",
    fontSize: 12,
    color: "#9ca3af",
  },
});
