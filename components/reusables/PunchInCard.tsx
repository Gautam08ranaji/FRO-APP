import { addAttendance } from "@/features/fro/addAttendanceStatus";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const TARGET_MINUTES = 8 * 60;

/* ================= HELPERS ================= */

const getTodayKey = () => new Date().toISOString().split("T")[0];

function formatMinutesToTime(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${h}h ${m}m`;
}

function formatTimeAMPM(date: Date) {
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/* ================= COMPONENT ================= */

export default function PunchInCard() {
  const { theme } = useTheme();
  const authState = useAppSelector((state) => state.auth);

  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [workedMinutes, setWorkedMinutes] = useState(0);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [dutyEnded, setDutyEnded] = useState(false);
  const [loading, setLoading] = useState(false);
  const [todayKey, setTodayKey] = useState(getTodayKey());

  /* ================= TIMER ================= */

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isPunchedIn && punchInTime) {
      interval = setInterval(() => {
        const diffMs = Date.now() - punchInTime.getTime();
        setWorkedMinutes(Math.floor(diffMs / 60000));
      }, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPunchedIn, punchInTime]);

  /* ================= DATE CHANGE RESET ================= */

  useEffect(() => {
    const interval = setInterval(() => {
      const newKey = getTodayKey();

      if (newKey !== todayKey) {
        setTodayKey(newKey);
        setPunchInTime(null);
        setWorkedMinutes(0);
        setIsPunchedIn(false);
        setDutyEnded(false);
      }
    }, 60 * 1000); // check every minute

    return () => clearInterval(interval);
  }, [todayKey]);

  /* ================= PUNCH HANDLER ================= */

  const punchAttendance = async () => {
    if (loading || dutyEnded) return;
    setLoading(true);

    try {
      const now = new Date();
      const currentDateTime = now.toISOString();

      const action: "start" | "end" = isPunchedIn ? "end" : "start";

      const res = await addAttendance({
        data: {
          attendancedate: todayKey,
          checkintime: action === "start" ? currentDateTime : "",
          checkouttime: action === "end" ? currentDateTime : "",
          status: "Present",
          totalworkinghours:
            action === "end" ? formatMinutesToTime(workedMinutes) : "0h 0m",
          userId: String(authState.userId),
        },
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      console.log("attendaxc res", res);

      if (action === "start") {
        setPunchInTime(now);
        setWorkedMinutes(0);
        setIsPunchedIn(true);

        Toast.show({
          type: "success",
          text1: "Punch In Successful",
          text2: `Started at ${formatTimeAMPM(now)}`,
        });
      } else {
        setIsPunchedIn(false);
        setDutyEnded(true);

        Toast.show({
          type: "success",
          text1: "Punch Out Successful",
          text2: `Worked ${formatMinutesToTime(workedMinutes)}`,
        });
      }
    } catch (error: any) {
      const statusCode = error?.response?.data?.statusCode;
      const apiMessage =
        error?.response?.data?.errors?.[0] ??
        "Attendance already recorded for today";

      if (statusCode === 409) {
        setDutyEnded(true);
        setIsPunchedIn(false);

        Toast.show({
          type: "info",
          text1: "Already Recorded",
          text2: apiMessage,
        });
        return;
      }

      Toast.show({
        type: "error",
        text1: "Attendance Failed",
        text2: "Please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <View
      style={{
        padding: 12,
        backgroundColor: theme.colors.validationWarningBg,
        marginTop: 10,
        borderRadius: 12,
        borderColor: theme.colors.validationWarningText,
        borderWidth: 1,
        elevation: 2,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View>
          <Text style={{ color: theme.colors.colorTextSecondary }}>
            Punched-in at
          </Text>

          <Text
            style={[
              theme.typography.fontH4,
              {
                color: theme.colors.validationWarningText,
                marginTop: 5,
              },
            ]}
          >
            {punchInTime ? formatTimeAMPM(punchInTime) : "--:--"}
          </Text>
        </View>

        <TouchableOpacity
          disabled={loading || dutyEnded}
          onPress={punchAttendance}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 22,
            borderRadius: 10,
            backgroundColor:
              loading || dutyEnded
                ? "#999"
                : theme.colors.validationWarningText,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {loading
              ? "Please wait..."
              : dutyEnded
                ? "Punched Out"
                : isPunchedIn
                  ? "Punch Out"
                  : "Punch In"}
          </Text>
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: 12,
        }}
      >
        <Text style={{ color: theme.colors.colorTextSecondary }}>
          Working Time: {formatMinutesToTime(workedMinutes)}
        </Text>

        <Text style={{ color: theme.colors.colorTextSecondary }}>
          Target: {formatMinutesToTime(TARGET_MINUTES)}
        </Text>
      </View>
    </View>
  );
}
