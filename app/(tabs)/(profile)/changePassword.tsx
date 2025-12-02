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

export default function ChangePasswordScreen() {
  const { theme } = useTheme();

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <BodyLayout type={"screen"} screenName="पासवर्ड बदलें">
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        {/* OLD PASSWORD */}
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          पुराना पासवर्ड
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.colorTextSecondary,
              },
            ]}
            placeholder={theme.colors.colorTextSecondary}
            secureTextEntry={!showOld}
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowOld(!showOld)}
          >
            <RemixIcon
              name={showOld ? "eye-line" : "eye-off-line"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* NEW PASSWORD */}
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          नया पासवर्ड
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.colorTextSecondary,
              },
            ]}
            placeholder={theme.colors.inputPlaceholder}
            secureTextEntry={!showNew}
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowNew(!showNew)}
          >
            <RemixIcon
              name={showNew ? "eye-line" : "eye-off-line"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* CONFIRM PASSWORD */}
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          पासवर्ड पुष्टि करें
        </Text>
        <View style={styles.inputWrapper}>
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: theme.colors.inputBg,
                borderColor: theme.colors.inputBorder,
                color: theme.colors.colorTextSecondary,
              },
            ]}
            placeholder={theme.colors.inputPlaceholder}
            secureTextEntry={!showConfirm}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          <TouchableOpacity
            style={styles.eyeBtn}
            onPress={() => setShowConfirm(!showConfirm)}
          >
            <RemixIcon
              name={showConfirm ? "eye-line" : "eye-off-line"}
              size={22}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        {/* SAVE BUTTON */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: theme.colors.colorPrimary600 },
          ]}
          onPress={() => {}}
        >
          <Text style={styles.saveText}>सेव करें</Text>
        </TouchableOpacity>
      </View>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    marginHorizontal: 15,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
    color: "#111",
  },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },

  input: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
  },

  eyeBtn: {
    position: "absolute",
    right: 12,
  },

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 25,
    alignItems: "center",
  },

  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
