import ReusableButton from "@/components/reusables/ReusableButton";
import i18n from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

/* ------------------ ✅ TYPES ------------------ */

type AttendanceStatus = "present" | "absent" | "leave";

type AttendanceItem = {
  id: number;
  date: string; // ISO recommended from API
  checkIn: string; // "09:00"
  checkOut: string; // "19:00"
  totalMinutes: number;
  status: AttendanceStatus;
};

/* ------------------ ✅ MOCK API DATA (REPLACE WITH REAL API) ------------------ */

const attendanceHistory: AttendanceItem[] = [
  {
    id: 1,
    date: "2025-12-03T09:00:00Z",
    checkIn: "09:00",
    checkOut: "19:00",
    totalMinutes: 600,
    status: "present",
  },
  {
    id: 2,
    date: "2025-12-02T09:00:00Z",
    checkIn: "--",
    checkOut: "--",
    totalMinutes: 0,
    status: "absent",
  },
  {
    id: 3,
    date: "2025-12-01T10:00:00Z",
    checkIn: "10:00",
    checkOut: "17:00",
    totalMinutes: 420,
    status: "leave",
  },
];

/* ------------------ ✅ STATUS COLOR MAP ------------------ */

const statusTheme: Record<
  AttendanceStatus,
  { bg: string; text: string; border: string }
> = {
  present: { bg: "#E9F9EF", text: "#1E7F43", border: "#1E7F43" },
  absent: { bg: "#FDECEC", text: "#C62828", border: "#C62828" },
  leave: { bg: "#EAF2FF", text: "#1565C0", border: "#1565C0" },
};

/* ------------------ ✅ LOCALE FORMAT HELPERS ------------------ */

