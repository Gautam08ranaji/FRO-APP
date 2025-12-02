import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OfficerDetailsScreen() {
  const { theme } = useTheme();

  return (
    <BodyLayout type={"screen"} screenName="अधिकारी विवरण">
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
          नाम
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBg ,color:theme.colors.colorTextSecondary,borderColor:theme.colors.colorBgPage}]}
          value="राजेश कुमार"
        />

        <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
          कर्मचारी कोड
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBg,color:theme.colors.colorTextSecondary,borderColor:theme.colors.colorBgPage }]}
          value="FRO-14567-001"
        />

        <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
          मोबाइल नंबर
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBg ,color:theme.colors.colorTextSecondary,borderColor:theme.colors.colorBgPage}]}
          value="+91-9876543210"
        />

        <Text style={[styles.label, { color: theme.colors.colorTextPrimary }]}>
          ईमेल
        </Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.colors.inputBg ,color:theme.colors.colorTextSecondary,borderColor:theme.colors.colorBgPage}]}
          value="rajesh.kumar@example.com"
        />

        <TouchableOpacity
          style={[
            styles.saveBtn,
            { backgroundColor: theme.colors.colorPrimary600 },
          ]}
          onPress={() => {
            // router.push[('/location'),{backgroundColor:theme.colors.inputBg}]
          }}
        >
          <Text style={[styles.saveText,{color:theme.colors.colorBgPage}]}>सेव करें</Text>
        </TouchableOpacity>
      </View>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F3F3",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    height: 60,
    paddingHorizontal: 15,
    elevation: 3,
  },

  backBtn: {
    paddingRight: 10,
  },

  headerTitle: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "600",
  },

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
