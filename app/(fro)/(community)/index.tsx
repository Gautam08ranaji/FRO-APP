import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// TAB SCREENS
import InformationTab from "./InformationTabs";
import DocumentsTab from "./documents";
import EmotionalSupportTab from "./emotionalSupport";
import FieldInterventionTab from "./fieldIntervention";
import GuidanceTab from "./guidance";
import SchemeTab from "./scheme";

type TabKey =
  | "scheme"
  | "information"
  | "guidance"
  | "field_intervention"
  | "emotional_support"
  | "documents";

export default function InfoScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState<TabKey>("information");

  const tabs: { key: TabKey; label: string }[] = [
    { key: "scheme", label: t("infoTabs.scheme") },
    { key: "information", label: t("infoTabs.information") },
    { key: "guidance", label: t("infoTabs.guidance") },
    {
      key: "field_intervention",
      label: t("infoTabs.fieldIntervention"),
    },
    {
      key: "emotional_support",
      label: t("infoTabs.emotionalSupport"),
    },
    { key: "documents", label: t("infoTabs.documents") },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "information":
        return <InformationTab />;
      case "guidance":
        return <GuidanceTab />;
      case "field_intervention":
        return <FieldInterventionTab />;
      case "emotional_support":
        return <EmotionalSupportTab />;
      case "scheme":
        return <SchemeTab />;
      case "documents":
        return <DocumentsTab />;
      default:
        return null;
    }
  };

  return (
    <BodyLayout
      type="screen"
      screenName="jwgfd"
      scrollContentStyle={{
        paddingHorizontal: 0,
        paddingBottom: 0,
        flex: 1,
      }}
    >
      {/* FIXED TABS HEADER - NOT SCROLLING */}
      <View
        style={[
          styles.tabsContainer,
          {
            backgroundColor: theme.colors.colorPrimary50,
            borderColor: theme.colors.btnPrimaryBg,
          },
        ]}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollTabs}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => setActiveTab(tab.key)}
                style={[
                  styles.tab,
                  { borderColor: theme.colors.btnPrimaryBg },
                  isActive && { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  style={[
                    styles.tabText,
                    { color: theme.colors.colorPrimary600 },
                    isActive && { color: theme.colors.btnPrimaryText },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* CONTENT - NO SCROLLVIEW, LET BODYLAYOUT HANDLE SCROLLING */}
      <View style={styles.contentWrapper}>{renderTabContent()}</View>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  tabsContainer: {
    borderBottomWidth: 2,
  },
  scrollTabs: {
    flexDirection: "row",
    // paddingTop: 6,
  },
  tab: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRightWidth: 2,
  },
  tabText: {
    fontSize: 14,
    maxWidth: 140,
  },
  contentWrapper: {
    flex: 1,
    marginTop: 20,
  },
});
