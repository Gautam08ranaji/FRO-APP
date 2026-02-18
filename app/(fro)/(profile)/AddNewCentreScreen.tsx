import BodyLayout from "@/components/layout/BodyLayout";
import { addMobileAppMaster } from "@/features/fro/hospitalMasterApi";
import { useLocation } from "@/hooks/LocationContext";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

/* ================= SCREEN ================= */

export default function AddNewCentreScreen() {
  const params = useLocalSearchParams();
  const authState = useAppSelector((state) => state.auth);
  const { fetchLocation } = useLocation();

  const { theme } = useTheme();

  const centreType = Array.isArray(params.centreType)
    ? params.centreType[0]
    : params.centreType;

  const [is24x7, setIs24x7] = useState(true);
  const [isEmergency, setIsEmergency] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  /* ================= FORM STATE ================= */

  const [formData, setFormData] = useState({
    centreName: "",
    description: "",
    address1: "",
    address2: "",
    district: "",
    state: "",
    primaryPhone: "",
    email: "",
    website: "",
    isEnabled: true,
  });

  const updateField = (key: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  /* ================= PAYLOAD BUILDER ================= */

  const buildPayload = () => ({
    name: formData.centreName,
    description: formData.description,
    state: formData.state,
    stateId: 22, //
    district: formData.district,
    districtId: 22, //
    city: "",
    latLong: "",
    address: `${formData.address1} ${formData.address2}`.trim(),
    contactName: formData.centreName,
    contactPhone: formData.primaryPhone,
    contactWebsite: formData.website,
    contactEmail: formData.email,
    isEnabled: true,
  });

  /* ================= HANDLE SUBMIT ================= */

  const handleSubmit = async () => {
    if (!formData.centreName.trim()) {
      Alert.alert("Error", "Please enter centre name");
      return;
    }

    if (!authState.userId || !authState.token || !authState.antiforgeryToken) {
      Alert.alert("Error", "User not authenticated");
      return;
    }

    try {
      setIsLoading(true);

      // 👉 Fetch current GPS location
      const location = await fetchLocation();

      const latLong = location?.coords
        ? `${location.coords.latitude},${location.coords.longitude}`
        : "";

      const res = await addMobileAppMaster({
        endpoint: centreType as string,
        bearerToken: authState.token,
        antiForgeryToken: authState.antiforgeryToken,
        data: {
          ...buildPayload(),
          latLong, // ⭐ dynamic lat long
          userId: authState.userId,
        },
      });

      console.log("ADD CENTRE RESPONSE:", res);

      if (res?.success) {
        Alert.alert("Success", res.data?.message || "Centre added");
      } else {
        Alert.alert("Failed", "Centre creation failed");
      }
    } catch (error: any) {
      console.error("❌ ADD CENTRE ERROR:", error);

      Alert.alert(
        "Error",
        error?.message ||
          error?.data?.Errors?.[0] ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  /* ================= CARD CONFIG ================= */

  const sectionConfig = {
    basicInfo: {
      title: "Basic Information",
    },
    address: {
      title: "Address Details",
    },
    contact: {
      title: "Contact Information",
    },
    settings: {
      title: "Settings",
    },
  };

  /* ================= UI ================= */

  return (
    <BodyLayout type="screen" screenName="Add New Centre">
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View
          style={[
            styles.container,
            { backgroundColor: "theme.colors.colorBgPage" },
          ]}
        >
          <View
            style={[
              styles.card,
              {
                backgroundColor: theme.colors.colorBgSurface,
                shadowColor: theme.colors.colorShadow,
                shadowOpacity: 1,
                elevation: theme.dark ? 4 : 2,
              },
            ]}
          >
            {/* Basic Information Section */}
            <Text
              style={[
                theme.typography.fontH5,
                { color: theme.colors.colorHeadingH2, marginBottom: 16 },
              ]}
            >
              {sectionConfig.basicInfo.title}
            </Text>

            <Text
              style={[
                theme.typography.fontLabel,
                { color: theme.colors.colorTextSecondary, marginBottom: 6 },
              ]}
            >
              Centre Name *
            </Text>
            <TextInput
              value={formData.centreName}
              onChangeText={(v) => updateField("centreName", v)}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter centre name"
              placeholderTextColor={theme.colors.inputPlaceholder}
            />

            <Text
              style={[
                theme.typography.fontLabel,
                {
                  color: theme.colors.colorTextSecondary,
                  marginTop: 12,
                  marginBottom: 6,
                },
              ]}
            >
              Short Description
            </Text>
            <TextInput
              value={formData.description}
              onChangeText={(v) => updateField("description", v)}
              multiline
              style={[
                styles.input,
                styles.textArea,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter description"
              placeholderTextColor={theme.colors.inputPlaceholder}
              numberOfLines={3}
              textAlignVertical="top"
            />

            {/* Address Section */}
            <Text
              style={[
                theme.typography.fontH5,
                {
                  color: theme.colors.colorHeadingH2,
                  marginTop: 24,
                  marginBottom: 16,
                },
              ]}
            >
              {sectionConfig.address.title}
            </Text>

            <Text
              style={[
                theme.typography.fontLabel,
                { color: theme.colors.colorTextSecondary, marginBottom: 6 },
              ]}
            >
              Address Line 1 *
            </Text>
            <TextInput
              value={formData.address1}
              onChangeText={(v) => updateField("address1", v)}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter address line 1"
              placeholderTextColor={theme.colors.inputPlaceholder}
            />

            <Text
              style={[
                theme.typography.fontLabel,
                {
                  color: theme.colors.colorTextSecondary,
                  marginTop: 12,
                  marginBottom: 6,
                },
              ]}
            >
              Address Line 2
            </Text>
            <TextInput
              value={formData.address2}
              onChangeText={(v) => updateField("address2", v)}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter address line 2 (optional)"
              placeholderTextColor={theme.colors.inputPlaceholder}
            />

            <Text
              style={[
                theme.typography.fontLabel,
                {
                  color: theme.colors.colorTextSecondary,
                  marginTop: 12,
                  marginBottom: 6,
                },
              ]}
            >
              District *
            </Text>
            <TextInput
              value={formData.district}
              onChangeText={(v) => updateField("district", v)}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter district"
              placeholderTextColor={theme.colors.inputPlaceholder}
            />

            <Text
              style={[
                theme.typography.fontLabel,
                {
                  color: theme.colors.colorTextSecondary,
                  marginTop: 12,
                  marginBottom: 6,
                },
              ]}
            >
              State
            </Text>
            <TextInput
              value={formData.state}
              onChangeText={(v) => updateField("state", v)}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter state"
              placeholderTextColor={theme.colors.inputPlaceholder}
            />

            {/* Contact Information Section */}
            <Text
              style={[
                theme.typography.fontH5,
                {
                  color: theme.colors.colorHeadingH2,
                  marginTop: 24,
                  marginBottom: 16,
                },
              ]}
            >
              {sectionConfig.contact.title}
            </Text>

            <Text
              style={[
                theme.typography.fontLabel,
                { color: theme.colors.colorTextSecondary, marginBottom: 6 },
              ]}
            >
              Primary Contact Number *
            </Text>
            <TextInput
              value={formData.primaryPhone}
              onChangeText={(v) => updateField("primaryPhone", v)}
              keyboardType="phone-pad"
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter phone number"
              placeholderTextColor={theme.colors.inputPlaceholder}
            />

            <Text
              style={[
                theme.typography.fontLabel,
                {
                  color: theme.colors.colorTextSecondary,
                  marginTop: 12,
                  marginBottom: 6,
                },
              ]}
            >
              Email
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(v) => updateField("email", v)}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter email address"
              placeholderTextColor={theme.colors.inputPlaceholder}
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text
              style={[
                theme.typography.fontLabel,
                {
                  color: theme.colors.colorTextSecondary,
                  marginTop: 12,
                  marginBottom: 6,
                },
              ]}
            >
              Website
            </Text>
            <TextInput
              value={formData.website}
              onChangeText={(v) => updateField("website", v)}
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputBorder,
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                },
              ]}
              placeholder="Enter website URL (optional)"
              placeholderTextColor={theme.colors.inputPlaceholder}
              autoCapitalize="none"
            />

            {/* Settings Section */}
            <Text
              style={[
                theme.typography.fontH5,
                {
                  color: theme.colors.colorHeadingH2,
                  marginTop: 24,
                  marginBottom: 16,
                },
              ]}
            >
              {sectionConfig.settings.title}
            </Text>

            <View
              style={[
                styles.switchRow,
                { borderBottomColor: theme.colors.navDivider },
              ]}
            >
              <Text
                style={[
                  theme.typography.fontBody,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                24x7 Available
              </Text>
              <Switch
                value={is24x7}
                onValueChange={setIs24x7}
                trackColor={{
                  false: theme.colors.btnDisabledBg,
                  true: theme.colors.btnPrimaryBg,
                }}
                thumbColor={theme.colors.colorBgSurface}
              />
            </View>

            <View
              style={[
                styles.switchRow,
                { borderBottomColor: theme.colors.navDivider },
              ]}
            >
              <Text
                style={[
                  theme.typography.fontBody,
                  { color: theme.colors.colorTextPrimary },
                ]}
              >
                Emergency Support
              </Text>
              <Switch
                value={isEmergency}
                onValueChange={setIsEmergency}
                trackColor={{
                  false: theme.colors.btnDisabledBg,
                  true: theme.colors.btnSosBg,
                }}
                thumbColor={theme.colors.colorBgSurface}
              />
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        style={[
          styles.footer,
          {
            backgroundColor: theme.colors.navBg,
            // borderTopColor: theme.colors.navDivider,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.btnPrimaryBg },
            isLoading && styles.buttonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text
            style={[
              theme.typography.fontButton,
              { color: theme.colors.btnPrimaryText },
            ]}
          >
            {isLoading ? "Submitting..." : "Submit for Approval"}
          </Text>
        </TouchableOpacity>
      </View>
    </BodyLayout>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  card: {
    borderRadius: 16,
    padding: 20,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  footer: {
    padding: 16,
    // borderTopWidth: 1,
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
