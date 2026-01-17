import BodyLayout from "@/components/layout/BodyLayout";
import RemarkActionModal from "@/components/reusables/RemarkActionModal";
import { useTheme } from "@/theme/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item as string) : null;

  console.log("fet item", item);

  const { theme } = useTheme();
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const ticketNo = item?.transactionNumber || "TKT-00000-001";
  const elderName = item?.name || item?.contactName || "रामलाल शर्मा";
  const age = item?.ageofTheElder || "72";
  const gender = item?.gender === "Male" ? t("caseDetail.genderMale") : item?.gender === "Female" ? t("caseDetail.genderFemale") : t("caseDetail.genderMale");
  const phone = item?.mobileNo || "+91-9876543210";
  const emergencyPhone = item?.contactPolice || item?.contactAmbulance || "+91-9876543 / 211";
  const category = item?.categoryName || "स्वास्थ्य सहायता";
  const subCategory = item?.subCategoryName || "";
  const subSubCategory = item?.subSubCategoryName || "";
  const details = item?.caseDescription || item?.problemReported || item?.reasonForCalling || "बुजुर्ग को चलने में कठिनाई हो रही है...";
  const address = item?.completeAddress || item?.location || "123, गांधी नगर, मुंबई - 400001";
  const state = item?.stateName || "";
  const district = item?.districtName || "";
  const agentRemarks = item?.agentRemarks || "";
  const comment = item?.comment || "";
  const priority = item?.priority || "Medium";
  const callType = item?.callTypeName || "Actionable";
  const caseStatus = item?.caseStatusName || "Open";
  const subStatus = item?.subStatusName || "Open";

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
                {elderName}
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
                {age} {t("caseDetail.years")}
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
                {gender}
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
              {phone}
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
              {emergencyPhone}
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

        <View style={styles.keyValueRow}>
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
            {category}
          </Text>
        </View>

        {subCategory && (
          <View style={styles.keyValueRow}>
            <Text
              style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
            >
              {t("caseDetail.subCategory")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {subCategory}
            </Text>
          </View>
        )}

        {subSubCategory && (
          <View style={styles.keyValueRow}>
            <Text
              style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
            >
              {t("caseDetail.subSubCategory")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {subSubCategory}
            </Text>
          </View>
        )}

        <View style={styles.keyValueRow}>
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
            {details}
          </Text>
        </View>

        {agentRemarks && (
          <View style={styles.keyValueRow}>
            <Text
              style={[
                styles.labelKey,
                { marginTop: 12, color: theme.colors.colorTextSecondary },
              ]}
            >
              {t("caseDetail.agentRemarks")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {agentRemarks}
            </Text>
          </View>
        )}

        {comment && (
          <View style={styles.keyValueRow}>
            <Text
              style={[
                styles.labelKey,
                { marginTop: 12, color: theme.colors.colorTextSecondary },
              ]}
            >
              {t("caseDetail.comments")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {comment}
            </Text>
          </View>
        )}

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
            {address}
          </Text>
        </View>

        {(state || district) && (
          <View style={styles.keyValueRow}>
            <Text
              style={[
                styles.labelKey,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {t("caseDetail.location")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {district && state ? `${district}, ${state}` : state || district}
            </Text>
          </View>
        )}

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

      {/* CASE METADATA */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          {t("caseDetail.caseMetadata")}
        </Text>

        <View style={styles.keyValueRow}>
          <Text
            style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
          >
            {t("caseDetail.priority")}:
          </Text>
          <Text
            style={[
              styles.labelValue,
              { 
                color: priority === "High" ? theme.colors.validationErrorText : 
                       priority === "Medium" ? theme.colors.colorAccent500 : 
                       theme.colors.colorSuccess600
              },
            ]}
          >
            {priority}
          </Text>
        </View>

        <View style={styles.keyValueRow}>
          <Text
            style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
          >
            {t("caseDetail.callType")}:
          </Text>
          <Text
            style={[
              styles.labelValue,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {callType}
          </Text>
        </View>

        <View style={styles.keyValueRow}>
          <Text
            style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
          >
            {t("caseDetail.status")}:
          </Text>
          <Text
            style={[
              styles.labelValue,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {caseStatus}
          </Text>
        </View>

        <View style={styles.keyValueRow}>
          <Text
            style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
          >
            {t("caseDetail.subStatus")}:
          </Text>
          <Text
            style={[
              styles.labelValue,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {subStatus}
          </Text>
        </View>

        {item?.teamName && (
          <View style={styles.keyValueRow}>
            <Text
              style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
            >
              {t("caseDetail.team")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {item.teamName}
            </Text>
          </View>
        )}

        {item?.assignToName && (
          <View style={styles.keyValueRow}>
            <Text
              style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
            >
              {t("caseDetail.assignedTo")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {item.assignToName}
            </Text>
          </View>
        )}

        {item?.callBack === "Yes" && item?.callBackDateTime && (
          <View style={styles.keyValueRow}>
            <Text
              style={[styles.labelKey, { color: theme.colors.colorTextSecondary }]}
            >
              {t("caseDetail.callback")}:
            </Text>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {new Date(item.callBackDateTime).toLocaleString()}
            </Text>
          </View>
        )}
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
              justifyContent: "center",
              gap: 10,
              alignItems: "center",
              borderWidth: 1,
              borderColor: theme.colors.validationErrorText,
            },
          ]}

          onPress={()=>{
            setShowModal(true)
          }}
        >
          <RemixIcon
            name="close-circle-line"
            size={22}
            color={theme.colors.validationErrorText}
          />

          <Text
            style={[
              styles.closeBtnText,
              { color: theme.colors.validationErrorText },
            ]}
          >
            Flag as Wrong Case
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.closeBtn,
            {
              backgroundColor: theme.colors.colorAccent500,
              flexDirection: "row",
              justifyContent: "center",
              gap: 10,
              alignItems: "center",
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

      <RemarkActionModal
        title="Reason for Marking as Incorrect"
        subtitle="Provide details to help us understand what is wrong."
        visible={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={() => {
          setShowModal(false)
        }}
        stylesOverride={{
          // button: { backgroundColor: "#1565C0" },
          // title: { color: "#0D47A1" },
        }}
      />
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