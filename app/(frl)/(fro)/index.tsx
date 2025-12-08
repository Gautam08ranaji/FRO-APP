import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";


const froData = [
  {
    id: 1,
    name: "Ashish Tomar",
    code: "FRO-001",
    location: "Agra, UP",
    time: "09:00 AM",
    casesToday: 5,
    solved: 3,
    rating: 4.8,
    status: "available",
    lastSeen: "Just Now",
    activeCase: "TKT-14567-023",
    image: "https://thispersondoesnotexist.com/",
  },
  {
    id: 2,
    name: "Priya Singh",
    code: "FRO-002",
    location: "Kanpur, UP",
    time: "08:45 AM",
    casesToday: 4,
    solved: 4,
    rating: 4.9,
    status: "busy",
    lastSeen: "2 min ago",
    activeCase: "TKT-14567-024",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    id: 3,
    name: "Amit Sharma",
    code: "FRO-003",
    location: "Agra, UP",
    time: "--:--",
    casesToday: 0,
    solved: 0,
    rating: 4.2,
    status: "unavailable",
    lastSeen: "2 hours ago",
    activeCase: "",
    image: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    id: 4,
    name: "Sunita Verma",
    code: "FRO-004",
    location: "Ghazipur, UP",
    time: "09:15 AM",
    casesToday: 6,
    solved: 5,
    rating: 4.7,
    status: "available",
    lastSeen: "1 min ago",
    activeCase: "TKT-14567-025",
    image: "https://randomuser.me/api/portraits/women/65.jpg",
  },
];


