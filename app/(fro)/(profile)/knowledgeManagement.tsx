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

import AddCentreTab from "./AddCentreTab";
import SubmittedCentreTab from "./SubmittedCentreTab";

type CentreType = {
  id: string;
  label: string;
};

const CENTRE_TYPES: CentreType[] = [
  { id: "old_age_homes", label: "Old Age Homes" },
  { id: "caregivers", label: "Caregivers" },
  { id: "day_care_centres", label: "Day Care Centres" },
  { id: "elder_friendly_products", label: "Elder-friendly Products" },

  { id: "list_of_hospitals", label: "List of Hospitals" },
  { id: "psychiatric_clinics", label: "Psychiatric Clinics" },
  { id: "counselling_centres", label: "Counselling Centres" },
  { id: "palliative_care_units", label: "Palliative Care Units" },

  { id: "organ_donation_organizations", label: "Organ Donation Organizations" },
  { id: "diagnostic_centres", label: "Diagnostic Centres" },
  { id: "senior_citizens_directory", label: "Senior Citizens Directory" },
  { id: "health_centres", label: "Health Centres" },

  { id: "blood_banks", label: "Blood Banks" },
  { id: "volunteers", label: "Volunteers" },
  { id: "para_legal_volunteers", label: "Para Legal Volunteers" },
  { id: "ngos_cbos_elder_care", label: "NGOs / CBOs  " },

  { id: "district_officials", label: "District Officials" },
  { id: "other_helplines", label: "Other Helplines" },
  { id: "resident_welfare_associations", label: "Resident Welfare Associations" },
  { id: "police_stations", label: "Police Stations" },
];


export default function AddNewCentreScreen() {
  const { theme } = useTheme();

  const [activeTab, setActiveTab] = useState<"add" | "submitted">("add");
  const [selectedId, setSelectedId] = useState("old_age");
  const [search, setSearch] = useState("");

  const filteredData = CENTRE_TYPES.filter((item) =>
    item.label.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <BodyLayout type="screen" screenName="Knowldge Management"
    scrollContentStyle={{ paddingHorizontal: 16 , }}
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
          onSelect={setSelectedId}
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
