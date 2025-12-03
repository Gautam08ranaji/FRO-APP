import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OfficerDetailsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <BodyLayout
      type={"screen"}
      screenName={t("officerDetails.screenTitle")}
    >
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
          {t("officerDetails.name")}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.inputBg,
              color: theme.colors.colorTextSecondary,
              borderColor: theme.colors.colorBgPage,
            },
          ]}
          value={t("officerDetails.nameValue")}
        />

        <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
          {t("officerDetails.employeeCode")}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.inputBg,
              color: theme.colors.colorTextSecondary,
              borderColor: theme.colors.colorBgPage,
            },
          ]}
          value={t("officerDetails.employeeCodeValue")}
        />

        <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
          {t("officerDetails.mobile")}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.inputBg,
              color: theme.colors.colorTextSecondary,
              borderColor: theme.colors.colorBgPage,
            },
          ]}
          value={t("officerDetails.mobileValue")}
        />

        <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
          {t("officerDetails.email")}
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.inputBg,
              color: theme.colors.colorTextSecondary,
              borderColor: theme.colors.colorBgPage,
            },
          ]}
          value={t("officerDetails.emailValue")}
        />

        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: theme.colors.colorPrimary600 },
          ]}
        >
          <Text
            style={[
              styles.saveText,
              { color: theme.colors.colorBgPage },
            ]}
          >
            {t("officerDetails.save")}
          </Text>
        </TouchableOpacity>
      </View>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginHorizontal: 15,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
    color: "#111",
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
  },

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 25,
    alignItems: "center",
  },

  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
