import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

/* ------------ TAB CONFIG ------------ */
const tabs = [
  { key: "policy", labelKey: "policy" },
  { key: "act", labelKey: "actRules" },
  { key: "documents", labelKey: "documents" },
  { key: "press", labelKey: "pressRelease" },
];

/* ------------ DATA CONFIG ------------ */
const data = [
  {
    id: 1,
    titleKey: "policyTitle",
    descKey: "policyDesc",
    category: "policy",
  },
  {
    id: 2,
    titleKey: "actTitle",
    descKey: "actDesc",
    category: "act",
  },
  {
    id: 3,
    titleKey: "documentsTitle",
    descKey: "documentsDesc",
    category: "documents",
  },
  {
    id: 4,
    titleKey: "pressTitle",
    descKey: "pressDesc",
    category: "press",
  },
];

export default function DocumentsTab() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [activeTab, setActiveTab] = useState("policy");

  /* ------------ FILTER ------------ */
  const filteredData = useMemo(() => {
    return data.filter((item) => item.category === activeTab);
  }, [activeTab]);

  return (
    <View>
      {/* ---------- TABS ---------- */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.tabContainer}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <TouchableOpacity
              key={tab.key}
              style={[
                styles.tabButton,
                {
                  backgroundColor: isActive
                    ? theme.colors.btnPrimaryBg
                    : theme.colors.colorBgPage,
                  borderColor: isActive
                    ? theme.colors.btnPrimaryBg
                    : theme.colors.colorBorder,
                },
              ]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive
                      ? theme.colors.btnPrimaryText
                      : theme.colors.colorTextSecondary,
                  },
                ]}
              >
                {t(`documentsTab.tabs.${tab.labelKey}`)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ---------- CARD LIST ---------- */}
      {filteredData.map((item) => (
        <View
          key={item.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.colorBgSurface,
              borderColor: theme.colors.colorBorder,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.colors.colorPrimary600 }]}>
            {t(`documentsTab.${item.titleKey}`)}
          </Text>

          <Text
            style={[
              styles.description,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {t(`documentsTab.${item.descKey}`)}
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.btnPrimaryBg },
            ]}
            onPress={() => router.push("/articlepage")}
            activeOpacity={0.85}
          >
            <RemixIcon
              name="file-text-line"
              size={16}
              color={theme.colors.btnPrimaryText}
            />
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.btnPrimaryText },
              ]}
            >
              {t("documentsTab.viewDocument")}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

/* ------------ STYLES ------------ */
const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    paddingVertical: 6,
    paddingHorizontal: 2,
  },

  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 24,
    marginRight: 10,
    borderWidth: 1,
  },

  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },

  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 22,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 14,
  },

  button: {
    flexDirection: "row",
    gap: 8,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
