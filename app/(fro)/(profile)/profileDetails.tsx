import BodyLayout from "@/components/layout/BodyLayout";
import { getUserDataById } from "@/features/fro/profile/getProfile";
import { updateUser } from "@/features/fro/profile/updateUser";
import { useAppSelector } from "@/store/hooks";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { launchImageLibrary } from "react-native-image-picker";
import RemixIcon from "react-native-remix-icon";

/* ================= TYPES ================= */

type OfficerForm = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  gender: string;
  state: string;
  city: string;
  pincode: string;
  address: string; // ✅ ADD
  photo: string | null;
};

export type UpdateUserPayload = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  gender: string;
  stateName: string;
  cityName: string;
  pinCode: string;

  isImageUpdate: boolean;
  imgSrc: string;

  address: string;
  isActive: boolean;
  userLevel: number;
  userLevelName: string;
  department: string;
  maxAssignInteraction: number;
  stateId: number;
  cityId: number;
  userType: string;
  userRoles: any[];
};

type TextInputKey = Exclude<keyof OfficerForm, "photo">;

type DropdownKey = "gender" | "state" | "city";

type UserApiResponse = {
  id: string | null;

  firstName: string | null;
  lastName: string | null;
  phoneNumber: string | null;
  email: string | null;

  gender: string | null;
  stateName: string | null;
  cityName: string | null;
  pinCode: string | null;

  profilePhoto: string | null;

  // ✅ missing fields
  address: string | null;
  isActive: boolean | null;
  userLevel: number | null;
  userLevelName: string | null;
  department: string | null;
  maxAssignInteraction: number | null;
  stateId: number | null;
  cityId: number | null;
  userType: string | null;
  userRoles: any[];
};

/* ================= COMPONENT ================= */

