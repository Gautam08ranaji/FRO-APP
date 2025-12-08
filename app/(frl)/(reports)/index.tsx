import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import { StyleSheet, Text, TextInput, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

import AllQueriesTab from "@/app/(frl)/(reports)/AllQueriesTab";
import KnowledgeBaseTab from "@/app/(frl)/(reports)/KnowledgeBaseTab";

const queryTabs = ["All Queries", "Knowledge Base"];

export default function CommunityScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("All Queries");

  return (
    <BodyLayout type="screen" screenName="Community & Knowledge">
      {/* ✅ SEARCH BAR */}
      <View
        style={[
          styles.searchBox,
          { borderColor: theme.colors.inputPlaceholder },
        ]}
      >
        <RemixIcon
          name="search-line"
          size={18}
          color={theme.colors.colorTextSecondary}
        />
        <TextInput
          placeholder="Search queries"
          style={{ flex: 1, color: theme.colors.colorTextSecondary }}
          placeholderTextColor={theme.colors.inputPlaceholder}
        />
      </View>

      {/* ✅ TAB BUTTONS */}
      <View style={styles.tabsRow}>
        {queryTabs.map((tab) => (
          <Text
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab
                    ? theme.colors.btnPrimaryBg
                    : theme.colors.colorBgSurface,
                    borderColor: 
                     theme.colors.btnPrimaryBg,
                color:
                  activeTab === tab
                    ? theme.colors.btnPrimaryText
                    : theme.colors.btnPrimaryBg,
              },
            ]}
          >
            {tab}
          </Text>
        ))}
      </View>

      {/* ✅ TAB SCREENS */}
      {activeTab === "All Queries" ? (
        <AllQueriesTab />
      ) : (
        <KnowledgeBaseTab />
      )}
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  searchBox: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  tabsRow: {
    flexDirection: "row",
    gap: 12,
    marginTop: 12,
  },

  tab: {
    flex: 1,
    textAlign: "center",
    paddingVertical: 10,
    fontWeight: "700",
    borderRadius: 12,
    borderWidth:1
  },
});
