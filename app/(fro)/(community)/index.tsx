import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View,
} from "react-native";

// IMPORT ALL TAB SCREENS
import InformationTab from "./InformationTabs";
import DocumentsTab from "./documents";
import EmotionalSupportTab from "./emotionalSupport";
import FieldInterventionTab from "./fieldIntervention";
import GuidanceTab from "./guidance";
import SchemeTab from "./scheme";

// ENABLE ANDROID LAYOUT ANIMATION
if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental?.(true);
}

const SCREEN_HEIGHT = Dimensions.get("window").height;

export default function InfoScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const headerHeightRef = useRef(0);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  const [activeTab, setActiveTab] = useState<
    | "scheme"
    | "information"
    | "guidance"
    | "field_intervention"
    | "emotional_support"
    | "Documents"
  >("information");

  const tabs = useMemo(
    () => [
      { key: "scheme", label: "Article" },
      { key: "information", label: "Information" },
      { key: "guidance", label: "Guidance"},
      { key: "field_intervention", label: "Field Intervention" },
      { key: "emotional_support", label: "Emotional Support" },
      { key: "Documents", label: "Documents" },
    ],
    [t]
  );

  const handleTabChange = (key: typeof activeTab) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setActiveTab(key);
  };

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
      case "Documents":
        return <DocumentsTab />;
      default:
        return null;
    }
  };

  return (
    <BodyLayout type="screen" screenName="Community">
      {/* TABS HEADER */}
      <View
        onLayout={(e) => {
          headerHeightRef.current = e.nativeEvent.layout.height;
          setContentHeight(SCREEN_HEIGHT - headerHeightRef.current - 100);
        }}
      >
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={[
            styles.scrollTabs,
            {
              backgroundColor: theme.colors.colorPrimary50,
              borderColor: theme.colors.btnPrimaryBg,
            },
          ]}
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;

            return (
              <TouchableOpacity
                key={tab.key}
                onPress={() => handleTabChange(tab.key as typeof activeTab)}
                style={[
                  styles.tab,
                  { borderColor: theme.colors.btnPrimaryBg },
                  isActive && { backgroundColor: theme.colors.primary },
                ]}
              >
                <Text
                  numberOfLines={1}
                  style={[
                    styles.tabText,
                    { color: theme.colors.colorPrimary600 },
                    isActive && { color: theme.colors.btnPrimaryText },
                  ]}
                >
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* 🔒 FIXED HEIGHT CONTENT */}
      {contentHeight && (
        <View style={[styles.contentContainer, { height: contentHeight }]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            {renderTabContent()}
          </ScrollView>
        </View>
      )}
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  scrollTabs: {
    flexDirection: "row",
    paddingTop: 6,
    borderBottomWidth: 2,
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
  contentContainer: {
    padding: 16,
  },
});
