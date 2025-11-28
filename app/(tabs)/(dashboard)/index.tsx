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
        style={[theme.typography.fontH2, { color: theme.colors.btnPrimaryBg }]}
      >
        मामलों का विवरण
      </Text>

      <View style={styles.row}>
        <ReusableCard
          icon="file-list-3-line"
          count={12}
          title="नए मामले"
          bg="#FFFFFF"
          iconBg="#2B7FFF"
        />
        <ReusableCard
          icon="folder-check-line"
          count={12}
          title="नए मामले"
          bg="#FFFFFF"
          iconBg="#00C950"
        />
      </View>
      <View style={styles.row}>
        <ReusableCard
          icon="arrow-right-box-line"
          count={12}
          title="नए मामले"
          bg="#FFFFFF"
          iconBg="#AD46FF"
        />
        <ReusableCard
          icon="time-line"
          count={12}
          title="नए मामले"
          bg="#FFFFFF"
          iconBg="#FF6900"
        />
      </View>
      <View style={styles.row}>
        <ReusableCard
          icon="group-line"
          count={12}
          title="नए मामले"
          bg="#FFFFFF"
          iconBg="#F0B100"
        />
        <ReusableCard
          icon="close-circle-line"
          count={12}
          title="नए मामले"
          bg="#FFFFFF"
          iconBg="#6A7282"
        />
      </View>

      <View
        style={[
          styles.bottomSection,
          { backgroundColor: theme.colors.colorBgSurface },
        ]}
      >
        <View style={styles.row}>
          <Text
            style={[
              theme.typography.fontBodyLarge,
              { color: theme.colors.colorTextPrimary,paddingHorizontal:1 },
            ]}
          >
            आज की ड्यूटी
          </Text>

          <Text
            style={[
              theme.typography.fontBodyLarge,
              { color: theme.colors.colorPrimary500, paddingHorizontal: 1 },
            ]}
          >
            कुल मामले
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              theme.typography.fontH4,
              { color: theme.colors.colorTextPrimary },
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

      <Card title="त्वरित कार्रवाई" cardStyle={{height:140,backgroundColor:theme.colors.colorBgSurface }} titleColor={theme.colors.btnPrimaryBg}   >
        <ReusableButton
          type="double"
          buttons={[
            {
              title: "नया मामला जोड़ें",
              containerStyle: { backgroundColor: "#EDEDED" ,borderWidth:1 , borderColor:theme.colors.btnPrimaryBg },
              textStyle: { color: theme.colors.btnPrimaryBg },
              onPress: () => console.log("Cancel"),
            },
            {
              title: "मैप देखें",
               containerStyle: { backgroundColor: "#EDEDED" ,borderWidth:1 , borderColor:theme.colors.btnPrimaryBg },
              textStyle: { color: theme.colors.btnPrimaryBg ,paddingHorizontal:1 },
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
