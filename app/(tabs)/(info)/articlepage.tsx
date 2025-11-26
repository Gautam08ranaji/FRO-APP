import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { ResizeMode, Video } from "expo-av";
import React, { useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function ArticleScreen() {
  const { theme } = useTheme();
  const videoRef = useRef<Video>(null);

  return (
    <BodyLayout scrollContentStyle={{paddingHorizontal:5}}>

      {/* ---------- TITLE + TAG ---------- */}
      <View style={styles.titleRow}>
        <Text style={[styles.title, { color: theme.colors.colorPrimary700 }]}>
          सभी वरिष्ठ नागरिकों के लिए स्वास्थ्य लाभ और सुविधाएँ
        </Text>

        <View
          style={[
            styles.tagWrapper,
            { backgroundColor: theme.colors.validationWarningBg },
          ]}
        >
          <Text style={[styles.tagText, { color: theme.colors.validationWarningText }]}>
            स्वास्थ्य लाभ
          </Text>
        </View>
      </View>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.colorBorder }]} />

      {/* ---------- SECTION HEADER ---------- */}
      <Text style={[styles.sectionTitle, { color: theme.colors.colorTextPrimary }]}>
        वीडियो देखें:
      </Text>

      {/* ---------- VIDEO PLAYER ---------- */}
      <Video
        ref={videoRef}
        style={styles.videoPlayer}
        source={{ uri: "https://www.w3schools.com/html/mov_bbb.mp4" }}
        useNativeControls
        resizeMode={ResizeMode.COVER}
        isLooping
      />

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.colorBorder }]} />

      {/* ---------- DETAILS SECTION ---------- */}
      <Text style={[styles.sectionTitle, { color: theme.colors.colorTextPrimary }]}>
        मुख्य सुविधाएँ:
      </Text>

      <Text style={[styles.bulletPoint, { color: theme.colors.colorTextSecondary }]}>
        • मेडिकल बीमा: वरिष्ठ नागरिकों के लिए विशेष केंद्रित स्वास्थ्य योजनाएँ।
      </Text>

      <Text style={[styles.bulletPoint, { color: theme.colors.colorTextSecondary }]}>
        • मुफ्त जांचें: सरकारी अस्पतालों में नियमित स्वास्थ्य जांच उपलब्ध।
      </Text>

      <Text style={[styles.bulletPoint, { color: theme.colors.colorTextSecondary }]}>
        • निःशुल्क दवाइयाँ: आम बीमारियों के लिए मुफ्त दवाइयाँ।
      </Text>

      <Text style={[styles.bulletPoint, { color: theme.colors.colorTextSecondary }]}>
        • विशेष सहायता: वरिष्ठ नागरिकों के लिए विशेष हेल्पलाइन।
      </Text>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.colorBorder }]} />

      {/* ---------- HOW TO USE SECTION ---------- */}
      <Text style={[styles.sectionTitle, { color: theme.colors.colorTextPrimary }]}>
        कैसे लाभ उठाएँ:
      </Text>

      <Text style={[styles.bulletPoint, { color: theme.colors.colorTextSecondary }]}>
        • नजदीकी स्वास्थ्य केंद्र में पंजीकरण करवाएँ।
      </Text>

      <Text style={[styles.bulletPoint, { color: theme.colors.colorTextSecondary }]}>
        • सरकारी अस्पताल से जानकारी प्राप्त करें।
      </Text>

      <Text style={[styles.bulletPoint, { color: theme.colors.colorTextSecondary }]}>
        • नियमित जांच और सलाह का पालन करें।
      </Text>

      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: theme.colors.colorBorder }]} />

      {/* ---------- CONCLUSION ---------- */}
      <Text style={[styles.sectionTitle, { color: theme.colors.colorTextPrimary }]}>
        निष्कर्ष:
      </Text>

      <Text style={[styles.paragraph, { color: theme.colors.colorTextSecondary }]}>
        ये सरकारी स्वास्थ्य कार्यक्रम वरिष्ठ नागरिकों के जीवन को सुरक्षित और बेहतर बनाने के लिए बनाए गए हैं। समय पर जांच और आवश्यक कदम उठाकर आप लंबे समय तक स्वस्थ रह सकते हैं।
      </Text>

    </BodyLayout>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
  },

  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: "700",
    lineHeight: 25,
    marginRight: 10,
  },

  tagWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
  },

  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
    marginBottom: 8,
  },

  /* Divider line */
  divider: {
    height: 1,
    width: "100%",
    marginVertical: 16,
  },

  videoPlayer: {
    width: "100%",
    height: 200,
    borderRadius: 12,
    backgroundColor: "#000",
    marginBottom: 10,
  },

  bulletPoint: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 6,
  },

  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 20,
  },
});
