// app/(onboarding)/profile.tsx

import { useTheme } from "@/theme/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useRouter } from "expo-router";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { theme } = useTheme();

  const [loading, setLoading] = useState(false);

  // Step control: 1 = profile, 2 = address
const [step, setStep] = useState<1 | 2 | 3>(1);



  // Step 1 state
  const [name, setName] = useState("");
  const [age, setAge] = useState<string>("");
  const [mobile, setMobile] = useState("");
  const [gender, setGender] = useState("");
  const [genderOpen, setGenderOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  // Step 2 state (address)
  const countries = useMemo(() => ["India"], []);

  const statesMap: Record<string, string[]> = {
    India: ["Delhi", "Uttar Pradesh", "Maharashtra"],
  };

  const citiesMap: Record<string, string[]> = {
    Delhi: ["New Delhi", "Dwarka", "Rohini"],
    "Uttar Pradesh": ["Noida", "Lucknow", "Varanasi"],
    Maharashtra: ["Mumbai", "Pune", "Nagpur"],
  };

  const [country, setCountry] = useState<string>("India");
  const [stateName, setStateName] = useState<string>(statesMap["India"][0]);
  const [city, setCity] = useState<string>(citiesMap[statesMap["India"][0]][0]);
  const [countryOpen, setCountryOpen] = useState(false);
  const [stateOpen, setStateOpen] = useState(false);
  const [cityOpen, setCityOpen] = useState(false);

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  // Validation state (combined)
  const [errors, setErrors] = useState({
    name: "",
    age: "",
    gender: "",
    mobile: "",
    country: "",
    stateName: "",
    city: "",
    addressLine1: "",
    landmark: "",
  });

  const { width } = Dimensions.get("window");

  // Update dependent lists when country/state change
  const availableStates = statesMap[country] || [];
  const availableCities = citiesMap[stateName] || [];


  // Auto-navigate to dashboard after success screen
React.useEffect(() => {
  if (step === 3) {
    const timeout = setTimeout(() => {
      router.replace("/(tabs)/(dashboard)");   // ⬅ correct expo-router navigation
    }, 1500); // wait 1.5s so user can see the success screen

    return () => clearTimeout(timeout);
  }
}, [step]);


  // Date selection handler
  const onSelectDate = (_event: any, date: any) => {
    // hide picker for both platforms when change
    setShowPicker(false);
    if (date) {
      // Format date as DD/MM/YYYY (en-GB)
      const formattedDate = date.toLocaleDateString("en-GB");
      setAge(formattedDate);
      if (errors.age) setErrors({ ...errors, age: "" });
    }
  };

  // Step 1 validation and proceed to step 2
  const handleContinueStep1 = () => {
    let newErrors = { ...errors };
    let isValid = true;

    if (!name.trim()) {
      newErrors.name = t("profile.nameError") || "कृपया पूरा नाम दर्ज करें";
      isValid = false;
    } else {
      newErrors.name = "";
    }

    if (!age) {
      newErrors.age = t("profile.dobError") || "कृपया जन्मतिथि चुनें";
      isValid = false;
    } else {
      newErrors.age = "";
    }

    if (!gender) {
      newErrors.gender = t("profile.genderError") || "कृपया लिंग चुनें";
      isValid = false;
    } else {
      newErrors.gender = "";
    }

    if (!mobile || mobile.length !== 10) {
      newErrors.mobile =
        t("profile.contError") || "कृपया सही फोन नंबर (10 अंक) दें";
      isValid = false;
    } else {
      newErrors.mobile = "";
    }

    setErrors(newErrors);

    if (!isValid) return;

    // proceed to step 2
    setStep(2);
  };

  // Step 2 validation and final submit (shows success message per user choice)
  const handleSubmitAddress = () => {
    let newErrors = { ...errors };
    let isValid = true;

    if (!country) {
      newErrors.country = "कृपया देश चुनें";
      isValid = false;
    } else newErrors.country = "";

    if (!stateName) {
      newErrors.stateName =  t("profile.stateError");
      isValid = false;
    } else newErrors.stateName = "";

    if (!city) {
      newErrors.city = t("profile.cityError");
      isValid = false;
    } else newErrors.city = "";

    if (!addressLine1.trim()) {
      newErrors.addressLine1 = t("profile.addressError");
      isValid = false;
    } else newErrors.addressLine1 = "";

    if (!landmark.trim()) {
      newErrors.landmark = t("profile.landmarkError");
      isValid = false;
    } else newErrors.landmark = "";

    setErrors(newErrors);

    if (!isValid) return;

    // show loading, then success alert (you chose option C)
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setStep(3);
    }, 900);
  };

  // Back to step1
  const handleBackToStep1 = () => {
    setStep(1);
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: theme.colors.btnPrimaryText,
          paddingHorizontal: width * 0.05,
        },
      ]}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      >

         {step !== 3 && (
          <>
 <View style={styles.headerContainer}>
          {/* SHOW ONLY IF LANGUAGE IS NOT ENGLISH */}
          {i18n.language !== "en" && (
            <Text
              style={[
                theme.typography.fontH1,
                {
                  color: theme.colors.btnPrimaryBg,
                  textAlign: "center",
                  marginBottom: 8,
                },
              ]}
            >
              {step === 1 ? t("profile.title") : t("profile.title1")}
            </Text>
          )}

          {/* ENGLISH TITLE (ALWAYS SHOWN) */}
          <Text
            style={[
              theme.typography.fontH1,
              {
                color: theme.colors.btnPrimaryBg,
                textAlign: "center",
                marginBottom: 8,
              },
            ]}
          >
            {step === 1 ? "Setup Profile" : "Setup Address"}
          </Text>

          <Text
            style={[
              theme.typography.fontBodySmall,
              {
                color: theme.colors.colorTextSecondary,
                textAlign: "center",
                marginBottom: 20,
              },
            ]}
          >
            {step === 1
              ? t("profile.subtitle1")
              : "सभी पता विवरण आपके GPS से पहले ही ले लिए गए हैं, आप इसे मैन्युअली बदल सकते हैं। इससे हमारी टीम बिना किसी देरी या गलती के मदद भेज सकती है।"}
          </Text>
        </View>

        {/* ---- STEP 1: PROFILE ---- */}
        {step === 1 && (
          <View style={{ width: "100%", marginBottom: 20 }}>
            {/* NAME */}
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.name
                    ? theme.colors.inputErrorBorder
                    : theme.colors.inputFocusBorder,
                  backgroundColor: theme.colors.card,
                  color: theme.colors.colorTextPrimary,
                },
              ]}
              placeholder={t("profile.name")}
              placeholderTextColor={theme.colors.colorTextSecondary}
              value={name}
              onChangeText={(tVal) => {
                setName(tVal);
                if (errors.name) setErrors({ ...errors, name: "" });
              }}
            />
            {errors.name ? (
              <Text
                style={{
                  color: theme.colors.inputErrorBorder,
                  marginBottom: 10,
                  marginLeft: 4,
                }}
              >
                {errors.name}
              </Text>
            ) : null}

            {/* AGE PICKER */}
            <TouchableOpacity
              style={[
                styles.input,
                {
                  borderColor: errors.age
                    ? theme.colors.inputErrorBorder
                    : theme.colors.inputFocusBorder,
                  backgroundColor: theme.colors.card,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                },
              ]}
              onPress={() => setShowPicker(true)}
            >
              <Text
                style={{
                  color: age
                    ? theme.colors.colorTextPrimary
                    : theme.colors.colorTextSecondary,
                }}
              >
                {age ? `${age}` : t("profile.dob")}
              </Text>
              <Ionicons
                name="calendar"
                size={20}
                color={theme.colors.btnPrimaryBg}
              />
            </TouchableOpacity>
            {errors.age ? (
              <Text
                style={{
                  color: theme.colors.inputErrorBorder,
                  marginBottom: 10,
                  marginLeft: 4,
                }}
              >
                {errors.age}
              </Text>
            ) : null}

            {showPicker && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display={Platform.OS === "ios" ? "inline" : "default"}
                maximumDate={new Date()}
                onChange={onSelectDate}
              />
            )}

            {/* GENDER DROPDOWN */}
            <TouchableOpacity
              style={[
                styles.input,
                {
                  borderColor: errors.gender
                    ? theme.colors.inputErrorBorder
                    : theme.colors.inputFocusBorder,
                  backgroundColor: theme.colors.card,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
              onPress={() => setGenderOpen(!genderOpen)}
            >
              <Text
                style={{
                  color: gender
                    ? theme.colors.colorTextPrimary
                    : theme.colors.colorTextSecondary,
                }}
              >
                {gender || t("profile.gender")}
              </Text>
              <Ionicons
                name={genderOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.btnPrimaryBg}
              />
            </TouchableOpacity>
            {errors.gender ? (
              <Text
                style={{
                  color: theme.colors.inputErrorBorder,
                  marginBottom: 10,
                  marginLeft: 4,
                }}
              >
                {errors.gender}
              </Text>
            ) : null}

            {genderOpen && (
              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: theme.colors.inputFocusBorder,
                  borderRadius: 10,
                  marginTop: -10,
                  backgroundColor: theme.colors.card,
                }}
              >
                {["पुरुष", "महिला", "अन्य"].map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={{
                      padding: 14,
                      borderBottomWidth: g === "अन्य" ? 0 : 1,
                      borderColor: theme.colors.border,
                    }}
                    onPress={() => {
                      setGender(g);
                      setErrors({ ...errors, gender: "" });
                      setGenderOpen(false);
                    }}
                  >
                    <Text
                      style={[
                        theme.typography.fontBody,
                        { color: theme.colors.colorTextPrimary },
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* MOBILE NUMBER */}
            <TextInput
              style={[
                styles.input,
                {
                  borderColor: errors.mobile
                    ? theme.colors.inputErrorBorder
                    : theme.colors.inputFocusBorder,
                  backgroundColor: theme.colors.card,
                  color: theme.colors.colorTextPrimary,
                },
              ]}
              placeholder={t("profile.emergCont")}
              placeholderTextColor={theme.colors.colorTextSecondary}
              value={mobile}
              onChangeText={(tVal) => {
                setMobile(tVal.replace(/[^0-9]/g, ""));
                if (errors.mobile) setErrors({ ...errors, mobile: "" });
              }}
              maxLength={10}
              keyboardType="numeric"
            />
            {errors.mobile ? (
              <Text
                style={{
                  color: theme.colors.inputErrorBorder,
                  marginBottom: 10,
                  marginLeft: 4,
                }}
              >
                {errors.mobile}
              </Text>
            ) : null}
          </View>
        )}

        {/* ---- STEP 2: ADDRESS ---- */}
        {step === 2 && (
          <View style={{ width: "100%", marginBottom: 20 }}>
            {/* SECTION 1 - Select Location */}
            <Text
              style={[
                theme.typography.fontH2,
                { color: theme.colors.colorTextPrimary, marginBottom: 8 },
              ]}
            >
              {t("profile.selectLocation")}
            </Text>

            {/* Country */}
            {/* Country (Disabled Dropdown) */}
            <View
              style={[
                styles.input,
                {
                  borderColor: theme.colors.inputFocusBorder,
                  backgroundColor: theme.colors.card,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  opacity: 0.6, // visually disabled
                },
              ]}
              pointerEvents="none" // blocks all touch events
            >
              <Text
                style={{
                  color: theme.colors.colorTextPrimary,
                }}
              >
                {country}
              </Text>
              <Ionicons
                name="lock-closed" // show lock icon instead of dropdown
                size={20}
                color={theme.colors.btnPrimaryBg}
              />
            </View>

            {errors.country ? (
              <Text
                style={{
                  color: theme.colors.inputErrorBorder,
                  marginBottom: 10,
                  marginLeft: 4,
                }}
              >
                {errors.country}
              </Text>
            ) : null}
            {countryOpen && (
              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: theme.colors.inputFocusBorder,
                  borderRadius: 10,
                  marginTop: -10,
                  backgroundColor: theme.colors.card,
                }}
              >
                {countries.map((c) => (
                  <TouchableOpacity
                    key={c}
                    disabled={true}
                    style={{
                      padding: 14,
                      borderBottomWidth:
                        c === countries[countries.length - 1] ? 0 : 1,
                      borderColor: theme.colors.border,
                      opacity: 0.5,
                    }}
                    onPress={() => {
                      setCountry(c);
                      setCountryOpen(false);
                      // reset state & city based on selection
                      const firstState = statesMap[c]?.[0] || "";
                      setStateName(firstState);
                      setCity(citiesMap[firstState]?.[0] || "");
                      setErrors({
                        ...errors,
                        country: "",
                        stateName: "",
                        city: "",
                      });
                    }}
                  >
                    <Text
                      style={[
                        theme.typography.fontBody,
                        { color: theme.colors.colorTextPrimary },
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* State */}
            <TouchableOpacity
              style={[
                styles.input,
                {
                  borderColor: errors.stateName
                    ? theme.colors.inputErrorBorder
                    : theme.colors.inputFocusBorder,
                  backgroundColor: theme.colors.card,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
              onPress={() => {
                setStateOpen(!stateOpen);
                setCountryOpen(false);
                setCityOpen(false);
              }}
            >
              <Text
                style={{
                  color: stateName
                    ? theme.colors.colorTextPrimary
                    : theme.colors.colorTextSecondary,
                }}
              >
                {stateName || t("profile.state")}
              </Text>
              <Ionicons
                name={stateOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.btnPrimaryBg}
              />
            </TouchableOpacity>
            {errors.stateName ? (
              <Text
                style={{
                  color: theme.colors.inputErrorBorder,
                  marginBottom: 10,
                  marginLeft: 4,
                }}
              >
                {errors.stateName}
              </Text>
            ) : null}
            {stateOpen && (
              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: theme.colors.inputFocusBorder,
                  borderRadius: 10,
                  marginTop: -10,
                  backgroundColor: theme.colors.card,
                }}
              >
                {availableStates.map((s) => (
                  <TouchableOpacity
                    key={s}
                    style={{
                      padding: 14,
                      borderBottomWidth:
                        s === availableStates[availableStates.length - 1]
                          ? 0
                          : 1,
                      borderColor: theme.colors.border,
                    }}
                    onPress={() => {
                      setStateName(s);
                      setStateOpen(false);
                      // reset city when state changes
                      setCity(citiesMap[s]?.[0] || "");
                      setErrors({ ...errors, stateName: "", city: "" });
                    }}
                  >
                    <Text
                      style={[
                        theme.typography.fontBody,
                        { color: theme.colors.colorTextPrimary },
                      ]}
                    >
                      {s}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* City */}
            <TouchableOpacity
              style={[
                styles.input,
                {
                  borderColor: errors.city
                    ? theme.colors.inputErrorBorder
                    : theme.colors.inputFocusBorder,
                  backgroundColor: theme.colors.card,
                  flexDirection: "row",
                  justifyContent: "space-between",
                },
              ]}
              onPress={() => {
                setCityOpen(!cityOpen);
                setStateOpen(false);
                setCountryOpen(false);
              }}
            >
              <Text
                style={{
                  color: city
                    ? theme.colors.colorTextPrimary
                    : theme.colors.colorTextSecondary,
                }}
              >
                {city || t("profile.city")}
              </Text>
              <Ionicons
                name={cityOpen ? "chevron-up" : "chevron-down"}
                size={20}
                color={theme.colors.btnPrimaryBg}
              />
            </TouchableOpacity>
            {errors.city ? (
              <Text
                style={{
                  color: theme.colors.inputErrorBorder,
                  marginBottom: 10,
                  marginLeft: 4,
                }}
              >
                {errors.city}
              </Text>
            ) : null}
            {cityOpen && (
              <View
                style={{
                  borderWidth: 1.5,
                  borderColor: theme.colors.inputFocusBorder,
                  borderRadius: 10,
                  marginTop: -10,
                  backgroundColor: theme.colors.card,
                }}
              >
                {availableCities.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={{
                      padding: 14,
                      borderBottomWidth:
                        c === availableCities[availableCities.length - 1]
                          ? 0
                          : 1,
                      borderColor: theme.colors.border,
                    }}
                    onPress={() => {
                      setCity(c);
                      setCityOpen(false);
                      setErrors({ ...errors, city: "" });
                    }}
                  >
                    <Text
                      style={[
                        theme.typography.fontBody,
                        { color: theme.colors.colorTextPrimary },
                      ]}
                    >
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {/* SECTION 2 - Address Details */}
            <View style={{ marginTop: 18 }}>
              <Text
                style={[
                  theme.typography.fontH2,
                  { color: theme.colors.colorTextPrimary, marginBottom: 8 },
                ]}
              >
                {t("profile.addressdetails")}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.addressLine1
                      ? theme.colors.inputErrorBorder
                      : theme.colors.inputFocusBorder,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.colorTextPrimary,
                  },
                ]}
                placeholder={t("profile.line1")}
                placeholderTextColor={theme.colors.colorTextSecondary}
                value={addressLine1}
                onChangeText={(tVal) => {
                  setAddressLine1(tVal);
                  if (errors.addressLine1)
                    setErrors({ ...errors, addressLine1: "" });
                }}
              />
              {errors.addressLine1 ? (
                <Text
                  style={{
                    color: theme.colors.inputErrorBorder,
                    marginBottom: 10,
                    marginLeft: 4,
                  }}
                >
                  {errors.addressLine1}
                </Text>
              ) : null}

              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.inputFocusBorder,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.colorTextPrimary,
                  },
                ]}
                placeholder={t("profile.line2")}
                placeholderTextColor={theme.colors.colorTextSecondary}
                value={addressLine2}
                onChangeText={setAddressLine2}
              />
            </View>

            {/* SECTION 3 - Landmark & Additional Info */}
            <View style={{ marginTop: 18 }}>
              <Text
                style={[
                  theme.typography.fontH2,
                  { color: theme.colors.colorTextPrimary, marginBottom: 8 },
                ]}
              >
                {t("profile.Landmark")}
              </Text>

              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: errors.landmark
                      ? theme.colors.inputErrorBorder
                      : theme.colors.inputFocusBorder,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.colorTextPrimary,
                  },
                ]}
                placeholder={t("profile.Landmark1")}
                placeholderTextColor={theme.colors.colorTextSecondary}
                value={landmark}
                onChangeText={(tVal) => {
                  setLandmark(tVal);
                  if (errors.landmark) setErrors({ ...errors, landmark: "" });
                }}
              />
              {errors.landmark ? (
                <Text
                  style={{
                    color: theme.colors.inputErrorBorder,
                    marginBottom: 10,
                    marginLeft: 4,
                  }}
                >
                  {errors.landmark}
                </Text>
              ) : null}

              <TextInput
                style={[
                  styles.input,
                  {
                    borderColor: theme.colors.inputFocusBorder,
                    backgroundColor: theme.colors.card,
                    color: theme.colors.colorTextPrimary,
                  },
                ]}
                placeholder={t("profile.additionalInfo")}
                placeholderTextColor={theme.colors.colorTextSecondary}
                value={additionalInfo}
                onChangeText={setAdditionalInfo}
              />
            </View>
          </View>
        )}

        {/* FOOTER ACTIONS (Continue / Back / Submit) */}
        <View style={{ marginTop: 8 }}>
          {step === 1 ? (
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: theme.colors.btnPrimaryBg },
                loading && { opacity: 0.6 },
              ]}
              onPress={handleContinueStep1}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={theme.colors.btnPrimaryText} />
              ) : (
                <Text
                  style={[
                    theme.typography.fontButton,
                    { color: theme.colors.btnPrimaryText },
                  ]}
                >
                  {t("profile.button1")}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: 12,
                }}
              >
                <TouchableOpacity
                  style={[
                    styles.button,
                    {
                      backgroundColor: theme.colors.card,
                      flex: 1,
                      borderWidth: 1,
                      borderColor: theme.colors.inputFocusBorder,
                    },
                  ]}
                  onPress={handleBackToStep1}
                >
                  <Text
                    style={[
                      theme.typography.fontButton,
                      { color: theme.colors.colorTextPrimary },
                    ]}
                  >
                     {t("button.back")}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.button,
                    { backgroundColor: theme.colors.btnPrimaryBg, flex: 1 },
                    loading && { opacity: 0.6 },
                  ]}
                  onPress={handleSubmitAddress}
                  disabled={loading}
                >
                  {loading ? (
                    <ActivityIndicator color={theme.colors.btnPrimaryText} />
                  ) : (
                    <Text
                      style={[
                        theme.typography.fontButton,
                        { color: theme.colors.btnPrimaryText },
                      ]}
                    >
                      {t("button.continue")}
                    </Text>
                  )}
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
          </>)}
        {/* HEADER */}
       

        {/* ---- STEP 3: SUCCESS UI ---- */}
{step === 3 && (
  <View style={{ width: "100%", alignItems: "center", marginTop: 120 }}>

    <View
      style={[
        styles.tickWrapper,
        { backgroundColor: theme.colors.btnPrimaryBg + "22" },
      ]}
    >
      <Text
        style={[
          theme.typography.fontH1,
          { fontSize: 48, color: theme.colors.btnPrimaryBg },
        ]}
      >
        ✓
      </Text>
    </View>

    <Text
      style={[
        theme.typography.fontH1,
        {
          color: theme.colors.btnPrimaryBg,
          textAlign: "center",
          // lineHeight: 30,
          marginBottom: 20,
        },
      ]}
    >
      {name}{t("profileSuccess.welcome") ||
        "आपकी प्रोफ़ाइल सफलतापूर्वक बनाई गई।"}
    </Text>
    <Text
      style={[
        theme.typography.fontH2,
        {
          color: theme.colors.btnPrimaryBg,
          textAlign: "center",
          lineHeight: 30,
          marginBottom: 20,
        },
      ]}
    >
      {t("profileSuccess.message") ||
        "आपकी प्रोफ़ाइल सफलतापूर्वक बनाई गई।"}
    </Text>

  
  </View>
)}

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 40 },
  headerContainer: { alignItems: "center", marginBottom: 30 },

  input: {
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginBottom: 15,
  },

  button: {
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    elevation: 3,
  },
  tickWrapper: {
  width: 110,
  height: 110,
  borderRadius: 55,
  alignItems: "center",
  justifyContent: "center",
  marginBottom: 20,
},buttonText: {
  textAlign: "center",
},


});
