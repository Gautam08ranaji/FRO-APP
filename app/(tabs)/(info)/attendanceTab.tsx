import ReusableButton from "@/components/reusables/ReusableButton";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

export default function AttendanceTab() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  // States
  const [isDutyStarted, setIsDutyStarted] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [totalTime, setTotalTime] = useState("00:00");

  // Live Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;

    if (isDutyStarted && startTime) {
      timer = setInterval(() => {
        const now = new Date().getTime();
        const diff = now - startTime.getTime();

        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff / (1000 * 60)) % 60);

        setTotalTime(
          `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
            2,
            "0"
          )}`
        );
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isDutyStarted, startTime]);

  // Format Time
  const formatTime = (date: Date | null) => {
    if (!date) return t("attendance.timePlaceholder"); // e.g. "--:-- --"

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm =
      hours >= 12 ? t("attendance.pmLabel") : t("attendance.amLabel");

    if (hours > 12) hours -= 12;
    if (hours === 0) hours = 12;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )} ${ampm}`;
  };

  // Start Duty
  const handleStart = () => {
    const now = new Date();
    setStartTime(now);
    setIsDutyStarted(true);
    setEndTime(null);
    setTotalTime("00:00");
  };

  // End Duty
  const handleEnd = () => {
    const now = new Date();
    setEndTime(now);
    setIsDutyStarted(false);
  };

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}>
      <Text
        style={[
          styles.cardTitle,
          { color: theme.colors.colorPrimary600 },
        ]}
      >
        {t("attendance.todayAttendanceTitle")}
      </Text>

      {/* START TIME */}
      <View
        style={[
          styles.row,
          { backgroundColor: theme.colors.colorSuccess100 },
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          {t("attendance.startTimeLabel")}
        </Text>
        <Text
          style={[
            styles.value,
            { color: theme.colors.colorSuccess600 },
          ]}
        >
          {formatTime(startTime)}
        </Text>
      </View>

      {/* END TIME */}
      <View
        style={[
          styles.row,
          { backgroundColor: theme.colors.inputBg },
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          {t("attendance.endTimeLabel")}
        </Text>
        <Text
          style={[
            styles.value,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          {formatTime(endTime)}
        </Text>
      </View>

      {/* TOTAL TIME */}
      <View
        style={[
          styles.row,
          { backgroundColor: theme.colors.inputBg },
        ]}
      >
        <Text
          style={[
            styles.label,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          {t("attendance.totalTimeLabel")}
        </Text>
        <Text
          style={[
            styles.value,
            { color: theme.colors.validationInfoText },
          ]}
        >
          {totalTime} {t("attendance.hoursSuffix")}
        </Text>
      </View>

      {/* BUTTON */}
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
          textStyle={{
            color: theme.colors.colorBgPage,
            paddingHorizontal: 1,
          }}
          onPress={isDutyStarted ? handleEnd : handleStart}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    padding: 16,
    elevation: 3,
    backgroundColor: "#FFF",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  row: {
    marginTop: 14,
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 14,
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
  },
});
