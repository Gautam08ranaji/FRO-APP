import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

interface ErrorState {
  mobile?: string;
  email?: string;
}

export default function MultiStepScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [currentStep, setCurrentStep] = useState(1);

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

  /* VALIDATION */
  const validateStep3 = () => {
    let temp: ErrorState = {};

    const mobileClean = mobile.replace(/\D/g, "");
    if (!mobileClean) temp.mobile = t("profileSteps.mobileRequired");
    else if (!/^[6-9]\d{9}$/.test(mobileClean))
      temp.mobile = t("profileSteps.mobileInvalid");

    const emailClean = email.trim();
    if (emailClean && !/^\S+@\S+\.\S+$/.test(emailClean)) {
      temp.email = t("profileSteps.emailInvalid");
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  };

  const handleNext = () => {
    if (currentStep === 3 && !validateStep3()) return;
    if (currentStep === 3) router.push("/educationScreen");
    setCurrentStep(currentStep + 1);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.colorBgPage }]}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP INDICATOR */}
        <View style={styles.stepIndicatorRow}>
          {[1, 2, 3].map((step) => (
            <React.Fragment key={step}>
              <View
                style={[
                  styles.stepCircle,
                  {
                    backgroundColor:
                      currentStep >= step
                        ? theme.colors.btnPrimaryBg
                        : theme.colors.inputBorder,
                  },
                ]}
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
                  style={[
                    styles.stepLine,
                    {
                      backgroundColor:
                        currentStep > step
                          ? theme.colors.btnPrimaryBg
                          : theme.colors.inputBorder,
                    },
                  ]}
                />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* STEP 1 */}
        {currentStep === 1 && (
          <>
            <View style={styles.iconWrap}>
              <RemixIcon
                name="user-line"
                size={30}
                color={theme.colors.btnPrimaryBg}
              />
            </View>

            <Text style={[styles.stepTitle, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.step1Title")}
            </Text>

            {/* Full name */}
            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.fullName")}
            </Text>
            <TextInput
              placeholder={t("profileSteps.enterFullName")}
              value={fullName}
              onChangeText={setFullName}
              placeholderTextColor={theme.colors.colorOverlay}
              style={[
                styles.input,
                { borderColor: theme.colors.inputBorder, color: theme.colors.colorTextSecondary },
              ]}
            />

            {/* Position */}
            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.position")}
            </Text>
            <TextInput
              value={position}
              editable={false}
              style={[
                styles.input,
                { borderColor: theme.colors.inputBorder, color: theme.colors.colorTextSecondary },
              ]}
            />

            {/* Employee Code */}
            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.empCode")}
            </Text>
            <TextInput
              value={empCode}
              editable={false}
              style={[
                styles.input,
                { borderColor: theme.colors.inputBorder, color: theme.colors.colorTextSecondary },
              ]}
            />
          </>
        )}

        {/* STEP 2 */}
        {currentStep === 2 && (
          <>
            <View style={styles.iconWrap}>
              <RemixIcon
                name="map-pin-line"
                size={30}
                color={theme.colors.btnPrimaryBg}
              />
            </View>

            <Text style={[styles.stepTitle, { color: theme.colors.colorPrimary700 }]}>
              {t("profileSteps.step2Title")}
            </Text>

            <Text style={[styles.subtitle, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.step2Description")}
            </Text>

            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.state")}
            </Text>
            <TextInput
              placeholder={t("profileSteps.enterState")}
              value={state}
              onChangeText={setState}
              placeholderTextColor={theme.colors.colorOverlay}
              style={[
                styles.input,
                { borderColor: theme.colors.inputBorder, color: theme.colors.colorTextSecondary },
              ]}
            />

            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.district")}
            </Text>
            <TextInput
              placeholder={t("profileSteps.enterDistrict")}
              value={district}
              onChangeText={setDistrict}
              placeholderTextColor={theme.colors.colorOverlay}
              style={[
                styles.input,
                { borderColor: theme.colors.inputBorder, color: theme.colors.colorTextSecondary },
              ]}
            />

            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.block")}
            </Text>
            <TextInput
              placeholder={t("profileSteps.enterBlock")}
              value={block}
              onChangeText={setBlock}
              placeholderTextColor={theme.colors.colorOverlay}
              style={[
                styles.input,
                { borderColor: theme.colors.inputBorder, color: theme.colors.colorTextSecondary },
              ]}
            />

            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.teamLead")}
            </Text>
            <TextInput
              value={teamLead}
              editable={false}
              style={[
                styles.input,
                { borderColor: theme.colors.inputBorder, color: theme.colors.colorTextSecondary },
              ]}
            />
          </>
        )}

        {/* STEP 3 */}
        {currentStep === 3 && (
          <>
            <View style={styles.iconWrap}>
              <RemixIcon
                name="phone-line"
                size={30}
                color={theme.colors.btnPrimaryBg}
              />
            </View>

            <Text style={[styles.stepTitle, { color: theme.colors.colorPrimary700 }]}>
              {t("profileSteps.step3Title")}
            </Text>

            {/* MOBILE */}
            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.mobile")}
            </Text>
            <TextInput
              placeholder={t("profileSteps.enterMobile")}
              keyboardType="number-pad"
              maxLength={10}
              value={mobile}
              onChangeText={(text) => setMobile(text.replace(/\D/g, ""))}
              placeholderTextColor={theme.colors.colorOverlay}
              style={[
                styles.input,
                {
                  borderColor: errors.mobile
                    ? "red"
                    : theme.colors.inputBorder,
                  color: theme.colors.colorTextSecondary,
                },
              ]}
            />
            {errors.mobile && <Text style={styles.error}>{errors.mobile}</Text>}

            {/* EMAIL */}
            <Text style={[styles.label, { color: theme.colors.colorTextSecondary }]}>
              {t("profileSteps.email")}
            </Text>
            <TextInput
              placeholder={t("profileSteps.enterEmail")}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
              onChangeText={setEmail}
              placeholderTextColor={theme.colors.colorOverlay}
              style={[
                styles.input,
                {
                  borderColor: errors.email
                    ? "red"
                    : theme.colors.inputBorder,
                  color: theme.colors.colorTextSecondary,
                },
              ]}
            />
            {errors.email && <Text style={styles.error}>{errors.email}</Text>}
          </>
        )}

        {/* NEXT BUTTON */}
        <TouchableOpacity
          onPress={handleNext}
          style={[
            styles.nextButton,
            { backgroundColor: theme.colors.btnPrimaryBg },
          ]}
        >
          <Text
            style={[
              styles.nextButtonText,
              { color: theme.colors.colorBgPage },
            ]}
          >
            {currentStep === 3
              ? t("profileSteps.submit")
              : t("profileSteps.next")}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

/* -------------------- STYLE SHEET -------------------- */

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { padding: 20, paddingBottom: 40 },

  stepIndicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 30,
    alignItems: "center",
  },
  stepCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: "center",
    alignItems: "center",
  },
  stepLine: {
    width: 40,
    height: 2,
    marginHorizontal: 6,
  },

  iconWrap: {
    width: 70,
    height: 70,
    borderRadius: 50,
    backgroundColor: "#E5F4EE",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },

  stepTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },

  subtitle: {
    fontSize: 14,
    marginBottom: 24,
  },

  label: {
    marginBottom: 6,
    fontSize: 14,
    fontWeight: "500",
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 18,
    fontSize: 15,
  },

  error: {
    color: "red",
    marginTop: -10,
    marginBottom: 14,
    fontSize: 13,
  },

  nextButton: {
    borderRadius: 30,
    paddingVertical: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 32,
  },

  nextButtonText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
