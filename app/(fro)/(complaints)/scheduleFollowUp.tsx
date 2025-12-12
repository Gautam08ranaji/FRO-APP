import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function ScheduleFollowUpScreen() {
  const { theme } = useTheme();
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <BodyLayout type="screen" screenName="Schedule Follow-Up">
      <View style={styles.container}>
        {/* Select Date */}
        <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>Select Date</Text>
        <TouchableOpacity style={[styles.inputBox, { borderColor: theme.colors.border }]}>
          <Text style={[styles.inputText, { color: theme.colors.colorTextSecondary }]}>
            {date || "Select date"}
          </Text>
          <RemixIcon name="calendar-line" size={22} color={theme.colors.colorPrimary600} />
        </TouchableOpacity>

        {/* Select Time */}
        <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>Select Time</Text>
        <TouchableOpacity style={[styles.inputBox, { borderColor: theme.colors.border }]}>
          <Text style={[styles.inputText, { color: theme.colors.colorTextSecondary }]}>
            {time || "Select time"}
          </Text>
          <RemixIcon name="time-line" size={22} color={theme.colors.colorPrimary600} />
        </TouchableOpacity>

        {/* Notes */}
        <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>Reason / Notes</Text>
        <TextInput
          style={[
            styles.textArea,
            { borderColor: theme.colors.border, color: theme.colors.colorTextSecondary },
          ]}
          placeholder="Enter reason for follow-up..."
          placeholderTextColor={theme.colors.colorTextSecondary}
          multiline
          value={notes}
          onChangeText={setNotes}
        />

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            { backgroundColor: theme.colors.btnDisabledBg },
          ]}
        >
          <Text style={[styles.submitText, { color: theme.colors.btnDisabledText }]}>
            Set Follow-up
          </Text>
        </TouchableOpacity>
      </View>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
  },

  label: {
    marginTop: 18,
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },

  inputBox: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  inputText: {
    fontSize: 15,
  },

  textArea: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    height: 120,
    textAlignVertical: "top",
    fontSize: 15,
  },

  submitButton: {
    marginTop: 30,
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
  },

  submitText: {
    fontSize: 15,
    fontWeight: "600",
  },
});
