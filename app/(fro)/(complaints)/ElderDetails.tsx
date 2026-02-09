import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const { width, height } = Dimensions.get("window");

/* RESPONSIVE SCALE */
const scale = (size: number) => (width / 375) * size;
const verticalScale = (size: number) => (height / 812) * size;
const moderateScale = (size: number, factor = 0.5) =>
  size + (scale(size) - size) * factor;

export default function CustomerDetailScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);

  /* MOCK DATA (Replace API later) */

  const customer = {
    name: "Rahul Sharma",
    age: 72,
    gender: "Male",
    phone: "9876543210",
    emergency: "9123456780",
    address: "Delhi, India",
    id: "CUST-1023",
  };

  const family = {
    spouse: "Riya Sharma",
    children: "2",
    caretaker: "Amit Sharma",
  };

  const medical = {
    bloodGroup: "B+",
    conditions: "Diabetes",
    allergies: "None",
    doctor: "Dr. Mehta",
  };

  const activity = [
    { date: "12 Feb", title: "Home Visit Completed" },
    { date: "15 Feb", title: "Medication Delivered" },
    { date: "20 Feb", title: "Follow-up Call Done" },
  ];

  const tabs = [
    "Family Details",
    "Medical Details",
    "Activity History",
    "Documents",
  ];

  /* TAB CONTENT */

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return (
          <View>
            <Text style={styles.key}>Spouse</Text>
            <Text style={styles.value}>{family.spouse}</Text>

            <Text style={styles.key}>Children</Text>
            <Text style={styles.value}>{family.children}</Text>

            <Text style={styles.key}>Caretaker</Text>
            <Text style={styles.value}>{family.caretaker}</Text>
          </View>
        );

      case 1:
        return (
          <View>
            <Text style={styles.key}>Blood Group</Text>
            <Text style={styles.value}>{medical.bloodGroup}</Text>

            <Text style={styles.key}>Conditions</Text>
            <Text style={styles.value}>{medical.conditions}</Text>

            <Text style={styles.key}>Allergies</Text>
            <Text style={styles.value}>{medical.allergies}</Text>

            <Text style={styles.key}>Doctor</Text>
            <Text style={styles.value}>{medical.doctor}</Text>
          </View>
        );

      case 2:
        return (
          <View>
            {activity.map((item, i) => (
              <View key={i} style={styles.timelineRow}>
                <View
                  style={[
                    styles.timelineDot,
                    { backgroundColor: theme.colors.colorPrimary600 },
                  ]}
                />
                <View>
                  <Text style={styles.timelineDate}>{item.date}</Text>
                  <Text style={styles.timelineText}>{item.title}</Text>
                </View>
              </View>
            ))}
          </View>
        );

      case 3:
        return (
          <View style={styles.emptyBox}>
            <RemixIcon name="file-line" size={28} color="#888" />
            <Text style={styles.emptyText}>No documents yet</Text>
          </View>
        );
    }
  };

  return (
    <BodyLayout type="screen" screenName="Customer Details">
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PROFILE CARD */}

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.colorPrimary50,
              borderColor: theme.colors.colorPrimary200,
            },
          ]}
        >
          <View style={styles.profileRow}>
            <View style={styles.avatar}>
              <RemixIcon
                name="user-3-fill"
                size={32}
                color={theme.colors.colorPrimary600}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[styles.name, { color: theme.colors.colorPrimary600 }]}
              >
                {customer.name}
              </Text>

              <Text style={styles.subText}>
                {customer.age} yrs • {customer.gender}
              </Text>

              <Text style={styles.subText}>{customer.phone}</Text>
              <Text style={styles.subText}>{customer.address}</Text>
            </View>
          </View>
        </View>

        {/* TABS */}

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabsWrapper}
        >
          {tabs.map((tab, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setActiveTab(index)}
              style={[
                styles.tab,
                { backgroundColor: theme.colors.colorBgSurface },
                activeTab === index && {
                  backgroundColor: theme.colors.colorPrimary600,
                },
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  { color: theme.colors.colorTextSecondary },
                  activeTab === index && { color: "#fff" },
                ]}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* TAB CARD */}

        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.colorBgSurface },
          ]}
        >
          {renderTabContent()}
        </View>
      </ScrollView>
    </BodyLayout>
  );
}

/* STYLES */

const styles = StyleSheet.create({
  card: {
    marginTop: verticalScale(14),
    padding: moderateScale(16),
    borderRadius: 16,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },

  profileRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#E8F4F1",
    marginRight: 12,
  },

  name: {
    fontSize: 16,
    fontWeight: "700",
  },

  subText: {
    fontSize: 13,
    color: "#666",
    marginTop: 2,
  },

  tabsWrapper: {
    marginTop: 10,
    paddingHorizontal: 8,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 6,
  },

  tabText: {
    fontSize: 13,
    fontWeight: "600",
  },

  key: {
    fontSize: 12,
    color: "#666",
    marginTop: 6,
  },

  value: {
    fontSize: 14,
    fontWeight: "600",
  },

  timelineRow: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "center",
  },

  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 10,
  },

  timelineDate: {
    fontSize: 12,
    color: "#888",
  },

  timelineText: {
    fontSize: 14,
    fontWeight: "600",
  },

  emptyBox: {
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },

  emptyText: {
    fontSize: 13,
    color: "#888",
    marginTop: 6,
  },
});
