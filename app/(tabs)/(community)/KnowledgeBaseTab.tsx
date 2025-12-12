import { useTheme } from "@/theme/ThemeContext";
import React, { useMemo } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";


const knowledgeBaseData = [
  {
    id: 1,
    title: "List of Government Hospitals",
    subtitle: "Healthcare",
    type: "health",
  },
  {
    id: 2,
    title: "NGOs Supporting Elderly Care",
    subtitle: "Supportive Service",
    type: "ngo",


  },
  {
    id: 3,
    title: "Legal Aid Services Directory",
    subtitle: "Legal Support",
    type: "legal",
  },
  {
    id: 4,
    title: "Emergency Contact Numbers",
    subtitle: "Emergency",
    type: "emergency",
  },
];


const uiMap: any = {
  health: {
    bg: "#FDECEC",
    iconBg: "#D32F2F",
    icon: "heart-line",
  },
  ngo: {
    bg: "#E3F2FD",
    iconBg: "#1976D2",
    icon: "team-line",
  },
  legal: {
    bg: "#FFF3E0",
    iconBg: "#FB8C00",
    icon: "scales-3-line",
  },
  emergency: {
    bg: "#E8F5E9",
    iconBg: "#2E7D32",
    icon: "home-5-line",
  },
};


export default function KnowledgeBaseTab({ search = "" }) {
  const { theme } = useTheme();


  const filteredData = useMemo(() => {
    if (!search.trim()) return knowledgeBaseData;

    return knowledgeBaseData.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return (
    <FlatList
      data={filteredData}   
      keyExtractor={(item) => item.id.toString()}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 40 }}
      renderItem={({ item }) => {
        const ui = uiMap[item.type];

        return (
          <View style={[styles.card, { backgroundColor: ui.bg }]}>
           
            <View style={[styles.iconBox, { backgroundColor: ui.iconBg }]}>
              <RemixIcon name={ui.icon} size={20} color="#fff" />
            </View>

           
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.subtitle}>{item.subtitle}</Text>
            </View>

            
            <RemixIcon
              name="arrow-right-up-line"
              size={20}
              color={theme.colors.colorTextSecondary}
            />
          </View>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 16,
    marginTop: 14,
  },

  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  title: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
});
