import { useTheme } from "@/theme/ThemeContext";
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

/* ---------------- ERROR TYPE FIX ---------------- */
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

  /* ---------------- VALIDATION ERRORS ---------------- */
  const [errors, setErrors] = useState<ErrorState>({});

  const validateStep3 = () => {
    let temp: ErrorState = {};

    if (!mobile.trim()) {
      temp.mobile = "कृपया मोबाइल नंबर दर्ज करें";
    } else if (!/^[6-9]\d{9}$/.test(mobile)) {
      temp.mobile = "मान्य 10 अंकों का मोबाइल नंबर दर्ज करें";
    }

    if (email.trim() && !/^\S+@\S+\.\S+$/.test(email)) {
      temp.email = "वैध ईमेल दर्ज करें";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3) {
      if (validateStep3()) {
        alert("All steps completed!");
      }
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  /* ---------------- STEP INDICATOR ---------------- */
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
                currentStep >= step ? theme.colors.btnPrimaryBg : "#EAEAEA",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{
                color: currentStep >= step ? "#fff" : "#777",
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
                  currentStep > step ? theme.colors.btnPrimaryBg : "#D6D6D6",
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
                // alignSelf: "center",
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
                color: theme.colors.colorPrimary700,
                marginBottom: 16,
              }}
            >
              अधिकारी विवरण
            </Text>

            <Text style={{ marginBottom: 6 }}>पूरा नाम</Text>
            <TextInput
              placeholder="अपना नाम लिखें"
              value={fullName}
              onChangeText={setFullName}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
              }}
            />

            <Text style={{ marginBottom: 6 }}>पद</Text>
            <TextInput
              value={position}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
              }}
            />

            <Text style={{ marginBottom: 6 }}>कर्मचारी कोड</Text>
            <TextInput
              value={empCode}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 30,
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
                // alignSelf: "center",
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

            <Text style={{ marginBottom: 6 }}>राज्य</Text>
            <TextInput
              value={state}
              onChangeText={setState}
              placeholder="राज्य दर्ज करें"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
              }}
            />

            <Text style={{ marginBottom: 6 }}>ज़िला</Text>
            <TextInput
              value={district}
              onChangeText={setDistrict}
              placeholder="ज़िला दर्ज करें"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
              }}
            />

            <Text style={{ marginBottom: 6 }}>ब्लॉक / थाना</Text>
            <TextInput
              value={block}
              onChangeText={setBlock}
              placeholder="ब्लॉक / थाना दर्ज करें"
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 18,
              }}
            />

            <Text style={{ marginBottom: 6 }}>टीम लीडर का नाम</Text>
            <TextInput
              value={teamLead}
              editable={false}
              style={{
                borderWidth: 1,
                borderColor: theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
                marginBottom: 30,
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
                // alignSelf: "center",
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

            {/* Mobile */}
            <Text style={{ marginBottom: 6 }}>मोबाइल नंबर</Text>
            <TextInput
              placeholder="मोबाइल नंबर दर्ज करें"
              keyboardType="numeric"
              value={mobile}
              onChangeText={setMobile}
              style={{
                borderWidth: 1,
                borderColor: errors.mobile ? "red" : theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
              }}
            />
            {errors.mobile && (
              <Text style={{ color: "red", marginTop: 4 }}>
                {errors.mobile}
              </Text>
            )}

            {/* Email */}
            <Text style={{ marginBottom: 6, marginTop: 18 }}>
              ईमेल (वैकल्पिक)
            </Text>
            <TextInput
              placeholder="ईमेल दर्ज करें"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              style={{
                borderWidth: 1,
                borderColor: errors.email ? "red" : theme.colors.inputBorder,
                backgroundColor: theme.colors.inputBg,
                height: 48,
                borderRadius: 12,
                paddingHorizontal: 12,
              }}
            />
            {errors.email && (
              <Text style={{ color: "red", marginTop: 4 }}>
                {errors.email}
              </Text>
            )}
          </>
        )}

        {/* ---------------- NEXT BUTTON ---------------- */}
        <TouchableOpacity
          onPress={handleNext}
          style={{
            backgroundColor: theme.colors.btnPrimaryBg,
            paddingVertical: 16,
            borderRadius: 30,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 32,
          }}
        >
          <Text
            style={{
              color: theme.colors.btnPrimaryText,
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
