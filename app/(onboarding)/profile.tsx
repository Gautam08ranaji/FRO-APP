import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

/* ---------------- ERROR TYPE ---------------- */
interface ErrorState {
  mobile?: string;
  email?: string;
}

export default function MultiStepScreen() {
  const { theme } = useTheme();

  const [currentStep, setCurrentStep] = useState(1);

  /* ---------------- FORM STATES ---------------- */
  const [fullName, setFullName] = useState("");
  const [position] = useState("FRO - फील्ड रिस्पॉन्स ऑफिसर");
  const [empCode] = useState("FRO-14567-001");

  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [block, setBlock] = useState("");
  const [teamLead] = useState("राजेश कुमार");

  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");

  const [errors, setErrors] = useState<ErrorState>({});

  const validateStep3 = () => {
    let temp: ErrorState = {};

    const cleanMobile = mobile.replace(/\D/g, "");

    if (!cleanMobile) {
      temp.mobile = "कृपया मोबाइल नंबर दर्ज करें";
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      temp.mobile = "मान्य 10 अंकों का मोबाइल नंबर दर्ज करें";
    }

    const cleanEmail = email.trim();

    if (cleanEmail && !/^\S+@\S+\.\S+$/.test(cleanEmail)) {
      temp.email = "वैध ईमेल दर्ज करें";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      router.push("/educationScreen");
    }
    setCurrentStep(currentStep + 1);
  };

  const renderStepIndicator = () => (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 30,
        alignItems: "center",
      }}
    >
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <View
            style={{
              width: 34,
              height: 34,
              borderRadius: 17,
              backgroundColor:
                currentStep >= step
                  ? theme.colors.btnPrimaryBg
                  : theme.colors.inputBorder,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color:
                  currentStep >= step
                    ? theme.colors.colorBgPage
                    : theme.colors.colorTextSecondary,
                fontWeight: "700",
              }}
            >
              {step}
            </Text>
          </View>

          {step !== 3 && (
            <View
              style={{
                width: 40,
                height: 2,
                backgroundColor:
                  currentStep > step
                    ? theme.colors.btnPrimaryBg
                    : theme.colors.inputBorder,
                marginHorizontal: 6,
              }}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.colorBgPage,
      }}
    >
      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {renderStepIndicator()}

        {/* ---------------- STEP 1 ---------------- */}
        {currentStep === 1 && (
          <>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 50,
                backgroundColor: "#E5F4EE",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <RemixIcon
                name="user-line"
                size={30}
                color={theme.colors.btnPrimaryBg}
              />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: theme.colors.colorTextSecondary,
                marginBottom: 16,
              }}
            >
              अधिकारी विवरण
            </Text>

            <Text style={{ marginBottom: 6 ,color:theme.colors.colorTextSecondary }}>पूरा नाम</Text>
            <TextInput
              placeholder="अपना नाम लिखें"
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={theme.colors.colorOverlay}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
                color:theme.colors.colorTextSecondary 
              }}
            />

            <Text style={{ marginBottom: 6 ,color:theme.colors.colorTextSecondary }}>पद</Text>
            <TextInput
              value={position}
              editable={false}
              placeholderTextColor={theme.colors.colorOverlay}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
                color:theme.colors.colorTextSecondary 
              }}
            />

            <Text style={{ marginBottom: 6,color:theme.colors.colorTextSecondary  }}>कर्मचारी कोड</Text>
            <TextInput
              value={empCode}
              editable={false}
              placeholderTextColor={theme.colors.colorOverlay}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 30,
                color:theme.colors.colorTextSecondary 
              }}
            />
          </>
        )}

        {/* ---------------- STEP 2 ---------------- */}
        {currentStep === 2 && (
          <>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 50,
                backgroundColor: "#E5F4EE",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
              }}
            >
              <RemixIcon
                name="map-pin-line"
                size={30}
                color={theme.colors.btnPrimaryBg}
              />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: theme.colors.colorPrimary700,
                marginBottom: 4,
              }}
            >
              आपका कार्यक्षेत्र
            </Text>

            <Text
              style={{
                fontSize: 14,
                color: theme.colors.colorTextSecondary,
                marginBottom: 24,
              }}
            >
              कृपया अपना कार्यक्षेत्र चुनें ताकि आपको सही मामले भेजे जा सकें।
            </Text>

            <Text style={{ marginBottom: 6 ,color:theme.colors.colorTextSecondary }}>राज्य</Text>
            <TextInput
              value={state}
              onChangeText={setState}
              placeholder="राज्य दर्ज करें"
              placeholderTextColor={theme.colors.colorOverlay}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
                color:theme.colors.colorTextSecondary 
              }}
            />

            <Text style={{ marginBottom: 6,color:theme.colors.colorTextSecondary  }}>ज़िला</Text>
            <TextInput
              value={district}
              onChangeText={setDistrict}
              placeholderTextColor={theme.colors.colorOverlay}
              placeholder="ज़िला दर्ज करें"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
                color:theme.colors.colorTextSecondary 
              }}
            />

            <Text style={{ marginBottom: 6,color:theme.colors.colorTextSecondary  }}>ब्लॉक / थाना</Text>
            <TextInput
              value={block}
              onChangeText={setBlock}
              placeholderTextColor={theme.colors.colorOverlay}
              placeholder="ब्लॉक / थाना दर्ज करें"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
                color:theme.colors.colorTextSecondary 
              }}
            />

            <Text style={{ marginBottom: 6 ,color:theme.colors.colorTextSecondary }}>टीम लीडर का नाम</Text>
            <TextInput
              value={teamLead}
              editable={false}
              placeholderTextColor={theme.colors.colorOverlay}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 30,
                color:theme.colors.colorTextSecondary 
              }}
            />
          </>
        )}

        {/* ---------------- STEP 3 ---------------- */}
        {currentStep === 3 && (
          <>
            <View
              style={{
                width: 70,
                height: 70,
                borderRadius: 50,
                backgroundColor: "#E5F4EE",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 16,
                
              }}
            >
              <RemixIcon
                name="phone-line"
                size={30}
                color={theme.colors.btnPrimaryBg}
              />
            </View>

            <Text
              style={{
                fontSize: 20,
                fontWeight: "700",
                color: theme.colors.colorPrimary700,
                marginBottom: 20,
              }}
            >
              संपर्क विवरण
            </Text>

            {/* MOBILE */}
            <Text style={{ marginBottom: 6 ,color:theme.colors.colorTextSecondary }}>मोबाइल नंबर</Text>
            <TextInput
              placeholder="मोबाइल नंबर दर्ज करें"
              keyboardType="number-pad"
              placeholderTextColor={theme.colors.colorOverlay}
              value={mobile}
              maxLength={10}
              onChangeText={(text) => setMobile(text.replace(/\D/g, ""))}
              style={{
                borderWidth: 1,
                borderColor: errors.mobile ? "red" : theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                color:theme.colors.colorTextSecondary 
              }}
            />
            {errors.mobile && (
              <Text style={{ color: "red", marginTop: 4 }}>
                {errors.mobile}
              </Text>
            )}

            {/* EMAIL */}
            <Text style={{ marginBottom: 6, marginTop: 18 ,color:theme.colors.colorTextSecondary }}>
              ईमेल (वैकल्पिक)
            </Text>
            <TextInput
              placeholder="ईमेल दर्ज करें"
              keyboardType="email-address"
              placeholderTextColor={theme.colors.colorOverlay}
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                borderColor: errors.email ? "red" : theme.colors.inputBorder,
                backgroundColor: theme.colors.colorBgPage,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                color:theme.colors.colorTextSecondary 
              }}
            />
            {errors.email && (
              <Text style={{ color: "red", marginTop: 4 }}>{errors.email}</Text>
            )}
          </>
        )}

        {/* ---------------- NEXT BUTTON ---------------- */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: theme.colors.btnPrimaryBg,
            borderRadius: 30,
            paddingVertical: 16,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <Text
            style={{
              color: theme.colors.colorBgPage,
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            {currentStep === 3 ? "सबमिट करें" : "आगे बढ़ें"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
