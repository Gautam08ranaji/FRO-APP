import { useTheme } from "@/theme/ThemeContext";
import React, { useMemo } from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const allQueriesData = [
  {
    id: 1,
    time: "10 mins ago",
    by: "Rajesh Kumar (FRO-001)",
    status: "Answered",
    question: "Hospital near me for senior citizen health checkup?",
    answerBy: "FRL Priya Sharma",
    answerTime: "5 mins ago",
    answer: "Gandhi Hospital, Sector 5 is the nearest facility with senior citizen services. Address: Gandhi Nagar, 2.3 km away. Phone: +91-9876543210.",
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
    time: "30 mins ago",
    by: "Gautam Rana (FRO-003)",
    status: "Answered",
    question: "Hospital near me for senior citizen health checkup?",
    answerBy: "FRL Priya Sharma",
    answerTime: "5 mins ago",
    answer: "Gandhi Hospital, Sector 5 is the nearest facility with senior citizen services. Address: Gandhi Nagar, 2.3 km away. Phone: +91-9876543210",
  },
];

// ✅ ACCEPT SEARCH PROP (ONLY LOGIC ADDED)
export default function AllQueriesTab({ search = "" }) {
  const { theme } = useTheme();

  // ✅ FILTER LOGIC (ONLY LOGIC ADDED)
  const filteredData = useMemo(() => {
    if (!search.trim()) return allQueriesData;

    return allQueriesData.filter((item) =>
      item.question.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <FlatList
      data={filteredData}   
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }) => (
        <View
          style={[
            styles.card,
            { backgroundColor: theme.colors.colorBgPage },
          ]}
        >
          {/* TOP META */}
          <View style={styles.topRow}>
            <View>
              <Text style={[styles.timeText, { color: theme.colors.navInactive }]}>
                {item.time}
              </Text>
              <Text style={[styles.byText, { color: theme.colors.navInactive }]}>
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
                <Text style={[{ color: theme.colors.validationSuccessText }]}>
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
  );
}

const styles = StyleSheet.create({
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

  timeText: { fontSize: 12 },
  byText: { fontSize: 12, marginTop: 2 },

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
