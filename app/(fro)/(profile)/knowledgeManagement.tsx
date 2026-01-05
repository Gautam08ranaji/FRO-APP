import BodyLayout from "@/components/layout/BodyLayout";
import { getFormPayload } from "@/services/payload"; // Import the payload utility
import { useTheme } from "@/theme/ThemeContext";
import { useRouter } from "expo-router"; // or your navigation method
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import AddCentreTab from "./AddCentreTab";
import SubmittedCentreTab from "./SubmittedCentreTab";

type CentreType = {
  id: string;
  label: string;
};

const CENTRE_TYPES: CentreType[] = [
  { id: "old_age_homes", label: "Old Age Homes" },
  { id: "ngos", label: "NGOs" },
];

export default function AddNewCentreScreen() {
  const { theme } = useTheme();
  const router = useRouter(); // or useNavigation() depending on your setup

  const [activeTab, setActiveTab] = useState<"add" | "submitted">("add");
  const [selectedId, setSelectedId] = useState("old_age_homes");
  const [search, setSearch] = useState("");

  const filteredData = CENTRE_TYPES.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleCentreSelect = (id: string) => {
    setSelectedId(id);
    
    const payload = getFormPayload(id);
    
    navigateToFormScreen(id, payload);
  };

  const navigateToFormScreen = (centreType: string, payload: any) => {
    const payloadString = JSON.stringify(payload);

    router.push({
      pathname: "/universalFormScreen", 
      params: {
        centreType: centreType,
        payload: payloadString,
        title: CENTRE_TYPES.find(item => item.id === centreType)?.label || "Add Centre"
      }
    });
  };

  return (
    <BodyLayout 
      type="screen" 
      screenName="Knowledge Management"
      scrollContentStyle={{ paddingHorizontal: 16 }}
    >
      {/* Tabs */}
      <View style={styles.tabRow}>
        {/* ADD TAB */}
        <TouchableOpacity
          onPress={() => setActiveTab("add")}
          style={[
            styles.tab,
            {
              borderColor: theme.colors.primary,
              backgroundColor:
                activeTab === "add"
                  ? theme.colors.colorPrimary50
                  : theme.colors.colorBgPage,
            },
          ]}
        >
          <Text style={[styles.tabText, { color: theme.colors.primary }]}>
            Add New Centre
          </Text>
        </TouchableOpacity>

        {/* SUBMITTED TAB */}
        <TouchableOpacity
          onPress={() => setActiveTab("submitted")}
          style={[
            styles.tab,
            {
              borderColor: theme.colors.primary,
              backgroundColor:
                activeTab === "submitted"
                  ? theme.colors.colorPrimary50
                  : theme.colors.colorBgPage,
            },
          ]}
        >
          <Text style={[styles.tabText, { color: theme.colors.primary }]}>
            Submitted Centre
          </Text>
        </TouchableOpacity>
      </View>

      {/* Search – COMMON */}
      <View style={styles.searchBox}>
        <RemixIcon name="search-line" size={20} color="#999" />
        <TextInput
          placeholder="Search Centre Type"
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
      </View>

      {/* Tabs Content */}
      {activeTab === "add" && (
        <AddCentreTab
          data={filteredData}
          selectedId={selectedId}
          onSelect={handleCentreSelect} // Updated to use the new handler
        />
      )}

      {activeTab === "submitted" && <SubmittedCentreTab search={search} />}
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  tabRow: {
    flexDirection: "row",
    marginBottom: 16,
    gap: 12,
  },
  tab: {
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderColor: "#ccc",
  },
  tabText: {
    fontWeight: "600",
    color: "#666",
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    marginBottom: 16,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
  },
});