import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useMemo, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const FILTERS = ["All Alerts", "Urgent", "Case Alerts", "FRO Alerts"];

const ALERTS_DATA = [
  {
    id: 1,
    title: "High Priority Case - Unassigned",
    badge: "High",
    description:
      "Medical emergency case pending for 8 minutes. No FRO assigned yet.",
    time: "2 min ago",
    location: "Hazratganj, Lucknow",
    caseId: "Case TKT-14567-001",
    actionText: "Assign to FRO",
    type: "danger",
    category: "Case Alerts",
  },
  {
    id: 2,
    title: "FRO Late Check-in Alert",
    badge: "High",
    description:
      "Amit Sharma (FRO-003) has not checked in yet. Duty time started 45 min ago",
    time: "15 min ago",
    caseId: "FRO ID: FRO-003",
    actionText: "View FRO Profile",
    type: "danger",
    category: "FRO Alerts",
  },
  {
    id: 3,
    title: "TAT Breach Warning",
    badge: "Medium",
    description:
      "Case TKT-14567-015 approaching SLA deadline in 10 minutes",
    time: "5 min ago",
    location: "Ghazipur, Lucknow",
    caseId: "Case: TKT-14567-015",
    actionText: "Assign Now",
    type: "warning",
    category: "Case Alerts",
  },
  {
    id: 4,
    title: "Case Successfully Resolved",
    badge: "Low",
    description:
      "Priya Singh (FRO-002) marked case TKT-14567-024 as resolved",
    time: "10 min ago",
    caseId: "Case: TKT-14567-024",
    actionText: "Mark as Read",
    type: "info",
    outline: true,
    category: "Case Alerts",
  },
];

export default function AlertsScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("All Alerts");

  // ✅ FILTER LOGIC
  const filteredAlerts = useMemo(() => {
    if (activeTab === "All Alerts") return ALERTS_DATA;

    if (activeTab === "Urgent") {
      return ALERTS_DATA.filter((item) => item.badge === "High");
    }

    return ALERTS_DATA.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <BodyLayout type="screen" screenName="Alerts">
      {/* SUMMARY CARDS */}
      <View style={styles.summaryRow}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Urgent</Text>
          <Text style={styles.summaryValue}>03</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Action Needed</Text>
          <Text style={styles.summaryValue}>04</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Information</Text>
          <Text style={styles.summaryValue}>05</Text>
        </View>
      </View>

      {/* FILTER TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsRow}
      >
        {FILTERS.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab
                    ? theme.colors.colorPrimary600
                    : "transparent",
                borderColor: theme.colors.colorPrimary600,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,
                {
                  color:
                    activeTab === tab
                      ? "#fff"
                      : theme.colors.colorPrimary600,
                },
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ✅ ACTIVE FILTER RESULT */}
      <Text style={styles.activeFilterText}>
        Showing: {activeTab}
      </Text>

      {/* ✅ FILTERED ALERT LIST */}
      {filteredAlerts.map((alert) => (
        <AlertCard key={alert.id} {...alert} />
      ))}
    </BodyLayout>
  );
}

/* ---------------- ALERT CARD ---------------- */

const AlertCard = ({
  title,
  badge,
  description,
  time,
  location,
  caseId,
  actionText,
  type,
  outline = false,
}: any) => {
  const bgMap: any = {
    danger: "#fee2e2",
    warning: "#fff7ed",
    info: "#e0f2fe",
  };

  const badgeMap: any = {
    High: "#dc2626",
    Medium: "#f97316",
    Low: "#2563eb",
  };

  return (
    <View
      style={[
        styles.alertCard,
        { backgroundColor: bgMap[type], borderColor: badgeMap[badge] },
      ]}
    >
      <View style={styles.alertHeader}>
        <Text style={styles.alertTitle}>{title}</Text>
        <View
          style={[
            styles.badgePill,
            { backgroundColor: badgeMap[badge] },
          ]}
        >
          <Text style={styles.badgeText}>{badge}</Text>
        </View>
      </View>

      <Text style={styles.alertDesc}>{description}</Text>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <RemixIcon name="time-line" size={14} color="#64748b" />
          <Text style={styles.metaText}>{time}</Text>
        </View>

        {location && (
          <View style={styles.metaItem}>
            <RemixIcon name="map-pin-line" size={14} color="#64748b" />
            <Text style={styles.metaText}>{location}</Text>
          </View>
        )}
      </View>

      <View style={styles.caseBox}>
        <Text style={styles.caseText}>{caseId}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[
            styles.mainBtn,
            outline && {
              backgroundColor: "transparent",
              borderWidth: 1,
              borderColor: "#64748b",
            },
          ]}
        >
          <Text
            style={[
              styles.mainBtnText,
              outline && { color: "#475569" },
            ]}
          >
            {actionText}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.callIcon}>
          <RemixIcon name="phone-line" size={18} color="#0f766e" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  summaryRow: { flexDirection: "row", gap: 10 },

  summaryCard: {
    flex: 1,
    backgroundColor: "#e7f5f3",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#2E7D32",
  },

  summaryTitle: { fontSize: 12, color: "#475569" },
  summaryValue: { fontSize: 22, fontWeight: "700", marginTop: 4 },

  tabsRow: { marginBottom: 10, marginTop: 10 },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 10,
  },

  tabText: { fontSize: 13, fontWeight: "600" },

  activeFilterText: {
    fontSize: 12,
    color: "#475569",
    marginBottom: 6,
    fontWeight: "600",
  },

  alertCard: {
    borderRadius: 14,
    padding: 14,
    marginTop: 12,
    borderWidth: 1,
  },

  alertHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  alertTitle: { fontSize: 14, fontWeight: "600" },

  badgePill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },

  badgeText: { color: "#fff", fontSize: 12, fontWeight: "700" },

  alertDesc: { fontSize: 13, marginTop: 6, color: "#475569" },

  metaRow: { flexDirection: "row", marginTop: 10, gap: 20 },

  metaItem: { flexDirection: "row", alignItems: "center", gap: 5 },

  metaText: { fontSize: 12, color: "#64748b" },

  caseBox: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },

  caseText: { fontSize: 12, color: "#475569" },

  actionRow: { flexDirection: "row", marginTop: 12, gap: 10 },

  mainBtn: {
    flex: 1,
    backgroundColor: "#0f766e",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  mainBtnText: { color: "#fff", fontWeight: "600" },

  callIcon: {
    backgroundColor: "#e7f5f3",
    width: 46,
    height: 46,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
