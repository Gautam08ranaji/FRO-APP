import ReusableButton from "@/components/reusables/ReusableButton";
import i18n from "@/i18n";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, Text, View } from "react-native";

import { getAttendanceHistory } from "@/features/fro/addAttendance";

import { addAttendance } from "@/features/fro/addAttendanceStatus";
import { useAppSelector } from "@/store/hooks";
import Toast from "react-native-toast-message";

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

const getTodayKey = () => new Date().toDateString();

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

const formatTimeAMPM = (date: Date | null) =>
  date
    ? date.toLocaleTimeString(i18n.language, {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

const formatMinutesToTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
};

/* ================= STATUS NORMALIZER ================= */

const normalizeStatus = (status?: string): AttendanceStatus => {
  switch (status?.trim().toLowerCase()) {
    case "present":
      return "Present";
    case "leave":
      return "Leave";
    default:
      return "Absent";
  }
};

/* ================= API MAPPER ================= */

const mapAttendanceFromApi = (item: any): AttendanceItem => {
  const checkInDate = item.checkintime ? new Date(item.checkintime) : null;
  const checkOutDate = item.checkouttime ? new Date(item.checkouttime) : null;

  const totalMinutes =
    checkInDate && checkOutDate
      ? Math.floor((checkOutDate.getTime() - checkInDate.getTime()) / 60000)
      : 0;

  return {
    id: item.id,
    date: item.attendancedate ?? item.createddate,
    checkIn: formatTimeAMPM(checkInDate),
    checkOut: formatTimeAMPM(checkOutDate),
    totalMinutes,
    status: normalizeStatus(item.status),
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

  /* ===== Punch States ===== */
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [workedMinutes, setWorkedMinutes] = useState(0);
  const [dutyEnded, setDutyEnded] = useState(false);

  const [todayKey, setTodayKey] = useState(getTodayKey());
  const [activeTab, setActiveTab] = useState<"all" | AttendanceStatus>("all");

  /* ================= FETCH HISTORY ================= */

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
    } catch (err) {
      console.error("Attendance API error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAttendance();
  }, []);

  /* ================= LIVE TIMER ================= */

  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;

    if (isPunchedIn && punchInTime) {
      timer = setInterval(() => {
        const diff = Date.now() - punchInTime.getTime();
        setWorkedMinutes(Math.floor(diff / 60000));
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isPunchedIn, punchInTime]);

  /* ================= DATE CHANGE AUTO RESET ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const currentKey = getTodayKey();

      if (currentKey !== todayKey) {
        setTodayKey(currentKey);

        setDutyEnded(false);
        setIsPunchedIn(false);
        setPunchInTime(null);
        setWorkedMinutes(0);

        loadAttendance();
      }
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, [todayKey]);

  const filteredData =
    activeTab === "all"
      ? attendanceHistory
      : attendanceHistory.filter((item) => item.status === activeTab);

  const submitAttendanceStatus = async (action: "start" | "end") => {
    try {
      const now = new Date();
      const currentDate = now.toISOString().split("T")[0];
      const currentDateTime = now.toISOString();

      const res = await addAttendance({
        data: {
          attendancedate: currentDate,
          checkintime: action === "start" ? currentDateTime : "",
          checkouttime: action === "end" ? currentDateTime : "",
          status: "Present",
          totalworkinghours:
            action === "end" ? formatMinutesToTime(workedMinutes) : "00:00",
          userId: String(authState.userId),
        },
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      console.log("punch in punch out ", res);

      Toast.show({
        type: "success",
        text1: action === "start" ? "Duty Started" : "Duty Ended Successfully",
      });

      loadAttendance();
    } catch (error) {
      console.error("Attendance submit failed", error);
      Toast.show({
        type: "error",
        text1: "Attendance failed",
      });
    }
  };

  const handleDutyAction = async () => {
    if (loading) return;

    if (!isPunchedIn) {
      // ▶ START DUTY
      const now = new Date();
      setPunchInTime(now);
      setWorkedMinutes(0);
      setIsPunchedIn(true);
      setDutyEnded(false);

      await submitAttendanceStatus("start");
    } else {
      // ⏹ END DUTY
      setIsPunchedIn(false);
      setPunchInTime(null);
      setDutyEnded(true);

      await submitAttendanceStatus("end");
    }
  };

  /* ================= UI ================= */

  return (
    <ScrollView style={{ padding: 16 }}>
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
            {formatTimeAMPM(punchInTime)}
          </Text>
        </View>

        <View style={[styles.row, { backgroundColor: theme.colors.inputBg }]}>
          <Text style={styles.label}>{t("attendance.endTimeLabel")}</Text>
          <Text style={styles.value}>
            {dutyEnded
              ? "Duty Ended"
              : !isPunchedIn && punchInTime
                ? formatTimeAMPM(new Date())
                : "--:--"}
          </Text>
        </View>

        <View style={[styles.row, { backgroundColor: theme.colors.inputBg }]}>
          <Text style={styles.label}>{t("attendance.totalTimeLabel")}</Text>
          <Text style={[styles.value, { color: "#1565C0" }]}>
            {formatMinutesToTime(workedMinutes)}
          </Text>
        </View>

        <View style={{ marginTop: 20 }}>
          <ReusableButton
            title={
              dutyEnded
                ? "Duty Ended"
                : isPunchedIn
                  ? t("attendance.endDutyButton")
                  : t("attendance.startDutyButton")
            }
            disabled={dutyEnded}
            containerStyle={{
              backgroundColor: dutyEnded
                ? "#BDBDBD"
                : isPunchedIn
                  ? theme.colors.colorAccent500
                  : theme.colors.colorPrimary500,
            }}
            textStyle={{ color: theme.colors.colorBgPage }}
            onPress={handleDutyAction}
          />
        </View>
      </View>

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

      {filteredData.map((item) => {
        const themeColor = statusTheme[item.status];
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
            <Text style={{ color: themeColor.text, fontWeight: "700" }}>
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
