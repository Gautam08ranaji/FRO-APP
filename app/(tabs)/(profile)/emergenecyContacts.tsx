import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function EmergencyContactScreen() {
  const { theme } = useTheme();

  const contacts = [
    {
      id: "1",
      name: "राम कुमार",
      relation: "बेटा",
      phone: "+91-9876543210",
      image: "https://thispersondoesnotexist.com/",
    },
    {
      id: "2",
      name: "सीमा देवी",
      relation: "पत्नी",
      phone: "+91-9123456780",
      image: "https://thispersondoesnotexist.com/",
    },
  ];

  return (
    <BodyLayout>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ---------- TITLE ---------- */}
        <View style={{ marginBottom: 12 }}>
          <Text
            style={[
              styles.title,
              { color: theme.colors.colorPrimary800 },
            ]}
          >
            आपातकालीन संपर्क
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: theme.colors.colorTextSecondary },
            ]}
          >
            आपकी आपात स्थिति में टीम सबसे पहले इन संपर्कों को कॉल करेगी।
          </Text>
        </View>

        {/* ---------- CONTACT CARDS ---------- */}
        {contacts.map((item) => (
          <View
            key={item.id}
            style={[
              styles.card,
              { borderColor: theme.colors.colorPrimary300 },
            ]}
          >
            <View style={styles.row}>
              <Image source={{ uri: item.image }} style={styles.avatar} />

              <View style={{ flex: 1, paddingLeft: 10 }}>
                <Text
                  style={[
                    styles.name,
                    { color: theme.colors.colorPrimary800 },
                  ]}
                >
                  {item.name}
                </Text>

                <Text
                  style={[
                    styles.label,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  संबंध: {item.relation}
                </Text>

                <Text
                  style={[
                    styles.label,
                    { color: theme.colors.colorTextSecondary },
                  ]}
                >
                  फ़ोन नंबर: {item.phone}
                </Text>

                {/* ---------- BUTTONS ---------- */}
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.updateBtn,
                      { backgroundColor: theme.colors.colorPrimary700 },
                    ]}
                  >
                    <RemixIcon name="edit-line" size={20} color="#fff" />
                    <Text style={styles.updateText}>अपडेट करें</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={styles.deleteBtn}>
                    <RemixIcon name="delete-bin-line" size={20} color="#fff" />
                    <Text style={styles.deleteText}>हटाएँ</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* ---------- ADD CONTACT BUTTON ---------- */}
        <TouchableOpacity
          style={[
            styles.addNewBtn,
            { backgroundColor: theme.colors.colorPrimary700 },
          ]}

          onPress={()=>{
            router.push('/addEmergencyContact')
          }}
        >
          <RemixIcon name="add-line" size={24} color="#fff" />
          <Text style={styles.addNewText}>नया संपर्क जोड़ें</Text>
        </TouchableOpacity>
      </ScrollView>
    </BodyLayout>
  );
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  title: {
    fontSize: 22,
    textAlign: "center",
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 4,
  },

  card: {
    padding: 14,
    borderWidth: 1,
    borderRadius: 14,
    marginBottom: 14,
    backgroundColor: "#E3F3F3",
  },

  row: { flexDirection: "row", alignItems: "center" },

  avatar: {
    width: 62,
    height: 62,
    borderRadius: 50,
  },

  name: {
    fontSize: 18,
    fontWeight: "700",
  },

  label: {
    fontSize: 14,
    marginTop: 2,
  },

  actionsRow: {
    flexDirection: "row",
    marginTop: 12,
    gap: 12,
  },

  updateBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
  updateText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  deleteBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#D32F2F",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },

  deleteText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },

  addNewBtn: {
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
    gap: 8,
  },

  addNewText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
