import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const params = useLocalSearchParams();
  const { t } = useTranslation();

  // ---------------------- i18n Tabs ----------------------
  const tabs = [
    { label: t("cases.tabAll"), key: "all" }, // NEW TAB
    { label: t("cases.tabNew"), key: "new" },
    { label: t("cases.tabApproved"), key: "approved" },
    { label: t("cases.tabOnWay"), key: "onway" },
    { label: t("cases.tabWorking"), key: "working" },
    { label: t("cases.tabFollowup"), key: "followup" },
    { label: t("cases.tabClosed"), key: "closed" },
  ];

  const initialTabIndex = tabs.findIndex((t) => t.key === params.filter);
  const [activeTab, setActiveTab] = useState(
    initialTabIndex !== -1 ? initialTabIndex : 0
  );

  const scrollRef = useRef<ScrollView>(null);
  const tabRefs = useRef<(View | null)[]>([]);

  // Update active tab on filter param change
  useEffect(() => {
    const index = tabs.findIndex((t) => t.key === params.filter);
    if (index !== -1) setActiveTab(index);
  }, [params.filter]);

  // Auto scroll tabs
  useEffect(() => {
    const tabEl = tabRefs.current[activeTab];
    const scrollEl = scrollRef.current;

    if (tabEl && scrollEl) {
      (tabEl as any).measureLayout(
        scrollEl as any,
        (x: number) => {
          scrollEl.scrollTo({ x: x - width / 3, animated: true });
        },
        () => {}
      );
    }
  }, [activeTab]);

  // ---------------------- Sample Data ----------------------
  const data = [
    {
      name: "रामलाल शर्मा",
      age: 72,
      category: "स्वास्थ्य सहायता",
      ticket: "TKT-14567-001",
      distance: "2.3 km",
      time: `10 ${t("cases.timeMinutesAgo")}`,
      status: "new",
      tag: t("cases.tabNew"),
    },
    {
      name: "सीता देवी",
      age: 68,
      category: "पेंशन सहायता",
      ticket: "TKT-14567-002",
      distance: "5.1 km",
      time: `25 ${t("cases.timeMinutesAgo")}`,
      status: "new",
      tag: t("cases.tabNew"),
    },
    {
      name: "गोपाल कृष्ण",
      age: 75,
      category: "कानूनी सहायता",
      ticket: "TKT-14567-003",
      distance: "1.8 km",
      time: `1 ${t("cases.timeHoursAgo")}`,
      status: "approved",
      tag: t("cases.tabApproved"),
    },
    {
      name: "अजय वर्मा",
      age: 63,
      category: "स्वास्थ्य सहायता",
      ticket: "TKT-14567-004",
      distance: "3.6 km",
      time: `40 ${t("cases.timeMinutesAgo")}`,
      status: "onway",
      tag: t("cases.tabOnWay"),
    },
    {
      name: "मोहन लाल",
      age: 70,
      category: "कानूनी सहायता",
      ticket: "TKT-14567-005",
      distance: "1.3 km",
      time: `2 ${t("cases.timeHoursAgo")}`,
      status: "working",
      tag: t("cases.tabWorking"),
    },
    {
      name: "गीता देवी",
      age: 66,
      category: "पेंशन सहायता",
      ticket: "TKT-14567-006",
      distance: "4.1 km",
      time: `3 ${t("cases.timeHoursAgo")}`,
      status: "followup",
      tag: t("cases.tabFollowup"),
    },
  ];

  // ---------------------- Status Badge Colors ----------------------
  const statusColors: any = {
    new: "#E53935", // red
    approved: "#6D4C41", // brown / grey
    onway: "#1E88E5", // blue
    working: "#FDD835", // yellow
    followup: "#FB8C00", // orange
    closed: "#43A047", // green
  };

  // ---------------------- Filter Logic ----------------------
  const selectedFilterKey = tabs[activeTab].key;

  const filteredData =
    selectedFilterKey === "all"
      ? data
      : data.filter((item) => item.status === selectedFilterKey);

  return (
    <BodyLayout type="screen" screenName={t("cases.screenTitle")}>
      {/* FILTER TABS */}
      <ScrollView
        ref={scrollRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            ref={(el) => {
              tabRefs.current[index] = el;
            }}
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
                styles.tabText,
                { color: theme.colors.colorTextSecondary },
                activeTab === index && { color: theme.colors.colorBgPage },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* CASE LIST */}
      {filteredData.length === 0 ? (
        <Text style={styles.noData}>{t("cases.noCases")}</Text>
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

              {/* STATUS BADGE WITH COLORS */}
              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: statusColors[item.status] },
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
              {t("cases.age")}: {item.age}
            </Text>

            <Text
              style={[
                styles.cardText,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {t("cases.category")}: {item.category}
            </Text>

            <Text
              style={[
                styles.cardText,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {t("cases.ticket")}: {item.ticket}
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
                  {item.distance} {t("cases.away")}
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
              onPress={() => router.push("/CaseDetailScreen")}
            >
              <Text
                style={[
                  styles.actionBtnText,
                  { color: theme.colors.colorBgPage },
                ]}
              >
                {t("cases.viewCase")}
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
    marginRight: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  tabText: {
    fontSize: 14,
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
