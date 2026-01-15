import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const { width } = Dimensions.get("window");

/* ------------ DATA ------------ */
const hospitals = [
  {
    id: 1,
    name: "Singh Life Care Hospital & Nursing Home",
    type: "Government Hospital",
    status: "open",
    address: "Zamania Road, Rauza",
    phone: "+91-9453416629",
    distanceLabel: "Nearest hospital to you • 2.4 km Away",
  },
  {
    id: 2,
    name: "City General Hospital",
    type: "Private Hospital",
    status: "closed",
    address: "Lanka, Ghazipur",
    phone: "+91-9453416629",
    distanceLabel: "Distance: 4.1 km Away",
  },
];

const diagnosticCentres = [
  {
    id: 1,
    name: "Health Scan Diagnostic Centre",
    type: "Diagnostics",
    status: "open",
    address: "Ghazipur City",
    phone: "+91-9554416629",
    distanceLabel: "1.8 km Away",
  },
];

const treatments = [
  {
    id: 1,
    name: "Ayush Treatment Facility",
    type: "Government Treatment Centre",
    status: "open",
    address: "Near Collector Office",
    phone: "+91-9999916629",
    distanceLabel: "3.2 km Away",
  },
];

const awareness = [
  {
    id: 1,
    title: "COVID-19 Vaccination: What to Know",
    summary: "Eligibility, nearest centres, documents required and safety tips.",
    link: "https://www.mohfw.gov.in/",
  },
  {
    id: 2,
    title: "Recognising Stroke Symptoms",
    summary: "FAST: Face, Arms, Speech, Time — act fast and call emergency services.",
    link: "https://www.who.int/news-room/fact-sheets/detail/stroke",
  },
];

/* ------------ SCREEN ------------ */
export default function HospitalListScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("Hospitals");

  const renderData = () => {
    switch (activeTab) {
      case "Hospitals":
        return hospitals;
      case "Diagnostic Centres":
        return diagnosticCentres;
      case "Treatment":
        return treatments;
      case "Awareness":
        return awareness;
      default:
        return [];
    }
  };

  const handleCall = (number: string) =>
    Linking.openURL(`tel:${number}`);

  const handleOpen = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <BodyLayout type="screen" screenName="Details">
      
      {/* ---------- TABS (HORIZONTAL ONLY) ---------- */}
      <View style={styles.tabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.tabsRow}>
            {["Hospitals", "Diagnostic Centres", "Treatment", "Awareness"].map(
              (tab) => {
                const isActive = activeTab === tab;
                return (
                  <TouchableOpacity
                    key={tab}
                    onPress={() => setActiveTab(tab)}
                    style={[
                      styles.tab,
                      { borderColor: theme.colors.primary },
                      isActive && { backgroundColor: theme.colors.primary },
                    ]}
                  >
                    <Text
                      style={[
                        styles.tabText,
                        { color: theme.colors.primary },
                        isActive && {
                          color: theme.colors.btnPrimaryText,
                        },
                      ]}
                    >
                      {tab}
                    </Text>
                  </TouchableOpacity>
                );
              }
            )}
          </View>
        </ScrollView>
      </View>

      {/* ---------- STATS (ONLY HOSPITAL TAB) ---------- */}
      {activeTab === "Hospitals" && (
        <View style={styles.statsRow}>
          <View
            style={[
              styles.statsCard,
              { backgroundColor: theme.colors.colorPrimary50 },
            ]}
          >
            <Text style={styles.statsTitle}>
              Total hospitals in your city
            </Text>
            <Text
              style={[
                styles.statsValue,
                { color: theme.colors.primary },
              ]}
            >
              612
            </Text>
          </View>

          <View
            style={[
              styles.statsCard,
              { backgroundColor: theme.colors.colorPrimary50 },
            ]}
          >
            <Text style={styles.statsTitle}>
              Total hospitals in Uttar Pradesh
            </Text>
            <Text
              style={[
                styles.statsValue,
                { color: theme.colors.primary },
              ]}
            >
              8,726
            </Text>
          </View>
        </View>
      )}

      {/* ---------- TAB CONTENT ---------- */}
      {renderData().map((item: any) => (
        <View
          key={item.id}
          style={[
            styles.card,
            { backgroundColor: theme.colors.colorBgSurface },
          ]}
        >
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              {item.title ?? item.name}
            </Text>

            {item.status && (
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      item.status === "open"
                        ? theme.colors.validationWarningBg
                        : theme.colors.validationErrorBg,
                  },
                ]}
              >
                <Text style={styles.statusText}>
                  {item.status === "open" ? "Open" : "Closed"}
                </Text>
              </View>
            )}
          </View>

          <Text style={styles.hospitalType}>
            {item.type ?? item.summary}
          </Text>

          {item.address && (
            <View style={styles.addressRow}>
              <RemixIcon name="map-pin-line" size={18} />
              <Text style={styles.addressText}>{item.address}</Text>
              <Text style={styles.phoneText}>Ph: {item.phone}</Text>
            </View>
          )}

          {item.distanceLabel && (
            <View style={styles.distanceBox}>
              <Text style={styles.distanceText}>
                {item.distanceLabel}
              </Text>
            </View>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity
              style={[
                styles.outlineBtn,
                { borderColor: theme.colors.primary },
              ]}
              onPress={() =>
                activeTab === "Awareness"
                  ? handleOpen(item.link)
                  : null
              }
            >
              <Text style={styles.outlineBtnText}>
                {activeTab === "Awareness"
                  ? "Learn More"
                  : "View Details"}
              </Text>
            </TouchableOpacity>

            {item.phone && (
              <TouchableOpacity
                style={[
                  styles.callBtn,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() => handleCall(item.phone)}
              >
                <RemixIcon name="phone-line" size={20} />
                <Text style={styles.callBtnText}>Call</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      ))}

      <View style={{ height: 40 }} />
    </BodyLayout>
  );
}

/* ------------ STYLES ------------ */
const styles = StyleSheet.create({
  tabsContainer: {
    marginTop: 16,
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 4,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
  },
  tabText: {
    fontWeight: "600",
  },

  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  statsCard: {
    width: width * 0.445,
    padding: 12,
    borderRadius: 12,
  },
  statsTitle: {
    fontSize: 12,
  },
  statsValue: {
    fontSize: 24,
    fontWeight: "700",
  },

  card: {
    marginTop: 20,
    padding: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    width: "75%",
  },

  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontWeight: "600",
  },

  hospitalType: {
    marginTop: 4,
  },

  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  addressText: {
    marginLeft: 6,
    width: "40%",
  },
  phoneText: {
    marginLeft: "auto",
  },

  distanceBox: {
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
  },
  distanceText: {
    fontWeight: "500",
  },

  btnRow: {
    flexDirection: "row",
    marginTop: 14,
    gap: 10,
  },
  outlineBtn: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
  },
  outlineBtnText: {
    fontWeight: "600",
  },

  callBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  callBtnText: {
    marginLeft: 6,
    fontWeight: "600",
  },
});
