import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import {
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FieldProps } from "../types";

export default function DateField({
  label,
  value,
  onChange,
}: FieldProps) {
  const [show, setShow] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={{ color: "#000" }}>{label}</Text>

      <TouchableOpacity
        onPress={() => setShow(true)}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          backgroundColor: "#fff",
          padding: 12,
          borderRadius: 8,
          marginTop: 6,
        }}
      >
        <Text style={{ color: "#000" }}>
          {value
            ? new Date(value).toDateString()
            : "Select date"}
        </Text>
      </TouchableOpacity>

      {show && (
        <DateTimePicker
          value={value ? new Date(value) : new Date()}
          mode="date"
          display={
            Platform.OS === "ios" ? "spinner" : "default"
          }
          onChange={(_, selectedDate) => {
            setShow(false);
            if (selectedDate) {
              onChange(selectedDate.toISOString());
            }
          }}
        />
      )}
    </View>
  );
}
