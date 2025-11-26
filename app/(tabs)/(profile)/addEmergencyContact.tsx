import BodyLayout from "@/components/layout/BodyLayout";
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

export default function AddEmergencyContactScreen() {
  const { theme } = useTheme();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relation, setRelation] = useState("");
  const [dropdownVisible, setDropdownVisible] = useState(false);

  const relationOptions = ["पिता", "माता", "बेटा", "बेटी", "पति", "पत्नी", "भाई", "बहन", "अन्य"];

  return (
    <BodyLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- TITLE ---------- */}
        <View style={{ marginBottom: 12 }}>
          <Text style={[styles.title, { color: theme.colors.colorPrimary800 }]}>
            नया आपातकालीन संपर्क जोड़ें
          </Text>

          <Text
            style={[
              styles.englishTitle,
              { color: theme.colors.colorPrimary800 },
            ]}
          >
            Add New Emergency Contact
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            आपकी आपात स्थिति में टीम सबसे पहले इन संपर्कों को कॉल करेगी।
          </Text>
        </View>

        {/* ---------- SECTION LABEL ---------- */}
        <Text style={[styles.sectionTitle, { color: theme.colors.colorPrimary800 }]}>
          बुनियादी जानकारी (Basic Details)
        </Text>

        {/* ---------- INPUT: Name ---------- */}
        <View style={[styles.inputWrapper, { borderColor: theme.colors.colorPrimary500 }]}>
          <TextInput
            style={styles.input}
            placeholder="नाम"
            placeholderTextColor="#888"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* ---------- INPUT: Phone ---------- */}
        <View style={[styles.inputWrapper, { borderColor: theme.colors.colorPrimary200 }]}>
          <TextInput
            style={styles.input}
            placeholder="आपातकालीन नंबर"
            placeholderTextColor="#888"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* ---------- DROPDOWN: Relation ---------- */}
        <View style={[styles.inputWrapper, { borderColor: theme.colors.colorPrimary200 }]}>
          <TouchableOpacity
            style={styles.dropdownButton}
            onPress={() => setDropdownVisible(!dropdownVisible)}
          >
            <Text style={styles.dropdownText}>
              {relation ? relation : "रिश्ता"}
            </Text>

            <RemixIcon
              name={dropdownVisible ? "arrow-up-s-line" : "arrow-down-s-line"}
              size={22}
              color="#444"
            />
          </TouchableOpacity>
        </View>

        {/* ---------- DROPDOWN LIST ---------- */}
        {dropdownVisible && (
          <View style={styles.dropdownList}>
            {relationOptions.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={styles.dropdownItem}
                onPress={() => {
                  setRelation(opt);
                  setDropdownVisible(false);
                }}
              >
                <Text style={styles.dropdownItemText}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ---------- SUBMIT BUTTON ---------- */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            { backgroundColor: theme.colors.colorPrimary700 },
          ]}
        >
          <Text style={styles.saveButtonText}>संपर्क सेव करें</Text>
        </TouchableOpacity>
      </ScrollView>
    </BodyLayout>
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

  saveButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 15,
    marginBottom: 40,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#fff",
  },
});