export default function FROListScreen() {

  
  const { theme } = useTheme();
const { filter } = useLocalSearchParams();

const [activeTab, setActiveTab] = useState(
  typeof filter === "string" ? filter : "All"
);


React.useEffect(() => {
  if (typeof filter === "string") {
    setActiveTab(filter);
  }
}, [filter]);


  const filteredData = useMemo(() => {
    if (activeTab === "All") return froData;
    if (activeTab === "Available")
      return froData.filter((item) => item.status === "available");
    if (activeTab === "On Duty")
      return froData.filter((item) => item.status === "busy");
    if (activeTab === "Off Duty")
      return froData.filter((item) => item.status === "unavailable");

    return froData;
  }, [activeTab]);

  function StatBox({ label, value, bg }: any) {
    return (
      <View style={[styles.statBox, { backgroundColor: bg }]}>
        <Text
          style={[
            styles.statLabel,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.statValue,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          {value}
        </Text>
      </View>
    );
  }

  function ActionButton({ label, icon }: any) {
    return (
      <TouchableOpacity style={styles.outlineBtn}>
        <RemixIcon name={icon} size={16} color="#0F766E" />
        <Text style={styles.outlineText}>{label}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <BodyLayout type="screen" screenName="FROs">
      <View style={styles.searchBox}>
        <RemixIcon name="search-line" size={18} color="#6A7282" />
        <TextInput
          placeholder="Search FRO by name or ID..."
          style={[{ flex: 1, color: theme.colors.colorTextSecondary }]}
          placeholderTextColor={theme.colors.inputText}
        />
      </View>

      <View style={styles.tabsRow}>
        {["All", "On Duty", "Off Duty", "Available"].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filteredData}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.colorBgPage,
                marginVertical: 20,
              },
            ]}
          >
            {/* TOP ROW */}
            <View style={styles.topRow}>
              <Image
                source={{ uri: item.image }}
                style={[
                  styles.avatar,
                  { borderColor: theme.colors.colorPrimary600 },
                ]}
              />

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.name,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  {item.name}
                </Text>
                <Text
                  style={[
                    styles.code,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  {item.code}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  item.status === "available"
                    ? { backgroundColor: theme.colors.validationSuccessBg }
                    : item.status === "busy"
                    ? { backgroundColor: theme.colors.validationErrorBg }
                    : { backgroundColor: theme.colors.btnDisabledBg },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "available"
                      ? { color: theme.colors.validationSuccessText }
                      : item.status === "busy"
                      ? { color: theme.colors.validationErrorText }
                      : { color: theme.colors.colorTextTertiary },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            {/* LOCATION & TIME */}
            <View style={styles.metaRow}>
              <View style={styles.rowItem}>
                <RemixIcon
                  name="map-pin-line"
                  size={16}
                  color={theme.colors.btnDisabledText}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.colors.btnDisabledText },
                  ]}
                >
                  {item.location}
                </Text>
              </View>

              <View style={styles.rowItem}>
                <RemixIcon
                  name="time-line"
                  size={16}
                  color={theme.colors.btnDisabledText}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.colors.btnDisabledText },
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            </View>

            {/* STATS */}
            <View style={styles.statsRow}>
              <StatBox
                label="Cases Today"
                value={item.casesToday}
                bg={theme.colors.validationSuccessBg}
              />
              <StatBox
                label="Solved"
                value={item.solved}
                bg={theme.colors.validationWarningBg}
              />
              <StatBox
                label="Rating"
                value={item.rating}
                bg={theme.colors.validationInfoBg}
              />
            </View>

            {item.activeCase !== "" && (
              <View
                style={[
                  styles.activeCase,
                  { backgroundColor: theme.colors.validationInfoBg },
                ]}
              >
                <Text
                  style={[
                    styles.activeText,
                    { color: theme.colors.validationInfoText },
                  ]}
                >
                  Active Case: {item.activeCase}
                </Text>
              </View>
            )}

            {/* ACTIONS */}
            <View style={styles.actionRow}>
              <ActionButton label="Track" icon="map-pin-line" />
              <ActionButton label="Call" icon="phone-line" />
              <TouchableOpacity
                style={[
                  styles.assignBtn,
                  item.status === "unavailable" && { opacity: 0.4 },
                ]}
              >
                <Text style={styles.assignText}>Assign</Text>
              </TouchableOpacity>
            </View>

            <Text
              style={[
                styles.lastSeen,
                { color: theme.colors.colorTextTertiary },
              ]}
            >
              Last Seen: {item.lastSeen}
            </Text>
          </View>
        )}
      />
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerSubtitle: { color: "#D1FAE5", marginTop: 4 },

  iconBadge: {
    backgroundColor: "#fff",
    padding: 8,
    borderRadius: 20,
  },
  badgeDot: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#DC2626",
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 10, color: "#fff", fontWeight: "700" },

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
    borderColor: "#0F766E",
  },
  tabActive: { backgroundColor: "#0F766E" },
  tabText: { color: "#0F766E" },
  tabTextActive: { color: "#fff" },

  card: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
    elevation: 2,
  },

  topRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  avatar: { width: 44, height: 44, borderRadius: 22, borderWidth: 1 },
  name: { fontWeight: "700" },
  code: { fontSize: 12, color: "#6A7282" },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
  },
  statusText: { fontSize: 11, fontWeight: "700" },

  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  rowItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  metaText: { fontSize: 12, color: "#6A7282" },

  statsRow: { flexDirection: "row", gap: 10, marginTop: 12 },

  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: 10,
  },
  statLabel: { fontSize: 11, color: "#6A7282" },
  statValue: { fontSize: 16, fontWeight: "700" },

  activeCase: {
    backgroundColor: "#E9F4FF",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  activeText: { color: "#1677FF", fontWeight: "600" },

  actionRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 10,
  },

  outlineBtn: {
    borderWidth: 1,
    borderColor: "#0F766E",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  outlineText: { color: "#0F766E", fontWeight: "700" },

  assignBtn: {
    backgroundColor: "#0F766E",
    padding: 10,
    borderRadius: 10,
    flex: 1,
    alignItems: "center",
  },
  assignText: { color: "#fff", fontWeight: "700" },

  lastSeen: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 11,
    color: "#6A7282",
  },
});
