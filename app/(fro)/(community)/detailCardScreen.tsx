import BodyLayout from "@/components/layout/BodyLayout";
import { getElderUserMemberList } from "@/features/fro/complaints/ElderMemberList";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";

import {
  Dimensions,
  FlatList,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const { width, height } = Dimensions.get("window");

/* RESPONSIVE SCALE */
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

interface FamilyMember {
  id: number;
  name: string;
  relatedTo: string;
  relatedToId: number;
  relatedToName: string;
  relationshipName: string;
  gender: string;
  profilePhoto: string | null;
  state: string;
  city: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  additionalInfo: string | null;
  phoneNumber: string;
  createdDate: string;
}

// Relationship color mapping for vibrant cards
const RELATIONSHIP_COLORS = {
  Daughter: { bg: "#FFE4E6", text: "#E11D48", icon: "#FB7185" },
  Son: { bg: "#E0F2FE", text: "#0369A1", icon: "#38BDF8" },
  Spouse: { bg: "#F1F5F9", text: "#334155", icon: "#64748B" },
  Father: { bg: "#DCFCE7", text: "#166534", icon: "#4ADE80" },
  Mother: { bg: "#FCE7F3", text: "#9D174D", icon: "#F472B6" },
  Brother: { bg: "#FEF3C7", text: "#92400E", icon: "#FBBF24" },
  Sister: { bg: "#FFEDD5", text: "#9A3412", icon: "#FB923C" },
  Grandson: { bg: "#E0F2FE", text: "#075985", icon: "#7DD3FC" },
  Granddaughter: { bg: "#FCE7F3", text: "#831843", icon: "#F9A8D4" },
  Caretaker: { bg: "#EDE9FE", text: "#5B21B6", icon: "#A78BFA" },
  Guardian: { bg: "#CCFBF1", text: "#115E59", icon: "#5EEAD4" },
  default: { bg: "#F3F4F6", text: "#1F2937", icon: "#6B7280" },
};

export default function CustomerDetailScreen() {
  const params = useLocalSearchParams();
  const contactId = params?.ContactId as string;
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const authState = useAppSelector((state) => state.auth);

  /* MOCK DATA (Replace API later) */
  const customer = {
    name: "Rahul Sharma",
    age: 72,
    gender: "Male",
    phone: "9876543210",
    emergency: "9123456780",
    address: "Delhi, India",
    id: "CUST-1023",
  };

  const medical = {
    bloodGroup: "B+",
    conditions: "Diabetes, Hypertension",
    allergies: "Penicillin",
    doctor: "Dr. Mehta",
    lastCheckup: "15 Feb 2026",
    insurance: "Star Health - Gold Plan",
  };

  const activity = [
    { date: "12 Feb", title: "Home Visit Completed", status: "completed" },
    { date: "15 Feb", title: "Medication Delivered", status: "completed" },
    { date: "20 Feb", title: "Follow-up Call Done", status: "pending" },
    { date: "25 Feb", title: "Doctor Appointment", status: "upcoming" },
  ];

  const tabs = [
    "Family Details",
    "Medical Details",
    "Activity History",
    "Documents",
  ];

  useEffect(() => {
    fetchMemberList();
  }, []);

  const fetchMemberList = async () => {
    try {
      setLoading(true);
      const response = await getElderUserMemberList({
        relatedToId: "1",
        token: String(authState?.token),
        csrfToken: String(authState?.antiforgeryToken),
        pageNumber: 1,
        pageSize: 11,
      });

      if (response?.data?.elderUserMemberList) {
        setFamilyMembers(response.data.elderUserMemberList);
      }
    } catch (error) {
      console.log("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = (phoneNumber: string) => {
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleMessage = (phoneNumber: string) => {
    Linking.openURL(`sms:${phoneNumber}`);
  };

  const getRelationshipColors = (relationship: string) => {
    return (
      RELATIONSHIP_COLORS[relationship as keyof typeof RELATIONSHIP_COLORS] ||
      RELATIONSHIP_COLORS.default
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const renderFamilyMember = ({
    item,
    index,
  }: {
    item: FamilyMember;
    index: number;
  }) => {
    const colors = getRelationshipColors(item.relationshipName);

    return (
      <View style={[styles.memberCard, { marginTop: index === 0 ? 0 : 12 }]}>
        {/* Card Header with Relationship Badge */}
        <View style={styles.memberCardHeader}>
          <View
            style={[styles.relationshipBadge, { backgroundColor: colors.bg }]}
          >
            <Text style={[styles.relationshipText, { color: colors.text }]}>
              {item.relationshipName}
            </Text>
          </View>

          {item.additionalInfo && (
            <View
              style={[
                styles.primaryBadge,
                { backgroundColor: theme.colors.colorPrimary50 },
              ]}
            >
              <Text
                style={[
                  styles.primaryText,
                  { color: theme.colors.colorPrimary600 },
                ]}
              >
                Primary Contact
              </Text>
            </View>
          )}
        </View>

        {/* Member Info Row */}
        <View style={styles.memberInfoRow}>
          {/* Avatar with gradient-like background */}
          <View style={[styles.memberAvatar, { backgroundColor: colors.bg }]}>
            {item.profilePhoto ? (
              // Add Image component here when profile photos are available
              <Text style={[styles.avatarInitials, { color: colors.text }]}>
                {getInitials(item.name)}
              </Text>
            ) : (
              <RemixIcon
                name={item.gender === "Male" ? "user-3-fill" : "user-3-line"}
                size={28}
                color={colors.icon}
              />
            )}
          </View>

          <View style={styles.memberMainInfo}>
            <Text
              style={[
                styles.memberName,
                { color: theme.colors.colorTextPrimary },
              ]}
            >
              {item.name}
            </Text>
            <View style={styles.memberMetaRow}>
              <View style={styles.genderChip}>
                <RemixIcon
                  name={item.gender === "Male" ? "male-line" : "female-line"}
                  size={14}
                  color={item.gender === "Male" ? "#3B82F6" : "#EC4899"}
                />
                <Text style={styles.genderText}>{item.gender}</Text>
              </View>
              <Text style={styles.memberSince}>
                Member since {new Date(item.createdDate).getFullYear()}
              </Text>
            </View>
          </View>
        </View>

        {/* Contact Information Section */}
        <View style={styles.contactSection}>
          <View style={styles.contactItem}>
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: colors.bg + "40" },
              ]}
            >
              <RemixIcon name="phone-line" size={16} color={colors.text} />
            </View>
            <View style={styles.contactDetails}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text
                style={[
                  styles.contactValue,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {item.phoneNumber}
              </Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.bg }]}
                onPress={() => handleCall(item.phoneNumber)}
              >
                <RemixIcon name="phone-fill" size={16} color={colors.text} />
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: colors.bg }]}
                onPress={() => handleMessage(item.phoneNumber)}
              >
                <RemixIcon name="chat-1-fill" size={16} color={colors.text} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Address Section */}
        <View style={styles.addressSection}>
          <View style={styles.locationHeader}>
            <RemixIcon
              name="map-pin-line"
              size={16}
              color={theme.colors.colorTextSecondary}
            />
            <Text style={styles.addressLabel}>Address</Text>
          </View>

          <Text
            style={[
              styles.addressText,
              { color: theme.colors.colorTextPrimary },
            ]}
          >
            {[item.addressLine1, item.addressLine2].filter(Boolean).join(", ")}
          </Text>

          <View style={styles.locationTags}>
            <View
              style={[
                styles.locationTag,
                { backgroundColor: theme.colors.colorPrimary50 },
              ]}
            >
              <RemixIcon
                name="building-line"
                size={12}
                color={theme.colors.colorPrimary600}
              />
              <Text
                style={[
                  styles.locationTagText,
                  { color: theme.colors.colorPrimary600 },
                ]}
              >
                {item.city}
              </Text>
            </View>

            <View
              style={[
                styles.locationTag,
                { backgroundColor: theme.colors.colorPrimary50 },
              ]}
            >
              <RemixIcon
                name="flag-line"
                size={12}
                color={theme.colors.colorPrimary600}
              />
              <Text
                style={[
                  styles.locationTagText,
                  { color: theme.colors.colorPrimary600 },
                ]}
              >
                {item.state}
              </Text>
            </View>

            {item.landmark && (
              <View
                style={[styles.locationTag, { backgroundColor: "#FEF3C7" }]}
              >
                <RemixIcon name="navigation-line" size={12} color="#92400E" />
                <Text style={[styles.locationTagText, { color: "#92400E" }]}>
                  {item.landmark}
                </Text>
              </View>
            )}

            <View style={[styles.locationTag, { backgroundColor: "#F1F5F9" }]}>
              <RemixIcon name="mail-line" size={12} color="#475569" />
              <Text style={[styles.locationTagText, { color: "#475569" }]}>
                {item.pincode}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View style={styles.tabContent}>
            {loading ? (
              <View style={styles.loadingContainer}>
                <View
                  style={[
                    styles.loadingCard,
                    { backgroundColor: theme.colors.colorBgSurface },
                  ]}
                >
                  <RemixIcon
                    name="loader-4-line"
                    size={40}
                    color={theme.colors.colorPrimary600}
                  />
                  <Text
                    style={[
                      styles.loadingText,
                      { color: theme.colors.colorTextSecondary },
                    ]}
                  >
                    Loading family members...
                  </Text>
                </View>
              </View>
            ) : familyMembers.length > 0 ? (
              <View>
                <View style={styles.familySummary}>
                  <View
                    style={[
                      styles.summaryCard,
                      { backgroundColor: theme.colors.colorPrimary50 },
                    ]}
                  >
                    <Text
                      style={[
                        styles.summaryNumber,
                        { color: theme.colors.colorPrimary600 },
                      ]}
                    >
                      {familyMembers.length}
                    </Text>
                    <Text
                      style={[
                        styles.summaryLabel,
                        { color: theme.colors.colorTextSecondary },
                      ]}
                    >
                      Family Members
                    </Text>
                  </View>
                  <View
                    style={[styles.summaryCard, { backgroundColor: "#FEF3C7" }]}
                  >
                    <Text style={[styles.summaryNumber, { color: "#92400E" }]}>
                      {
                        familyMembers.filter(
                          (m) =>
                            m.relationshipName === "Daughter" ||
                            m.relationshipName === "Son",
                        ).length
                      }
                    </Text>
                    <Text style={[styles.summaryLabel, { color: "#92400E" }]}>
                      Children
                    </Text>
                  </View>
                </View>

                <FlatList
                  data={familyMembers}
                  renderItem={renderFamilyMember}
                  keyExtractor={(item) => item.id.toString()}
                  scrollEnabled={false}
                  showsVerticalScrollIndicator={false}
                />
              </View>
            ) : (
              <View style={styles.emptyContainer}>
                <View
                  style={[
                    styles.emptyCard,
                    { backgroundColor: theme.colors.colorBgSurface },
                  ]}
                >
                  <RemixIcon
                    name="group-line"
                    size={60}
                    color={theme.colors.colorTextSecondary}
                  />
                  <Text
                    style={[
                      styles.emptyTitle,
                      { color: theme.colors.colorTextPrimary },
                    ]}
                  >
                    No family members found
                  </Text>
                  <Text
                    style={[
                      styles.emptySubtext,
                      { color: theme.colors.colorTextSecondary },
                    ]}
                  >
                    Add family members to keep track of your loved ones
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.addButton,
                      { backgroundColor: theme.colors.colorPrimary600 },
                    ]}
                  >
                    <RemixIcon name="add-line" size={20} color="#fff" />
                    <Text style={styles.addButtonText}>Add Family Member</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        );

      case 1:
        return (
          <View style={styles.medicalContainer}>
            <View style={[styles.vitalCard, { backgroundColor: "#FEF2F2" }]}>
              <View style={styles.vitalHeader}>
                <RemixIcon name="heart-pulse-line" size={24} color="#DC2626" />
                <Text style={styles.vitalTitle}>Blood Group</Text>
              </View>
              <Text style={styles.vitalValue}>{medical.bloodGroup}</Text>
            </View>

            <View style={[styles.vitalCard, { backgroundColor: "#EFF6FF" }]}>
              <View style={styles.vitalHeader}>
                <RemixIcon name="stethoscope-line" size={24} color="#2563EB" />
                <Text style={styles.vitalTitle}>Medical Conditions</Text>
              </View>
              <Text style={styles.vitalValue}>{medical.conditions}</Text>
            </View>

            <View style={[styles.vitalCard, { backgroundColor: "#FEFCE8" }]}>
              <View style={styles.vitalHeader}>
                <RemixIcon name="alert-line" size={24} color="#CA8A04" />
                <Text style={styles.vitalTitle}>Allergies</Text>
              </View>
              <Text style={styles.vitalValue}>{medical.allergies}</Text>
            </View>

            <View
              style={[
                styles.infoGrid,
                { backgroundColor: theme.colors.colorBgSurface },
              ]}
            >
              <View style={styles.infoRow}>
                <View style={styles.infoItem}>
                  <RemixIcon
                    name="user-star-line"
                    size={18}
                    color={theme.colors.colorTextSecondary}
                  />
                  <Text style={styles.infoLabel}>Primary Doctor</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme.colors.colorTextPrimary },
                    ]}
                  >
                    {medical.doctor}
                  </Text>
                </View>

                <View style={styles.infoItem}>
                  <RemixIcon
                    name="calendar-check-line"
                    size={18}
                    color={theme.colors.colorTextSecondary}
                  />
                  <Text style={styles.infoLabel}>Last Checkup</Text>
                  <Text
                    style={[
                      styles.infoValue,
                      { color: theme.colors.colorTextPrimary },
                    ]}
                  >
                    {medical.lastCheckup}
                  </Text>
                </View>
              </View>

              <View style={styles.infoDivider} />

              <View style={styles.infoItem}>
                <RemixIcon
                  name="shield-star-line"
                  size={18}
                  color={theme.colors.colorTextSecondary}
                />
                <Text style={styles.infoLabel}>Insurance</Text>
                <Text
                  style={[
                    styles.infoValue,
                    { color: theme.colors.colorTextPrimary },
                  ]}
                >
                  {medical.insurance}
                </Text>
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.activityContainer}>
            {activity.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.timelineCard,
                  { backgroundColor: theme.colors.colorBgSurface },
                ]}
              >
                <View style={styles.timelineRow}>
                  <View style={styles.timelineLeft}>
                    <View
                      style={[
                        styles.timelineDot,
                        item.status === "completed" && {
                          backgroundColor: "#22C55E",
                        },
                        item.status === "pending" && {
                          backgroundColor: "#F59E0B",
                        },
                        item.status === "upcoming" && {
                          backgroundColor: "#3B82F6",
                        },
                      ]}
                    />
                    {i < activity.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>

                  <View style={styles.timelineContent}>
                    <View style={styles.timelineHeader}>
                      <Text
                        style={[
                          styles.timelineTitle,
                          { color: theme.colors.colorTextPrimary },
                        ]}
                      >
                        {item.title}
                      </Text>
                      <View
                        style={[
                          styles.statusPill,
                          item.status === "completed" && {
                            backgroundColor: "#DCFCE7",
                          },
                          item.status === "pending" && {
                            backgroundColor: "#FEF3C7",
                          },
                          item.status === "upcoming" && {
                            backgroundColor: "#DBEAFE",
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.statusPillText,
                            item.status === "completed" && { color: "#166534" },
                            item.status === "pending" && { color: "#92400E" },
                            item.status === "upcoming" && { color: "#1E40AF" },
                          ]}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.timelineMeta}>
                      <RemixIcon
                        name="calendar-line"
                        size={14}
                        color={theme.colors.colorTextSecondary}
                      />
                      <Text
                        style={[
                          styles.timelineDate,
                          { color: theme.colors.colorTextSecondary },
                        ]}
                      >
                        {item.date}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        );

      case 3:
        return (
          <View style={styles.documentsContainer}>
            <View
              style={[
                styles.documentCard,
                { backgroundColor: theme.colors.colorBgSurface },
              ]}
            >
              <View style={styles.documentIcon}>
                <RemixIcon name="file-pdf-line" size={32} color="#DC2626" />
              </View>
              <View style={styles.documentInfo}>
                <Text
                  style={[
                    styles.documentName,
                    { color: theme.colors.colorTextPrimary },
                  ]}
                >
                  Medical History.pdf
                </Text>
                <Text
                  style={[
                    styles.documentSize,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  2.4 MB • Uploaded 12 Feb 2026
                </Text>
              </View>
              <TouchableOpacity style={styles.documentAction}>
                <RemixIcon
                  name="download-line"
                  size={20}
                  color={theme.colors.colorPrimary600}
                />
              </TouchableOpacity>
            </View>

            <View
              style={[
                styles.documentCard,
                { backgroundColor: theme.colors.colorBgSurface },
              ]}
            >
              <View style={styles.documentIcon}>
                <RemixIcon name="file-image-line" size={32} color="#2563EB" />
              </View>
              <View style={styles.documentInfo}>
                <Text
                  style={[
                    styles.documentName,
                    { color: theme.colors.colorTextPrimary },
                  ]}
                >
                  Prescription_Feb2026.jpg
                </Text>
                <Text
                  style={[
                    styles.documentSize,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  1.1 MB • Uploaded 15 Feb 2026
                </Text>
              </View>
              <TouchableOpacity style={styles.documentAction}>
                <RemixIcon
                  name="download-line"
                  size={20}
                  color={theme.colors.colorPrimary600}
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.uploadButton,
                { borderColor: theme.colors.colorPrimary600 },
              ]}
            >
              <RemixIcon
                name="upload-2-line"
                size={20}
                color={theme.colors.colorPrimary600}
              />
              <Text
                style={[
                  styles.uploadButtonText,
                  { color: theme.colors.colorPrimary600 },
                ]}
              >
                Upload New Document
              </Text>
            </TouchableOpacity>
          </View>
        );
    }
  };

  return (
    <BodyLayout type="screen" screenName="Customer Details">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* PROFILE CARD */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.colors.colorPrimary50,
            },
          ]}
        >
          <View style={styles.profileHeader}>
            <View style={styles.profileAvatarWrapper}>
              <View
                style={[
                  styles.profileAvatar,
                  { backgroundColor: theme.colors.colorPrimary100 },
                ]}
              >
                <RemixIcon
                  name="user-3-fill"
                  size={36}
                  color={theme.colors.colorPrimary600}
                />
              </View>
              <View
                style={[
                  styles.profileBadge,
                  { backgroundColor: theme.colors.colorPrimary600 },
                ]}
              >
                <RemixIcon name="verified-badge-fill" size={16} color="#fff" />
              </View>
            </View>

            <View style={styles.profileInfo}>
              <Text
                style={[
                  styles.profileName,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                {customer.name}
              </Text>

              <View style={styles.profileTags}>
                <View
                  style={[
                    styles.profileTag,
                    { backgroundColor: theme.colors.colorPrimary100 },
                  ]}
                >
                  <RemixIcon
                    name="cake-line"
                    size={14}
                    color={theme.colors.colorPrimary600}
                  />
                  <Text
                    style={[
                      styles.profileTagText,
                      { color: theme.colors.colorPrimary600 },
                    ]}
                  >
                    {customer.age} yrs
                  </Text>
                </View>

                <View
                  style={[
                    styles.profileTag,
                    { backgroundColor: theme.colors.colorPrimary100 },
                  ]}
                >
                  <RemixIcon
                    name={
                      customer.gender === "Male" ? "male-line" : "female-line"
                    }
                    size={14}
                    color={theme.colors.colorPrimary600}
                  />
                  <Text
                    style={[
                      styles.profileTagText,
                      { color: theme.colors.colorPrimary600 },
                    ]}
                  >
                    {customer.gender}
                  </Text>
                </View>
              </View>

              <View style={styles.profileContact}>
                <View style={styles.profileContactItem}>
                  <RemixIcon
                    name="phone-line"
                    size={14}
                    color={theme.colors.colorTextSecondary}
                  />
                  <Text
                    style={[
                      styles.profileContactText,
                      { color: theme.colors.colorTextSecondary },
                    ]}
                  >
                    {customer.phone}
                  </Text>
                </View>

                <View style={styles.profileContactItem}>
                  <RemixIcon
                    name="map-pin-line"
                    size={14}
                    color={theme.colors.colorTextSecondary}
                  />
                  <Text
                    style={[
                      styles.profileContactText,
                      { color: theme.colors.colorTextSecondary },
                    ]}
                  >
                    {customer.address}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* TABS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsWrapper}
          contentContainerStyle={styles.tabsContent}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(index)}
              style={[
                styles.tab,
                activeTab === index && {
                  backgroundColor: theme.colors.colorPrimary600,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: theme.colors.colorTextSecondary },
                  activeTab === index && { color: "#fff" },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TAB CONTENT */}
        <View style={styles.tabContentContainer}>{renderTabContent()}</View>
      </ScrollView>
    </BodyLayout>
  );
}

