import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/reusables/Card";
import ConfirmationAlert from "@/components/reusables/ConfirmationAlert";
import { useTheme } from "@/theme/ThemeContext";
import { typography } from "@/theme/typography";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const screenWidth = Dimensions.get("window").width;

  const [showAlert, setShowAlert] = useState(false);

  /* ---------------- STATIC JSON (Complaints) ---------------- */
  const recentComplaints = [
    {
      id: "12345",
      issue: t("homeScreen.complaint_issue_1"),
      status: "in-progress",
      message: t("homeScreen.complaint_status_msg_1"),
    },
    {
      id: "12348",
      issue: t("homeScreen.complaint_issue_2"),
      status: "closed",
      message: t("homeScreen.complaint_status_msg_2"),
    },
  ];

  const [activeFilter, setActiveFilter] = useState("recent");

  /* ---------------- STATIC INFO JSON ---------------- */
  const infoData = [
    {
      id: 1,
      title: t("homeScreen.news_title_1"),
      tag: t("homeScreen.news_tag_1"),
      tagColor: "#E0661A",
      description: t("homeScreen.news_desc_1"),
    },
    {
      id: 2,
      title: t("homeScreen.news_title_2"),
      tag: t("homeScreen.news_tag_2"),
      tagColor: "#D18500",
      description: t("homeScreen.news_desc_2"),
    },
  ];

  const [activeFilterInfo, setActiveFilterInfo] = useState("latest");

  return (
    <BodyLayout>

      {/* ---------------- SOS CARD ---------------- */}
      <View style={{ marginBottom: 25, width: "100%" }}>
        <Card gradientColors={["#FD5050", "#590000"]}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={[
              styles.sosButton,
              {
                width: screenWidth * 0.45,
                height: screenWidth * 0.45,
                borderRadius: screenWidth * 0.23,
                borderColor: theme.colors.btnSosText,
              },
            ]}
            onPress={() => setShowAlert(true)}
          >
            <View style={{ alignItems: "center" }}>
              <RemixIcon
                name="alarm-warning-line"
                size={screenWidth * 0.14}
                color={theme.colors.btnSosText}
              />

              <Text
                style={[
                  typography.fontH1,
                  {
                    color: theme.colors.btnSosText,
                    marginTop: 10,
                    fontSize: screenWidth * 0.07,
                  },
                ]}
              >
                {t("homeScreen.sos")}
              </Text>
            </View>
          </TouchableOpacity>

          <ConfirmationAlert
            visible={showAlert}
            icon="alarm-outline"
            title={t("homeScreen.help_question")}
            description=""
            confirmText={t("homeScreen.yes_help")}
            cancelText={t("homeScreen.no_cancel")}
            onConfirm={() => {
              setShowAlert(false);
              router.push("/(tabs)/(dashboard)/confirmLocationScreen");
            }}
            onCancel={() => setShowAlert(false)}
          />
        </Card>
      </View>

      {/* ---------------- COMPLAINT FILTERS ---------------- */}
      <View style={styles.sectionHeader}>
        <TouchableOpacity
          onPress={() => setActiveFilter("recent")}
          activeOpacity={0.8}
          style={styles.filterBtn}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === "recent" ? theme.colors.colorLink : theme.colors.colorTextSecondary },
            ]}
            numberOfLines={2}
          >
            {t("homeScreen.recent_complaints")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveFilter("all")}
          activeOpacity={0.8}
          style={styles.filterBtn}
        >
          <Text
            style={[
              styles.filterText,
              { color: activeFilter === "all" ? "#00796B" : "#424242" },
            ]}
            numberOfLines={2}
          >
            {t("homeScreen.all_complaints")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------------- COMPLAINT CARDS ---------------- */}
      {recentComplaints
        .filter((item) =>
          activeFilter === "recent" ? item.status === "in-progress" : true
        )
        .map((item, index) => {
          const isInProgress = item.status === "in-progress";

          const titleColor = isInProgress ? theme.colors.btnPrimaryBg : theme.colors.colorTextTertiary;
          const keyColor = isInProgress ? theme.colors.btnPrimaryBg: theme.colors.colorTextSecondary;

          return (
            <View
              key={index}
              style={[
                styles.complaintCard,
                { borderColor: "#00796B" },
              ]}
            >
              <View style={styles.complaintRow}>
                <Text style={[styles.ticketText, { color: titleColor }]}>
                  {t("homeScreen.ticket_number")}: {item.id}
                </Text>

                <View
                  style={[
                    styles.tag,
                    { borderColor: isInProgress ? "#F57C00" : "#C62828" },
                  ]}
                >
                  <View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: isInProgress ? "#F57C00" : "#C62828",
                      },
                    ]}
                  />

                  <Text
                    style={{
                      color: isInProgress ? "#F57C00" : "#C62828",
                      fontWeight: "600",
                      fontSize: 13,
                    }}
                  >
                    {isInProgress ? t("homeScreen.in_progress") : t("homeScreen.closed")}
                  </Text>
                </View>
              </View>

              <Text style={[styles.label, { color: keyColor }]}>{t("homeScreen.complaint_label")}</Text>
              <Text style={[styles.value,{color:theme.colors.colorTextSecondary}]}>{item.issue}</Text>

              <Text style={[styles.label, { color: keyColor }]}>{t("homeScreen.status_label")}</Text>
              <Text style={[styles.value,{color:theme.colors.colorTextSecondary}]}>{item.message}</Text>

              <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
                <Text style={[styles.primaryBtnText,{color:theme.colors.btnPrimaryText}]}>
                  {t("homeScreen.view_status")}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}

      {/* ---------------- INFO FILTERS ---------------- */}
      <View style={{ marginTop: 20, marginBottom: 10 }}>
        <View style={styles.sectionHeader}>
          <TouchableOpacity
            onPress={() => setActiveFilterInfo("latest")}
            activeOpacity={0.8}
            style={styles.filterBtn}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilterInfo === "latest" ? theme.colors.colorLink : theme.colors.colorTextSecondary },
              ]}
            >
              {t("homeScreen.latest_news")}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setActiveFilterInfo("all")}
            activeOpacity={0.8}
            style={styles.filterBtn}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilterInfo === "all" ? theme.colors.colorLink : theme.colors.colorTextSecondary },
              ]}
            >
              {t("homeScreen.view_all_news")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ---------------- INFO CARDS ---------------- */}
      {infoData
        .filter((item) => (activeFilterInfo === "latest" ? item.id === 1 : true))
        .map((info, index) => (
          <View key={index} style={[styles.infoCard,{backgroundColor:theme.colors.colorBgPage,borderColor:theme.colors.btnPrimaryBg}]}>
            <View style={styles.infoHeader}>
              <Text style={styles.infoTitle}>{info.title}</Text>

              <View
                style={[
                  styles.infoTag,
                  { borderColor: info.tagColor },
                ]}
              >
                <Text style={{ color: info.tagColor, fontWeight: "600" }}>
                  {info.tag}
                </Text>
              </View>
            </View>

            <Text style={[styles.infoDesc,{color:theme.colors.colorTextSecondary}]}>{info.description}</Text>

            <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
              <Text style={[styles.primaryBtnText,{color:theme.colors.btnPrimaryText}]}>
                {t("homeScreen.view_more")}
              </Text>
            </TouchableOpacity>
          </View>
        ))}
    </BodyLayout>
  );
}

/* ---------------- STYLES (UNCHANGED) ---------------- */
const styles = StyleSheet.create({
  sosButton: {
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    borderWidth: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  filterBtn: {
    alignItems: "center",
  },
  filterText: {
    fontSize: 17,
    fontWeight: "600",
    textAlign: "center",
  },
  complaintCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
  },
  complaintRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  ticketText: {
    fontSize: 16,
    fontWeight: "600",
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  label: {
    marginTop: 6,
    fontSize: 14,
  },
  value: {
    marginBottom: 6,
    fontSize: 15,
  },
  primaryBtn: {
    backgroundColor: "#0A6955",
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 12,
    alignItems: "center",
  },
  primaryBtnText: {
    fontWeight: "700",
    fontSize: 15,
  },
  infoCard: {
    borderWidth: 1.5,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  infoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A6955",
    flex: 1,
    paddingRight: 10,
  },
  infoTag: {
    borderWidth: 1.5,
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 20,
  },
  infoDesc: {
    fontSize: 14.5,
    marginBottom: 15,
    marginTop: 5,
    lineHeight: 20,
  },
});
