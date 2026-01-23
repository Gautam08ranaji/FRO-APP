import BodyLayout from "@/components/layout/BodyLayout";
import { addNotesRecord } from "@/features/fro/complaints/addNoteApi";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Modal,
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
  const [showSheet, setShowSheet] = useState(false);

  const submitNote = async () => {
    try {
      const payload = {
        relatedTo: "CAS",
        relatedToId: 61,
        relatedToName: "26012300001",
        noteType: noteType,
        noteDesc: description,
        createdBy: String(authState.userId),
        nextFollowUpDate: new Date().toISOString(),
      };

      const res = await addNotesRecord({
        payload,
        auth: {
          bearerToken: String(authState.token),
          antiForgeryToken: String(authState.antiforgeryToken),
        },
      });

      console.log("res", res);

      Alert.alert("Success", "Note added successfully");

      router.back();
    } catch (error: any) {
      const status = error?.response?.status;
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Unable to add note. Please try again.";

      if (status === 401) {
        Alert.alert(
          "Session Expired",
          "Your session has expired. Please login again.",
          [
            {
              text: "OK",
              onPress: () => router.replace("/login"),
            },
          ],
        );
        return;
      }

      Alert.alert("Error", message);
    }
  };

  return (
    <BodyLayout type="screen">
      <View style={styles.container}>
        {/* ---------- NOTE TYPE ---------- */}
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
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
          onPress={() => {
            submitNote();
          }}
        >
          <Text
            style={{ color: theme.colors.colorBgSurface, fontWeight: "600" }}
          >
            Save Note
          </Text>
        </TouchableOpacity>
      </View>

      {/* ---------- BOTTOM SHEET ---------- */}
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
