import { useTheme } from "@/theme/ThemeContext";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

const knowledgeBaseData = [
  {
    id: 1,
    titleKey: "emotionalSupportTab.anxietyTitle",
    subtitleKey: "emotionalSupportTab.anxietySubtitle",
    type: "Anxiety",
  },
  {
    id: 2,
    titleKey: "emotionalSupportTab.lifeTitle",
    subtitleKey: "emotionalSupportTab.lifeSubtitle",
    type: "Life",
  },
  {
    id: 3,
    titleKey: "emotionalSupportTab.deathTitle",
    subtitleKey: "emotionalSupportTab.deathSubtitle",
    type: "Death",
  },
  {
    id: 4,
    titleKey: "emotionalSupportTab.bereavementTitle",
    subtitleKey: "emotionalSupportTab.bereavementSubtitle",
    type: "Bereavement",
  },
  {
    id: 5,
    titleKey: "emotionalSupportTab.relationshipTitle",
    subtitleKey: "emotionalSupportTab.relationshipSubtitle",
    type: "Relationship",
  },
];

export default function EmotionalSupportTab({ search = "" }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // ===============================
  // THEME-BASED UI COLOR MAPPING
  // ===============================
  const uiMap: any = {
    Anxiety: {
      bg: theme.colors.validationWarningBg,
      iconBg: theme.colors.validationWarningText,
      icon: "emotion-line",
    },
    Life: {
      bg: theme.colors.validationInfoBg,
      iconBg: theme.colors.validationInfoText,
      icon: "task-line",
    },
    Relationship: {
      bg: theme.colors.validationInfoBg,
      iconBg: theme.colors.validationInfoText,
      icon: "group-line",
    },
    Death: {
      bg: theme.colors.validationErrorBg,
      iconBg: theme.colors.validationErrorText,
      icon: "heart-line",
    },
    Bereavement: {
      bg: theme.colors.validationSuccessBg,
      iconBg: theme.colors.validationSuccessText,
      icon: "home-5-line",
    },
  };

  const filteredData = useMemo(() => {
    if (!search.trim()) return knowledgeBaseData;

    return knowledgeBaseData.filter(
      (item) =>
        t(item.titleKey).toLowerCase().includes(search.toLowerCase()) ||
        t(item.subtitleKey).toLowerCase().includes(search.toLowerCase()),
    );
  }, [search, t]);

  return (
    <FlatList
      data={filteredData}
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={({ item }) => {
        const ui = uiMap[item.type];
        const title = t(item.titleKey);
        const subtitle = t(item.subtitleKey);

        return (
          <View style={[styles.card, { backgroundColor: ui.bg }]}>
            {/* ICON */}
            <View style={[styles.iconBox, { backgroundColor: ui.iconBg }]}>
              <RemixIcon
                name={ui.icon}
                size={20}
                color={theme.colors.colorBgSurface}
              />
            </View>

            {/* TEXT */}
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.title,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {title}
              </Text>
              <Text
                style={[
                  styles.subtitle,
                  { color: theme.colors.colorTextSecondary },
                ]}
              >
                {subtitle}
              </Text>
            </View>

            {/* ARROW */}
            <RemixIcon name="arrow-right-up-line" size={20} color={ui.iconBg} />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 12,
    marginTop: 2,
  },
});
