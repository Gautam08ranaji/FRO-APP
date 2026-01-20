import ReusableButton from "@/components/reusables/ReusableButton";
import i18n from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { getAttendanceHistory } from "@/features/fro/addAttendance";
import { useAppSelector } from "@/store/hooks";

/* ================= TYPES ================= */

type AttendanceStatus = "Present" | "Absent" | "Leave";

type AttendanceItem = {
  id: number;
  date: string;
  checkIn: string;
  checkOut: string;
  totalMinutes: number;
  status: AttendanceStatus;
};

/* ================= STATUS COLORS ================= */

const statusTheme: Record<
  AttendanceStatus,
  { bg: string; text: string; border: string }
> = {
  Present: { bg: "#E9F9EF", text: "#1E7F43", border: "#1E7F43" },
  Absent: { bg: "#FDECEC", text: "#C62828", border: "#C62828" },
  Leave: { bg: "#EAF2FF", text: "#1565C0", border: "#1565C0" },
};

/* ================= HELPERS ================= */

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? "--"
    : date.toLocaleDateString(i18n.language, {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

/* ================= STATUS NORMALIZER (ADDED) ================= */

const normalizeStatus = (status?: string): AttendanceStatus => {
  switch (status?.trim().toLowerCase()) {
    case "present":
      return "Present";
    case "absent":
      return "Absent";
    case "leave":
      return "Leave";
    default:
      return "Absent"; // ✅ safe fallback
  }
};

/* ================= API MAPPER ================= */

const mapAttendanceFromApi = (item: any): AttendanceItem => {
  const checkIn = item.checkintime
    ? new Date(item.checkintime).toLocaleTimeString(i18n.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

  const checkOut = item.checkouttime
    ? new Date(item.checkouttime).toLocaleTimeString(i18n.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--";

  const totalMinutes =
    item.checkintime && item.checkouttime
      ? Math.floor(
          (new Date(item.checkouttime).getTime() -
            new Date(item.checkintime).getTime()) /
            60000,
        )
      : 0;

  return {
    id: item.id,
    date: item.attendancedate ?? item.createddate,
    checkIn,
    checkOut,
    totalMinutes,
    status: normalizeStatus(item.status), // ✅ FIXED
  };
};

/* ================= COMPONENT ================= */

export default function AttendanceTab() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const authState = useAppSelector((state) => state.auth);

  const [attendanceHistory, setAttendanceHistory] = useState<AttendanceItem[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const [isDutyStarted, setIsDutyStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [totalTime, setTotalTime] = useState("00:00");

  const [activeTab, setActiveTab] = useState<"all" | AttendanceStatus>("all");

  /* ================= FETCH ================= */

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);

      const res = await getAttendanceHistory({
        userId: String(authState.userId),
        pageNumber: 1,
        pageSize: 30,
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      const list = Array.isArray(res?.data?.attendanceList)
        ? res.data.attendanceList
        : [];

      setAttendanceHistory(list.map(mapAttendanceFromApi));
    } catch (error) {
      console.error("Attendance API error:", error);
    } finally {
      setLoading(false);
    }
  };

  /* ================= FILTER ================= */

  const filteredData =
    activeTab === "all"
      ? attendanceHistory
      : attendanceHistory.filter((item) => item.status === activeTab);

  /* ================= UI ================= */

  return (
    <ScrollView style={{ padding: 16 }}>
      {/* ================= TODAY CARD (UNCHANGED) ================= */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          {t("attendance.todayAttendanceTitle")}
        </Text>

        <View
          style={[
            styles.row,
            { backgroundColor: theme.colors.colorSuccess100 },
          ]}
        >
          <Text style={styles.label}>{t("attendance.startTimeLabel")}</Text>
          <Text style={[styles.value, { color: theme.colors.colorSuccess600 }]}>
            {startTime
              ? startTime.toLocaleTimeString(i18n.language, {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </Text>
        </View>

        <View style={[styles.row, { backgroundColor: theme.colors.inputBg }]}>
          <Text style={styles.label}>{t("attendance.endTimeLabel")}</Text>
          <Text style={styles.value}>
            {endTime
              ? endTime.toLocaleTimeString(i18n.language, {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "--:--"}
          </Text>
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
            onPress={() => {}}
          />
        </View>
      </View>

      {/* ================= TABS ================= */}
      <View style={styles.tabRow}>
        {(["all", "Present", "Absent", "Leave"] as const).map((tab) => (
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

      {/* ================= HISTORY ================= */}
      {filteredData.map((item) => {
        const themeColor = statusTheme[item.status] ?? statusTheme.Absent; // ✅ NO CRASH

        const hours = Math.floor(item.totalMinutes / 60);
        const minutes = item.totalMinutes % 60;

        return (
          <View
            key={item.id}
            style={[
              styles.historyCard,
              {
                backgroundColor: themeColor.bg,
                borderColor: themeColor.border,
              },
            ]}
          >
            <Text style={{ color: themeColor.text }}>
              {formatDate(item.date)} — {item.status}
            </Text>

            <Text style={{ color: themeColor.text }}>
              {item.checkIn} → {item.checkOut}
            </Text>

            <Text style={{ color: themeColor.text }}>
              {hours}:{String(minutes).padStart(2, "0")} hrs
            </Text>
          </View>
        );
      })}
    </ScrollView>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  row: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: { fontSize: 14, color: "#555" },
  value: { fontSize: 15, fontWeight: "600" },

  tabRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  tabText: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    fontWeight: "600",
    borderWidth: 1,
  },

  historyCard: {
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    marginBottom: 12,
  },
});
