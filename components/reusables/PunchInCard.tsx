import { updateAttendancePunch } from "@/features/fro/attendanceApi";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";

const TARGET_MINUTES = 8 * 60;
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

export default function PunchInCard() {
  const { theme } = useTheme();
  const authState = useAppSelector((state) => state.auth);

  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [workedMinutes, setWorkedMinutes] = useState(0);
  const [isPunchedIn, setIsPunchedIn] = useState(false);
  const [loading, setLoading] = useState(false);

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
      if (interval !== undefined) {
        clearInterval(interval);
      }
    };
  }, [isPunchedIn, punchInTime]);

  /* ================= API HANDLER ================= */
  const punchAttendance = async (punchIn: boolean) => {
    if (loading) return;

    setLoading(true);

    try {
      const res = await updateAttendancePunch({
        userId: String(authState.userId),
        punchIn,
        token: String(authState.token),
      });

      console.log("attendance update", res);

      if (punchIn) {
        const now = new Date();
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

        Toast.show({
          type: "success",
          text1: "Punch Out Successful",
          text2: `Worked ${formatMinutesToTime(workedMinutes)}`,
        });
      }
    } catch (error) {
      console.error("Attendance punch failed", error);

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
          disabled={loading}
          onPress={() => punchAttendance(!isPunchedIn)}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 22,
            borderRadius: 10,
            backgroundColor: loading
              ? "#999"
              : theme.colors.validationWarningText,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {loading
              ? "Please wait..."
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