// ✅ Date formatter
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString(i18n.language, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

// ✅ Time formatter
const formatApiTime = (time: string) => {
  if (time === "--") return "--";
  const date = new Date(`1970-01-01T${time}:00`);
  return date.toLocaleTimeString(i18n.language, {
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function AttendanceTab() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [isDutyStarted, setIsDutyStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [totalTime, setTotalTime] = useState("00:00");
  const [activeTab, setActiveTab] = useState<
    "all" | AttendanceStatus
  >("all");

  /* ------------------ ✅ LIVE DUTY TIMER ------------------ */

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isDutyStarted && startTime) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = now - startTime.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        setTotalTime(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`
        );
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isDutyStarted, startTime]);

  /* ------------------ ✅ FORMAT LOCAL TIME ------------------ */

  const formatLocalTime = (date: Date | null) => {
    if (!date) return "--:--";
    return date.toLocaleTimeString(i18n.language, {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  /* ------------------ ✅ DUTY HANDLERS ------------------ */

  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsDutyStarted(true);
    setEndTime(null);
    setTotalTime("00:00");
  };

  const handleEnd = () => {
    const now = new Date();
    setEndTime(now);
    setIsDutyStarted(false);
  };

  /* ------------------ ✅ FILTER ------------------ */

  const filteredData =
    activeTab === "all"
      ? attendanceHistory
      : attendanceHistory.filter(item => item.status === activeTab);

  return (
    <ScrollView style={{ padding: 16 }}>

      {/* ✅ TODAY ATTENDANCE */}
      <View style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}>
        <Text style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}>
          {t("attendance.todayAttendanceTitle")}
        </Text>

        <View style={[styles.row, { backgroundColor: theme.colors.colorSuccess100 }]}>
          <Text style={styles.label}>{t("attendance.startTimeLabel")}</Text>
          <Text style={[styles.value, { color: theme.colors.colorSuccess600 }]}>
            {formatLocalTime(startTime)}
          </Text>
        </View>

        <View style={[styles.row, { backgroundColor: theme.colors.inputBg }]}>
          <Text style={styles.label}>{t("attendance.endTimeLabel")}</Text>
          <Text style={styles.value}>{formatLocalTime(endTime)}</Text>
        </View>

        <View style={[styles.row, { backgroundColor: theme.colors.inputBg }]}>
          <Text style={styles.label}>{t("attendance.totalTimeLabel")}</Text>
          <Text style={[styles.value, { color: "#1565C0" }]}>{totalTime}</Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <ReusableButton
            title={
              isDutyStarted
                ? t("attendance.endDutyButton")
                : t("attendance.startDutyButton")
            }
            containerStyle={{
              backgroundColor: isDutyStarted
                ? theme.colors.colorAccent500
                : theme.colors.colorPrimary500,
            }}
            textStyle={{ color: theme.colors.colorBgPage }}
            onPress={isDutyStarted ? handleEnd : handleStart}
          />
        </View>
      </View>

      {/* ✅ TAB FILTER */}
      <View style={styles.tabRow}>
        {(["all", "present", "absent", "leave"] as const).map(tab => (
          <Text
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tabText,
              { borderColor: theme.colors.colorTextSecondary },
              activeTab === tab && {
                borderColor: theme.colors.validationSuccessText,
                color: theme.colors.validationSuccessText,
              },
            ]}
          >
            {t(`attendance.tabs.${tab}`)}
          </Text>
        ))}
      </View>

      {/* ✅ ATTENDANCE CARDS */}
      {filteredData.map(item => {
        const themeColor = statusTheme[item.status];
        const hours = Math.floor(item.totalMinutes / 60);
        const minutes = item.totalMinutes % 60;

        return (
          <View
            key={item.id}
            style={[
              styles.historyCard,
              { backgroundColor: themeColor.bg, borderColor: themeColor.border },
            ]}
          >
            <View style={styles.historyTopRow}>
              <Text style={[styles.historyDate, { color: themeColor.text }]}>
                {formatDate(item.date)}
              </Text>

              <View style={[styles.statusBadge, { borderColor: themeColor.border }]}>
                <Text style={{ color: themeColor.text }}>
                  {t(`attendance.history.${item.status}Status`)}
                </Text>
              </View>
            </View>

            <View style={styles.historyBottomRow}>
              <View>
                <Text style={styles.historyLabel}>
                  {t("attendance.history.checkInOutLabel")}
                </Text>
                <Text style={[styles.historyValue, { color: themeColor.text }]}>
                  {formatApiTime(item.checkIn)} {t("attendance.history.toLabel")}{" "}
                  {formatApiTime(item.checkOut)}
                </Text>
              </View>

              <View>
                <Text style={styles.historyLabel}>
                  {t("attendance.history.totalWorkingHoursLabel")}
                </Text>
                <Text style={[styles.historyValue, { color: themeColor.text }]}>
                  {hours}:{String(minutes).padStart(2, "0")}{" "}
                  {t("attendance.hoursSuffix")}
                </Text>
              </View>
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
}

/* ------------------ ✅ STYLES ------------------ */

const styles = StyleSheet.create({
  card: { borderRadius: 16, padding: 16, elevation: 3, marginBottom: 20 },
  cardTitle: { fontSize: 16, fontWeight: "700", marginBottom: 6 },
  row: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { fontSize: 14, color: "#555" },
  value: { fontSize: 15, fontWeight: "600" },

  tabRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 16 },
  tabText: { paddingVertical: 8, paddingHorizontal: 14, borderRadius: 20, fontWeight: "600", borderWidth: 1 },

  historyCard: { borderRadius: 14, padding: 14, borderWidth: 1, marginBottom: 12 },
  historyTopRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 12 },
  historyDate: { fontSize: 15, fontWeight: "700" },

  statusBadge: { borderWidth: 1, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },

  historyBottomRow: { flexDirection: "row", justifyContent: "space-between" },
  historyLabel: { fontSize: 12, color: "#666" },
  historyValue: { fontSize: 14, fontWeight: "600", marginTop: 4 },
});
