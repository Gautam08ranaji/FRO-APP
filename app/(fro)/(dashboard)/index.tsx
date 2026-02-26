import BodyLayout from "@/components/layout/BodyLayout";
import CircularKPIChart from "@/components/reusables/CircularKPIChart";
import PunchInCard from "@/components/reusables/PunchInCard";
import ReusableCard from "@/components/reusables/ReusableCard";
import { getFROCasePerformanceDayWise } from "@/features/fro/dashboard.ts/dayWisePerformance";
import { getFROMonthCasePerformanceDayWise } from "@/features/fro/dashboard.ts/monthWisePerformance";
import { getDashCount } from "@/features/fro/interaction/countApi";
import { getUserDataById } from "@/features/fro/profile/getProfile";
import { useInteractionPopupPoller } from "@/hooks/InteractionPopupProvider";
import { useFROLocationUpdater } from "@/hooks/useFROLocationUpdater";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Dimensions, ScrollView, StyleSheet, Text, View } from "react-native";
import { LineChart } from "react-native-chart-kit";
import Toast from "react-native-toast-message";

/* ================= TYPES ================= */

type DashCount = {
  closed: number;
  open: number;
  inProgress: number;
  tickets: number;
};

type DayWisePerformance = {
  date: string;
  open: number;
  inProgress: number;
  closed: number;
  total: number;
  formattedDate?: string;
  day?: number;
};

type MonthWisePerformance = {
  month: number;
  monthName: string;
  open: number;
  inProgress: number;
  closed: number;
  total: number;
};

type MonthPerformanceResponse = {
  year: number;
  data: MonthWisePerformance[];
};

