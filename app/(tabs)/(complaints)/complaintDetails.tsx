import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React from "react";
import {
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function ComplaintDetailsScreen() {
  const { theme } = useTheme();

  const complaint = {
    id: "12345",
    category: "उत्पीड़न से संबंधित समस्या",
    subCategory: "घर में बच्चों द्वारा मारपीट की समस्या",
    address: "गली नंबर 5, रामनगर मोहल्ला, जयपुर, 302001",
    status: "active",
    officerName: "आशिफ लोहार",
    officerPhone: "+91 9453416629",
    statusDescription:
      "हमने आपके लिए FRO स्टाफ को भेजा है। वे अगले 10 मिनट में आपके पास पहुँच जाएंगे।",
  };

  return (
    <BodyLayout>
      <View style={styles.container}>

        {/* Ticket Header */}
        <View style={styles.headerRow}>
          <Text style={styles.ticketNumber}>टिकट नंबर: {complaint.id}</Text>

          <View style={styles.statusTag}>
            <View style={styles.statusDot} />
            <Text style={styles.statusText}>सक्रिय</Text>
          </View>
        </View>

        {/* Complaint Fields */}
        <View style={styles.card}>
          <Text style={styles.sectionHeading}>शिकायत विवरण</Text>

          <View style={styles.row}>
            <Text style={styles.key}>शिकायत:</Text>
            <Text style={styles.value}>{complaint.category}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>विवरण:</Text>
            <Text style={styles.value}>{complaint.subCategory}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>पता:</Text>
            <Text style={styles.value}>{complaint.address}</Text>
          </View>
        </View>

        {/* Assigned Team */}
        <Text style={styles.label}>यह काम किस टीम को सौंपा गया है:</Text>
        <View style={[styles.card,{backgroundColor:"#E0F2F1",borderColor:"#00695C"}]}>
          <Text style={styles.sectionHeading}>सौंपा गया टीम</Text>

          <View style={styles.row}>
            <Text style={styles.key}>नाम:</Text>
            <Text style={styles.value}>{complaint.officerName}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.key}>फ़ोन:</Text>
            <Text style={styles.value}>{complaint.officerPhone}</Text>
          </View>

          <View style={styles.buttonRow}>
            <TouchableOpacity style={styles.msgBtn}>
              <RemixIcon name="message-3-line" size={20} color="#0A6955" />
              <Text style={styles.msgBtnText}>संदेश</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.callBtn}
            onPress={()=>{
                router.push("/(tabs)/(complaints)/complaintsolved")
            }}
            >
              <RemixIcon name="phone-line" size={20} color="#fff" />
              <Text style={styles.callBtnText}>कॉल</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Status Description */}
        <View style={[styles.card,{marginTop:14}]}>
          <Text style={styles.sectionHeading}>स्टेटस विवरण</Text>
          <Text style={styles.statusDescription}>
            {complaint.statusDescription}
          </Text>
        </View>

      </View>
    </BodyLayout>
  );
}

/* ------------ STYLES ------------ */

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 14,
    paddingBottom: 20,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 12,
  },

  ticketNumber: {
    fontSize: 18,
    color: "#0A6955",
    fontWeight: "700",
  },
  label: {
    fontSize: 18,
    color: "#0A6955",
    fontWeight: "700",
    marginVertical:10,
    marginTop:20
  },

  statusTag: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#0A6955",
  },

  statusDot: {
    width: 8,
    height: 8,
    backgroundColor: "#0A6955",
    borderRadius: 4,
    marginRight: 6,
  },

  statusText: {
    color: "#0A6955",
    fontWeight: "700",
  },

  /* Card Layout */
  card: {
    backgroundColor: "#F9F9F9",
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E6E6E6",
  },

  sectionHeading: {
    fontSize: 16,
    color: "#0A6955",
    fontWeight: "700",
    marginBottom: 10,
  },

  /* Key → Value Row */
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 8,
  },

  key: {
    width: 110, 
    color: "#00796B",
    fontWeight: "600",
    fontSize: 15,
  },

  value: {
    flex: 1,
    color: "#333",
    fontSize: 15,
    lineHeight: 21,
  },

  /* Buttons */
  buttonRow: {
    flexDirection: "row",
    marginTop: 12,
  },

  msgBtn: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#E0F2F1",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0A6955",
    alignItems: "center",
    flex: 1,
    marginRight: 8,
  },

  msgBtnText: {
    color: "#0A6955",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },

  callBtn: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: "#0A6955",
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginLeft: 8,
  },

  callBtnText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
  },

  statusDescription: {
    fontSize: 15,
    color: "#333",
    lineHeight: 22,
  },
});
