import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/reusables/Card";
import ReusableButton from "@/components/reusables/ReusableButton";
import ReusableCard from "@/components/reusables/ReusableCard";
import { useTheme } from "@/theme/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const screenWidth = Dimensions.get("window").width;

  return (
    <BodyLayout type="dashboard">
      <Text
        style={[theme.typography.fontH2, { color: theme.colors.colorPrimary600 }]}
      >
        मामलों का विवरण
      </Text>

      <View style={styles.row}>
        <ReusableCard
          icon="file-list-3-line"
          count={12}
          title="नए मामले"
          bg={theme.colors.colorBgPage}
          iconBg={theme.colors.validationInfoText}
          countColor={theme.colors.colorPrimary600}
          titleColor={theme.colors.colorTextSecondary}
        />
        <ReusableCard
          icon="folder-check-line"
          count={12}
          title="नए मामले"
          bg={theme.colors.colorBgPage}
          iconBg="#00C950"
           countColor={theme.colors.colorPrimary600}
          titleColor={theme.colors.colorTextSecondary}
        />
      </View>
      <View style={styles.row}>
        <ReusableCard
          icon="arrow-right-box-line"
          count={12}
          title="नए मामले"
          bg={theme.colors.colorBgPage}
          iconBg="#AD46FF"
           countColor={theme.colors.colorPrimary600}
          titleColor={theme.colors.colorTextSecondary}
        />
        <ReusableCard
          icon="time-line"
          count={12}
          title="नए मामले"
          bg={theme.colors.colorBgPage}
          iconBg="#FF6900"
           countColor={theme.colors.colorPrimary600}
          titleColor={theme.colors.colorTextSecondary}
        />
      </View>
      <View style={styles.row}>
        <ReusableCard
          icon="group-line"
          count={12}
          title="नए मामले"
          bg={theme.colors.colorBgPage}
          iconBg="#F0B100"
           countColor={theme.colors.colorPrimary600}
          titleColor={theme.colors.colorTextSecondary}
        />
        <ReusableCard
          icon="close-circle-line"
          count={12}
          title="नए मामले"
          bg={theme.colors.colorBgPage}
          iconBg="#6A7282"
           countColor={theme.colors.colorPrimary600}
          titleColor={theme.colors.colorTextSecondary}
        />
      </View>

      <View
        style={[
          styles.bottomSection,
          { backgroundColor: theme.colors.colorBgPage },
        ]}
      >
        <View style={styles.row}>
          <Text
            style={[
              theme.typography.fontBodyLarge,
              { color: theme.colors.colorTextSecondary, paddingHorizontal: 1 },
            ]}
          >
            आज की ड्यूटी
          </Text>

          <Text
            style={[
              theme.typography.fontBodyLarge,
              { color: theme.colors.colorPrimary600, paddingHorizontal: 1 },
            ]}
          >
            कुल मामले
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              theme.typography.fontH4,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            उच्च प्राथमिकता मामले:
          </Text>

          <Text
            style={[
              theme.typography.fontH4,
              { color: theme.colors.inputErrorBorder },
            ]}
          >
            04
          </Text>
        </View>
      </View>

      <Card
        title="त्वरित कार्रवाई"
        cardStyle={{
          height: 140,
          backgroundColor: theme.colors.colorBgPage,
        }}
        titleColor={theme.colors.btnPrimaryBg}
      >
        <ReusableButton
          type="double"
          buttons={[
            {
              title: "नया मामला जोड़ें",
              containerStyle: {
                backgroundColor: theme.colors.colorBgPage,
                borderWidth: 1,
                borderColor: theme.colors.colorPrimary600,
              },
              textStyle: { color: theme.colors.colorPrimary600,paddingHorizontal:1 },
              onPress: () => console.log("Cancel"),
            },
            {
              title: "मैप देखें",
              containerStyle: {
                backgroundColor:  theme.colors.colorBgPage,
                borderWidth: 1,
                borderColor: theme.colors.colorPrimary600,
              },
              textStyle: {
                color: theme.colors.colorPrimary600,
                paddingHorizontal: 1,
              },
              // route: "/next",
            },
          ]}
        />
      </Card>
    </BodyLayout>
  );
}

/* ---------------- STYLES (UNCHANGED) ---------------- */
const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 20,
    marginTop: 20,
  },
  bottomSection: {
    width: "100%",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginVertical: 10,
    elevation: 1,
    marginTop: 30,
  },

  rowText: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
});