type DayCasePerformanceResponse = {
  data: DayWisePerformance[];
  month: number;
  year: number;
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
  
  const [dayPerformanceData, setDayPerformanceData] = useState<DayCasePerformanceResponse | null>(null);
  const [monthPerformanceData, setMonthPerformanceData] = useState<MonthPerformanceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [dayChartData, setDayChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        color: () => '#00C950',
        strokeWidth: 2
      },
      {
        data: [] as number[],
        color: () => '#FFA500',
        strokeWidth: 2
      },
      {
        data: [] as number[],
        color: () => '#6A7282',
        strokeWidth: 2
      }
    ],
    legend: ['Open', 'In Progress', 'Closed']
  });

  const [monthChartData, setMonthChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        data: [] as number[],
        color: () => '#00C950',
        strokeWidth: 2
      },
      {
        data: [] as number[],
        color: () => '#FFA500',
        strokeWidth: 2
      },
      {
        data: [] as number[],
        color: () => '#6A7282',
        strokeWidth: 2
      }
    ],
    legend: ['Open', 'In Progress', 'Closed']
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
      Promise.all([
        fetchUserData(),
        fetchCountData(),
        handleGetDayCasePerformance(),
        handleGetMonthCasePerformance()
      ]);
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

  const handleGetDayCasePerformance = async () => {
    setLoading(true);
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      // console.log(`Fetching daily performance for Year: ${currentYear}, Month: ${currentMonth}`);

      const response = await getFROCasePerformanceDayWise({
        year: currentYear,
        month: currentMonth,
        userId: String(authState.userId),
        token: String(authState.token),
      });

      // console.log("FRO Day Case Performance:", response?.data);
      
      if (response?.data) {
        const processedData = processDayPerformanceData(response.data, currentYear, currentMonth);
        setDayPerformanceData(processedData);
        prepareDayChartData(processedData);
      }

    } catch (error: any) {
      console.error("Error fetching day performance:", error);
      Toast.show({
        type: "error",
        text1: "Failed to fetch daily performance data",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetMonthCasePerformance = async () => {
    try {
      const response = await getFROMonthCasePerformanceDayWise({
        year: 2026,
        userId: String(authState.userId),
        token: String(authState.token)
      });

      // console.log("Month Case Performance:", response?.data);
      
      if (response?.data) {
        setMonthPerformanceData(response.data);
        prepareMonthChartData(response.data);
      }

    } catch (error: any) {
      console.error("Error fetching month performance:", error);
      Toast.show({
        type: "error",
        text1: error?.response?.data?.message || "Failed to fetch month performance",
      });
    }
  };

  // Process daily performance data
  const processDayPerformanceData = (data: DayCasePerformanceResponse, year: number, month: number) => {
    return {
      ...data,
      data: data.data.map((item: DayWisePerformance) => {
        const date = new Date(item.date);
        const day = date.getUTCDate();
        return {
          ...item,
          day: day,
          formattedDate: `${day} ${new Date(year, month - 1).toLocaleString('default', { month: 'short' })}`
        };
      }).sort((a, b) => (a.day || 0) - (b.day || 0))
    };
  };

  // Prepare daily chart data
  const prepareDayChartData = (data: DayCasePerformanceResponse) => {
    const daysToShow = Math.min(data.data.length, 10);
    const interval = Math.ceil(data.data.length / daysToShow);
    
    const labels: string[] = [];
    const openData: number[] = [];
    const inProgressData: number[] = [];
    const closedData: number[] = [];

    data.data.forEach((item, index) => {
      if (index % interval === 0 || index === data.data.length - 1) {
        labels.push(item.day?.toString() || '');
      } else {
        labels.push('');
      }
      
      openData.push(item.open);
      inProgressData.push(item.inProgress);
      closedData.push(item.closed);
    });

    // Calculate averages
    const avgOpen = Math.round(openData.reduce((a, b) => a + b, 0) / openData.filter(v => v > 0).length || 1);
    const avgInProgress = Math.round(inProgressData.reduce((a, b) => a + b, 0) / inProgressData.filter(v => v > 0).length || 1);
    const avgClosed = Math.round(closedData.reduce((a, b) => a + b, 0) / closedData.filter(v => v > 0).length || 1);

    // Update legend with averages
    const legendWithAvg = [
      `Open: (${avgOpen})`,
      `In Progress: (${avgInProgress})`,
      `Closed: (${avgClosed})`
    ];

    setDayChartData({
      labels,
      datasets: [
        { data: openData, color: () => '#00C950', strokeWidth: 2 },
        { data: inProgressData, color: () => '#FFA500', strokeWidth: 2 },
        { data: closedData, color: () => '#6A7282', strokeWidth: 2 }
      ],
      legend: legendWithAvg
    });
  };

  // Prepare monthly chart data
  const prepareMonthChartData = (data: MonthPerformanceResponse) => {
    const labels: string[] = [];
    const openData: number[] = [];
    const inProgressData: number[] = [];
    const closedData: number[] = [];

    data.data.forEach((item) => {
      labels.push(item.monthName);
      openData.push(item.open);
      inProgressData.push(item.inProgress);
      closedData.push(item.closed);
    });

    // Calculate monthly averages (only for months with data)
    const activeMonths = data.data.filter(m => m.total > 0).length;
    const totals = data.data.reduce(
      (acc, month) => ({
        open: acc.open + month.open,
        inProgress: acc.inProgress + month.inProgress,
        closed: acc.closed + month.closed,
      }),
      { open: 0, inProgress: 0, closed: 0 }
    );

    const avgOpen = activeMonths > 0 ? Math.round(totals.open / activeMonths) : 0;
    const avgInProgress = activeMonths > 0 ? Math.round(totals.inProgress / activeMonths) : 0;
    const avgClosed = activeMonths > 0 ? Math.round(totals.closed / activeMonths) : 0;

    // Update legend with averages
    const legendWithAvg = [
      `Open:(${avgOpen})`,
      `In Progress :(${avgInProgress})`,
      `Closed: (${avgClosed})`
    ];

    setMonthChartData({
      labels,
      datasets: [
        { data: openData, color: () => '#00C950', strokeWidth: 2 },
        { data: inProgressData, color: () => '#FFA500', strokeWidth: 2 },
        { data: closedData, color: () => '#6A7282', strokeWidth: 2 }
      ],
      legend: legendWithAvg
    });
  };

  // Calculate yearly totals
  const calculateYearlyTotals = () => {
    if (!monthPerformanceData?.data) return null;
    
    return monthPerformanceData.data.reduce(
      (acc, month) => ({
        total: acc.total + month.total,
        open: acc.open + month.open,
        inProgress: acc.inProgress + month.inProgress,
        closed: acc.closed + month.closed,
      }),
      { total: 0, open: 0, inProgress: 0, closed: 0 }
    );
  };

  const yearlyTotals = calculateYearlyTotals();

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

  const screenWidth = Dimensions.get("window").width - 40;

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
        <ScrollView showsVerticalScrollIndicator={false}>
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
            <CircularKPIChart percentage={completionRate} label="Completion Rate" />
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

          {/* Daily Performance Chart */}
          {dayPerformanceData && dayPerformanceData.data.length > 0 && (
            <View style={styles.chartContainer}>
              <Text style={[theme.typography.fontH6, { color: theme.colors.colorPrimary600 }]}>
                Daily Performance - {new Date().toLocaleString('default', { month: 'long' })} {new Date().getFullYear()}
              </Text>
              
              {loading ? (
                <Text>Loading chart...</Text>
              ) : (
                <>
                  <LineChart
                    data={dayChartData}
                    width={screenWidth}
                    height={220}
                    chartConfig={{
                      backgroundColor: '#ffffff',
                      backgroundGradientFrom: '#ffffff',
                      backgroundGradientTo: '#ffffff',
                      decimalPlaces: 0,
                      color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                      style: { borderRadius: 16 },
                      propsForDots: { r: '4', strokeWidth: '2' }
                    }}
                    bezier
                    style={styles.chart}
                  />
                </>
              )}
            </View>
          )}

          {/* Monthly Performance Chart */}
          {monthPerformanceData && (
            <View style={styles.chartContainer}>
              <Text style={[theme.typography.fontH6, { color: theme.colors.colorPrimary600 }]}>
                Monthly Performance - {monthPerformanceData.year}
              </Text>
              
              <LineChart
                data={monthChartData}
                width={screenWidth}
                height={220}
                chartConfig={{
                  backgroundColor: '#ffffff',
                  backgroundGradientFrom: '#ffffff',
                  backgroundGradientTo: '#ffffff',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: { borderRadius: 16 },
                  propsForDots: { r: '4', strokeWidth: '2' }
                }}
                bezier
                style={styles.chart}
              />

              {/* Yearly Summary Stats */}
              {yearlyTotals && (
                <View style={styles.chartStats}>
                  <View style={styles.statCard}>
                    <Text style={theme.typography.fontBodySmall}>Total Open</Text>
                    <Text style={[theme.typography.fontH6, { color: '#00C950' }]}>
                      {yearlyTotals.open}
                    </Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={theme.typography.fontBodySmall}>Total In Progress</Text>
                    <Text style={[theme.typography.fontH6, { color: '#FFA500' }]}>
                      {yearlyTotals.inProgress}
                    </Text>
                  </View>
                  <View style={styles.statCard}>
                    <Text style={theme.typography.fontBodySmall}>Total Closed</Text>
                    <Text style={[theme.typography.fontH6, { color: '#6A7282' }]}>
                      {yearlyTotals.closed}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          )}
        </ScrollView>
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
  chartContainer: {
    marginTop: 30,
    padding: 15,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16
  },
  chartStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0'
  },
  statCard: {
    alignItems: 'center'
  }
});