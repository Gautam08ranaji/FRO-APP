import BodyLayout from "@/components/layout/BodyLayout";
import NewCasePopupModal from "@/components/reusables/NewCasePopupModal";
import RemarkActionModal from "@/components/reusables/RemarkActionModal";
import StatusModal from "@/components/reusables/StatusModal";
import { useTheme } from "@/theme/ThemeContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
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

  /* ---------------- MODAL STATES ---------------- */
  const [showPopUp, setShowPopUp] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeclinedStatusModal, setShowDeclinedStatusModal] = useState(false);

  // 🔑 IMPORTANT FLAG
  const [hasShownPopup, setHasShownPopup] = useState(false);

  useFocusEffect(
    useCallback(() => {
      setShowPopUp(true);
    
    }, [])
  );

  const tabs = [
    { label: "All", key: "all" },
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

  useEffect(() => {
    const index = tabs.findIndex((t) => t.key === params.filter);
    if (index !== -1) setActiveTab(index);
  }, [params.filter]);

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
      status: "approved",
      tag: t("cases.tabApproved"),
    },
  ];

  const statusColors: any = {
    new: "#E53935",
    approved: "#6D4C41",
    onway: "#1E88E5",
    working: "#FDD835",
    followup: "#FB8C00",
    closed: "#43A047",
  };

  const selectedFilterKey = tabs[activeTab].key;
  const filteredData =
    selectedFilterKey === "all"
      ? data
      : data.filter((item) => item.status === selectedFilterKey);

  return (
    <BodyLayout type="screen" screenName={t("cases.screenTitle")}>
      {/* ---------------- TABS ---------------- */}
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
                activeTab === index && {
                  color: theme.colors.colorBgPage,
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* ---------------- CASE LIST ---------------- */}
      {filteredData.map((item, idx) => (
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
                { backgroundColor: statusColors[item.status] },
              ]}
            >
              <Text style={styles.tagText}>{item.tag}</Text>
            </View>
          </View>

          <Text style={styles.cardText}>
            {t("cases.age")}: {item.age}
          </Text>
          <Text style={styles.cardText}>
            {t("cases.category")}: {item.category}
          </Text>
          <Text style={styles.cardText}>
            {t("cases.ticket")}: {item.ticket}
          </Text>

          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <RemixIcon
                name="map-pin-line"
                size={16}
                color={theme.colors.colorTextSecondary}
              />
              <Text style={styles.metaText}>{item.distance}</Text>
            </View>
            <View style={styles.metaItem}>
              <RemixIcon
                name="time-line"
                size={16}
                color={theme.colors.colorTextSecondary}
              />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              { backgroundColor: theme.colors.colorPrimary600 },
            ]}
            onPress={() => router.push("/CaseDetailScreen")}
          >
            <Text style={styles.actionBtnText}>{t("cases.viewCase")}</Text>
          </TouchableOpacity>
        </View>
      ))}

      {/* ---------------- NEW CASE POPUP ---------------- */}
      <NewCasePopupModal
        visible={showPopUp}
        name="Satpal Gulati"
        age={72}
        timerSeconds={30}
        details={[
          { label: "Complaint Category:", value: "Health Assistance" },
          { label: "Ticket Number:", value: "TKT-14567-001" },
          { label: "Distance:", value: "2.3 km Away" },
        ]}
        onAccept={() => {
          setShowPopUp(false);
          setShowStatusModal(true);
        }}
        onDeny={() => {
          setShowPopUp(false);
          setShowRemarkModal(true);
        }}
      />

      {/* ---------------- REMARK MODAL ---------------- */}
      <RemarkActionModal
        visible={showRemarkModal}
        title="Why You Declined"
        buttonText="Deny"
        onClose={() => {
          setShowRemarkModal(false);
          setShowStatusModal(true);
        }}
        onSubmit={() => {
          setShowRemarkModal(false);
          setShowDeclinedStatusModal(true);
        }}
      />

      {/* ---------------- STATUS MODAL ---------------- */}
      <StatusModal
        visible={showStatusModal}
        title="Case Accepted"
        iconName="check-line"
        iconColor="#00796B"
        iconBgColor="#E0F2F1"
        autoCloseAfter={2000}
        onClose={() => setShowStatusModal(false)}
      />
      <StatusModal
        visible={showDeclinedStatusModal}
        title="Case Declined"
        iconName="check-line"
        iconColor={theme.colors.validationErrorText}
        iconBgColor={theme.colors.validationErrorText +22}
        autoCloseAfter={2000}
        onClose={() => setShowDeclinedStatusModal(false)}
        titleColor={theme.colors.colorAccent500}
      />
    </BodyLayout>
  );
}

/* ---------------- STYLES ---------------- */
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
    marginTop: 4,
    fontSize: 14,
  },
  tagBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: "#fff",
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
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },
});
