import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

/* ------------ DATA ------------ */
const knowledgeBaseData = [
  { id: 1, type: "health", category: "health" },
  { id: 2, type: "shelter", category: "shelter" },
  { id: 3, type: "nutrition", category: "nutrition" },
  { id: 4, type: "dayCare", category: "dayCare" },
  { id: 5, type: "elder", category: "elder" },
  { id: 6, type: "cultural", category: "cultural" },
  { id: 7, type: "companionship", category: "companionship" },
];

/* ------------ i18n KEY MAP ------------ */
const i18nKeyMap: any = {
  health: {
    title: "healthTitle",
    subtitle: "healthSubtitle",
  },
  shelter: {
    title: "shelterTitle",
    subtitle: "shelterSubtitle",
  },
  nutrition: {
    title: "nutritionTitle",
    subtitle: "nutritionSubtitle",
  },
  dayCare: {
    title: "daycareTitle",
    subtitle: "daycareSubtitle",
  },
  elder: {
    title: "elderProductsTitle",
    subtitle: "elderProductsSubtitle",
  },
  cultural: {
    title: "culturalTitle",
    subtitle: "culturalSubtitle",
  },
  companionship: {
    title: "companionshipTitle",
    subtitle: "companionshipSubtitle",
  },
};

/* ------------ CATEGORY TABS MAPPING ------------ */
const CATEGORY_TABS: { [key: string]: { id: string; label: string }[] } = {
  health: [
    { id: "AddHospitalMaster", label: "Hospitals" },
    { id: "AddDiagnosticCentre", label: "Diagnostic Centres" },
    { id: "AddPsychiatricClinics", label: "Psychiatric Clinic" },
    { id: "AddPalliativeCares", label: "Palliative Care" },
    { id: "AddBloodBank", label: "Blood Banks" },
    { id: "AddOrganDonationOrg", label: "Organ Donation Organizations" },
  ],
  shelter: [{ id: "AddCitizenHome", label: "Elder Homes" }],
  dayCare: [{ id: "AddDayCareCentres", label: "Day Care Centres" }],
  elder: [
    { id: "AddCaregiver", label: "Caregivers" },
    { id: "AddElderFriendlyProducts", label: "Elder-friendly Products" },
  ],
  companionship: [
    { id: "AddCounsellingCentres", label: "Counselling Centres" },
  ],
  nutrition: [{ id: "AddNgoMaster", label: "NGOs" }],
  cultural: [{ id: "AddNgoMaster", label: "NGOs" }],
};

export default function InformationTab({ search = "" }) {
  const { theme } = useTheme();
  const { t } = useTranslation();

  /* ------------ ROUTES ------------ */
  const routeMap: any = {
    health: "/detailCardScreen",
    shelter: "/detailCardScreen",
    nutrition: "/detailCardScreen",
    dayCare: "/detailCardScreen",
    elder: "/detailCardScreen",
    cultural: "/detailCardScreen",
    companionship: "/detailCardScreen",
  };

  /* ------------ UI CONFIG ------------ */
  const uiMap: any = {
    health: {
      bg: theme.colors.validationErrorBg,
      iconBg: theme.colors.validationErrorText,
      icon: "heart-line",
    },
    nutrition: {
      bg: theme.colors.validationErrorBg,
      iconBg: theme.colors.validationErrorText,
      icon: "dna-line",
    },
    elder: {
      bg: theme.colors.validationErrorBg,
      iconBg: theme.colors.validationErrorText,
      icon: "box-2-line",
    },
    dayCare: {
      bg: theme.colors.validationInfoBg,
      iconBg: theme.colors.validationInfoText,
      icon: "group-line",
    },
    cultural: {
      bg: theme.colors.validationInfoBg,
      iconBg: theme.colors.validationInfoText,
      icon: "hotel-line",
    },
    companionship: {
      bg: theme.colors.validationWarningBg,
      iconBg: theme.colors.validationWarningText,
      icon: "shake-hands-line",
    },
    shelter: {
      bg: theme.colors.validationSuccessBg,
      iconBg: theme.colors.validationSuccessText,
      icon: "home-5-line",
    },
  };

  /* ------------ SEARCH FILTER ------------ */
  const filteredData = useMemo(() => {
    if (!search.trim()) return knowledgeBaseData;

    return knowledgeBaseData.filter((item) => {
      const keys = i18nKeyMap[item.type];
      const title = t(`informationTab.${keys.title}`).toLowerCase();
      const subtitle = t(`informationTab.${keys.subtitle}`).toLowerCase();

      return (
        title.includes(search.toLowerCase()) ||
        subtitle.includes(search.toLowerCase())
      );
    });
  }, [search, t]);

  /* ------------ RENDER ------------ */
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.contentContainer}
    >
      {filteredData.map((item) => {
        const ui = uiMap[item.type];
        const keys = i18nKeyMap[item.type];

        return (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.8}
            onPress={() =>
              router.push({
                pathname: routeMap[item.type],
                params: {
                  category: item.type,
                  tabs: JSON.stringify(CATEGORY_TABS[item.type] || []),
                },
              })
            }
          >
            <View style={[styles.card, { backgroundColor: ui.bg }]}>
              <View style={[styles.iconBox, { backgroundColor: ui.iconBg }]}>
                <RemixIcon
                  name={ui.icon}
                  size={20}
                  color={theme.colors.colorBgSurface}
                />
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={[
                    styles.title,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  {t(`informationTab.${keys.title}`)}
                </Text>

                <Text
                  style={[
                    styles.subtitle,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  {t(`informationTab.${keys.subtitle}`)}
                </Text>
              </View>

              <RemixIcon
                name="arrow-right-up-line"
                size={20}
                color={ui.iconBg}
              />
            </View>
          </TouchableOpacity>
        );
      })}

      {/* Empty State */}
      {filteredData.length === 0 && (
        <View style={styles.emptyState}>
          <RemixIcon
            name="file-search-line"
            size={48}
            color={theme.colors.colorTextTertiary}
          />
          <Text
            style={[
              styles.emptyStateText,
              { color: theme.colors.colorTextTertiary },
            ]}
          >
            {t("common.noResultsFound") || "No results found"}
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

/* ------------ STYLES ------------ */
const styles = StyleSheet.create({
  contentContainer: {
    paddingBottom: 20,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginBottom: 14, // Changed from marginTop to marginBottom for better spacing
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
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 16,
  },
});
