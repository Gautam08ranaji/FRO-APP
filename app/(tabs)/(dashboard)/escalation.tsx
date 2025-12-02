import BodyLayout from "@/components/layout/BodyLayout";
import ReusableButton from "@/components/reusables/ReusableButton";
import { useTheme } from "@/theme/ThemeContext";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Divider } from "react-native-paper";
import RemixIcon from "react-native-remix-icon";

export default function EscalationScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [notes, setNotes] = useState("");
  const [focusField, setFocusField] = useState("");

  // ✅ Correct TS type for selected file
  const [file, setFile] = useState<ImagePicker.ImagePickerAsset | null>(null);

  const reasons = [
    "आपातकालीन स्थिति",
    "कारण स्पष्ट नहीं",
    "सहयोग प्राप्त नहीं",
    "इलाज में देरी",
  ];

  // 🔥 Button active only when required fields filled
  const isFormValid = selectedReason !== "" && notes.trim() !== "";

  // 📸 Pick Image/Document
  const openUploadPicker = async () => {
    Alert.alert("फाइल अपलोड", "एक विकल्प चुनें", [
      {
        text: "📷 कैमरा",
        onPress: async () => {
          const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ correct for your SDK
            quality: 0.7,
          });

          if (!result.canceled) setFile(result.assets[0]);
        },
      },
      {
        text: "🖼️ गैलरी",
        onPress: async () => {
          const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images, // ✅ correct
            quality: 0.7,
          });

          if (!result.canceled) setFile(result.assets[0]);
        },
      },
      { text: "रद्द करें", style: "cancel" },
    ]);
  };

  return (
    <BodyLayout type="screen" screenName="एस्केलेशन भेजें">
      {/* 🚨 Warning */}
      <Card
        mode="contained"
        style={[
          styles.warningCard,
          {
            backgroundColor: theme.colors.colorWarning100,
            borderColor: theme.colors.colorWarning100,
          },
        ]}
      >
        <Text style={[theme.typography.fontBody, styles.warningText]}>
          ⚠️ एस्केलेशन केवल गंभीर मामलों के लिए उपयोग करें। आपका सुपरवाइज़र
          तुरंत सूचित किया जाएगा।
        </Text>
      </Card>

      {/* MAIN CARD */}
      <Card
        style={[styles.mainCard, { backgroundColor: theme.colors.colorBgPage }]}
      >
        {/* DROPDOWN */}
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          कारण चुनें
        </Text>

        <TouchableOpacity
          onPress={() => {
            setDropdownOpen(!dropdownOpen);
            setFocusField("dropdown");
          }}
          style={[
            styles.dropdown,
            {
              borderColor:
                focusField === "dropdown"
                  ? theme.colors.colorPrimary600
                  : theme.colors.colorOverlay,
            },
          ]}
        >
          <Text
            style={{
              color: selectedReason
                ? theme.colors.colorTextSecondary
                : theme.colors.colorOverlay,
            }}
          >
            {selectedReason || "कारण चुनें"}
          </Text>

          <RemixIcon
            name={dropdownOpen ? "arrow-up-s-line" : "arrow-down-s-line"}
            size={20}
            color={theme.colors.colorOverlay}
          />
        </TouchableOpacity>

        {dropdownOpen && (
          <View
            style={[
              styles.dropdownList,
              {
                backgroundColor: theme.colors.colorBgSurface,
                borderColor: theme.colors.colorOverlay,
              },
            ]}
          >
            {reasons.map((reason, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setSelectedReason(reason);
                  setDropdownOpen(false);
                  setFocusField("");
                }}
                style={[
                  styles.dropdownItem,
                  { borderColor: theme.colors.colorOverlay },
                ]}
              >
                <Text style={{ color: theme.colors.colorTextSecondary }}>
                  {reason}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <Divider style={{ marginVertical: 14 }} />

        {/* NOTES */}
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          नोट्स जोड़ें
        </Text>

        <TextInput
          multiline
          placeholder="यहां लिखें..."
          placeholderTextColor={theme.colors.colorOverlay}
          value={notes}
          onChangeText={(text) => setNotes(text)}
          onFocus={() => setFocusField("notes")}
          onBlur={() => setFocusField("")}
          style={[
            styles.notesBox,
            {
              borderColor:
                focusField === "notes"
                  ? theme.colors.colorPrimary600
                  : theme.colors.colorOverlay,
              backgroundColor: theme.colors.colorBgSurface,
              color: theme.colors.colorTextSecondary,
            },
          ]}
        />

        <Divider style={{ marginVertical: 14 }} />

        {/* FILE UPLOAD */}
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          फोटो / दस्तावेज़ जोड़ें
        </Text>

        <TouchableOpacity
          style={[
            styles.uploadBox,
            {
              backgroundColor: theme.colors.colorBgSurface,
              borderColor: theme.colors.colorOverlay,
            },
          ]}
          onPress={openUploadPicker}
        >
          <RemixIcon
            name="upload-2-line"
            size={40}
            color={theme.colors.colorOverlay}
          />
          <Text
            style={[styles.uploadText, { color: theme.colors.colorOverlay }]}
          >
            {file ? "फाइल चुनी गई ✓" : "फाइल अपलोड करें"}
          </Text>
        </TouchableOpacity>
      </Card>

      {/* BUTTON ENABLED ONLY WHEN VALID */}
      <ReusableButton
        title="एस्केलेशन सबमिट करें"
        containerStyle={{
          backgroundColor: isFormValid
            ? theme.colors.colorPrimary600
            : theme.colors.colorOverlay,
        }}
        textStyle={{
          color: isFormValid
            ? theme.colors.colorTextSecondary
            : theme.colors.colorOverlay,
        }}
        disabled={!isFormValid}
      />
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  warningCard: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  warningText: {
    color: "#92400E",
    lineHeight: 20,
  },
  mainCard: {
    marginTop: 16,
    padding: 16,
    borderRadius: 12,
    elevation: 1,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
  },

  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownList: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 8,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
  },

  notesBox: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: 100,
    textAlignVertical: "top",
  },

  uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",

    borderRadius: 10,
    paddingVertical: 40,
    alignItems: "center",
  },
  uploadText: {
    marginTop: 8,
  },
});
