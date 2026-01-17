import BodyLayout from "@/components/layout/BodyLayout";
import NewCasePopupModal from "@/components/reusables/NewCasePopupModal";
import RemarkActionModal from "@/components/reusables/RemarkActionModal";
import StatusModal from "@/components/reusables/StatusModal";
import { getInteractionsListByAssignToId } from "@/features/fro/interactionApi";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

/* ================= STATUS MAP ================= */

const STATUS_MAP: Record<string, string> = {
  Open: "new",
  Approved: "approved",
  "On The Way": "onway",
  "In Progress": "working",
  "Follow Up": "followup",
  Closed: "closed",
};

export default function CasesScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const params = useLocalSearchParams();
  const authState = useAppSelector((state) => state.auth);

  /* ---------------- MODAL STATES ---------------- */
  const [showPopUp, setShowPopUp] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showDeclinedStatusModal, setShowDeclinedStatusModal] = useState(false);

  /* ---------------- DATA STATE ---------------- */
  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- TABS ---------------- */
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

  /* ---------------- FETCH DATA ---------------- */

  useFocusEffect(
    useCallback(() => {
      fetchInteractions();
      setShowPopUp(true);
    }, [])
  );

  const fetchInteractions = async () => {
    try {
      setLoading(true);

      const res = await getInteractionsListByAssignToId({
        assignToId: String(authState.userId),
        pageNumber: 1,
        pageSize: 100,
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      setInteractions(res?.data?.interactions || []);
    } catch (error) {
      console.error("❌ Failed to fetch cases:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- SYNC TAB FROM ROUTE ---------------- */

  useEffect(() => {
    const index = tabs.findIndex((t) => t.key === params.filter);
    if (index !== -1) setActiveTab(index);
  }, [params.filter]);

  /* ---------------- AUTO SCROLL TAB ---------------- */

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

  /* ---------------- FILTER DATA ---------------- */

  const selectedFilterKey = tabs[activeTab].key;

  const filteredData = useMemo(() => {
    if (selectedFilterKey === "all") return interactions;

    return interactions.filter(
      (item) => STATUS_MAP[item.caseStatusName] === selectedFilterKey
    );
  }, [interactions, selectedFilterKey]);

  /* ---------------- STATUS COLORS ---------------- */

  const statusColors: any = {
    new: "#E53935",
    approved: "#6D4C41",
    onway: "#1E88E5",
    working: "#FDD835",
    followup: "#FB8C00",
    closed: "#43A047",
  };

  /* ================= UI ================= */

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
            key={tab.key}
            ref={(el:any) => (tabRefs.current[index] = el)}
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
      {filteredData.map((item, idx) => {
        const statusKey = STATUS_MAP[item.caseStatusName];

        return (
          <View
            key={idx}
            style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
          >
            <View style={styles.rowBetween}>
              <Text style={[styles.cardTitle, { color: theme.colors.colorTextSecondary }]}>
                {item.name}
              </Text>

              <View
                style={[
                  styles.tagBadge,
                  { backgroundColor: statusColors[statusKey] },
                ]}
              >
                <Text style={styles.tagText}>{item.caseStatusName}</Text>
              </View>
            </View>

            <Text style={styles.cardText}>
              {t("cases.age")}: {item.ageofTheElder || "-"}
            </Text>
            <Text style={styles.cardText}>
              {t("cases.category")}: {item.categoryName}
            </Text>
            <Text style={styles.cardText}>
              {t("cases.ticket")}: {item.transactionNumber}
            </Text>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <RemixIcon name="map-pin-line" size={16} />
                <Text style={styles.metaText}>{item.districtName}</Text>
              </View>
              <View style={styles.metaItem}>
                <RemixIcon name="time-line" size={16} />
                <Text style={styles.metaText}>
                  {new Date(item.callBackDateTime).toLocaleString()}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              style={[
                styles.actionBtn,
                { backgroundColor: theme.colors.colorPrimary600 },
              ]}
              onPress={() =>
                router.push({
                  pathname: "/CaseDetailScreen",
                  params: { item : JSON.stringify(item) },
                })
              }
            >
              <Text style={styles.actionBtnText}>{t("cases.viewCase")}</Text>
            </TouchableOpacity>
          </View>
        );
      })}

      {/* ---------------- MODALS (UNCHANGED) ---------------- */}
      <NewCasePopupModal
        visible={showPopUp}
        name="New Case Assigned"
        age={72}
        timerSeconds={30}
        details={[
          { label: "Ticket Number:", value: "Auto Assigned" },
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
        iconBgColor={theme.colors.validationErrorText + "22"}
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
