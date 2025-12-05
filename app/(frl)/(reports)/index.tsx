import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const queryTabs = ["All Queries", "Knowledge Base"];

const communityData = [
  {
    id: 1,
    time: "10 mins ago",
    by: "Rajesh Kumar (FRO-001)",
    status: "Answered",
    question: "Hospital near me for senior citizen health checkup?",
    answerBy: "FRL Priya Sharma",
    answerTime: "5 mins ago",
    answer:
      "Gandhi Hospital, Sector 5 is the nearest facility with senior citizen services. Address: Gandhi Nagar, 2.3 km away. Phone: +91-9876543210",
  },
  {
    id: 2,
    time: "25 mins ago",
    by: "Amit Verma (FRO-003)",
    status: "Pending",
    question: "Nearest NGO for legal aid support?",
  },
  {
    id: 3,
    time: "1 hour ago",
    by: "Sunita Devi (FRO-003)",
    status: "Answered",
    question: "NGO providing free medicines for elderly?",
    answerBy: "FRL Vikram Singh",
    answerTime: "45 mins ago",
    answer:
      "HelpAge India provides free medicine support. Contact: +91-9876543211. Location: Hazratganj, 3.5 km away.",
  },
];

export default function CommunityScreen() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState("All Queries");

  return (
    <BodyLayout type="screen" screenName="Community & nowledge">
      <View style={[styles.searchBox,{borderColor:theme.colors.inputPlaceholder}]}>
        <RemixIcon
          name="search-line"
          size={18}
          color={theme.colors.colorTextSecondary}
        />
        <TextInput
          placeholder="Search queries"
          style={[{ flex: 1, color: theme.colors.colorTextSecondary }]}
          placeholderTextColor={theme.colors.inputPlaceholder}
        />
      </View>

      <View style={styles.tabsRow}>
        {queryTabs.map((tab) => (
          <TouchableOpacity
            key={tab}
            onPress={() => setActiveTab(tab)}
            style={[
              styles.tab,
              {
                backgroundColor:
                  activeTab === tab
                    ? theme.colors.btnPrimaryBg
                    : theme.colors.colorBgSurface,
                borderColor: theme.colors.btnPrimaryBg,
              },
            ]}
          >
            <Text
              style={{
                color:
                  activeTab === tab
                    ? theme.colors.btnPrimaryText
                    : theme.colors.btnPrimaryBg,
                fontWeight: "700",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={communityData}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.colors.colorBgSurface },
            ]}
          >
            {/* TOP META */}
            <View style={styles.topRow}>
              <View>
                <Text
                  style={[styles.timeText, { color: theme.colors.navInactive }]}
                >
                  {item.time}
                </Text>
                <Text
                  style={[styles.byText, { color: theme.colors.navInactive }]}
                >
                  By: {item.by}
                </Text>
              </View>

              <View
                style={[
                  styles.statusBadge,
                  item.status === "Answered"
                    ? { backgroundColor: theme.colors.validationSuccessBg }
                    : { backgroundColor: theme.colors.validationWarningBg },
                ]}
              >
                <Text
                  style={[
                    styles.statusText,
                    item.status === "Answered"
                      ? { color: theme.colors.validationSuccessText }
                      : { color: theme.colors.validationWarningText },
                  ]}
                >
                  {item.status}
                </Text>
              </View>
            </View>

            <Text
              style={[
                styles.question,
                { color: theme.colors.colorTextSecondary },
              ]}
            >
              {item.question}
            </Text>

            {item.status === "Answered" ? (
              <View
                style={[
                  styles.answerBox,
                  { backgroundColor: theme.colors.validationSuccessBg },
                ]}
              >
                <View style={styles.answerTop}>
                  <RemixIcon
                    name="chat-3-line"
                    size={16}
                    color={theme.colors.validationSuccessText}
                  />
                  <Text
                    style={{
                      color: theme.colors.validationSuccessText,
                      fontWeight: "700",
                    }}
                  >
                    Answer by {item.answerBy} • {item.answerTime}
                  </Text>
                </View>

                <Text
                  style={[
                    styles.answerText,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  {item.answer}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[
                  styles.acceptBtn,
                  { backgroundColor: theme.colors.btnPrimaryBg },
                ]}
              >
                <Text
                  style={[
                    styles.acceptText,
                    { color: theme.colors.btnPrimaryText },
                  ]}
                >
                  Accept and Answer
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  header: {
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },

  iconBadge: {
    backgroundColor: "red",
    padding: 8,
    borderRadius: 20,
  },
  badgeDot: {
    position: "absolute",
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: { fontSize: 10,  fontWeight: "700" },

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
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: "center",
  },

  card: {
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
    elevation: 2,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeText: { fontSize: 12, },
  byText: { fontSize: 12,  marginTop: 2 },

  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 20,
  },

  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },

  question: {
    marginTop: 10,
    fontWeight: "700",
  },

  answerBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
  },

  answerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },

  answerText: {
    fontSize: 13,
  },

  acceptBtn: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    alignItems: "center",
  },

  acceptText: {
    fontWeight: "700",
  },
});
