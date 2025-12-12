import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function CaseDetailScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const ticketNo = "TKT-14567-001";

  const steps = [
    { title: t("caseDetail.steps.registered"), time: "10:30 AM" },
    { title: t("caseDetail.steps.assigned"), time: "10:45 AM" },
    { title: t("caseDetail.steps.approved") },
    { title: t("caseDetail.steps.onway") },
    { title: t("caseDetail.steps.arrived") },
    { title: t("caseDetail.steps.working") },
  ];

  const completedSteps = 3;

  const animatedProgress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedProgress, {
      toValue: completedSteps,
      duration: 4800,
      delay: 2000,
      easing: Easing.out(Easing.exp),
      useNativeDriver: false,
    }).start();
  }, [animatedProgress]);

  return (
    <BodyLayout
      type="screen"
      screenName={t("caseDetail.screenTitle", { ticket: ticketNo })}
    >
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          {t("caseDetail.elderDetails")}
        </Text>

        <View style={styles.row}>
          <View
            style={[
              styles.avatarBox,
              { backgroundColor: theme.colors.colorPrimary50 },
            ]}
          >
            <RemixIcon
              name="user-3-line"
              size={40}
              color={theme.colors.colorPrimary600}
            />
          </View>

          <View style={{ marginLeft: 12 }}>
            <View style={styles.keyValueRow}>
              <Text
                style={[
                  styles.labelKey,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {t("caseDetail.name")}:
              </Text>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                रामलाल शर्मा
              </Text>
            </View>

            <View style={styles.keyValueRow}>
              <Text
                style={[
                  styles.labelKey,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {t("caseDetail.age")}:
              </Text>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                72 {t("caseDetail.years")}
              </Text>
            </View>

            <View style={styles.keyValueRow}>
              <Text
                style={[
                  styles.labelKey,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {t("caseDetail.gender")}:
              </Text>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {t("caseDetail.genderMale")}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ marginTop: 14 }}>
          <View style={styles.keyValueRow}>
            <Text
              style={[
                styles.labelKey,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {t("caseDetail.phone")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              +91-9876543210
            </Text>
          </View>

          <View style={styles.keyValueRow}>
            <Text
              style={[
                styles.labelKey,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {t("caseDetail.emergency")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              +91-9876543 / 211
            </Text>
          </View>
        </View>
      </View>

      {/* COMPLAINT INFO */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          {t("caseDetail.complaintInfo")}
        </Text>

        <Text
          style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
        >
          {t("caseDetail.category")}:
        </Text>
        <Text
          style={[
            styles.labelValue,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          स्वास्थ्य सहायता
        </Text>

        <Text
          style={[
            styles.labelKey,
            { marginTop: 12, color: theme.colors.colorTextSecondary },
          ]}
        >
          {t("caseDetail.details")}:
        </Text>
        <Text
          style={[
            styles.labelValue,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          बुजुर्ग को चलने में कठिनाई हो रही है...
        </Text>

        <Text
          style={[
            styles.labelKey,
            { marginTop: 12, color: theme.colors.colorTextSecondary },
          ]}
        >
          {t("caseDetail.attachments")}:
        </Text>
        <View
          style={[
            styles.attachmentBox,
            { backgroundColor: theme.colors.colorBgSurface },
          ]}
        >
          <RemixIcon name="image-line" size={32} color="#888" />
        </View>
      </View>

      {/* LOCATION */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          {t("caseDetail.location")}
        </Text>

        <View style={styles.keyValueRow}>
          <Text
            style={[
              styles.labelKey,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {t("caseDetail.address")}:
          </Text>
          <Text
            style={[
              styles.labelValue,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            123, गांधी नगर, मुंबई - 400001
          </Text>
        </View>

        <View
          style={[
            styles.mapBox,
            { backgroundColor: theme.colors.colorBgSurface },
          ]}
        >
          <RemixIcon name="map-pin-line" size={36} color="#999" />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.navBtn}
          onPress={() => router.push("/StartNavigationScreen")}
        >
          <Text style={styles.navBtnText}>
            {t("caseDetail.startNavigation")}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          {t("caseDetail.timeline")}
        </Text>

        <View style={styles.timelineContainer}>
          {steps.map((item, index) => {
            const isLast = index === steps.length - 1;

            const lineProgress = animatedProgress.interpolate({
              inputRange: [index, index + 1],
              outputRange: ["0%", "100%"],
              extrapolate: "clamp",
            });

            const dotActive = animatedProgress.interpolate({
              inputRange: [index - 0.5, index, index + 0.5],
              outputRange: [0, 1, 1],
              extrapolate: "clamp",
            });

            return (
              <View key={index} style={styles.progressRow}>
                {/* DOT + LINE */}
                <View style={styles.progressLeft}>
                  <Animated.View
                    style={[
                      styles.dot,
                      {
                        backgroundColor: dotActive.interpolate({
                          inputRange: [0, 1],
                          outputRange: [
                            "#D8D8D8",
                            theme.colors.colorPrimary600,
                          ],
                        }),
                      },
                    ]}
                  />

                  {!isLast && (
                    <View style={styles.lineContainer}>
                      <Animated.View
                        style={[
                          styles.lineFill,
                          {
                            backgroundColor: theme.colors.colorPrimary600,
                            width: lineProgress,
                          },
                        ]}
                      />
                    </View>
                  )}
                </View>

                {/* TEXT */}
                <View style={styles.progressContent}>
                  <Text
                    style={[
                      styles.progressTitle,
                      {
                        color:
                          index < completedSteps
                            ? theme.colors.colorPrimary600
                            : theme.colors.colorTextSecondary,
                      },
                    ]}
                  >
                    {item.title}
                  </Text>

                  {item.time && (
                    <Text
                      style={[
                        styles.progressTime,
                        { color: theme.colors.colorTextSecondary },
                      ]}
                    >
                      {item.time}
                    </Text>
                  )}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* ACTIONS */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          {t("caseDetail.actions")}
        </Text>

        {[
          t("caseDetail.updateStatus"),
          t("caseDetail.addPhoto"),
          t("caseDetail.addNote"),
          t("caseDetail.addVoice"),
          t("caseDetail.scheduleFollowup"),
        ].map((label, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionBtn,
              { borderColor: theme.colors.colorPrimary600 },
            ]}
          >
            <Text
              style={[
                styles.actionBtnText,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={[
            styles.closeBtn,
            {
              backgroundColor: theme.colors.validationErrorBg,
              flexDirection: "row",
              justifyContent:"center", gap:10,
              alignItems:"center",
              borderWidth:1,
              borderColor:theme.colors.validationErrorText
            },
          ]}
        >
          <RemixIcon
            name="close-circle-line"
            size={22}
            color={theme.colors.validationErrorText}
          />

          <Text
            style={[styles.closeBtnText, { color: theme.colors.validationErrorText }]}
          >
            Flag as Wrong Case
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.closeBtn,
            { backgroundColor: theme.colors.colorAccent500 ,
                 flexDirection: "row",
              justifyContent:"center", gap:10,
              alignItems:"center"
            },
          ]}
        >
              <RemixIcon
            name="close-circle-line"
            size={22}
            color={theme.colors.colorBgPage}
          />
          <Text
            style={[styles.closeBtnText, { color: theme.colors.colorBgPage }]}
          >
            {t("caseDetail.closeCase")}
          </Text>
        </TouchableOpacity>
      </View>
    </BodyLayout>
  );
}

/* STYLES (NO CHANGE) */
const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    padding: 18,
    borderRadius: 12,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 12 },

  keyValueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  labelKey: { width: 130, fontSize: 14, fontWeight: "500" },
  labelValue: { fontSize: 14, fontWeight: "600", flexShrink: 1 },

  row: { flexDirection: "row", alignItems: "center" },

  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  attachmentBox: {
    height: 70,
    borderRadius: 10,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  mapBox: {
    height: 120,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  navBtn: {
    marginTop: 12,
    backgroundColor: "#027A61",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  navBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  /* TIMELINE */
  timelineContainer: { marginTop: 4 },

  progressRow: { flexDirection: "row", minHeight: 55 },

  progressLeft: { width: 30, alignItems: "center" },

  dot: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#D8D8D8",
  },

  lineContainer: {
    width: 2,
    height: 40,
    backgroundColor: "#D8D8D8",
    overflow: "hidden",
    marginTop: -2,
  },
  lineFill: { height: "100%", width: "0%" },

  progressContent: { paddingLeft: 10, paddingBottom: 10, flex: 1 },
  progressTitle: { fontSize: 14, fontWeight: "600" },
  progressTime: { fontSize: 12, marginTop: 2 },

  /* ACTION BUTTONS */
  actionBtn: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  actionBtnText: { fontSize: 15, fontWeight: "600" },

  closeBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 14,
    alignItems: "center",
  },
  closeBtnText: { fontSize: 15, fontWeight: "700" },
});