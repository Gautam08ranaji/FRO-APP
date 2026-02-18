import BodyLayout from "@/components/layout/BodyLayout";
import CircularKPIChart from "@/components/reusables/CircularKPIChart";
import DashboardAnimatedChart from "@/components/reusables/DashboardAnimatedChart";
import FROPerformanceCard from "@/components/reusables/FROPerformanceCard";
import PunchInCard from "@/components/reusables/PunchInCard";
import ReusableCard from "@/components/reusables/ReusableCard";
import { getDashCount } from "@/features/fro/interaction/countApi";
import { getUserDataById } from "@/features/fro/profile/getProfile";
import { useInteractionPopupPoller } from "@/hooks/InteractionPopupProvider";
import { useFROLocationUpdater } from "@/hooks/useFROLocationUpdater";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

/* ================= TYPES ================= */

type DashCount = {
  closed: number;
  open: number;
  inProgress: number;
  tickets: number;
};

/* ================= SCREEN ================= */

export default function HomeScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const authState = useAppSelector((state) => state.auth);
  const { Popup } = useInteractionPopupPoller();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [count, setCount] = useState<DashCount>({
    closed: 0,
    open: 0,
    inProgress: 0,
    tickets: 0,
  });

  /* 🔴 Demo Attendance Values (replace with API later) */
  const presentDays = 20;
  const absentDays = 6;

  const totalDays = new Date(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    0,
  ).getDate();

  const attendanceRateNum = totalDays > 0 ? (presentDays / totalDays) * 100 : 0;

  /* 🔴 KPI calculation */

  const completionRate =
    count.tickets > 0 ? (count.closed / count.tickets) * 100 : 0;

  useFROLocationUpdater(authState?.userId);

  useFocusEffect(
    useCallback(() => {
      Promise.all([fetchUserData(), fetchCountData()]);
    }, []),
  );

  /* ================= API ================= */

  const fetchUserData = async () => {
    console.log("authState.userId", authState.antiforgeryToken);
    console.log("authState.token", authState.userId);

    try {
      const response = await getUserDataById({
        userId: String(authState.userId),
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      console.log("use Data", response);

      setFirstName(response?.data?.firstName || "User");
      setLastName(response?.data?.lastName || "");
    } catch (error) {
      console.error("User fetch error:", error);
      alert(
        "Failed to fetch user data. " +
          (error instanceof Error ? error?.message : "Unknown error"),
      );
    }
  };

  const fetchCountData = async () => {
    try {
      const response = await getDashCount({
        userId: String(authState.userId),
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      if (response?.success) {
        setCount(response.data);
      }
    } catch (error) {
      console.error("Count fetch error:", error);
    }
  };

  /* ================= CARD CONFIG ================= */

  const caseCardConfig = {
    open: {
      title: "Open",
      icon: "folder-check-line",
      iconBg: "#00C950",
      cardBg: theme.colors.validationSuccessBg,
      countColor: theme.colors.colorPrimary600,
      filter: "Open",
    },
    InProgress: {
      title: "In-Progress",
      icon: "time-line",
      iconBg: theme.colors.validationWarningText,
      cardBg: theme.colors.validationWarningBg,
      countColor: theme.colors.validationWarningText,
      filter: "inProgress",
    },
    Total: {
      title: "Total",
      icon: "arrow-right-box-line",
      iconBg: theme.colors.colorHeadingH1,
      cardBg: theme.colors.validationInfoBg,
      countColor: theme.colors.colorHeadingH1,
      filter: "tickets",
    },
    closed: {
      title: "Closed",
      icon: "close-circle-line",
      iconBg: "#6A7282",
      cardBg: theme.colors.navDivider,
      countColor: theme.colors.colorTextSecondary,
      filter: "Closed",
    },
  };

  /* ================= UI ================= */

  return (
    <>
      {Popup}

      <BodyLayout
        type="dashboard"
        userName={`${firstName} ${lastName}`}
        userId=""
        todaysDutyCount={count.tickets}
        totalCases={count.tickets}
        notificationCount={3}
      >
        {/* Attendance */}

        <Text
          style={[
            theme.typography.fontH5,
            { color: theme.colors.colorPrimary600 },
          ]}
        >
          Attendance
        </Text>

        <PunchInCard />

        {/* KPI Circular Charts */}
        <View style={styles.kpiRow}>
          <CircularKPIChart percentage={attendanceRateNum} label="Attendance" />

          <CircularKPIChart percentage={completionRate} label="Leaves" />
        </View>

        {/* Case Overview */}
        <Text
          style={[
            theme.typography.fontH6,
            { color: theme.colors.colorPrimary600, marginTop: 20 },
          ]}
        >
          {t("home.casesOverview")}
        </Text>

        {/* Case Cards */}
        <View style={styles.row}>
          <ReusableCard
            icon={caseCardConfig.Total.icon}
            count={String(count.tickets)}
            title={caseCardConfig.Total.title}
            iconBg={caseCardConfig.Total.iconBg}
            cardBg={caseCardConfig.Total.cardBg}
            countColor={caseCardConfig.Total.countColor}
            titleColor={theme.colors.colorTextSecondary}
            onPress={() =>
              router.push({
                pathname: "/(fro)/(complaints)",
                params: { filter: caseCardConfig.Total.filter },
              })
            }
          />
          <ReusableCard
            icon={caseCardConfig.open.icon}
            count={String(count.open)}
            title={caseCardConfig.open.title}
            iconBg={caseCardConfig.open.iconBg}
            cardBg={caseCardConfig.open.cardBg}
            countColor={caseCardConfig.open.countColor}
            titleColor={theme.colors.colorTextSecondary}
            onPress={() =>
              router.push({
                pathname: "/(fro)/(complaints)",
                params: { filter: caseCardConfig.open.filter },
              })
            }
          />
        </View>

        <View style={styles.row}>
          <ReusableCard
            icon={caseCardConfig.InProgress.icon}
            count={String(count.inProgress)}
            title={caseCardConfig.InProgress.title}
            iconBg={caseCardConfig.InProgress.iconBg}
            cardBg={caseCardConfig.InProgress.cardBg}
            countColor={caseCardConfig.InProgress.countColor}
            titleColor={theme.colors.colorTextSecondary}
            onPress={() =>
              router.push({
                pathname: "/(fro)/(complaints)",
                params: { filter: caseCardConfig.InProgress.filter },
              })
            }
          />

          <ReusableCard
            icon={caseCardConfig.closed.icon}
            count={String(count.closed)}
            title={caseCardConfig.closed.title}
            iconBg={caseCardConfig.closed.iconBg}
            cardBg={caseCardConfig.closed.cardBg}
            countColor={caseCardConfig.closed.countColor}
            titleColor={theme.colors.colorTextSecondary}
            onPress={() =>
              router.push({
                pathname: "/(fro)/(complaints)",
                params: { filter: caseCardConfig.closed.filter },
              })
            }
          />
        </View>

        {/* Performance Card */}
        <FROPerformanceCard
          total={count.tickets}
          closed={count.closed}
          open={count.open}
          inProgress={count.inProgress}
        />

        {/* Animated Chart */}
        <DashboardAnimatedChart
          closed={count.closed}
          open={count.open}
          inProgress={count.inProgress}
        />
      </BodyLayout>
    </>
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

  kpiRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 30,
  },
});
