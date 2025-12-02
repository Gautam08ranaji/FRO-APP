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
import { Dropdown } from "react-native-element-dropdown";

export default function LocationDetailsScreen() {
  const { theme } = useTheme();

  const stateList = [
    { label: "उत्तर प्रदेश", value: "UP" },
    { label: "बिहार", value: "BR" },
    { label: "राजस्थान", value: "RJ" },
  ];

  const districtList = [
    { label: "लखनऊ", value: "lucknow" },
    { label: "कानपुर", value: "kanpur" },
    { label: "वाराणसी", value: "varanasi" },
  ];

  const [state, setState] = useState("UP");
  const [district, setDistrict] = useState("lucknow");
  const [block, setBlock] = useState("");
  const [name, setName] = useState("राजेश कुमार");

  return (
    <BodyLayout type={"screen"} screenName="कार्यक्षेत्र">
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          राज्य
        </Text>
        <Dropdown
          style={[styles.dropdown,{borderColor:theme.colors.inputBorder}]}
          selectedTextStyle={[styles.dropdownText,{color:theme.colors.colorTextSecondary}]}
          placeholderStyle={[styles.dropdownText,{color:theme.colors.colorTextSecondary}]}
          data={stateList}
          labelField="label"
          valueField="value"
          value={state}
          onChange={(item) => setState(item.value)}
        />

        {/* ---------- District Dropdown ---------- */}
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          जिला
        </Text>
        <Dropdown
          style={[styles.dropdown,{borderColor:theme.colors.inputBorder}]}
          selectedTextStyle={[styles.dropdownText,{color:theme.colors.colorTextSecondary}]}
          placeholderStyle={[styles.dropdownText,{color:theme.colors.colorTextSecondary}]}
          data={districtList}
          labelField="label"
          valueField="value"
          value={district}
          onChange={(item) => setDistrict(item.value)}
        />

        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          ब्लॉक / थाना
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.colors.inputBorder,
              color: theme.colors.colorTextSecondary,
            },
          ]}
          placeholder="ब्लॉक / थाना दर्ज करें"
          value={block}
          onChangeText={setBlock}
          placeholderTextColor={theme.colors.colorTextSecondary}
        />
        <Text
          style={[styles.label, { color: theme.colors.colorTextSecondary }]}
        >
          टीम लीडर का नाम
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor: theme.colors.inputBorder,
              color: theme.colors.colorTextSecondary,
            },
          ]}
          placeholder="ब्लॉक / थाना दर्ज करें"
          value={name}
          onChangeText={setBlock}
          placeholderTextColor={theme.colors.colorTextSecondary}
        />

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: theme.colors.colorPrimary600 },
          ]}
        >
          <Text style={[styles.saveText, { color: theme.colors.colorBgPage }]}>
            सेव करें
          </Text>
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

    borderRadius: 12,
    elevation: 3,
  },

  label: {
    fontSize: 14,
    marginBottom: 5,
    marginTop: 15,
  },

  dropdown: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    height: 50,
    justifyContent: "center",
  },

  dropdownText: {
    fontSize: 14,
  },

  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 14,
  },

  saveBtn: {
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 25,
    alignItems: "center",
  },

  saveText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