export default function OfficerDetailsScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const authState = useAppSelector((state) => state.auth);

  /* ================= REFS ================= */

  const scrollRef = useRef<ScrollView>(null);

  // Initialize with all required keys
  const inputRefs = useRef<Record<TextInputKey, View | null>>({
    firstName: null,
    lastName: null,
    phone: null,
    email: null,
    gender: null,
    state: null,
    city: null,
    pincode: null,
    address: null,
  });

  /* ================= STATE ================= */
  const [userProfile, setUserProfile] = useState<UserApiResponse | null>(null);

  const [form, setForm] = useState<OfficerForm>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gender: "",
    state: "",
    city: "",
    pincode: "",
    photo: null,
    address: "",
  });

  const [errors, setErrors] = useState<Partial<Record<TextInputKey, string>>>(
    {},
  );

  const [dropdownKey, setDropdownKey] = useState<DropdownKey | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);

  /* ================= FETCH USER ================= */

  const fetchUserData = async () => {
    try {
      const response = await getUserDataById({
        userId: String(authState.userId),
        token: String(authState.token),
        csrfToken: String(authState.antiforgeryToken),
      });

      console.log("fetch profile", response);

      const data: UserApiResponse = response?.data;
      setUserProfile(data);
      setForm({
        firstName: data?.firstName ?? "",
        lastName: data?.lastName ?? "",
        phone: data?.phoneNumber ?? "",
        email: data?.email ?? "",
        gender: data?.gender ?? "",
        state: data?.stateName ?? "",
        city: data?.cityName ?? "",
        pincode: data?.pinCode ?? "",
        photo: data?.profilePhoto ?? null,
        address: data?.address ?? "",
      });
    } catch (error) {
      console.error("Failed to fetch user data", error);
    }
  };

  useEffect(() => {
    if (authState?.userId && authState?.token) {
      fetchUserData();
    }
  }, [authState]);

  /* ================= IMAGE PICKER ================= */

  const openImagePicker = () => {
    launchImageLibrary({ mediaType: "photo" }, (res) => {
      if (res.assets?.length) {
        setForm((prev) => ({
          ...prev,
          photo: res.assets![0].uri ?? null,
        }));
      }
    });
  };

  /* ================= KEYBOARD AUTO SCROLL ================= */

  const scrollToField = (key: TextInputKey) => {
    const fieldRef = inputRefs.current[key];
    if (!fieldRef || !scrollRef.current) return;

    fieldRef.measureInWindow((x, y) => {
      scrollRef.current?.scrollTo({
        y: Math.max(0, y - 20),
        animated: true,
      });
    });
  };

  /* ================= VALIDATION ================= */

  const validate = () => {
    const newErrors: Partial<Record<TextInputKey, string>> = {};

    if (!form.firstName.trim()) newErrors.firstName = "First name is required";

    if (!form.lastName.trim()) newErrors.lastName = "Last name is required";

    if (!/^\d{10}$/.test(form.phone))
      newErrors.phone = "Phone must be 10 digits";

    if (!/^\d{6}$/.test(form.pincode))
      newErrors.pincode = "Pincode must be 6 digits";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";

    if (!form.state) newErrors.state = "State required";
    if (!form.city) newErrors.city = "City required";

    setErrors(newErrors);

    const firstErrorKey = Object.keys(newErrors)[0] as TextInputKey | undefined;

    if (firstErrorKey) {
      scrollToField(firstErrorKey);
      return false;
    }

    return true;
  };

  /* ================= SUBMIT ================= */

  const onSave = () => {
    if (!validate()) return;
    handleUpdateUser();
    console.log("UPDATE PAYLOAD:", form);
  };

  /* ================= DROPDOWN ================= */

  const openDropdown = (key: DropdownKey) => {
    setDropdownKey(key);
    setDropdownVisible(true);
  };

  const getDropdownData = () => {
    switch (dropdownKey) {
      case "gender":
        return ["Male", "Female", "Other"];
      case "state":
        return ["Delhi", "Maharashtra", "Karnataka"];
      case "city":
        return ["Mumbai", "Delhi", "Bengaluru"];
      default:
        return [];
    }
  };

  const buildUpdatePayload = (): UpdateUserPayload => {
    if (!userProfile) {
      throw new Error("User profile not loaded");
    }

    return {
      id: String(authState.userId),

      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      phoneNumber: form.phone,
      gender: form.gender,
      stateName: form.state,
      cityName: form.city,
      pinCode: form.pincode,

      isImageUpdate: Boolean(form.photo),
      imgSrc: form.photo ?? "",

      address: form.address ?? "",
      isActive: userProfile.isActive ?? true,
      userLevel: userProfile.userLevel ?? 0,
      userLevelName: userProfile.userLevelName ?? "",
      department: userProfile.department ?? "",
      maxAssignInteraction: userProfile.maxAssignInteraction ?? 0,
      stateId: userProfile.stateId ?? 0,
      cityId: userProfile.cityId ?? 0,
      userType: userProfile.userType ?? "",
      userRoles: userProfile.userRoles ?? [],
    };
  };

  const handleUpdateUser = async () => {
    if (!validate()) return;
    if (!userProfile) return; // ✅ guard here

    try {
      const response = await updateUser({
        token: authState.token!,
        csrfToken: String(authState.antiforgeryToken),
        data: buildUpdatePayload(), // ✅ always valid
      });

      if (response?.success) {
        fetchUserData();
      }
    } catch (error: any) {
      console.error("Update failed:", error?.response?.data ?? error.message);
    }
  };

  /* ================= UI ================= */

  return (
    <BodyLayout
      type="screen"
      screenName={t("officerDetails.screenTitle")}
      enableScroll={false}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 210}
        style={{ flex: 1 }}
      >
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 0 }}
        >
          <View
            style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
          >
            {/* PROFILE */}
            <View style={styles.profileWrapper}>
              <View
                style={[
                  styles.profileCircle,
                  {
                    backgroundColor: theme.colors.colorPrimary600 + "22",
                  },
                ]}
              >
                {form.photo ? (
                  <Image
                    source={{ uri: form.photo }}
                    style={styles.profileImage}
                  />
                ) : (
                  <RemixIcon
                    name="user-3-line"
                    size={42}
                    color={theme.colors.colorPrimary600}
                  />
                )}
              </View>

              <TouchableOpacity
                style={[
                  styles.editIcon,
                  { backgroundColor: theme.colors.colorPrimary600 },
                ]}
                onPress={openImagePicker}
              >
                <RemixIcon name="camera-line" size={16} color="#fff" />
              </TouchableOpacity>
            </View>

            {renderInput("First Name", "firstName", "Enter first name")}
            {renderInput("Last Name", "lastName", "Enter last name")}
            {renderInput("Phone", "phone", "Enter phone", true)}
            {renderInput("Email", "email", "Enter email")}
            {renderDropdown("Gender", "gender", "Select gender")}
            {renderDropdown("State", "state", "Select state")}
            {renderDropdown("City", "city", "Select city")}
            {renderInput("Pincode", "pincode", "Enter pincode", true)}
            {renderInput("Address", "address", "Enter ")}

            <TouchableOpacity
              style={[
                styles.saveBtn,
                { backgroundColor: theme.colors.colorPrimary600 },
              ]}
              onPress={onSave}
            >
              <Text style={styles.saveText}>{t("officerDetails.save")}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* DROPDOWN MODAL */}
      <Modal transparent visible={dropdownVisible} animationType="slide">
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setDropdownVisible(false)}
        >
          <View style={styles.modalContent}>
            {getDropdownData().map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.modalItem}
                onPress={() => {
                  if (!dropdownKey) return;
                  setForm((prev) => ({
                    ...prev,
                    [dropdownKey]: item,
                  }));
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.modalText}>{item}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </BodyLayout>
  );

  /* ================= HELPERS ================= */

  function renderInput(
    label: string,
    key: TextInputKey,
    placeholder: string,
    numeric = false,
  ) {
    return (
      <View
        ref={(ref) => {
          inputRefs.current[key] = ref;
        }}
        collapsable={false}
      >
        <Text style={styles.label}>{label}</Text>
        <TextInput
          style={styles.input}
          value={form[key]}
          placeholder={placeholder}
          keyboardType={numeric ? "numeric" : "default"}
          onFocus={() => scrollToField(key)}
          onChangeText={(v) => setForm((prev) => ({ ...prev, [key]: v }))}
        />
        {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
      </View>
    );
  }

  function renderDropdown(
    label: string,
    key: DropdownKey,
    placeholder: string,
  ) {
    return (
      <>
        <Text style={styles.label}>{label}</Text>
        <TouchableOpacity
          style={styles.input}
          onPress={() => openDropdown(key)}
        >
          <Text style={{ color: form[key] ? "#000" : "#999" }}>
            {form[key] || placeholder}
          </Text>
        </TouchableOpacity>
        {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
      </>
    );
  }
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  card: {
    marginTop: 0,
    // padding: 20,
    // borderRadius: 12,
  },
  profileWrapper: {
    alignSelf: "center",
    marginBottom: 20,
  },
  profileCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    marginTop: 15,
    marginBottom: 5,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f5f5f5",
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
  },
  saveBtn: {
    marginTop: 30,
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  saveText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  modalItem: {
    paddingVertical: 15,
  },
  modalText: {
    fontSize: 16,
  },
});
