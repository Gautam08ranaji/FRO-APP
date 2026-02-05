import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef } from "react";
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

  const { theme } = useTheme();

  console.log("itesm", item);

  const ticketNo = item?.transactionNumber;
  const elderName = item?.name || item?.contactName;
  const age = item?.age;
  const gender = item?.gender;

  const phone = item?.mobileNo;
  const emergencyPhone = item?.alternateNo || item?.contactAmbulance;
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
  const lat = item?.latitude || item?.lat || 19.076;
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
    { title: "Open", icon: "file-list-line" },
    { title: "In-Progress", icon: "loader-3-line" },
    { title: "Closed", icon: "checkbox-circle-line" },
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

  // Action buttons with colors
  const actionButtons = [
    {
      label: "Update Status",
      icon: "refresh-line",
      color: "#027A61",
      bgColor: "#E6F4F1",
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
      label: "Add Attachments",
      icon: "attachment-line",
      color: "#4A6FA5",
      bgColor: "#E8EFF9",
      onPress: () =>
        router.push({
          pathname: "/(fro)/(complaints)/DocumentListScreen",
          params: {
            caseId: item?.id,
            item: JSON.stringify(item),
          },
        }),
    },
    {
      label: "Add Note",
      icon: "sticky-note-line",
      color: "#8B5A2B",
      bgColor: "#F5EEE6",
      onPress: () =>
        router.push({
          pathname: "/(fro)/(complaints)/NoteHistory",
          params: {
            caseId: item?.id,
            item: JSON.stringify(item),
          },
        }),
    },
    {
      label: "Add Voice",
      icon: "mic-line",
      color: "#D35400",
      bgColor: "#FDEDE8",
      onPress: () => console.log("Add voice pressed"),
    },
    {
      label: "Schedule",
      icon: "calendar-line",
      color: "#8E44AD",
      bgColor: "#F3E8F7",
      onPress: () => console.log("Schedule followup pressed"),
    },
    {
      label: "Call",
      icon: "phone-line",
      color: "#27AE60",
      bgColor: "#E8F8F0",
      onPress: () => console.log("Call pressed"),
    },
  ];

  // Function to render action buttons in grid
  const renderActionButtons = () => {
    const rows = [];
    for (let i = 0; i < actionButtons.length; i += 3) {
      const rowButtons = actionButtons.slice(i, i + 3);
      rows.push(
        <View key={i} style={styles.actionRow}>
          {rowButtons.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.actionBtn,
                {
                  backgroundColor: action.bgColor,
                  borderColor: action.color,
                },
              ]}
              onPress={action.onPress}
            >
              <RemixIcon
                name={action.icon as any}
                size={16}
                color={action.color}
                style={styles.actionIcon}
              />
              <Text
                style={[styles.actionBtnText, { color: action.color }]}
                numberOfLines={2}
              >
                {action.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>,
      );
    }
    return rows;
  };

  return (
    <BodyLayout type="screen" screenName={`Case Details - ${ticketNo}`}>
      {/* ELDER DETAILS */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: theme.colors.colorPrimary50,
            borderWidth: 1,
            borderColor: theme.colors.colorPrimary200,
          },
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <RemixIcon
              name="user-heart-line"
              size={20}
              color={theme.colors.colorPrimary600}
            />
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              Elder Details
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => console.log("View More Details clicked")}
            style={styles.viewMoreBtn}
          >
            <Text
              style={[
                styles.viewMoreText,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              View More
            </Text>
            <RemixIcon
              name="arrow-right-s-line"
              size={16}
              color={theme.colors.colorPrimary600}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.row}>
          <View
            style={[
              styles.avatarBox,
              {
                backgroundColor: theme.colors.colorPrimary100,
                borderColor: theme.colors.colorPrimary300,
              },
            ]}
          >
            <RemixIcon
              name="user-3-fill"
              size={32}
              color={theme.colors.colorPrimary600}
            />
          </View>

          <View style={styles.elderInfo}>
            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="user-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.labelKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Name:
                </Text>
              </View>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {elderName}
              </Text>
            </View>

            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="calendar-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.labelKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Age:
                </Text>
              </View>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {age}
              </Text>
            </View>

            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="genderless-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.labelKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Gender:
                </Text>
              </View>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {gender}
              </Text>
            </View>

            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="phone-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.labelKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Phone:
                </Text>
              </View>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {phone}
              </Text>
            </View>

            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="alert-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.labelKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Emergency:
                </Text>
              </View>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {emergencyPhone}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* COMPLAINT INFO */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.colorBgSurface },
          styles.cardShadow,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <RemixIcon
              name="file-warning-line"
              size={20}
              color={theme.colors.colorPrimary600}
            />
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              Complaint Information
            </Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <View style={styles.keyValueRow}>
            <View style={styles.labelContainer}>
              <RemixIcon
                name="folder-line"
                size={14}
                color={theme.colors.colorTextSecondary}
                style={styles.labelIcon}
              />
              <Text
                style={[
                  styles.labelKey,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                Category:
              </Text>
            </View>
            <View style={styles.valueContainer}>
              <Text
                style={[
                  styles.labelValue,
                  {
                    color: theme.colors.colorTextPrimary,
                  },
                ]}
              >
                {category}
              </Text>
            </View>
          </View>

          {subCategory && (
            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="folder-2-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.labelKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Sub Category:
                </Text>
              </View>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {subCategory}
              </Text>
            </View>
          )}

          {subSubCategory && (
            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="folder-3-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.labelKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Sub Sub Category:
                </Text>
              </View>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {subSubCategory}
              </Text>
            </View>
          )}

          <View style={styles.keyValueRow}>
            <View style={styles.labelContainer}>
              <RemixIcon
                name="file-text-line"
                size={14}
                color={theme.colors.colorTextSecondary}
                style={styles.labelIcon}
              />
              <Text
                style={[
                  styles.detailLabel,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                Details:
              </Text>
            </View>
            <Text
              style={[
                styles.detailText,
                { color: theme.colors.colorTextPrimary },
              ]}
            >
              {details}
            </Text>
          </View>

          {agentRemarks && (
            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="chat-quote-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Agent Remarks:
                </Text>
              </View>
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {agentRemarks}
              </Text>
            </View>
          )}

          {comment && (
            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="information-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.detailLabel,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Current Status:
                </Text>
              </View>
              <Text
                style={[
                  styles.detailText,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {comment}
              </Text>
            </View>
          )}

          <View style={styles.detailItem}>
            <View style={styles.labelContainer}>
              <RemixIcon
                name="image-line"
                size={14}
                color={theme.colors.colorTextSecondary}
                style={styles.labelIcon}
              />
              <Text
                style={[
                  styles.detailLabel,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                Attachments:
              </Text>
            </View>
            <View
              style={[
                styles.attachmentBox,
                { backgroundColor: theme.colors.colorBgSurface },
              ]}
            >
              <RemixIcon name="image-2-line" size={24} color="#888" />
              <Text style={styles.attachmentText}>No attachments yet</Text>
            </View>
          </View>
        </View>
      </View>

      {/* LOCATION */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.colorBgSurface },
          styles.cardShadow,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <RemixIcon
              name="map-pin-line"
              size={20}
              color={theme.colors.colorPrimary600}
            />
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              Location
            </Text>
          </View>
        </View>

        <View style={styles.detailSection}>
          <View style={styles.keyValueRow}>
            <View style={styles.labelContainer}>
              <RemixIcon
                name="home-3-line"
                size={14}
                color={theme.colors.colorTextSecondary}
                style={styles.labelIcon}
              />
              <Text
                style={[
                  styles.labelKey,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                Address:
              </Text>
            </View>
            <Text
              style={[
                styles.labelValue,
                { color: theme.colors.colorTextPrimary },
              ]}
            >
              {address}
            </Text>
          </View>

          {(state || district) && (
            <View style={styles.keyValueRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="map-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.labelKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Location:
                </Text>
              </View>
              <Text
                style={[
                  styles.labelValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {district && state
                  ? `${district}, ${state}`
                  : state || district}
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
                    <RemixIcon name="map-pin-fill" size={16} color="#FFF" />
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
              <RemixIcon name="fullscreen-line" size={16} color="#027A61" />
              <Text style={styles.mapOverlayText}>Full Map</Text>
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
            <RemixIcon name="navigation-line" size={20} color="#fff" />
            <Text style={styles.navBtnText}>Start Navigation</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* TIMELINE */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.colorBgSurface },
          styles.cardShadow,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <RemixIcon
              name="time-line"
              size={20}
              color={theme.colors.colorPrimary600}
            />
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              Timeline
            </Text>
          </View>
        </View>

        <View style={styles.timelineContainer}>
          {steps.map((step, index) => {
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
                            theme.colors.colorBorder,
                            theme.colors.colorPrimary600,
                          ],
                        }),
                      },
                    ]}
                  >
                    <RemixIcon
                      name={step.icon as any}
                      size={12}
                      color="#FFF"
                      style={styles.stepIcon}
                    />
                  </Animated.View>

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
                    {step.title}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* CASE METADATA */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.colorBgSurface },
          styles.cardShadow,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <RemixIcon
              name="database-line"
              size={20}
              color={theme.colors.colorPrimary600}
            />
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              Case Metadata
            </Text>
          </View>
        </View>

        <View style={styles.metadataGrid}>
          <View
            style={[
              styles.metadataItem,
              {
                backgroundColor:
                  priority === "High"
                    ? "#FDEDE8"
                    : priority === "Medium"
                      ? "#FFF4E6"
                      : "#E8F8F0",
              },
            ]}
          >
            <RemixIcon
              name="flag-line"
              size={16}
              color={
                priority === "High"
                  ? theme.colors.validationErrorText
                  : priority === "Medium"
                    ? theme.colors.colorAccent500
                    : theme.colors.colorSuccess600
              }
            />
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
            <Text style={styles.metadataLabel}>Priority</Text>
          </View>

          <View
            style={[
              styles.metadataItem,
              { backgroundColor: theme.colors.colorPrimary50 },
            ]}
          >
            <RemixIcon
              name="checkbox-circle-line"
              size={16}
              color={theme.colors.colorPrimary600}
            />
            <Text
              style={[
                styles.metadataValue,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              {caseStatus}
            </Text>
            <Text style={styles.metadataLabel}>Status</Text>
          </View>

          <View
            style={[
              styles.metadataItem,
              { backgroundColor: theme.colors.colorAccent50 },
            ]}
          >
            <RemixIcon
              name="subtract-line"
              size={16}
              color={theme.colors.colorAccent700}
            />
            <Text
              style={[
                styles.metadataValue,
                { color: theme.colors.colorAccent700 },
              ]}
            >
              {subStatus}
            </Text>
            <Text style={styles.metadataLabel}>Sub Status</Text>
          </View>

          {callType && (
            <View
              style={[
                styles.metadataItem,
                { backgroundColor: theme.colors.colorAccent100 },
              ]}
            >
              <RemixIcon
                name="phone-line"
                size={16}
                color={theme.colors.colorAccent700}
              />
              <Text
                style={[
                  styles.metadataValue,
                  { color: theme.colors.colorAccent700 },
                ]}
              >
                {callType}
              </Text>
              <Text style={styles.metadataLabel}>Call Type</Text>
            </View>
          )}
        </View>

        <View style={styles.metadataDetails}>
          {item?.teamName && (
            <View style={styles.metadataDetailRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="team-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.metadataKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Team:
                </Text>
              </View>
              <Text
                style={[
                  styles.metadataDetailValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {item.teamName}
              </Text>
            </View>
          )}

          {item?.assignToName && (
            <View style={styles.metadataDetailRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="user-star-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.metadataKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Assigned To:
                </Text>
              </View>
              <Text
                style={[
                  styles.metadataDetailValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {item.assignToName}
              </Text>
            </View>
          )}

          {item?.callBack === "Yes" && item?.callBackDateTime && (
            <View style={styles.metadataDetailRow}>
              <View style={styles.labelContainer}>
                <RemixIcon
                  name="history-line"
                  size={14}
                  color={theme.colors.colorTextSecondary}
                  style={styles.labelIcon}
                />
                <Text
                  style={[
                    styles.metadataKey,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  Callback:
                </Text>
              </View>
              <Text
                style={[
                  styles.metadataDetailValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {new Date(item.callBackDateTime).toLocaleString()}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* ACTIONS */}
      <View
        style={[
          styles.card,
          { backgroundColor: theme.colors.colorBgSurface },
          styles.cardShadow,
        ]}
      >
        <View style={styles.cardHeader}>
          <View style={styles.titleContainer}>
            <RemixIcon
              name="flashlight-line"
              size={20}
              color={theme.colors.colorPrimary600}
            />
            <Text
              style={[
                styles.cardTitle,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              Quick Actions
            </Text>
          </View>
        </View>

        <View style={styles.actionsGrid}>{renderActionButtons()}</View>
      </View>
    </BodyLayout>
  );
}

/* IMPROVED STYLES */
const styles = StyleSheet.create({
  card: {
    marginTop: 14,
    padding: 16,
    borderRadius: 16,
    marginHorizontal: 2,
  },
  cardShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
  viewMoreBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatarBox: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
  },
  elderInfo: {
    flex: 1,
    marginLeft: 12,
  },

  keyValueRow: {
    flexDirection: "row",
    alignItems: "flex-start", // Changed from 'center' to 'flex-start'
    marginBottom: 8,
    flexWrap: "wrap",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    minWidth: 140, // Minimum width for label
    maxWidth: 140, // Maximum width to prevent stretching
  },
  labelIcon: {
    marginRight: 6,
  },
  labelKey: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8,
    flexShrink: 1, // Allow shrinking if needed
  },
  labelValue: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
    flexWrap: "wrap",
    paddingLeft: 8,
    marginLeft: 0, // Reset margin
  },
  valueContainer: {
    flex: 1,
  },
  categoryValue: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: "flex-start",
    fontWeight: "700",
  },
  detailSection: {
    marginTop: 4,
  },
  detailItem: {
    marginTop: 12,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 4,
    opacity: 0.8,
  },
  detailText: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "500",
  },
  attachmentBox: {
    height: 80,
    borderRadius: 12,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderStyle: "dashed",
  },
  attachmentText: {
    fontSize: 12,
    color: "#888",
    marginTop: 6,
  },
  mapContainer: {
    height: 140,
    borderRadius: 12,
    marginTop: 16,
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
    width: 32,
    height: 32,
    borderRadius: 16,
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
    borderLeftWidth: 6,
    borderRightWidth: 6,
    borderTopWidth: 10,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    marginTop: -2,
  },
  mapOverlayButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#027A61",
  },
  mapOverlayText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#027A61",
    marginLeft: 4,
  },
  navBtn: {
    marginTop: 16,
    backgroundColor: "#027A61",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  navBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
    marginLeft: 8,
  },
  timelineContainer: {
    marginTop: 8,
  },
  progressRow: {
    flexDirection: "row",
    minHeight: 48,
  },
  progressLeft: {
    width: 28,
    alignItems: "center",
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#FFF",
    zIndex: 2,
  },
  stepIcon: {
    position: "absolute",
  },
  lineContainer: {
    width: 2,
    height: 40,
    backgroundColor: "#E5E5E5",
    overflow: "hidden",
    marginTop: -2,
  },
  lineFill: {
    height: "100%",
    width: "0%",
  },
  progressContent: {
    paddingLeft: 12,
    paddingBottom: 8,
    flex: 1,
    justifyContent: "center",
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: "600",
  },
  metadataGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
    marginBottom: 12,
  },
  metadataItem: {
    flex: 1,
    minWidth: "45%",
    margin: 4,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  metadataLabel: {
    fontSize: 11,
    fontWeight: "500",
    marginTop: 2,
    opacity: 0.8,
  },
  metadataValue: {
    fontSize: 14,
    fontWeight: "700",
    marginTop: 4,
  },
  metadataDetails: {
    marginTop: 8,
  },
  metadataDetailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    paddingVertical: 4,
  },
  metadataKey: {
    fontSize: 13,
    fontWeight: "600",
    opacity: 0.8,
  },
  metadataDetailValue: {
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
  },
  actionsGrid: {
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  actionBtn: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 1.5,
    minHeight: 70,
  },
  actionIcon: {
    marginBottom: 6,
  },
  actionBtnText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
});
