import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RemixIcon, { IconName } from "react-native-remix-icon";

export default function OnboardingSteps() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  const steps: {
    id: number;
    icon: IconName;
    title: string;
    subtitle: string;
    singleButton: boolean;
  }[] = [
    {
      id: 1,
      icon: "file-list-3-line",
      title: t("onboarding.step1Title"),
      subtitle: t("onboarding.step1Subtitle"),
      singleButton: false,
    },
    {
      id: 2,
      icon: "arrow-right-box-line",
      title: t("onboarding.step2Title"),
      subtitle: t("onboarding.step2Subtitle"),
      singleButton: false,
    },
    {
      id: 3,
      icon: "checkbox-circle-fill",
      title: t("onboarding.step3Title"),
      subtitle: t("onboarding.step3Subtitle"),
      singleButton: true,
    },
  ];

  const current = steps[step - 1];

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: theme.colors.colorBgSurface }
      ]}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconWrapper,
          { backgroundColor: theme.colors.btnSecondaryBg }
        ]}
      >
        <RemixIcon
          name={current.icon}
          size={42}
          color={theme.colors.btnPrimaryBg}
        />
      </View>

      {/* Title */}
      <Text
        style={[
          styles.title,
          { color: theme.colors.colorPrimary600 }
        ]}
      >
        {current.title}
      </Text>

      {/* Subtitle */}
      <Text
        style={[
          styles.subtitle,
          { color: theme.colors.colorTextSecondary }
        ]}
      >
        {current.subtitle}
      </Text>

      {/* Step Indicators */}
      <View style={styles.indicatorRow}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.indicator,
              {
                backgroundColor:
                  step === i ? theme.colors.btnPrimaryBg : theme.colors.border,
              },
            ]}
          />
        ))}
      </View>

      {/* Buttons */}
      {!current.singleButton ? (
        <View style={styles.buttonRow}>
          {/* Previous */}
          <TouchableOpacity
            disabled={step === 1}
            onPress={() => step > 1 && setStep(step - 1)}
            style={[
              styles.prevBtn,
              {
                borderColor: theme.colors.colorPrimary600,
                opacity: step === 1 ? 0.4 : 1,
                backgroundColor: theme.colors.colorBgPage,
              },
            ]}
          >
            <RemixIcon
              name="arrow-left-s-line"
              size={18}
              color={theme.colors.colorPrimary600}
              style={styles.iconLeft}
            />
            <Text
              style={[
                styles.prevText,
                { color: theme.colors.colorPrimary600 }
              ]}
            >
              {t("onboarding.prev")}
            </Text>
          </TouchableOpacity>

          {/* Next */}
          <TouchableOpacity
            onPress={() => step < 3 && setStep(step + 1)}
            style={[
              styles.nextBtn,
              { backgroundColor: theme.colors.colorPrimary600 }
            ]}
          >
            <Text
              style={[
                styles.nextText,
                { color: theme.colors.colorBgPage }
              ]}
            >
              {t("onboarding.next")}
            </Text>
            <RemixIcon
              name="arrow-right-s-line"
              size={18}
              color={theme.colors.colorBgPage}
            />
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity
          style={[
            styles.fullBtn,
            { backgroundColor: theme.colors.colorPrimary600 }
          ]}
          onPress={() => router.push("/(tabs)/(dashboard)")}
        >
          <Text
            style={[
              styles.fullBtnText,
              { color: theme.colors.colorBgPage }
            ]}
          >
            {t("onboarding.gotoDashboard")}
          </Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },

  iconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
  },

  title: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 25,
  },

  indicatorRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 40,
  },

  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  buttonRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  prevBtn: {
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 10,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  nextBtn: {
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },

  iconLeft: { marginRight: 6 },

  prevText: { fontSize: 16 },

  nextText: {
    marginRight: 6,
    fontSize: 16,
  },

  fullBtn: {
    width: "100%",
    paddingVertical: 16,
    borderRadius: 10,
  },

  fullBtnText: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
});
