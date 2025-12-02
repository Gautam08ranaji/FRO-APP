import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const { width } = Dimensions.get("window");

export default function CasesScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  const tabs = ["नए", "स्वीकृत", "रास्ते में", "कार्य जारी", "फॉलो-अप"];

  const data = [
    {
      name: "रामलाल शर्मा",
      age: 72,
      category: "स्वास्थ्य सहायता",
      ticket: "TKT-14567-001",
      distance: "2.3 km",
      time: "10 मिनट पहले मिला",
      status: 0,
      tag: "नया",
    },
    {
      name: "सीता देवी",
      age: 68,
      category: "पेंशन सहायता",
      ticket: "TKT-14567-002",
      distance: "5.1 km",
      time: "25 मिनट पहले मिला",
      status: 0,
      tag: "नया",
    },
    {
      name: "गोपाल कृष्ण",
      age: 75,
      category: "कानूनी सहायता",
      ticket: "TKT-14567-003",
      distance: "1.8 km",
      time: "1 घंटे पहले मिला",
      status: 0,
      tag: "नया",
    },
  ];

  const filteredData = data.filter((item) => item.status === activeTab);

  return (
    <BodyLayout type="screen" screenName="मामले">
      {/* TABS */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(index)}
            activeOpacity={0.8}
            style={[
              styles.tab,
              { backgroundColor: theme.colors.colorBgPage },
              activeTab === index && {
                backgroundColor: theme.colors.colorPrimary600,
              },
            ]}
          >
            <Text
              style={[
                styles.tabText,{color:theme.colors.colorTextSecondary},
                activeTab === index && {color:theme.colors.colorBgPage},
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* LIST */}

      {filteredData.length === 0 ? (
        <Text style={styles.noData}>कोई मामला उपलब्ध नहीं</Text>
      ) : (
        filteredData.map((item, idx) => (
          <View
            key={idx}
            style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
          >
            <View style={styles.rowBetween}>
              <Text
                style={[
                  styles.cardTitle,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {item.name}
              </Text>

              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: theme.colors.validationInfoText },
                ]}
              >
                <Text
                  style={[styles.tagText, { color: theme.colors.colorBgPage }]}
                >
                  {item.tag}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.cardText,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              उम्र: {item.age}
            </Text>
            <Text
              style={[
                styles.cardText,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              शिकायत श्रेणी: {item.category}
            </Text>
            <Text
              style={[
                styles.cardText,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              टिकट नंबर: {item.ticket}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <RemixIcon
                  name="map-pin-line"
                  size={16}
                  color={theme.colors.colorTextSecondary}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  {item.distance} दूर
                </Text>
              </View>

              <View style={styles.metaItem}>
                <RemixIcon
                  name="time-line"
                  size={16}
                  color={theme.colors.colorTextSecondary}
                />
                <Text
                  style={[
                    styles.metaText,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  {item.time}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.85}
              style={[
                styles.actionBtn,
                { backgroundColor: theme.colors.colorPrimary600 },
              ]}
              onPress={() => {
                router.push("/CaseDetailScreen");
              }}
            >
              <Text
                style={[
                  styles.actionBtnText,
                  { color: theme.colors.colorBgPage },
                ]}
              >
                मामला देखें
              </Text>
            </TouchableOpacity>
          </View>
        ))
      )}
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  tab: {
    height: 38,
    paddingHorizontal: 20,
    borderRadius: 10,
    // backgroundColor: "#EDEDED",
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  activeTab: {
    shadowColor: "#027A61",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  tabText: {
    fontSize: 14,
    color: "#323232",
  },
  activeTabText: {
    fontWeight: "700",
  },
  card: {
    width: width - 28,
    alignSelf: "center",
    padding: 16,
    marginBottom: 14,
    borderRadius: 12,
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginTop: 10,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  cardText: {
    fontSize: 14,

    marginTop: 4,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },
  metaRow: {
    flexDirection: "row",
    marginTop: 12,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 20,
  },
  metaText: {
    marginLeft: 4,
    fontSize: 13,
  },
  actionBtn: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  actionBtnText: {
    fontSize: 15,
    fontWeight: "600",
  },

  noData: {
    textAlign: "center",
    paddingTop: 40,
    fontSize: 16,
  },
});
