import BodyLayout from "@/components/layout/BodyLayout";
import PunchInCard from "@/components/reusables/PunchInCard";
import ReusableCard from "@/components/reusables/ReusableCard";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const screenWidth = Dimensions.get("window").width;
  const authState = useAppSelector((state) => state.auth);

console.log(authState.userId);
console.log(authState.antiforgeryToken);


  return (
    <BodyLayout type="dashboard">
      {/* Heading */}
      <Text
        style={[
          theme.typography.fontH2,
          { color: theme.colors.colorPrimary600 },
        ]}
      >
        Attendance
      </Text>

      <PunchInCard />

      <Text
        style={[
          theme.typography.fontH2,
          { color: theme.colors.colorPrimary600, marginTop: 20 },
        ]}
      >
        {t("home.casesOverview")}
      </Text>



      {/* ROW 1 */}
      <View style={styles.row}>
        <ReusableCard
          icon="file-list-3-line"
          count={12}
          title={t("home.newCases")}
          bg={theme.colors.colorBgPage}
          iconBg={theme.colors.validationInfoText}
          countColor={theme.colors.validationInfoText}
          titleColor={theme.colors.colorTextSecondary}
          cardBg={theme.colors.validationInfoBg}
          onPress={() =>
            router.push({
              pathname: "/(fro)/(complaints)",
              params: { filter: "new" },
            })
          }
        />

        <ReusableCard
          icon="folder-check-line"
          count={12}
          title={t("home.approvedCases")}
          bg={theme.colors.colorBgPage}
          iconBg="#00C950"
          countColor={theme.colors.colorPrimary600}
          titleColor={theme.colors.colorTextSecondary}
          cardBg={theme.colors.validationSuccessBg}
          onPress={() =>
            router.push({
              pathname: "/(fro)/(complaints)",
              params: { filter: "approved" },
            })
          }
        />
      </View>

      {/* ROW 2 */}
      <View style={styles.row}>
        <ReusableCard
          icon="arrow-right-box-line"
          count={12}
          title={t("home.onTheWay")}
          bg={theme.colors.colorHeadingH1 + 22}
          iconBg={theme.colors.colorHeadingH1}
          countColor={theme.colors.colorHeadingH1}
          titleColor={theme.colors.colorTextSecondary}
          cardBg={theme.colors.validationInfoBg}
          onPress={() =>
            router.push({
              pathname: "/(fro)/(complaints)",
              params: { filter: "onway" },
            })
          }
        />

        <ReusableCard
          icon="time-line"
          count={12}
          title={t("home.working")}
          bg={theme.colors.colorBgPage}
          iconBg={theme.colors.validationWarningText}
          countColor={theme.colors.validationWarningText}
          cardBg={theme.colors.validationWarningBg}
          titleColor={theme.colors.colorTextSecondary}
          onPress={() =>
            router.push({
              pathname: "/(fro)/(complaints)",
              params: { filter: "working" },
            })
          }
        />
      </View>

      {/* ROW 3 */}
      <View style={styles.row}>
        <ReusableCard
          icon="group-line"
          count={12}
          title={t("home.followup")}
          bg={theme.colors.colorBgPage}
          iconBg={theme.colors.colorWarning400}
          countColor={theme.colors.colorWarning400}
          titleColor={theme.colors.colorTextSecondary}
          cardBg={theme.colors.validationWarningBg}
          onPress={() =>
            router.push({
              pathname: "/(fro)/(complaints)",
              params: { filter: "followup" },
            })
          }
        />

        <ReusableCard
          icon="close-circle-line"
          count={12}
          title={t("home.closedCases")}
          bg={theme.colors.colorBgPage}
          cardBg={theme.colors.navDivider}
          iconBg="#6A7282"
          countColor={theme.colors.colorTextSecondary}
          titleColor={theme.colors.colorTextSecondary}
          onPress={() =>
            router.push({
              pathname: "/(fro)/(complaints)",
              params: { filter: "closed" },
            })
          }
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
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {t("home.todayDuty")}
          </Text>

          <Text
            style={[
              theme.typography.fontBodyLarge,
              { color: theme.colors.colorPrimary600 },
            ]}
          >
            {t("home.totalCases")}
          </Text>
        </View>

        <View style={styles.row}>
          <Text
            style={[
              theme.typography.fontH4,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {t("home.highPriority")}
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

      {/* QUICK ACTION CARD */}
      {/* <Card
        title={t("home.quickActions")}
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
              title: t("home.addNewCase"),
              containerStyle: {
                backgroundColor: theme.colors.colorBgPage,
                borderWidth: 1,
                borderColor: theme.colors.colorPrimary600,
              },
              textStyle: {
                color: theme.colors.colorPrimary600,
              },
              onPress: () => console.log("new case"),
            },
            {
              title: t("home.viewMap"),
              containerStyle: {
                backgroundColor: theme.colors.colorBgPage,
                borderWidth: 1,
                borderColor: theme.colors.colorPrimary600,
              },
              textStyle: {
                color: theme.colors.colorPrimary600,
              },
            },
          ]}
        />
      </Card> */}
    </BodyLayout>
  );
}

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
});
