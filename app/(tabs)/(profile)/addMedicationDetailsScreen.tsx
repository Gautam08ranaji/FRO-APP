import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function AddMedicationDetailsScreen() {
  const { theme } = useTheme();

  const [problem, setProblem] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const problemOptions = [
    "हृदय रोग",
    "डायबिटीज़",
    "ब्लड प्रेशर",
    "अस्थमा",
    "थायराइड",
    "अन्य",
  ];

  const [medicines, setMedicines] = useState("");
  const [allergy, setAllergy] = useState("");
  const [doctorInfo, setDoctorInfo] = useState("");

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#fff" }}
      contentContainerStyle={{ padding: 16 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ---------- TITLE ---------- */}
      <Text style={[styles.title, { color: theme.colors.colorPrimary800 }]}>
        दवा की जानकारी जोड़ें
      </Text>

      <Text style={[styles.englishTitle, { color: theme.colors.colorPrimary800 }]}>
        Add Medication Details
      </Text>

      <Text style={[styles.subtitle, { color: theme.colors.colorTextSecondary }]}>
        आपकी चिकित्सा स्थिति जानने से आपातकालीन सहायता टीम सही कदम उठा पाएगी।
      </Text>

      {/* ---------- SECTION TITLE ---------- */}
      <Text style={[styles.sectionTitle, { color: theme.colors.colorPrimary800 }]}>
        बुनियादी जानकारी (Basic Details)
      </Text>

      {/* ---------- DROPDOWN: Health Problems ---------- */}
      <View style={[styles.inputWrapper, { borderColor: theme.colors.colorPrimary200 }]}>
        <TouchableOpacity
          style={styles.dropdownButton}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          <Text style={styles.dropdownText}>
            {problem ? problem : "स्वास्थ्य समस्याएँ"}
          </Text>

          <RemixIcon
            name={dropdownVisible ? "arrow-up-s-line" : "arrow-down-s-line"}
            size={22}
            color="#444"
          />
        </TouchableOpacity>
      </View>

      {dropdownVisible && (
        <View style={styles.dropdownList}>
          {problemOptions.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={styles.dropdownItem}
              onPress={() => {
                setProblem(opt);
                setDropdownVisible(false);
              }}
            >
              <Text style={styles.dropdownItemText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* ---------- MEDICINES INPUT ---------- */}
      <View style={[styles.inputWrapper, { borderColor: theme.colors.colorPrimary300 }]}>
        <TextInput
          style={styles.input}
          placeholder="दवाइयाँ: संक्षेप में लिखें"
          placeholderTextColor="#888"
          value={medicines}
          onChangeText={setMedicines}
        />
      </View>

      {/* ---------- ALLERGY INPUT ---------- */}
      <View style={[styles.inputWrapper, { borderColor: theme.colors.colorPrimary300 }]}>
        <TextInput
          style={styles.input}
          placeholder="एलर्जी: संक्षेप में लिखें"
          placeholderTextColor="#888"
          value={allergy}
          onChangeText={setAllergy}
        />
      </View>

      {/* ---------- Doctor Info ---------- */}
      <View style={styles.textareaWrapper}>
        <TextInput
          style={styles.textarea}
          multiline
          placeholder="डॉक्टर का नाम, डॉक्टर का फोन नंबर, अन्य जानकारी जो आप हमारे साथ साझा करना चाहते हैं (वैकल्पिक)"
          placeholderTextColor="#777"
          value={doctorInfo}
          onChangeText={setDoctorInfo}
        />
      </View>

      {/* ---------- SAVE BUTTON ---------- */}
      <TouchableOpacity
        style={[styles.saveButton, { backgroundColor: theme.colors.colorPrimary700 }]}
      >
        <Text style={styles.saveButtonText}>सेव करें</Text>
      </TouchableOpacity>

    </ScrollView>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  englishTitle: {
    fontSize: 18,
    textAlign: "center",
    fontWeight: "600",
    marginTop: 2,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },

  inputWrapper: {
    borderWidth: 1.2,
    borderRadius: 10,
    marginBottom: 14,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
    height: 52,
    justifyContent: "center",
  },

  input: {
    fontSize: 16,
    color: "#000",
  },

  dropdownButton: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: 48,
  },
  dropdownText: {
    fontSize: 16,
    color: "#000",
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 15,
    overflow: "hidden",
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownItemText: {
    fontSize: 16,
  },

  textareaWrapper: {
    borderWidth: 1.2,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: "#fafafa",
    minHeight: 120,
    marginBottom: 18,
    paddingTop: 10,
  },
  textarea: {
    fontSize: 15,
    textAlignVertical: "top",
    color: "#000",
  },

  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 35,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
