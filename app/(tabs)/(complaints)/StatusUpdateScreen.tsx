import BodyLayout from "@/components/layout/BodyLayout";
import ReusableButton from "@/components/reusables/ReusableButton";
import { useTheme } from "@/theme/ThemeContext";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import RemixIcon from "react-native-remix-icon";

const { width } = Dimensions.get("window");

type StepId = 1 | 2 | 3 | 4 | 5;

export default function StatusUpdateScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const typo = theme.typography;

  const [notes, setNotes] = useState("");
  const [step, setStep] = useState<StepId>(1);

 
  const renderStepIndicator = (id: StepId) => {
    const isCompleted = id < step;
    const isActive = id === step;

    const circleBg = isCompleted
      ? colors.colorPrimary600
      : colors.colorPrimary500 + "22";

    return (
      <TouchableOpacity
        key={id}
        onPress={() => setStep(id)}
        style={[
          styles.stepCircle,
          {
            backgroundColor: circleBg,
            borderColor: isActive ? colors.colorPrimary500 : "transparent",
          },
        ]}
        activeOpacity={0.7}
      >
        <Text
          style={[
            styles.stepText,
            {
              color: isCompleted ? "#fff" : colors.colorPrimary500,
            },
          ]}
        >
          {id}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <BodyLayout
      type="screen"
      screenName="स्थिति अपडेट करें"
      scrollContentStyle={{ paddingHorizontal: 0 }}
    >
      <View style={styles.container}>
        {/* STEP TABS */}
        <View style={styles.stepsRow}>
          {[1, 2, 3, 4, 5].map((id) => renderStepIndicator(id as StepId))}
        </View>

        {/* ---------------------- */}
        {/* STEP UI */}
        {/* ---------------------- */}
        {step === 1 && (
          <View style={styles.stepHolder}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: colors.colorPrimary500 + "22" },
              ]}
            >
              <RemixIcon
                name="checkbox-circle-line"
                size={40}
                color={colors.colorPrimary500}
              />
            </View>

            <Text style={[styles.title, { color: colors.colorPrimary500 }]}>
              मामला स्वीकृत
            </Text>

            <Text style={[styles.subtitle, { color: colors.colorTextSecondary }]}>
              मामला स्वीकार करें और आगे बढ़ें
            </Text>

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: colors.btnPrimaryBg },
              ]}
              onPress={() => setStep(2)}
            >
              <Text style={styles.primaryBtnText}>मामला स्वीकार करें</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 2 && (
          <View style={styles.stepHolder}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: colors.validationInfoText + "22" },
              ]}
            >
              <RemixIcon
                name="guide-line"
                size={40}
                color={colors.validationInfoText}
              />
            </View>

            <Text style={[styles.title, { color: colors.validationInfoText }]}>
              मैं रास्ते में हूँ
            </Text>

            <Text style={[styles.subtitle, { color: colors.colorTextSecondary }]}>
              आपका लोकेशन साझा किया जा रहा है।
            </Text>

            <View
              style={[
                styles.info,
                { backgroundColor: colors.validationInfoText + "22" },
              ]}
            >
              <Text style={[typo.fontToast, { color: colors.validationInfoText }]}>
                📍 आपकी लाइव लोकेशन ट्रैक की जा रही है
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: colors.btnPrimaryBg },
              ]}
              onPress={() => setStep(3)}
            >
              <Text style={styles.primaryBtnText}>स्थिति अपडेट करें</Text>
            </TouchableOpacity>
          </View>
        )}

        {step === 3 && (
          <View style={styles.stepHolder}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: colors.colorError400 + "22" },
              ]}
            >
              <RemixIcon
                name="map-pin-line"
                size={40}
                color={colors.colorError400}
              />
            </View>

            <Text style={[styles.title, { color: colors.colorError400 }]}>
              स्थल पर पहुँच गए?
            </Text>

            <Text style={[styles.subtitle, { color: colors.colorTextSecondary }]}>
              कृपया पुष्टि करें और कार्य शुरू करें।
            </Text>

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: colors.btnPrimaryBg },
              ]}
              onPress={() => setStep(4)}
            >
              <Text style={styles.primaryBtnText}>हाँ, पहुँच गया</Text>
            </TouchableOpacity>

            <ReusableButton
              title="नहीं, पता नहीं मिला"
              containerStyle={{
                width: "100%",
                backgroundColor: colors.colorBgSurface,
                borderColor: colors.colorAccent500,
                borderWidth: 1,
              }}
              textStyle={{ color: colors.colorAccent500 }}
            />
          </View>
        )}

        {step === 4 && (
          <View style={styles.stepHolder}>
            <View
              style={[
                styles.iconWrapper,
                { backgroundColor: colors.validationInfoText + "22" },
              ]}
            >
              <RemixIcon
                name="question-answer-line"
                size={40}
                color={colors.validationInfoText}
              />
            </View>

            <Text style={[styles.title, { color: colors.colorPrimary500 }]}>
              क्या वरिष्ठ नागरिक से संपर्क हुआ?
            </Text>

           

            <TouchableOpacity
              style={[
                styles.primaryBtn,
                { backgroundColor: colors.btnPrimaryBg },
              ]}
              onPress={() => setStep(5)}
            >
              <Text style={styles.primaryBtnText}>हाँ</Text>
            </TouchableOpacity>

            <ReusableButton title="नहीं" containerStyle={{ width: "100%" ,backgroundColor:colors.colorBgSurface,borderWidth:1,borderColor:colors.colorPrimary500}}
            textStyle={{color:colors.colorPrimary500}}
            onPress={()=>{
              setStep(3)
            }}
            />
          </View>
        )}

        {step === 5 && (
          <View style={styles.stepHolder}>
            <Text
              style={[
                typo.fontToast,
                { color: colors.colorPrimary500, alignSelf: "flex-start" },
              ]}
            >
              किए गए कार्य का विवरण
            </Text>

            <TextInput
              multiline
              placeholder="यहां लिखें..."
              value={notes}
              onChangeText={setNotes}
              style={[
                styles.notesBox,
                { borderColor: colors.colorPrimary500 },
              ]}
            />

            {/* ACTION ROW */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: colors.colorBgSurface,
                    borderWidth: 1,
                    borderColor: colors.colorPrimary500,
                  },
                ]}
                onPress={()=>{
                  router.push('/AddPhotoScreen')
                }}
              >
                <View style={styles.actionContent}>
                  <RemixIcon
                    name="camera-line"
                    size={18}
                    color={colors.colorPrimary500}
                  />
                  <Text style={[typo.fontToast, { color: colors.colorPrimary500 }]}>
                    फ़ोटो
                  </Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.actionBtn,
                  {
                    backgroundColor: colors.colorBgSurface,
                    borderWidth: 1,
                    borderColor: colors.colorAccent500,
                  },
                ]}
              >
                <View style={styles.actionContentAlt}>
                  <RemixIcon
                    name="mic-line"
                    size={18}
                    color={colors.colorAccent500}
                  />
                  <Text style={[typo.fontToast, { color: colors.colorAccent500 }]}>
                    वॉइस नोट
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <ReusableButton title="सेव करें और अपडेट करें" containerStyle={{ width: "100%" }} 
            onPress={ ()=>{
              setStep(1)
            }}
            />
          </View>
        )}
      </View>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: width * 0.05,
    paddingTop: 20,
    alignItems: "center",
    width: "100%",
  },

  stepsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 26,
    gap: width * 0.04,
  },

  stepCircle: {
    width: width * 0.11,
    height: width * 0.11,
    borderRadius: width * 0.055,
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
  },

  stepText: {
    fontSize: width * 0.045,
    fontWeight: "700",
  },

  stepHolder: {
    width: "100%",
    alignItems: "center",
  },

  iconWrapper: {
    width: width * 0.23,
    height: width * 0.23,
    borderRadius: width * 0.115,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: width * 0.055,
    fontWeight: "700",
    marginBottom: 6,
    textAlign: "center",
  },

  subtitle: {
    fontSize: width * 0.04,
    marginBottom: 20,
    textAlign: "center",
  },

  primaryBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  primaryBtnText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "700",
  },

  info: {
    width: "100%",
    padding: 16,
    borderRadius: 10,
    marginVertical: 10,
  },

  notesBox: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    height: width * 0.4,
    textAlignVertical: "top",
    backgroundColor: "#FFF",
  },

  actionRow: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    marginTop: 40,
    marginBottom: 15,
  },

  actionBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  actionContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionContentAlt: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
