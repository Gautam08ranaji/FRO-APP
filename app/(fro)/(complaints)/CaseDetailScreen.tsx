import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import RemixIcon from "react-native-remix-icon";

export default function CaseDetailScreen() {
  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item as string) : null;

  console.log("fet item", item);

  const { theme } = useTheme();
  const [showModal, setShowModal] = useState(false);

  const ticketNo = item?.transactionNumber;
  const elderName = item?.name || item?.contactName;
  const age = item?.ageofTheElder;
  const gender = item?.gender;

  const phone = item?.mobileNo;
  const emergencyPhone = item?.contactPolice || item?.contactAmbulance;
  const category = item?.categoryName;
  const subCategory = item?.subCategoryName;
  const subSubCategory = item?.subSubCategoryName;
  const details =
    item?.caseDescription || item?.problemReported || item?.reasonForCalling;

  const address = item?.completeAddress || item?.location;
  const state = item?.stateName;
  const district = item?.districtName;
  const agentRemarks = item?.agentRemarks;
  const comment = item?.comment;
  const priority = item?.priority;
  const callType = item?.callTypeName;
  const caseStatus = item?.caseStatusName;
  const subStatus = item?.subStatusName;

  // Extract coordinates with fallback
  const lat = item?.latitude || item?.lat || 19.076; // Default to Mumbai
  const lng = item?.longitude || item?.lng || 72.8777;
  const latitude = typeof lat === "string" ? parseFloat(lat) : lat;
  const longitude = typeof lng === "string" ? parseFloat(lng) : lng;

  const initialRegion = {
    latitude,
    longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  };

  const steps = [
    { title: "Open" },
    { title: "In-Progress" },
    { title: "Closed" },
  ];

  const completedSteps = item?.caseStatusId - 1;

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
    <BodyLayout type="screen" screenName={`Case Details - ${ticketNo}`}>
      {/* ELDER DETAILS */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorPrimary50 }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          Elder Details
        </Text>

        <View style={styles.row}>
          <View
            style={[
              styles.avatarBox,
              {
                backgroundColor: theme.colors.colorPrimary50,
                borderColor: theme.colors.colorPrimary600,
              },
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
                Name:
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
                Age:
              </Text>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {age} years
              </Text>
            </View>

            <View style={styles.keyValueRow}>
              <Text
                style={[
                  styles.labelKey,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                Gender:
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
              Phone:
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
              Emergency Contact:
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
          Complaint Information
        </Text>

        <View style={styles.keyValueRow}>
          <Text
            style={[
              styles.labelKey,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            Category:
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
              style={[
                styles.labelKey,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              Sub Category:
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
              style={[
                styles.labelKey,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              Sub Sub Category:
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
            Details:
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
              Agent Remarks:
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
              Comments:
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
          Attachments:
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
          Location
        </Text>

        <View style={styles.keyValueRow}>
          <Text
            style={[
              styles.labelKey,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            Address:
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
              Location:
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

        <View style={styles.mapContainer}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={styles.map}
            initialRegion={initialRegion}
            scrollEnabled={true}
            zoomEnabled={true}
            rotateEnabled={false}
            pitchEnabled={false}
            loadingEnabled={true}
            loadingIndicatorColor={theme.colors.colorPrimary600}
          >
            <Marker
              coordinate={{ latitude, longitude }}
              title={elderName}
              description={address}
            >
              <View style={styles.markerContainer}>
                <View
                  style={[
                    styles.markerPin,
                    { backgroundColor: theme.colors.validationErrorText },
                  ]}
                >
                  <RemixIcon name="map-pin-fill" size={20} color="#FFF" />
                </View>
                <View
                  style={[
                    styles.markerTail,
                    { borderTopColor: theme.colors.validationErrorText },
                  ]}
                />
              </View>
            </Marker>
          </MapView>

          <TouchableOpacity
            style={styles.mapOverlayButton}
            onPress={() => {
              router.push({
                pathname: "/FullMapScreen",
                params: {
                  latitude: latitude.toString(),
                  longitude: longitude.toString(),
                  title: elderName,
                  description: address,
                },
              });
            }}
          >
            <Text style={styles.mapOverlayText}>View Full Map</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.navBtn}
          onPress={() =>
            router.push({
              pathname: "/(fro)/(complaints)/StartNavigationScreen",
              params: { item: JSON.stringify(item) },
            })
          }
        >
          <Text style={styles.navBtnText}>Start Navigation</Text>
        </TouchableOpacity>
      </View>

      {/* TIMELINE */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          Timeline
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

                  {/* {item.time && (
                    <Text
                      style={[
                        styles.progressTime,
                        { color: theme.colors.colorTextSecondary },
                      ]}
                    >
                      {item.time}
                    </Text>
                  )} */}
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* CASE METADATA - UPDATED WITH FIXED SPACING */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          Case Metadata
        </Text>

        <View style={styles.metadataRow}>
          <Text
            style={[
              styles.metadataKey,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            Priority:
          </Text>
          <Text
            style={[
              styles.metadataValue,
              {
                color:
                  priority === "High"
                    ? theme.colors.validationErrorText
                    : priority === "Medium"
                      ? theme.colors.colorAccent500
                      : theme.colors.colorSuccess600,
              },
            ]}
          >
            {priority}
          </Text>
        </View>

        <View style={styles.metadataRow}>
          <Text
            style={[
              styles.metadataKey,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            Call Type:
          </Text>
          <Text
            style={[
              styles.metadataValue,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {callType}
          </Text>
        </View>

        <View style={styles.metadataRow}>
          <Text
            style={[
              styles.metadataKey,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            Status:
          </Text>
          <Text
            style={[
              styles.metadataValue,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {caseStatus}
          </Text>
        </View>

        <View style={styles.metadataRow}>
          <Text
            style={[
              styles.metadataKey,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            Sub Status:
          </Text>
          <Text
            style={[
              styles.metadataValue,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {subStatus}
          </Text>
        </View>

        {item?.teamName && (
          <View style={styles.metadataRow}>
            <Text
              style={[
                styles.metadataKey,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              Team:
            </Text>
            <Text
              style={[
                styles.metadataValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {item.teamName}
            </Text>
          </View>
        )}

        {item?.assignToName && (
          <View style={styles.metadataRow}>
            <Text
              style={[
                styles.metadataKey,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              Assigned To:
            </Text>
            <Text
              style={[
                styles.metadataValue,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {item.assignToName}
            </Text>
          </View>
        )}

        {item?.callBack === "Yes" && item?.callBackDateTime && (
          <View style={styles.metadataRow}>
            <Text
              style={[
                styles.metadataKey,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              Callback:
            </Text>
            <Text
              style={[
                styles.metadataValue,
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
          Actions
        </Text>

        {[
          {
            label: "Update Status",
            onPress: () =>
              router.push({
                pathname: "/(fro)/(complaints)/updateCase",
                params: {
                  item: JSON.stringify(item),
                  caseId: item?.id,
                },
              }),
          },
          {
            label: "Add Attchments",
            onPress: () =>
              router.push({
                pathname: "/(fro)/(complaints)/AddPhotoScreen",
              }),
          },
          {
            label: "Add Note",
            onPress: () =>
              router.push({
                pathname: "/(fro)/(complaints)/NoteHistory",
              }),
          },
          {
            label: "Add Voice",
            onPress: () => console.log("Add voice pressed"),
          },
          {
            label: "Schedule Followup",
            onPress: () => console.log("Schedule followup pressed"),
          },
        ].map((action, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.actionBtn,
              { borderColor: theme.colors.colorPrimary600 },
            ]}
            onPress={action.onPress}
          >
            <Text
              style={[
                styles.actionBtnText,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              {action.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </BodyLayout>
  );
}

/* STYLES */
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

  // Updated metadata styles with fixed spacing
  metadataRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 4,
  },
  metadataKey: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },

  row: { flexDirection: "row", alignItems: "center" },

  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
  },

  attachmentBox: {
    height: 70,
    borderRadius: 10,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  mapContainer: {
    height: 120,
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
    position: "relative",
  },

  map: {
    width: "100%",
    height: "100%",
  },

  markerContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  markerPin: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },

  markerTail: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 12,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -4,
  },

  mapOverlayButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#027A61",
  },

  mapOverlayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#027A61",
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
    height: 50,
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
