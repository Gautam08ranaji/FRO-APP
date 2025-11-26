import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function InfoScreen() {
  const { theme } = useTheme();

  const tabs = ["सभी", "आवास", "कानूनी अधिकार", "सहायता"];
  const [activeTab, setActiveTab] = useState("सभी");

  const data = [
    {
      id: 1,
      title: "स्वास्थ्य लाभों में नया अपडेट",
      tag: "स्वास्थ्य",
      desc:
        "सभी वरिष्ठ नागरिकों के लिए स्वास्थ्य योजनाओं में नई छूट और सहायता किया गया। इस योजना के चिकित्सा लाभों का लाभ आप अगले महीने से ले सकेंगे।",
      category: "सहायता",
    },
    {
      id: 2,
      title: "आवास सहायता में नई सुविधाएं",
      tag: "आवास",
      desc:
        "वरिष्ठ व वृद्ध नागरिकों के लिए आवास सहायता में सुधार किया जाएगा। इसमें किराए की छूट और निवास संबंधी प्रक्रियाओं में बदलाव किया गया है।",
      category: "आवास",
    },
    {
      id: 3,
      title: "कानूनी मदद में नया सुधार",
      tag: "कानूनी सहायता",
      desc:
        "वरिष्ठ नागरिकों के लिए कानूनी सहायता सुविधा को सरल किया गया है। अब मामलों के लिए जल्दी सुनवाई और प्राथमिकता मिलेगी।",
      category: "कानूनी अधिकार",
    },
    {
      id: 4,
      title: "वरिष्ठ नागरिकों के अधिकारों में सुधार",
      tag: "अधिकार",
      desc:
        "वरिष्ठ नागरिकों को मिलने वाले अधिकारों में नए प्रावधान जोड़े गए हैं। इसमें आर्थिक मदद और सुरक्षा से जुड़े नियम भी शामिल हैं।",
      category: "सहायता",
    },
  ];

  const filteredData =
    activeTab === "सभी"
      ? data
      : data.filter((item) => item.category === activeTab);

  return (
    <BodyLayout>

      {/* ---------- TABS ---------- */}
      <View style={styles.tabContainer}>
        {tabs.map((t) => {
          const isActive = activeTab === t;

          return (
            <TouchableOpacity
              key={t}
              style={[
                styles.tabButton,
                {
                  backgroundColor: isActive
                    ? theme.colors.colorWarning100
                    : theme.colors.colorBgPage,
                  borderColor: isActive
                    ? theme.colors.colorWarning600
                    : theme.colors.colorBorder,
                },
              ]}
              onPress={() => setActiveTab(t)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive
                      ? theme.colors.colorWarning600
                      : theme.colors.colorTextSecondary,
                  },
                ]}
              >
                {t}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ---------- LIST ---------- */}
      {filteredData.map((item) => (
        <View
          key={item.id}
          style={[
            styles.card,
            {
              backgroundColor: theme.colors.colorBgSurface,
              borderColor: theme.colors.colorBorder,
            },
          ]}
        >

          {/* Title & Tag */}
          <View style={styles.titleRow}>
            <Text
              style={[
                styles.title,
                { color: theme.colors.colorPrimary600 },
              ]}
            >
              {item.title}
            </Text>

            <View
              style={[
                styles.tagWrapper,
                { backgroundColor: theme.colors.validationWarningBg },
              ]}
            >
              <Text
                style={[
                  styles.tagText,
                  { color: theme.colors.validationWarningText },
                ]}
              >
                {item.tag}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            style={[
              styles.description,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            {item.desc}
          </Text>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: theme.colors.btnPrimaryBg },
            ]}
            onPress={()=>{
              router.push('/articlepage')
            }}
          >
            <Text
              style={[
                styles.buttonText,
                { color: theme.colors.btnPrimaryText },
              ]}
            >
              पूरी जानकारी देखें  ›
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </BodyLayout>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    justifyContent: "flex-start",
    marginVertical: 10,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 30,
    marginRight: 10,
    borderWidth: 1,
  },
  tabText: {
    fontSize: 14,
    fontWeight: "600",
  },

  card: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    elevation: 2,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginVertical: 20,
  },

  tagWrapper: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    marginLeft: 10,
  },
  tagText: {
    fontSize: 12,
    fontWeight: "600",
  },

  title: {
    flex: 1,
    flexShrink: 1,
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    lineHeight: 22,
  },

  description: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },

  button: {
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
