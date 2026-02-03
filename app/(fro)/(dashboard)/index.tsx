import BodyLayout from "@/components/layout/BodyLayout";
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
  const [loading, setLoading] = useState(false);

  const [count, setCount] = useState<DashCount>({
    closed: 0,
    open: 0,
    inProgress: 0,
    tickets: 0,
  });

  // 🔴 Live location update
  useFROLocationUpdater(authState?.userId);

  /* ================= EFFECTS ================= */

  useFocusEffect(
    useCallback(() => {
      fetchUserData();
      fetchCountData();
    }, []),
  );

  // console.log("ant", authState?.antiforgeryToken);

  const fetchUserData = async () => {
    try {
      const response = await getUserDataById({
        userId: String(authState.userId),
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      setFirstName(response?.data?.firstName || "User");
      setLastName(response?.data?.lastName || "");
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  const fetchCountData = async () => {
    try {
      setLoading(true);
      const response = await getDashCount({
        userId: String(authState.userId),
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });
      console.log(authState.userId);

      if (response?.success) {
        setCount(response?.data);
        console.log("count", response?.data);
      }
    } catch (error) {
      console.error("Failed to fetch count data", error);
    } finally {
      setLoading(false);
    }
  };

  // console.log("antifof", authState.antiforgeryToken);

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

        {/* ROW 2 */}
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
});
