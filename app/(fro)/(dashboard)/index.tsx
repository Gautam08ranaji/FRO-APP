import BodyLayout from "@/components/layout/BodyLayout";
import Card from "@/components/reusables/Card";
import PunchInCard from "@/components/reusables/PunchInCard";
import ReusableButton from "@/components/reusables/ReusableButton";
import ReusableCard from "@/components/reusables/ReusableCard";

import { getInteractionsListByAssignToId } from "@/features/fro/interactionApi";
import { getUserDataById } from "@/features/fro/profile/getProfile";
import { useFROLocationUpdater } from "@/hooks/useFROLocationUpdater";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

/* ================= LOCAL DROPDOWN WRAPPER ================= */

/* ================= SCREEN ================= */

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const [firstName, setfirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const authState = useAppSelector((state) => state.auth);

  // 🔴 Update FRO live location
  useFROLocationUpdater(authState?.userId);

  /* ================= STATE ================= */

  const [interactions, setInteractions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await getUserDataById({
        userId: String(authState.userId),
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });
      setfirstName(response?.data?.firstName || "User");
      setLastName(response?.data?.lastName || "User");
      console.log("User data:", response?.data);
      return response;
    } catch (error) {
      console.error("Failed to fetch user data", error);
      throw error;
    }
  };

  console.log("antifog", authState?.antiforgeryToken);

  /* ================= API CALLS ================= */

  const fetchInteractions = useCallback(async () => {
    if (!authState?.token || !authState?.userId) return;

    try {
      setLoading(true);

      const res = await getInteractionsListByAssignToId({
        assignToId: String(authState.userId),
        pageNumber: 1,
        pageSize: 100,
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      setInteractions(res?.data?.interactions || []);
    } catch (error) {
      console.error("❌ Failed to fetch interactions:", error);
    } finally {
      setLoading(false);
    }
  }, [authState]);

  /* ================= FETCH ON LOAD ================= */

  useEffect(() => {
    fetchInteractions();
  }, [fetchInteractions]);

  /* ================= CASE COUNTS ================= */

  const caseCounts = useMemo(() => {
    return {
      new: interactions.filter((i) => i.caseStatusName === "Open").length,
      approved: interactions.filter((i) => i.caseStatusName === "Approved")
        .length,
      onTheWay: interactions.filter((i) => i.caseStatusName === "On The Way")
        .length,
      working: interactions.filter((i) => i.caseStatusName === "In Progress")
        .length,
      followup: interactions.filter((i) => i.caseStatusName === "Follow Up")
        .length,
      closed: interactions.filter((i) => i.caseStatusName === "Closed").length,
    };
  }, [interactions]);

  const highPriorityCount = useMemo(() => {
    return interactions.filter((i) => i.priority === "Highkjklj").length;
  }, [interactions]);

  const totalCaseCount = interactions.length;

  /* ================= UI ================= */

  return (
    <BodyLayout
      type="dashboard"
      userName={`${firstName} ${lastName}`}
      userId={""}
      todaysDutyCount={12}
      totalCases={48}
      notificationCount={3}
    >
      {/* Attendance */}
      <Text
        style={[
          theme.typography.fontH2,
          { color: theme.colors.colorPrimary600 },
        ]}
      >
        Attendance
      </Text>

      <PunchInCard />

      {/* Case Overview */}
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
          count={caseCounts.new}
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
          count={caseCounts.approved}
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
          count={caseCounts.onTheWay}
          title={t("home.onTheWay")}
          bg={theme.colors.colorHeadingH1 + "22"}
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
          count={caseCounts.working}
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
          count={caseCounts.followup}
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
          count={caseCounts.closed}
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

      {/* Bottom Summary */}
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
            {highPriorityCount}
          </Text>
        </View>
      </View>

      {/* Quick Actions */}
      <Card
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
              onPress: () => console.log("Add new case"),
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
      </Card>
    </BodyLayout>
  );
}

/* ================= STYLES ================= */

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
