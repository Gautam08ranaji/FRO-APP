import React, { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateField from "./fields/DateField";
import { FieldProps } from "./types";

/* ================= HELPERS ================= */

const capitalize = (text?: string) =>
  text ? text.charAt(0).toUpperCase() + text.slice(1) : "";

/* ================= STYLES ================= */

const inputStyle = {
  borderWidth: 1,
  borderColor: "#ccc",
  backgroundColor: "#fff",
  color: "#000",
  padding: 12,
  borderRadius: 8,
  marginTop: 6,
};

/* ================= COMPONENTS ================= */

/* ✅ REAL COMPONENT → Hooks allowed */
const DropdownField: React.FC<FieldProps> = ({
  label,
  options = [],
  value,
  onChange,
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ marginBottom: 16 }}>
      <Text>{capitalize(label)}</Text>

      {/* Trigger */}
      <TouchableOpacity
        onPress={() => setVisible(true)}
        activeOpacity={0.85}
        style={{
          borderWidth: 1,
          borderColor: "#ccc",
          borderRadius: 8,
          padding: 12,
          marginTop: 6,
          backgroundColor: "#fff",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ color: value ? "#000" : "#999" }}>
          {value || `Select ${capitalize(label)}`}
        </Text>

        <Text
          style={{
            fontSize: 14,
            color: "#666",
            transform: [{ rotate: visible ? "180deg" : "0deg" }],
          }}
        >
          ▼
        </Text>
      </TouchableOpacity>

      {/* Bottom Modal */}
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
      >
        {/* Overlay */}
        <Pressable
          style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.4)" }}
          onPress={() => setVisible(false)}
        />

        {/* Bottom Sheet */}
        <View
          style={{
            backgroundColor: "#fff",
            borderTopLeftRadius: 18,
            borderTopRightRadius: 18,
            paddingHorizontal: 16,
            paddingTop: 14,
            paddingBottom: 24,
            maxHeight: "60%",
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: "600", marginBottom: 12 }}>
            Select {capitalize(label)}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {options.map((opt) => (
              <TouchableOpacity
                key={opt}
                onPress={() => {
                  onChange(opt);
                  setVisible(false);
                }}
                style={{
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: "#eee",
                }}
              >
                <Text
                  style={{
                    fontSize: 15,
                    color: value === opt ? "#007AFF" : "#000",
                    fontWeight: value === opt ? "600" : "400",
                  }}
                >
                  {opt}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
};

/* ================= REGISTRY ================= */

export const FieldRegistry: Record<
  string,
  React.ComponentType<FieldProps>
> = {
  input: ({ label, value = "", onChange }) => (
    <View style={{ marginBottom: 16 }}>
      <Text>{capitalize(label)}</Text>
      <TextInput
        value={String(value)}
        onChangeText={onChange}
        placeholder={`Enter ${capitalize(label)}`}
        style={inputStyle}
      />
    </View>
  ),

  textarea: ({ label, value = "", onChange }) => (
    <View style={{ marginBottom: 16 }}>
      <Text>{capitalize(label)}</Text>
      <TextInput
        value={String(value)}
        multiline
        numberOfLines={4}
        onChangeText={onChange}
        placeholder={`Enter ${capitalize(label)}`}
        style={{ ...inputStyle, height: 100, textAlignVertical: "top" }}
      />
    </View>
  ),

  date: DateField,

  radio: ({ label, options = [], value, onChange }) => (
    <View style={{ marginBottom: 16 }}>
      <Text>{capitalize(label)}</Text>
      <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
        {options.map((opt) => (
          <TouchableOpacity key={opt} onPress={() => onChange(opt)}>
            <Text>{value === opt ? "🔘" : "⚪"} {opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  ),

  dropdown: DropdownField, // ✅ CORRECT
};
