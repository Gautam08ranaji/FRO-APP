import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const { theme } = useTheme();

  const [officerId, setOfficerId] = useState("");
  const [phone, setPhone] = useState("");

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.inner}>
        {/* Top Icon */}
        <View style={styles.iconWrapper}>
          <RemixIcon
            name="contract-right-line"
            size={28}
            color={theme.colors.btnPrimaryBg}
          />
        </View>

        {/* Title */}
        <Text
          style={[
            theme.typography.fontH1,
            styles.title,
            { color: theme.colors.primary },
          ]}
        >
          लॉगिन करें
        </Text>

        {/* Subtitle */}
        <Text
          style={[
            theme.typography.fontBodySmall,
            styles.subtitle,
            { color: theme.colors.colorTextSecondary },
          ]}
        >
          अपना ऑफिसर आईडी और मोबाइल नंबर दर्ज करें।
        </Text>

        {/* Officer ID */}
        <View style={styles.inputWrapper}>
          <Text
            style={[
              theme.typography.fontBodySmall,
              styles.label,
              { color: theme.colors.text },
            ]}
          >
            ऑफिसर आईडी
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
              },
            ]}
            placeholder="अपना ऑफिसर कोड दर्ज करें"
            placeholderTextColor={theme.colors.inputPlaceholder}
            value={officerId}
            onChangeText={setOfficerId}
          />
        </View>

        {/* Mobile Number */}
        <View style={styles.inputWrapper}>
          <Text
            style={[
              theme.typography.fontBodySmall,
              styles.label,
              { color: theme.colors.text },
            ]}
          >
            मोबाइल नंबर
          </Text>

          <TextInput
            style={[
              styles.input,
              {
                borderColor: theme.colors.border,
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
              },
            ]}
            placeholder="+91..."
            placeholderTextColor={theme.colors.inputPlaceholder}
            keyboardType="numeric"
            value={phone}
            onChangeText={(t) => setPhone(t.replace(/[^0-9]/g, ""))}
            maxLength={10}
          />
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.colors.btnPrimaryBg },
          ]}
          
            onPress={()=>{
              // console.log("hii");
              
              router.push('/(onboarding)/otpVerify')
            }}
        >
          <Text
            style={[
              theme.typography.fontButton,
              styles.buttonText,
              { color: theme.colors.btnPrimaryText },
            ]}

          >
            OTP भेजें
          </Text>
        </TouchableOpacity>

        {/* Forgot Password */}
        <TouchableOpacity style={{flexDirection:"row",justifyContent:"center",marginTop:20,gap:10,alignSelf:"center"}}>
           <RemixIcon
            name="question-line"
            size={18}
            color={theme.colors.btnPrimaryBg}
          />
          <Text
            style={[
              theme.typography.fontBodySmall,
              
              { color: theme.colors.primary ,},
            ]}
          >
            पासवर्ड भूल गए?
          </Text>
        </TouchableOpacity>

        {/* Contact Supervisor */}
        <TouchableOpacity style={{flexDirection:"row",justifyContent:"center",marginTop:20,gap:10,alignSelf:"center",marginLeft:10}}>
           <RemixIcon
            name="phone-line"
            size={18}
            color={theme.colors.btnPrimaryBg}
          />
          <Text
            style={[
              theme.typography.fontBodySmall,
              
              { color: theme.colors.primary,},
            ]}
          >
            सुपरवाइज़र से संपर्क करें
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  inner: { padding: 20, paddingTop:0 },

  iconWrapper: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#E5F4EE",
    alignItems: "center",
    justifyContent: "center",
    // marginTop: 40,
    marginBottom: 20,
  },

  title: { marginTop: 20,  },
  subtitle: { marginTop: 10, width: "100%" },

  inputWrapper: { width: "100%", marginTop: 35 },
  label: { marginBottom: 8 },

  input: {
    width: "100%",
    paddingVertical: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderRadius: 10,
    fontSize: 16,
  },

  button: {
    width: "100%",
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 35,
  },

  buttonText: { fontSize: 16, fontWeight: "600" },

  
});
