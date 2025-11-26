import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import RemixIcon from "react-native-remix-icon";

export default function ProfileUpdateScreen() {
  const { theme } = useTheme();

  // form state
  const [name, setName] = useState("");
  const [dob, setDob] = useState<Date | null>(null);
  const [age, setAge] = useState<string>("");
  const [gender, setGender] = useState("पुरुष");
  const [altMobile, setAltMobile] = useState("");

  const [aadhaar, setAadhaar] = useState("");
  const [country, setCountry] = useState("भारत");
  const [stateValue, setStateValue] = useState("उत्तर प्रदेश");
  const [district, setDistrict] = useState("गाज़ीपुर");

  const [locality, setLocality] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");
  const [landmark, setLandmark] = useState("");
  const [additional, setAdditional] = useState("");

  // bottom sheet & datepicker UI state
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetType, setSheetType] = useState<
    "country" | "state" | "district" | "gender" | null
  >(null);

  const [showDatePicker, setShowDatePicker] = useState(false);

  // static data
  const COUNTRIES = ["भारत"];
  const STATES = ["उत्तर प्रदेश", "बिहार", "मध्य प्रदेश"];
  const DISTRICTS_BY_STATE: Record<string, string[]> = {
    "उत्तर प्रदेश": ["गाज़ीपुर", "कानपुर", "लखनऊ"],
    बिहार: ["पटना", "मुख्तसर", "मुज़फ़्फरपुर"],
    "मध्य प्रदेश": ["भोपाल", "इंदौर", "ग्वालियर"],
  };
  const GENDERS = ["पुरुष", "महिला", "अन्य"];

  const districtsForSelectedState = useMemo(
    () => DISTRICTS_BY_STATE[stateValue] || [],
    [stateValue]
  );

  // helpers
  function openSheet(type: typeof sheetType) {
    setSheetType(type);
    setSheetVisible(true);
  }
  function closeSheet() {
    setSheetVisible(false);
    setSheetType(null);
  }

  function onSelectFromSheet(item: string) {
    if (sheetType === "country") {
      setCountry(item);
    } else if (sheetType === "state") {
      setStateValue(item);
      // reset district to first in new state
      const dList = DISTRICTS_BY_STATE[item] || [];
      setDistrict(dList[0] ?? "");
    } else if (sheetType === "district") {
      setDistrict(item);
    } else if (sheetType === "gender") {
      setGender(item);
    }
    closeSheet();
  }

  // Date picker handlers
  const openDatePicker = () => {
    setShowDatePicker(true);
  };

  const onChangeDob = (event: any, selectedDate?: Date) => {
    // On Android the event returns when dismissed (selectedDate undefined)
    setShowDatePicker(Platform.OS === "ios"); // keep for ios, hide for android after selection/dismiss
    if (selectedDate) {
      setDob(selectedDate);
      const calculated = calculateAgeFromDOB(selectedDate);
      setAge(String(calculated));
    }
  };

  function calculateAgeFromDOB(dobDate: Date) {
    const today = new Date();
    let years = today.getFullYear() - dobDate.getFullYear();
    const m = today.getMonth() - dobDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dobDate.getDate())) {
      years--;
    }
    return years;
  }

  // sheet list source depending on sheetType
  function sheetData(): string[] {
    switch (sheetType) {
      case "country":
        return COUNTRIES;
      case "state":
        return STATES;
      case "district":
        return districtsForSelectedState;
      case "gender":
        return GENDERS;
      default:
        return [];
    }
  }

  return (
    <BodyLayout>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View style={styles.center}>
          <Text style={[styles.title, { color: theme.colors.primary }]}>
            प्रोफ़ाइल अपडेट करें
          </Text>
          <Text style={[styles.subtitle, { color: theme.colors.primary }]}>
            Update Profile
          </Text>

          <Text style={[styles.infoText, { color: theme.colors.colorTextSecondary }]}>
            आपकी प्रोफ़ाइल हमें सही मदद भेजने में सहायता करेगी।
          </Text>
        </View>

        {/* Basic details */}
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          बुनियादी जानकारी (Basic Details)
        </Text>

        <TextInput
          placeholder="अपना पूरा नाम दर्ज करें"
          style={[styles.input, { borderColor: theme.colors.border }]}
          value={name}
          onChangeText={setName}
        />

        {/* DOB / Age (datepicker) */}
        <TouchableOpacity
          onPress={openDatePicker}
          style={[styles.input, styles.iconInput, { borderColor: theme.colors.border }]}
        >
          <Text style={{ flex: 1, color: dob ? theme.colors.text : "#888" }}>
            {dob ? dob.toLocaleDateString() + ` (${age} yrs)` : "जन्म तिथि चुनें (Date of Birth)"}
          </Text>
          <RemixIcon name="calendar-line" size={22} color={theme.colors.text} />
        </TouchableOpacity>

        {/* show native date picker when requested */}
        {showDatePicker && (
          <DateTimePicker
            value={dob ?? new Date(new Date().getFullYear() - 25, 0, 1)}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={new Date()}
            onChange={onChangeDob}
          />
        )}

        {/* Gender */}
        <TouchableOpacity
          onPress={() => openSheet("gender")}
          style={[styles.dropdown, { borderColor: theme.colors.border }]}
        >
          <Text style={styles.dropdownText}>{gender}</Text>
          <RemixIcon name="arrow-down-s-line" size={20} />
        </TouchableOpacity>

        {/* Alt mobile */}
        <TextInput
          placeholder="वैकल्पिक मोबाइल नंबर (Optional)"
          keyboardType="number-pad"
          style={styles.inputError}
          value={altMobile}
          onChangeText={setAltMobile}
        />

        <Text style={styles.errorText}>
          आपका वैकल्पिक आपातकालीन मोबाइल नंबर जोड़ा नहीं गया है।
        </Text>

        {/* Aadhaar */}
        <View style={styles.adharBox}>
          <TextInput
            placeholder="आधार नंबर (XXXXXXXXXXXX)"
            keyboardType="number-pad"
            maxLength={12}
            style={styles.adharInput}
            value={aadhaar}
            onChangeText={setAadhaar}
          />
          <TouchableOpacity style={styles.adharBtn}>
            <Text style={styles.adharBtnText}>आधार अपडेट करें</Text>
            <RemixIcon name="arrow-right-s-line" size={22} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Location pickers */}
        <Text style={[styles.sectionTitle, { color: theme.colors.primary, marginTop: 12 }]}>
          स्थान चुनें (Select Location)
        </Text>

        <TouchableOpacity
          onPress={() => openSheet("country")}
          style={[styles.dropdown, { borderColor: theme.colors.border }]}
        >
          <Text style={styles.dropdownText}>{country}</Text>
          <RemixIcon name="arrow-down-s-line" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openSheet("state")}
          style={[styles.dropdown, { borderColor: theme.colors.border }]}
        >
          <Text style={styles.dropdownText}>{stateValue}</Text>
          <RemixIcon name="arrow-down-s-line" size={20} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => openSheet("district")}
          style={[styles.dropdown, { borderColor: theme.colors.border }]}
        >
          <Text style={styles.dropdownText}>{district}</Text>
          <RemixIcon name="arrow-down-s-line" size={20} />
        </TouchableOpacity>

        {/* Address */}
        <Text style={[styles.sectionTitle, { color: theme.colors.primary }]}>
          पता विवरण (Address Details)
        </Text>

        <TextInput
          placeholder="स्थानीय क्षेत्र / Locality"
          style={[styles.input, { borderColor: theme.colors.border }]}
          value={locality}
          onChangeText={setLocality}
        />

        <TextInput
          placeholder="पूरा पता / Full Address"
          style={[styles.input, { borderColor: theme.colors.border }]}
          value={address}
          onChangeText={setAddress}
        />

        <TextInput
          placeholder="पिनकोड / Pincode"
          keyboardType="number-pad"
          style={[styles.input, { borderColor: theme.colors.border }]}
          value={pincode}
          onChangeText={setPincode}
        />

        {/* Landmark */}
        <Text style={[styles.sectionTitle, { color: theme.colors.primary, marginTop: 10 }]}>
          संपर्क स्थान (Landmark & Additional Info)
        </Text>

        <TextInput
          placeholder="उदाहरण: बरगद का पेड़ / Near Banyan Tree"
          style={[styles.input, { borderColor: theme.colors.border }]}
          value={landmark}
          onChangeText={setLandmark}
        />

        <TextInput
          placeholder="अपनी लोकेशन के बारे में अतिरिक्त जानकारी…"
          multiline
          style={styles.textArea}
          value={additional}
          onChangeText={setAdditional}
        />

        {/* Submit */}
        <TouchableOpacity style={styles.submitBtn}
        onPress={()=>{
          router.push('/otpVerify')
        }}
        >
          <Text style={styles.submitText}>प्रोफ़ाइल अपडेट करें</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom sheet modal for selecting country/state/district/gender */}
      <Modal
        isVisible={sheetVisible}
        onBackdropPress={closeSheet}
        onBackButtonPress={closeSheet}
        swipeDirection={["down"]}
        onSwipeComplete={closeSheet}
        style={styles.bottomModal}
      >
        <View style={[styles.sheetContainer, { backgroundColor: theme.colors.card }]}>
          <View style={styles.sheetHandle} />
          <Text style={[styles.sheetTitle, { color: theme.colors.text }]}>
            {sheetType === "country" && "देश चुनें"}
            {sheetType === "state" && "राज्य चुनें"}
            {sheetType === "district" && "ज़िला चुनें"}
            {sheetType === "gender" && "लिंग चुनें"}
          </Text>

          <FlatList
            data={sheetData()}
            keyExtractor={(item) => item}
            renderItem={({ item }) => {
              const selected =
                (sheetType === "country" && item === country) ||
                (sheetType === "state" && item === stateValue) ||
                (sheetType === "district" && item === district) ||
                (sheetType === "gender" && item === gender);
              return (
                <TouchableOpacity
                  style={[styles.sheetItem, selected && { backgroundColor: theme.colors.colorBgPage }]}
                  onPress={() => onSelectFromSheet(item)}
                >
                  <Text style={[styles.sheetItemText, { color: theme.colors.text }]}>{item}</Text>
                  {selected && <RemixIcon name="checkbox-circle-fill" size={18} color={theme.colors.primary} />}
                </TouchableOpacity>
              );
            }}
            ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: "#eee" }} />}
            style={{ marginTop: 8 }}
          />
        </View>
      </Modal>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  center: {
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "500",
  },
  infoText: {
    marginTop: 4,
    fontSize: 13,
    textAlign: "center",
  },
  sectionTitle: {
    marginTop: 16,
    marginBottom: 6,
    fontSize: 16,
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    fontSize: 15,
  },
  iconInput: {
    flexDirection: "row",
    alignItems: "center",
  },
  inputError: {
    borderWidth: 1.5,
    borderColor: "#D9534F",
    backgroundColor: "#FFECEC",
    padding: 14,
    borderRadius: 10,
    marginBottom: 4,
    fontSize: 15,
  },
  errorText: {
    color: "#D32F2F",
    marginBottom: 12,
    fontSize: 13,
  },
  adharBox: {
    backgroundColor: "#FFF3D6",
    padding: 14,
    borderRadius: 12,
    marginTop: 10,
    marginBottom: 12,
  },
  adharInput: {
    borderWidth: 0,
    marginBottom: 12,
    fontSize: 15,
  },
  adharBtn: {
    backgroundColor: "#F57C00",
    padding: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  adharBtnText: {
    color: "#fff",
    fontSize: 16,
    marginRight: 6,
    fontWeight: "500",
  },
  dropdown: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownText: {
    fontSize: 15,
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 110,
    padding: 14,
    fontSize: 14,
    textAlignVertical: "top",
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: "#00695C",
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
    marginHorizontal: 16,
  },
  submitText: {
    textAlign: "center",
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },

  /* bottom sheet */
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  sheetContainer: {
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 30,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    minHeight: 240,
  },
  sheetHandle: {
    width: 48,
    height: 4,
    backgroundColor: "#CCC",
    borderRadius: 4,
    alignSelf: "center",
    marginBottom: 8,
  },
  sheetTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  sheetItem: {
    paddingVertical: 14,
    paddingHorizontal: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sheetItemText: {
    fontSize: 15,
  },
});
