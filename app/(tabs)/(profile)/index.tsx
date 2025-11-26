import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

import RemixIcon, { IconName } from "react-native-remix-icon";

export default function ProfileScreen() {
  const { theme } = useTheme();

  return (
    <BodyLayout>
      {/* 🔶 Aadhaar Warning Card */}
      <View
        style={[
          styles.warningCard,
          { backgroundColor: theme.colors.colorWarning100 ,borderColor:theme.colors.colorWarning600},
        ]}
      >
        <Text
          style={[styles.warningText, { color: theme.colors.colorTextPrimary }]}
        >
          ऐसा लगता है कि आपने अपना आधार अपडेट नहीं किया है। इसे अपडेट करने से
          हमें किसी आपातकालीन स्थिति में आपके बारे में सही जानकारी प्राप्त कर
          सकेंगे।
        </Text>

        <TouchableOpacity
          style={[
            styles.updateBtn,
            { backgroundColor: theme.colors.colorWarning600 },
          ]}
        >
          <Text style={styles.updateBtnText}>आधार अपडेट करें</Text>
        </TouchableOpacity>
      </View>

      {/* 🧑 Profile Card */}
      <View
        style={[
          styles.profileCard,
          { backgroundColor: theme.colors.colorPrimary50 },
        ]}
      >
        <View style={styles.profileRow}>
          <Image
            source={{ uri: "https://thispersondoesnotexist.com/" }}
            style={styles.profileImage}
          />

          <View style={{ flex: 1 }}>
            <Text
              style={[styles.name, { color: theme.colors.colorTextPrimary }]}
            >
              दुर्गेश राय
            </Text>
            <Text style={styles.age}>65 वर्ष</Text>
          </View>
        </View>

        {/* Details */}
        <View style={styles.detailsBox}>
          <ProfileItem label="फोन नम्बर" value="+91 9453416629" />
          <ProfileItem label="लिंग" value="पुरुष" />
          <ProfileItem label="आधार नम्बर" value="जोड़ नहीं गया" red />
          <ProfileItem label="वैक्सीनेशन स्टेटस" value="जोड़ नहीं गया" red />
          <ProfileItem
            label="पता"
            value="कुशमुरा चौहान, पंडितपुर, सेजना, गोरखपुर, उत्तर प्रदेश - 233001"
          />
        </View>

        <TouchableOpacity
          style={[
            styles.profileUpdateBtn,
            { backgroundColor: theme.colors.btnPrimaryBg },
          ]}
          onPress={()=>{
            router.push('/(tabs)/(profile)/profileUpdate')
          }}
        >
          <Text style={styles.profileUpdateText}>प्रोफ़ाइल अपडेट करें</Text>
        </TouchableOpacity>
      </View>

      {/* MENU LIST */}
      <MenuItem
        icon="phone-line"
        title="आपातकालीन संपर्क"
        onPress={() =>router.push('/emergenecyContacts')}
      />

      <MenuItem
        icon="dossier-line"
        title="चिकित्सा नोट्स"
        onPress={() =>{
           console.log("Navigate to medical notes")
          router.push('/addMedicationDetailsScreen')
          }}
      />

      <MenuItem
        icon="translate-2"
        title="भाषा"
        onPress={() =>{
         console.log("Navigate to language settings")
          router.push('/languageSelect')
        }}
      />

      <MenuItem
        icon="settings-3-line"
        title="सेटिंग्स"
        onPress={() => console.log("Navigate to settings")}
      />

      {/* 🚪 Logout */}
      <TouchableOpacity style={styles.logoutBtn}>
        <RemixIcon name="logout-box-line" size={20} color="#D32F2F" />
        <Text style={styles.logoutText}>लॉग आउट</Text>
      </TouchableOpacity>
    </BodyLayout>
  );
}

/* -----------------------------------------
  REUSABLE PROFILE ITEM
------------------------------------------- */
function ProfileItem({
  label,
  value,
  red,
}: {
  label: string;
  value: string;
  red?: boolean;
}) {
  return (
    <View style={styles.detailRow}>
      <Text style={[styles.detailLabel, { color: "#00695C" }]}>{label}:</Text>
      <Text
        style={[
          styles.detailValue,
          red ? { color: "#D32F2F", fontWeight: "700" } : {},
        ]}
      >
        {value}
      </Text>
    </View>
  );
}

/* -----------------------------------------
  SIMPLE MENU ITEM WITH RIGHT ARROW
------------------------------------------- */
function MenuItem({
  icon,
  title,
  onPress,
}: {
  icon: IconName;
  title: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.menuItem}>
      <View style={styles.menuLeft}>
        <RemixIcon name={icon} size={20} color="#424242" />
        <Text style={styles.menuText}>{title}</Text>
      </View>

      {/* 👉 Always show right arrow */}
      <RemixIcon name="arrow-right-s-line" size={20} color="#424242" />
    </TouchableOpacity>
  );
}

/* -------------------------------------------------- */

const styles = StyleSheet.create({
  warningCard: {
    padding: 14,
    borderRadius: 10,
    marginVertical: 16,
    borderWidth:1
  },
  warningText: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
  },
  updateBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  updateBtnText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "600",
  },

  /* Profile Card */
  profileCard: {
    padding: 16,
    borderRadius: 14,
    marginBottom: 18,
  },
  profileRow: {
    flexDirection: "row",
    marginBottom: 12,
  },
  profileImage: {
    width: 65,
    height: 65,
    borderRadius: 50,
    marginRight: 12,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
  },
  age: {
    color: "#424242",
    marginTop: 2,
  },

  detailsBox: { marginTop: 5 },

  detailRow: {
    flexDirection: "row",
    marginBottom: 6,
  },
  detailLabel: {
    width: 110,
    fontWeight: "600",
  },
  detailValue: {
    flex: 1,
    color: "#212121",
    fontWeight: "500",
  },

  profileUpdateBtn: {
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: "center",
  },
  profileUpdateText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 15,
  },

  /* Menu Items */
  menuItem: {
    backgroundColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 14,
    marginBottom: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuText: {
    marginLeft: 10,
    fontSize: 15,
    color: "#424242",
    fontWeight: "600",
  },

  /* Logout */
  logoutBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFEBEE",
    paddingVertical: 14,
    paddingHorizontal: 14,
    borderRadius: 10,
    marginTop: 12,
  },
  logoutText: {
    marginLeft: 10,
    color: "#D32F2F",
    fontSize: 15,
    fontWeight: "700",
  },
});
