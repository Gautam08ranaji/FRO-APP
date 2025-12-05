import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const caseTabs = [
  { label: "All", count: 42 },
  { label: "New", count: 12 },
  { label: "Assigned", count: 8 },
  { label: "In Progress", count: 6 },
];

const caseData = [
  {
    id: 1,
    name: "Ram Prasad Sharma",
    age: 75,
    ticket: "TKT-14567-001",
    category: "Medical Emergency",
    status: "New",
    priority: "High",
    location: "Lucknow, UP",
    time: "5 min ago",
    assigned: null,
    tat: "10 min remaining",
    tatStatus: "danger",
  },
  {
    id: 2,
    name: "Sita Devi",
    age: 68,
    ticket: "TKT-14567-002",
    category: "Pension Support",
    status: "Assigned",
    priority: "Medium",
    location: "Kanpur, UP",
    time: "15 min ago",
    assigned: "Ashish Tomar (FRO-001)",
    tat: "25 min remaining",
    tatStatus: "success",
  },
  {
    id: 3,
    name: "Gopal Krishna",
    age: 72,
    ticket: "TKT-14567-003",
    category: "Legal Aid",
    status: "In Progress",
    priority: "Low",
    location: "Agra, UP",
    time: "1 hour ago",
    assigned: "Priya Singh (FRO-002)",
    tat: "On Time",
    tatStatus: "success",
  },
  {
    id: 4,
    name: "Laxmi Bai",
    age: 80,
    ticket: "TKT-14567-004",
    category: "Food Security",
    status: "Resolved",
    priority: "High",
    location: "Ghazipur, UP",
    time: "3 hours ago",
    assigned: "Amit Sharma (FRO-007)",
    tat: "Completed",
    tatStatus: "success",
  },
];

export default function CaseManagementScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("All");

  return (
    <BodyLayout type="screen" screenName="Case Management">

      <View style={styles.searchBox}>
        <RemixIcon name="search-line" size={18} color={theme.colors.colorTextSecondary} />
        <TextInput
          placeholder="Search case/ticket ID or elder name..."
          style={[{ flex: 1 ,color:theme.colors.colorTextSecondary}]}
          placeholderTextColor={theme.colors.inputText}
          
        />
      </View>

      <View style={styles.tabsRow}>
        {caseTabs.map((tab) => (
          <TouchableOpacity
            key={tab.label}
            onPress={() => setActiveTab(tab.label)}
            style={[
              styles.tab,
              {
                borderColor: theme.colors.colorPrimary600,
                backgroundColor:
                  activeTab === tab.label
                    ? theme.colors.colorPrimary600
                    : "transparent",
              },
            ]}
          >
            <Text
              style={{
                color:
                  activeTab === tab.label
                    ? "#fff"
                    : theme.colors.colorPrimary600,
                fontWeight: "700",
              }}
            >
              {tab.label} {tab.count.toString().padStart(2, "0")}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={caseData}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
<View
  style={[
    styles.card,
    {
      backgroundColor:
        item?.status === "New"
          ? theme.colors.colorPrimary50
        : theme.colors.colorBgPage
    },
  ]}
>
            {/* NAME ROW */}
            <View style={styles.topRow}>
              <View>
                <Text style={[styles.name,{color:theme.colors.colorTextSecondary}]}>{item.name}</Text>
                <Text style={[styles.ticket,{color:theme.colors.colorTextSecondary}]}>
                  {item.ticket} ({item.age} Years)
                </Text>
              </View>

              <View
                style={[
                  styles.priorityBadge,
                  item.priority === "High"
                    ? { backgroundColor: theme.colors.validationErrorBg }
                    : item.priority === "Medium"
                    ? { backgroundColor: theme.colors.validationWarningBg }
                    : { backgroundColor: theme.colors.validationInfoBg },
                ]}
              >
                <Text
                  style={[
                    styles.priorityText,
                    item.priority === "High"
                      ? { color: theme.colors.validationErrorText }
                      : item.priority === "Medium"
                      ? { color: theme.colors.validationWarningText }
                      : { color: theme.colors.validationInfoText },
                  ]}
                >
                  {item.priority}
                </Text>
              </View>
            </View>

          
            <Text style={[styles.category,{color:theme.colors.colorTextSecondary}]}>
              ● {item.category} • {item.status}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.rowItem}>
                <RemixIcon name="map-pin-line" size={16} color={theme.colors.btnDisabledText} />
                <Text style={[styles.metaText,{color:theme.colors.btnDisabledText}]}>{item.location}</Text>
              </View>

              <View style={styles.rowItem}>
                <RemixIcon name="time-line" size={16} color={theme.colors.btnDisabledText} />
                <Text style={[styles.metaText,{color:theme.colors.btnDisabledText}]}>{item.time}</Text>
              </View>
            </View>

         
            {!item.assigned ? (
              <View
                style={[
                  styles.infoBox,
                  { backgroundColor: theme.colors.validationInfoText },
                ]}
              >
                <RemixIcon name="information-line" size={16} color={theme.colors.validationInfoBg} />
                <Text
                  style={{
                    color: theme.colors.validationInfoBg,
                    fontWeight: "600",
                  }}
                >
                  Not assigned yet
                </Text>
              </View>
            ) : (
              <View
                style={[
                  styles.infoBox,
                  { backgroundColor: theme.colors.validationSuccessBg },
                ]}
              >
                <RemixIcon name="user-line" size={16} color={theme.colors.validationSuccessText} />
                <Text
                  style={{
                    color: theme.colors.validationSuccessText,
                    fontWeight: "600",
                  }}
                >
                  Assigned to: {item.assigned}
                </Text>
              </View>
            )}

            <View style={styles.tatRow}>
              <Text style={[styles.tatLabel,{color:theme.colors.colorTextSecondary}]}>TAT:</Text>
              <Text
                style={[
                  styles.tatValue,
                  item.tatStatus === "danger"
                    ? { color: theme.colors.validationErrorText }
                    : { color: theme.colors.validationSuccessText },
                ]}
              >
                {item.tat}
              </Text>
            </View>

          
            {!item.assigned && (
              <TouchableOpacity
                style={[
                  styles.assignBtn,
                  { backgroundColor: theme.colors.btnPrimaryBg },
                ]}
              >
                <Text style={styles.assignText}>Assign to FRO</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </BodyLayout>
  );
}



const styles = StyleSheet.create({
  searchBox: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  tabsRow: { flexDirection: "row", gap: 10, marginTop: 12 },

  tab: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
  },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
    elevation: 2,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  name: { fontSize: 16, fontWeight: "700" },
  ticket: { fontSize: 12, color: "#6A7282" },

  priorityBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  priorityText: { fontSize: 11, fontWeight: "700" },

  category: {
    marginTop: 6,
    color: "#374151",
    fontWeight: "600",
  },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  rowItem: { flexDirection: "row", alignItems: "center", gap: 6 },

  metaText: { color: "#6A7282", fontSize: 12 },

  infoBox: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 10,
    borderRadius: 10,
  },

  tatRow: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  tatLabel: {
    fontWeight: "700",
    color: "#374151",
  },

  tatValue: {
    fontWeight: "700",
  },

  assignBtn: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },

  assignText: {
    color: "#fff",
    fontWeight: "700",
  },
});
