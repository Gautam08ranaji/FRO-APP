import BodyLayout from "@/components/layout/BodyLayout"; // ✅ ADD THIS
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";


export default function CaseDetailScreen() {
  const { theme } = useTheme();

  return (
    <BodyLayout type="screen" screenName="टिकट नंबर: TKT-14567-001">
      {/* --------------- ELDER DETAILS CARD --------------- */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          Elder Details
        </Text>

        {/* IMAGE + NAME/AGE/GENDER */}
        <View style={styles.row}>
          <View style={[styles.avatarBox,{backgroundColor:theme.colors.colorPrimary50}]}>
            <RemixIcon name="user-3-line" size={40} color={theme.colors.colorPrimary600} />
          </View>

          <View style={{ marginLeft: 12 }}>
            <View style={styles.keyValueRow}>
              <Text style={[styles.labelKey,{color:theme.colors.colorTextSecondary}]}>
                नाम:</Text>
              <Text style={[styles.labelValue,{color:theme.colors.colorTextSecondary}]}>
                रामलाल शर्मा</Text>
            </View>

            <View style={styles.keyValueRow}>
              <Text style={[styles.labelKey,{color:theme.colors.colorTextSecondary}]}>
                उम्र:</Text>
              <Text style={[styles.labelValue,{color:theme.colors.colorTextSecondary}]}>
                72 वर्ष</Text>
            </View>

            <View style={styles.keyValueRow}>
              <Text style={[styles.labelKey,{color:theme.colors.colorTextSecondary}]}>
                लिंग:</Text>
              <Text style={[styles.labelValue,{color:theme.colors.colorTextSecondary}]}>
                पुरुष</Text>
            </View>
          </View>
        </View>

        {/* PHONE NUMBERS */}
        <View style={{ marginTop: 14 }}>
          <View style={styles.keyValueRow}>
              <Text style={[styles.labelKey,{color:theme.colors.colorTextSecondary}]}>
              फ़ोन नंबर:</Text>
              <Text style={[styles.labelValue,{color:theme.colors.colorTextSecondary}]}>
              +91-9876543210</Text>
          </View>

          <View style={styles.keyValueRow}>
              <Text style={[styles.labelKey,{color:theme.colors.colorTextSecondary}]}>
              आपातकालीन संपर्क:</Text>
              <Text style={[styles.labelValue,{color:theme.colors.colorTextSecondary}]}>
              +91-9876543 / 211</Text>
          </View>
        </View>
      </View>

      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          Complaint Info
        </Text>

        <View>
              <Text style={[styles.labelKey,{color:theme.colors.colorTextSecondary}]}>
            शिकायत श्रेणी:</Text>
              <Text style={[styles.labelValue,{color:theme.colors.colorTextSecondary}]}>
            स्वास्थ्य सहायता</Text>
        </View>

        <Text style={[styles.labelKey, { marginTop: 12 ,color:theme.colors.colorTextSecondary}]}>विवरण:</Text>
              <Text style={[styles.labelValue,{color:theme.colors.colorTextSecondary}]}>
          बुजुर्ग को चलने में कठिनाई हो रही है, और नजदीकी हॉस्पिटल तक ले जाने
          में मदद चाहिए। नियमित चेकअप के लिए अस्पताल जाना है।
        </Text>

        <Text style={[styles.labelKey, { marginTop: 12 ,color:theme.colors.colorTextSecondary}]}>संलग्न मीडिया:</Text>
        <View style={[styles.attachmentBox,{backgroundColor:theme.colors.colorBgSurface}]}>
          <RemixIcon name="image-line" size={32} color="#888" />
        </View>
      </View>

      {/* --------------- LOCATION CARD --------------- */}
      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          Location
        </Text>

        <View style={styles.keyValueRow}>
              <Text style={[styles.labelKey,{color:theme.colors.colorTextSecondary}]}>
            पता:</Text>
              <Text style={[styles.labelValue,{color:theme.colors.colorTextSecondary}]}>
            123, गांधी नगर, सेक्टर 5, मुंबई, महाराष्ट्र - 400001
          </Text>
        </View>

        <View style={[styles.mapBox,{backgroundColor:theme.colors.colorBgSurface}]}>
          <RemixIcon name="map-pin-line" size={36} color="#999" />
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          style={styles.navBtn}
          onPress={() => {
            router.push("/StartNavigationScreen");
          }}
        >
          <Text style={styles.navBtnText}>नेविगेशन शुरू करें</Text>
        </TouchableOpacity>
      </View>

      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          Timeline
        </Text>

        <View style={styles.timelineContainer}>
          {[
            { title: "शिकायत दर्ज हुई", time: "10:30 AM", done: true },
            { title: "FRO को सौंपा गया", time: "10:45 AM", done: true },
            { title: "स्वीकृत", time: null, done: true },
            { title: "रास्ते में", time: null, done: false },
            { title: "स्थान पर पहुँचे", time: null, done: false },
            { title: "कार्य जारी", time: null, done: false },
          ].map((item, index, arr) => (
            <View key={index} style={styles.progressRow}>
              {/* LEFT SIDE DOT + LINES */}
              <View style={styles.progressLeft}>
                {index !== 0 && (
                  <View
                    style={[
                      styles.verticalLine,
                      arr[index - 1].done && {backgroundClip:theme.colors.colorPrimary600},
                    ]}
                  />
                )}

                <View
                  style={[
                    styles.progressDot,{},
                    item.done && {backgroundColor:theme.colors.colorPrimary600},
                  ]}
                >
                  {item.done && (
                    <RemixIcon name="check-line" size={12} color="#fff" />
                  )}
                </View>

                {index !== arr.length - 1 && (
                  <View
                    style={[
                      styles.verticalLine,
                      item.done && {backgroundColor:theme.colors.colorPrimary600},
                    ]}
                  />
                )}
              </View>

              <View style={styles.progressContent}>
                <Text
                  style={[
                    styles.progressTitle,{color:theme.colors.colorTextSecondary},
                    item.done && {color:theme.colors.colorPrimary600},
                  ]}
                >
                  {item.title}
                </Text>

                {item.time && (
                  <Text style={[styles.progressTime,{color:theme.colors.colorTextSecondary}]}>{item.time}</Text>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      <View
        style={[styles.card, { backgroundColor: theme.colors.colorBgPage }]}
      >
        <Text
          style={[styles.cardTitle, { color: theme.colors.colorPrimary600 }]}
        >
          Actions
        </Text>

        {[
          "स्थिति अपडेट करें",
          "फोटो/वीडियो जोड़ें",
          "नोट जोड़ें",
          "वॉइस नोट जोड़ें",
          "फॉलो-अप शेड्यूल करें",
        ].map((label, index) => (
          <TouchableOpacity key={index} style={[styles.actionBtn,{borderColor:theme.colors.colorPrimary600}]}>
            <Text style={[styles.actionBtnText,{color:theme.colors.colorPrimary600}]}>{label}</Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity style={[styles.closeBtn,{backgroundColor:theme.colors.colorAccent500}]}>
          <Text style={[styles.closeBtnText,{color:theme.colors.colorBgPage}]}>मामला बंद करें</Text>
        </TouchableOpacity>
      </View>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F6FA" },

  /* CARD */
  card: {
    marginHorizontal: 0,
    marginTop: 14,
    padding: 18,
    borderRadius: 12,
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },

  /* KEY VALUE */
  keyValueRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
    flexWrap: "wrap",
  },
  labelKey: {
    width: 130,
    fontSize: 14,
    fontWeight: "500",
  },
  labelValue: {
    fontSize: 14,
    fontWeight: "600",
    flexShrink: 1,
  },

  /* GENERAL UI */
  row: { flexDirection: "row", alignItems: "center" },

  avatarBox: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
  },

  attachmentBox: {
    height: 70,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    marginTop: 8,
    justifyContent: "center",
    alignItems: "center",
  },

  mapBox: {
    height: 120,
    backgroundColor: "#EFEFEF",
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  navBtn: {
    marginTop: 12,
    backgroundColor: "#027A61",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  navBtnText: { color: "#fff", fontSize: 15, fontWeight: "600" },

  /* PROGRESS TRACKER */
  timelineContainer: { marginTop: 4 },

  progressRow: { flexDirection: "row", minHeight: 55 },

  progressLeft: { width: 30, alignItems: "center" },

  verticalLine: { width: 2, flex: 1, backgroundColor: "#D8D8D8" },

  progressDot: {
    width: 20,
    height: 20,
    borderRadius: 20,
    backgroundColor: "#D8D8D8",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  progressContent: {
    paddingLeft: 10,
    paddingBottom: 10,
    flex: 1,
  },

  progressTitle: { fontSize: 14,  },

  progressTime: { fontSize: 12, marginTop: 2 },

  /* ACTIONS */
  actionBtn: {
    borderWidth: 1,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
  },
  actionBtnText: {
    color: "#027A61",
    fontSize: 15,
    fontWeight: "600",
  },

  closeBtn: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 14,
    alignItems: "center",
  },
  closeBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});
