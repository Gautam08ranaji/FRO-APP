import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import type { IconName } from "react-native-remix-icon";
import RemixIcon from "react-native-remix-icon";
import AttendanceTab from "./attendanceTab";
import DailyTab from "./dailyTab";
import MonthlyTab from "./monthly";
import WeeklyTab from "./weeklyTab";

const TABS: { key: string; icon: IconName }[] = [
  { key: "उपस्थिति", icon: "alarm-line" },
  { key: "दैनिक", icon: "calendar-line" },
  { key: "साप्ताहिक", icon: "bar-chart-2-line" },
  { key: "मासिक", icon: "calendar-2-line" },
];
export default function AvailabilityScreen() {
  const [activeTab, setActiveTab] = useState("उपस्थिति");
  const { theme } = useTheme();
  const scrollRef = useRef<ScrollView>(null);

  const handleTabPress = (tab: string, index: number) => {
    setActiveTab(tab);

    // Auto-scroll to keep active tab in view
    scrollRef.current?.scrollTo({
      x: index * 120, // adjust width according to your UI
      animated: true,
    });
  };

  return (
    <BodyLayout type="screen" screenName="रिपोर्टिंग">
      {/* ---------- TOP TABS ---------- */}
      <View style={{ marginBottom: 20 }}>
        <ScrollView
          horizontal
          ref={scrollRef}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsScrollContainer}
        >
          {TABS.map((item, index) => {
            const isActive = activeTab === item.key;

            return (
              <TouchableOpacity
                key={item.key}
                style={[
                  styles.tab,
                  {
                    backgroundColor: isActive
                      ? theme.colors.colorPrimary600
                      : theme.colors.colorBgSurface,
                    elevation: 2,
                  },
                ]}
                onPress={() => handleTabPress(item.key, index)}
              >
                <RemixIcon
                  name={item.icon}
                  size={18}
                  color={
                    isActive
                      ? theme.colors.colorBgPage
                      : theme.colors.colorTextSecondary
                  }
                />
                <Text
                  style={
                    isActive
                      ? [
                          styles.activeTabText,
                          { color: theme.colors.colorBgPage },
                        ]
                      : [
                          styles.tabText,
                          { color: theme.colors.colorTextSecondary },
                        ]
                  }
                >
                  {item.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ---------- RENDER TAB SCREENS ---------- */}
      {activeTab === "उपस्थिति" && <AttendanceTab />}
      {activeTab === "दैनिक" && <DailyTab />}
      {activeTab === "साप्ताहिक" && <WeeklyTab />}
      {activeTab === "मासिक" && <MonthlyTab />}
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  tabsScrollContainer: {
    flexDirection: "row",
    gap: 10,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  activeTabText: {
    fontSize: 14,
    fontWeight: "600",
  },
  tabText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