/* STYLES */
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: verticalScale(30),
  },

  profileCard: {
    marginTop: verticalScale(14),
    marginHorizontal: moderateScale(16),
    padding: moderateScale(20),
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },

  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileAvatarWrapper: {
    position: "relative",
    marginRight: 16,
  },

  profileAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
  },

  profileBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 6,
  },

  profileTags: {
    flexDirection: "row",
    marginBottom: 8,
  },

  profileTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
    marginRight: 8,
  },

  profileTagText: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 4,
  },

  profileContact: {
    gap: 4,
  },

  profileContactItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  profileContactText: {
    fontSize: 13,
    marginLeft: 6,
  },

  tabsWrapper: {
    marginTop: 20,
  },

  tabsContent: {
    paddingHorizontal: moderateScale(16),
    gap: 8,
  },

  tab: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },

  tabContentContainer: {
    paddingHorizontal: moderateScale(16),
    marginTop: 20,
  },

  tabContent: {
    flex: 1,
  },

  // Family Summary Styles
  familySummary: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },

  summaryCard: {
    flex: 1,
    padding: moderateScale(16),
    borderRadius: 16,
    alignItems: "center",
  },

  summaryNumber: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 4,
  },

  summaryLabel: {
    fontSize: 13,
    fontWeight: "500",
  },

  // Member Card Styles
  memberCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: moderateScale(16),
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },

  memberCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  relationshipBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },

  relationshipText: {
    fontSize: 12,
    fontWeight: "700",
  },

  primaryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  primaryText: {
    fontSize: 11,
    fontWeight: "600",
  },

  memberInfoRow: {
    flexDirection: "row",
    marginBottom: 16,
  },

  memberAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  avatarInitials: {
    fontSize: 20,
    fontWeight: "700",
  },

  memberMainInfo: {
    flex: 1,
    justifyContent: "center",
  },

  memberName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },

  memberMetaRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  genderChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F3F4F6",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },

  genderText: {
    fontSize: 12,
    color: "#4B5563",
    marginLeft: 4,
  },

  memberSince: {
    fontSize: 12,
    color: "#6B7280",
  },

  contactSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  contactDetails: {
    flex: 1,
  },

  contactLabel: {
    fontSize: 11,
    color: "#6B7280",
    marginBottom: 2,
  },

  contactValue: {
    fontSize: 15,
    fontWeight: "600",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },

  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
  },

  addressSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 16,
    padding: 12,
  },

  locationHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  addressLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#374151",
    marginLeft: 6,
  },

  addressText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 12,
  },

  locationTags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  locationTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 4,
  },

  locationTagText: {
    fontSize: 12,
    fontWeight: "500",
  },

  // Medical Tab Styles
  medicalContainer: {
    gap: 12,
  },

  vitalCard: {
    padding: moderateScale(16),
    borderRadius: 16,
  },

  vitalHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },

  vitalTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
    marginLeft: 8,
  },

  vitalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  infoGrid: {
    padding: moderateScale(16),
    borderRadius: 16,
    marginTop: 4,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 4,
    marginBottom: 2,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: "600",
  },

  infoDivider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 16,
  },

  // Activity Tab Styles
  activityContainer: {
    gap: 12,
  },

  timelineCard: {
    padding: moderateScale(16),
    borderRadius: 16,
  },

  timelineRow: {
    flexDirection: "row",
  },

  timelineLeft: {
    alignItems: "center",
    marginRight: 16,
  },

  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginTop: 4,
  },

  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: "#E5E7EB",
    marginTop: 4,
  },

  timelineContent: {
    flex: 1,
  },

  timelineHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },

  timelineTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },

  statusPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },

  statusPillText: {
    fontSize: 11,
    fontWeight: "600",
  },

  timelineMeta: {
    flexDirection: "row",
    alignItems: "center",
  },

  timelineDate: {
    fontSize: 13,
    marginLeft: 6,
  },

  // Documents Tab Styles
  documentsContainer: {
    gap: 12,
  },

  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: moderateScale(16),
    borderRadius: 16,
  },

  documentIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  documentInfo: {
    flex: 1,
  },

  documentName: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },

  documentSize: {
    fontSize: 12,
  },

  documentAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: "dashed",
    marginTop: 8,
    gap: 8,
  },

  uploadButtonText: {
    fontSize: 15,
    fontWeight: "600",
  },

  // Empty States
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },

  emptyCard: {
    alignItems: "center",
    padding: moderateScale(32),
    borderRadius: 24,
    width: "100%",
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },

  emptySubtext: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 24,
  },

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 24,
    gap: 8,
  },

  addButtonText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  loadingContainer: {
    paddingVertical: 40,
  },

  loadingCard: {
    alignItems: "center",
    padding: moderateScale(32),
    borderRadius: 24,
  },

  loadingText: {
    fontSize: 15,
    marginTop: 12,
  },
});
