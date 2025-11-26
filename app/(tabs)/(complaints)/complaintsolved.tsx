import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from "react-native";

export default function ComplaintSolvedScreen() {
  const { theme } = useTheme();

  // Static demo data (replace with API)
  const complaint = {
    id: "12345",
    category: "कार्यस्थल पर अनुचित व्यवहार",
    subCategory: "घर में बच्चों द्वारा मारपीट की समस्या",
    address: "गली नंबर 5, रामनगर मोहल्ला, जयपुर, 302001",
    statusDescription:
      "जांच पूरी हो गई है और मामला सफलतापूर्वक बंद कर दिया गया है।",
  };

  return (
    <BodyLayout>
      <View style={styles.container}>

        {/* ---------- Ticket Number + Status ---------- */}
        <View style={styles.headerRow}>
          <Text style={styles.ticketNumber}>टिकट नंबर: {complaint.id}</Text>

          <View style={styles.closedTag}>
            <View style={styles.closedDot} />
            <Text style={styles.closedText}>बंद</Text>
          </View>
        </View>

        {/* ---------- Complaint Fields ---------- */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.key}>शिकायत:</Text>
            <Text style={styles.value}>{complaint.category}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>शिकायत का विवरण:</Text>
            <Text style={styles.value}>{complaint.subCategory}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>पता / स्थान:</Text>
            <Text style={styles.value}>{complaint.address}</Text>
          </View>
        </View>

        {/* ---------- Status Description ---------- */}
        <Text style={styles.sectionHeading}>स्टेटस विवरण:</Text>
        <View style={styles.card}>
          <Text style={styles.statusDescription}>
            {complaint.statusDescription}
          </Text>
        </View>

        {/* ---------- Feedback Section ---------- */}
        <Text style={styles.sectionHeading}>आपका अनुभव कैसा रहा?</Text>

        <View style={styles.feedbackBox}>
          <Text style={styles.feedbackHint}>
            कृपया हमारी सपोर्ट टीम के व्यवहार, आपके साथ हुए इलाज और
            शिकायत के समाधान के बारे में अपनी राय दें, आपका फीडबैक हमारी
            सेवाओं और सरकारी स्टाफ के प्रशिक्षण को बेहतर बनाने में मदद करेगा।
          </Text>
        </View>

        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitBtnText}>फीडबैक दें</Text>
        </TouchableOpacity>

      </View>
    </BodyLayout>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingBottom: 40,
  },

  /* Ticket + Status */
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },

  ticketNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0A6955",
  },

  closedTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#D32F2F",
  },

  closedDot: {
    width: 8,
    height: 8,
    backgroundColor: "#D32F2F",
    borderRadius: 4,
    marginRight: 6,
  },

  closedText: {
    color: "#D32F2F",
    fontWeight: "700",
  },

  /* Info Card */
  card: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#E2E2E2",
  },

  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 10,
  },

  key: {
    width: 140,
    color: "#616161",
    fontWeight: "600",
    fontSize: 15,
  },

  value: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    lineHeight: 21,
  },

  sectionHeading: {
    marginTop: 18,
    fontSize: 16,
    color: "#0A6955",
    fontWeight: "700",
    marginBottom: 6,
  },

  statusDescription: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },

  /* Feedback box */
  feedbackBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    padding: 14,
    marginTop: 4,
  },

  feedbackHint: {
    color: "#555",
    fontSize: 14,
    lineHeight: 22,
  },

  /* Submit Button */
  submitBtn: {
    backgroundColor: "#0A6955",
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 20,
    alignItems: "center",
  },

  submitBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});

