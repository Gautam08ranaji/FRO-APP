import BodyLayout from "@/components/layout/BodyLayout";
import { addNotesRecord } from "@/features/fro/complaints/addNoteApi";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ---------- NOTE TYPES ---------- */
const NOTE_TYPES = ["PUBLIC", "PRIVATE"];

export default function AddNoteScreen() {
  const { theme } = useTheme();
  const authState = useAppSelector((state) => state.auth);

  const [noteType, setNoteType] = useState("");
  const [description, setDescription] = useState("");
  const [followUpDate, setFollowUpDate] = useState<Date | null>(null);

  const [showSheet, setShowSheet] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const params = useLocalSearchParams();

  const caseId = params.caseId ? Number(params.caseId) : null;
  const transactionNumber = params.transactionNumber as string | undefined;

  console.log("caseId:", caseId);
  console.log("transactionNumber:", transactionNumber);

  /* ---------- TOMORROW ONLY ---------- */
  const getTomorrow = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    date.setHours(0, 0, 0, 0);
    return date;
  };

  /* ---------- SUBMIT ---------- */
  const submitNote = async () => {
    if (!noteType) {
      Alert.alert("Validation", "Please select note type");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Validation", "Please enter description");
      return;
    }

    if (!followUpDate) {
      Alert.alert("Validation", "Please select follow-up date");
      return;
    }

    try {
      const payload = {
        relatedTo: "CAS",
        relatedToId: caseId ?? 0,
        relatedToName: transactionNumber ?? "",
        noteType: noteType.toLowerCase(),
        noteDesc: description,
        createdBy: String(authState.userId),
        nextFollowUpDate: followUpDate.toISOString(),
      };

      await addNotesRecord({
        payload,
        auth: {
          bearerToken: String(authState.token),
          antiForgeryToken: String(authState.antiforgeryToken),
        },
      });

      Alert.alert("Success", "Note added successfully");
      router.back();
    } catch (error: any) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to add note. Please try again.";

      if (status === 401) {
        Alert.alert("Session Expired", "Please login again.", [
          {
            text: "OK",
            onPress: () => router.replace("/login"),
          },
        ]);
        return;
      }

      Alert.alert("Error", message);
    }
  };

  return (
    <BodyLayout type="screen">
      <View style={styles.container}>
        {/* ---------- NOTE TYPE ---------- */}

        {/* ---------- FOLLOW UP DATE ---------- */}
        <Text
          style={[
            styles.label,
            { color: theme.colors.colorTextSecondary, marginTop: 20 },
          ]}
        >
          Next Follow-up Date
        </Text>

        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.colors.colorBgSurface,
              borderColor: theme.colors.navDivider,
            },
          ]}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={{
              color: followUpDate
                ? theme.colors.colorTextPrimary
                : theme.colors.colorTextSecondary,
              fontSize: 14,
            }}
          >
            {followUpDate
              ? followUpDate.toDateString()
              : "Select follow-up date"}
          </Text>

          <Ionicons
            name="calendar-outline"
            size={18}
            color={theme.colors.colorTextSecondary}
          />
        </TouchableOpacity>

        <Text
          style={[
            styles.label,
            { color: theme.colors.colorTextSecondary, marginTop: 10 },
          ]}
        >
          Note Type
        </Text>

        <TouchableOpacity
          style={[
            styles.dropdown,
            {
              backgroundColor: theme.colors.colorBgSurface,
              borderColor: theme.colors.navDivider,
            },
          ]}
          onPress={() => setShowSheet(true)}
        >
          <Text
            style={{
              color: noteType
                ? theme.colors.colorTextPrimary
                : theme.colors.colorTextSecondary,
              fontSize: 14,
            }}
          >
            {noteType || "Select note type"}
          </Text>
          <Ionicons
            name="chevron-down"
            size={18}
            color={theme.colors.colorTextSecondary}
          />
        </TouchableOpacity>

        {/* ---------- DESCRIPTION ---------- */}
        <Text
          style={[
            styles.label,
            { color: theme.colors.colorTextSecondary, marginTop: 20 },
          ]}
        >
          Description
        </Text>

        <TextInput
          multiline
          value={description}
          onChangeText={setDescription}
          placeholder="Write note description..."
          placeholderTextColor={theme.colors.colorTextSecondary}
          style={[
            styles.textArea,
            {
              backgroundColor: theme.colors.colorBgSurface,
              color: theme.colors.colorTextPrimary,
              borderColor: theme.colors.navDivider,
            },
          ]}
        />

        {/* ---------- SAVE BUTTON ---------- */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.colorPrimary600 },
          ]}
          onPress={submitNote}
        >
          <Text
            style={{ color: theme.colors.colorBgSurface, fontWeight: "600" }}
          >
            Save Note
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------- DATE PICKER ---------- */}
      {showDatePicker && (
        <DateTimePicker
          value={followUpDate ?? getTomorrow()}
          mode="date"
          display={Platform.OS === "ios" ? "spinner" : "default"}
          minimumDate={getTomorrow()} // 🚫 today disabled
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setFollowUpDate(selectedDate);
            }
          }}
        />
      )}

      {/* ---------- NOTE TYPE BOTTOM SHEET ---------- */}
      <Modal transparent visible={showSheet} animationType="slide">
        <Pressable style={styles.overlay} onPress={() => setShowSheet(false)} />

        <View
          style={[
            styles.sheet,
            { backgroundColor: theme.colors.colorBgSurface },
          ]}
        >
          <Text
            style={[styles.sheetTitle, { color: theme.colors.colorHeadingH1 }]}
          >
            Select Note Type
          </Text>

          {NOTE_TYPES.map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.sheetItem}
              onPress={() => {
                setNoteType(type);
                setShowSheet(false);
              }}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: theme.colors.colorTextPrimary,
                }}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </Modal>
    </BodyLayout>
  );
}

/* ---------- STYLES ---------- */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },

  label: {
    fontSize: 13,
    marginBottom: 6,
  },

  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  textArea: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    minHeight: 120,
    textAlignVertical: "top",
    fontSize: 14,
  },

  saveButton: {
    marginTop: 30,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },

  /* ---------- BOTTOM SHEET ---------- */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
  },

  sheet: {
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginBottom: 100,
  },

  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 16,
  },

  sheetItem: {
    paddingVertical: 14,
  },
});
