import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

  const [punchInTime, setPunchInTime] = useState<Date | null>(null);
  const [workedMinutes, setWorkedMinutes] = useState(0);
  const [isPunchedIn, setIsPunchedIn] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isPunchedIn && punchInTime) {
      interval = setInterval(() => {
        const now = new Date();
        const diffMs = now.getTime() - punchInTime.getTime();
        const totalMinutes = Math.floor(diffMs / 60000);
        setWorkedMinutes(totalMinutes);
      }, 60000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPunchedIn, punchInTime]);

  const handlePunchIn = () => {
    setPunchInTime(new Date());
    setWorkedMinutes(0);
    setIsPunchedIn(true);
  };

  const handlePunchOut = () => {
    // setIsPunchedIn(false);
    router.push('/(tabs)/(dashboard)/updateReport')
  };

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
              { color: theme.colors.validationWarningText, marginTop: 5 },
            ]}
          >
            {punchInTime ? formatTimeAMPM(punchInTime) : "00:00"}
          </Text>
        </View>

        <TouchableOpacity
          onPress={isPunchedIn ? handlePunchOut : handlePunchIn}
          style={{
            paddingVertical: 12,
            paddingHorizontal: 22,
            borderRadius: 10,
            backgroundColor: theme.colors.validationWarningText,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "700" }}>
            {isPunchedIn ? "Punch Out" : "Punch In"}
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
