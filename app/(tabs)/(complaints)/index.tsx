import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { Audio } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import RemixIcon from "react-native-remix-icon";

export default function ComplaintsScreen() {
  const { theme } = useTheme();
  const screenWidth = Dimensions.get("window").width;
  const [activeTab, setActiveTab] = useState<"register" | "myComplaints">(
    "register"
  );

  return (
    <BodyLayout>
      {/* ---------------- TOP TABS ---------------- */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "register" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("register")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "register" && styles.activeTabText,
            ]}
          >
            शिकायत दर्ज करें
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.tabButton,
            activeTab === "myComplaints" && styles.activeTabButton,
          ]}
          onPress={() => setActiveTab("myComplaints")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "myComplaints" && styles.activeTabText,
            ]}
          >
            मेरी शिकायतें
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === "register" ? <RegisterComplaintUI /> : <MyComplaintsUI />}
    </BodyLayout>
  );
}

/* ===========================================================
                      REGISTER TAB UI
   =========================================================== */

function RegisterComplaintUI() {
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);

  const dropdownOptions = [
    "उत्पीड़न",
    "उपेक्षा",
    "चिकित्सीय सहायता",
    "मानसिक तनाव",
    "घरेलू परेशानी",
    "अन्य",
  ];

  // File / Image
  const [fileAttachment, setFileAttachment] = useState<
    DocumentPicker.DocumentPickerAsset | ImagePicker.ImagePickerAsset | null
  >(null);

  // Audio
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  const [text, setText] = useState<string>("");

  /* -------- PICK DOCUMENT ---------- */
  const pickFile = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
    });
    if (!result.canceled && result.assets?.length > 0) {
      setFileAttachment(result.assets[0]);
    }
  };

  /* -------- PICK IMAGE ---------- */
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.canceled && result.assets?.length > 0) {
      setFileAttachment(result.assets[0]);
    }
  };

  /* -------- START RECORDING ---------- */
  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const created = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(created.recording);
  };

  /* -------- STOP RECORDING ---------- */
  const stopRecording = async () => {
    if (!recording) return;

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();
    if (uri) setAudioUri(uri);

    setRecording(null);
  };

  /* -------- PLAY AUDIO ---------- */
  const playAudio = async () => {
    if (!audioUri) return;

    if (sound) {
      await sound.playAsync();
      setIsPlaying(true);
      return;
    }

    const { sound: newSound } = await Audio.Sound.createAsync(
      { uri: audioUri },
      { shouldPlay: true }
    );

    setSound(newSound);
    setIsPlaying(true);

    newSound.setOnPlaybackStatusUpdate((status) => {
      if ("didJustFinish" in status && status.didJustFinish) {
        setIsPlaying(false);
      }
    });
  };

  /* -------- PAUSE AUDIO ---------- */
  const pauseAudio = async () => {
    if (!sound) return;
    await sound.pauseAsync();
    setIsPlaying(false);
  };

  /* -------- UNLOAD SOUND (CLEANUP) ---------- */
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  /* -------- FILE NAME ---------- */
  const getFileName = () => {
    if (!fileAttachment) return null;

    if ("name" in fileAttachment && fileAttachment.name) {
      return fileAttachment.name;
    }

    if ("fileName" in fileAttachment && fileAttachment.fileName) {
      return fileAttachment.fileName;
    }

    return "File selected";
  };

  return (
    <View style={{ paddingHorizontal: 12 }}>
      <Text style={styles.heading}>समस्या की जानकारी दें</Text>

      {/* -------- DROPDOWN -------- */}
      <Text style={styles.label}>अपनी स्थिति के अनुसार एक विकल्प चुनें</Text>

      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setIsDropdownOpen(!isDropdownOpen)}
      >
        <Text style={styles.dropdownText}>
          {selectedOption || "एक विकल्प चुनें"}
        </Text>

        <RemixIcon
          name={isDropdownOpen ? "arrow-up-s-line" : "arrow-down-s-line"}
          size={24}
          color="#444"
        />
      </TouchableOpacity>

      {isDropdownOpen && (
        <View style={styles.dropdownList}>
          {dropdownOptions.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.dropdownItem}
              onPress={() => {
                setSelectedOption(item);
                setIsDropdownOpen(false);
              }}
            >
              <Text style={{ color: "#444", fontSize: 14 }}>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* -------- FILE SELECTOR -------- */}
      <TouchableOpacity
        style={styles.uploadBox}
        onPress={pickFile}
        onLongPress={pickImage}
      >
        <RemixIcon name="image-add-line" size={28} color="#777" />
        <Text style={styles.uploadText}>फाइल चुनें, कैमरा खोलें या तस्वीर अपलोड करें</Text>
      </TouchableOpacity>

      {fileAttachment && (
        <Text style={{ color: "#00796B", marginBottom: 10 }}>📎 {getFileName()}</Text>
      )}

      {/* -------- TEXT + MIC -------- */}
      <Text style={styles.label}>आप कम से कम शब्दों में स्थिति बताएं</Text>

      <View style={styles.voiceRow}>
        <TextInput
          style={styles.inputBox}
          placeholder="अपनी समस्या लिखें..."
          placeholderTextColor="#777"
          value={text}
          onChangeText={setText}
          multiline
        />

        <TouchableOpacity
          onPress={recording ? stopRecording : startRecording}
          style={styles.micButton}
        >
          <RemixIcon
            name={recording ? "stop-circle-line" : "mic-line"}
            size={28}
            color="#00695C"
          />
        </TouchableOpacity>
      </View>

      {/* -------- AUDIO PLAYER -------- */}
      {audioUri && (
        <View style={styles.audioPreview}>
          <TouchableOpacity
            onPress={isPlaying ? pauseAudio : playAudio}
            style={{ marginRight: 10 }}
          >
            <RemixIcon
              name={isPlaying ? "pause-circle-line" : "play-circle-line"}
              size={32}
              color="#00796B"
            />
          </TouchableOpacity>

          <Text style={{ color: "#00796B" }}>
            {isPlaying ? "Playing..." : "Voice message attached"}
          </Text>
        </View>
      )}

      {/* -------- SUBMIT BUTTON -------- */}
      <TouchableOpacity style={styles.submitButton}>
        <Text style={styles.submitText}>शिकायत दर्ज करें</Text>
      </TouchableOpacity>
    </View>
  );
}

/* ===========================================================
                   MY COMPLAINTS TAB UI
   =========================================================== */

function MyComplaintsUI() {
  // Static list temporarily
  const myComplaints = [
    {
      id: "98761",
      issue: "पड़ोसी द्वारा मानसिक उत्पीड़न",
      status: "in-progress",
      message: "हमारी टीम आपकी समस्या की जांच कर रही है।",
    },
    {
      id: "45678",
      issue: "दवाइयों की उपलब्धता में समस्या",
      status: "closed",
      message: "मामला सफलतापूर्वक बंद कर दिया गया है।",
    },
  ];

  return (
    <View style={{ paddingHorizontal: 12, marginTop: 20 }}>
      {myComplaints.map((item, index) => {
        const isInProgress = item.status === "in-progress";

        const titleColor = isInProgress ? "#00796B" : "#616161";
        const keyColor = isInProgress ? "#00796B" : "#424242";

        return (
          <View
            key={index}
            style={{
              borderWidth: 1.5,
              borderColor: "#00796B",
              borderRadius: 12,
              padding: 16,
              marginBottom: 18,
            }}
          >
            {/* TOP ROW */}
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "600", color: titleColor }}>
                टिकट नंबर: {item.id}
              </Text>

              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  borderWidth: 1.5,
                  borderColor: isInProgress ? "#F57C00" : "#C62828",
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    marginRight: 6,
                    backgroundColor: isInProgress ? "#F57C00" : "#C62828",
                  }}
                />

                <Text
                  style={{
                    color: isInProgress ? "#F57C00" : "#C62828",
                    fontWeight: "600",
                    fontSize: 13,
                  }}
                >
                  {isInProgress ? "प्रगति में" : "बंद"}
                </Text>
              </View>
            </View>

            {/* COMPLAINT */}
            <Text style={{ marginTop: 6, fontSize: 14, color: keyColor }}>शिकायत:</Text>
            <Text style={{ color: "#222", marginBottom: 6, fontSize: 15 }}>
              {item.issue}
            </Text>

            {/* STATUS */}
            <Text style={{ marginTop: 6, fontSize: 14, color: keyColor }}>स्टेटस:</Text>
            <Text style={{ color: "#222", marginBottom: 6, fontSize: 15 }}>
              {item.message}
            </Text>

            {/* BUTTON */}
            <TouchableOpacity
              style={{
                backgroundColor: "#0A6955",
                paddingVertical: 10,
                borderRadius: 8,
                marginTop: 12,
                alignItems: "center",
              }}
              onPress={()=>{
                router.push('/complaintDetails')
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "700", fontSize: 15 }}>
                शिकायत की स्थिति देखें
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

/* ===========================================================
                        STYLES
   =========================================================== */

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    marginTop: 10,
    backgroundColor: "#E0E0E0",
    padding: 6,
    borderRadius: 8,
    width: "92%",
    alignSelf: "center",
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: "center",
  },

  activeTabButton: {
    backgroundColor: "#00796B",
  },

  tabText: {
    color: "#444",
    fontSize: 15,
    fontWeight: "600",
  },

  activeTabText: {
    color: "#fff",
  },

  heading: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: 20,
    textAlign: "center",
    marginBottom: 10,
  },

  label: {
    fontSize: 14,
    color: "#00796B",
    marginBottom: 6,
    marginTop: 10,
  },

  /* Dropdown */
  dropdown: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    padding: 14,
    marginBottom: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  dropdownText: {
    color: "#444",
    fontSize: 14,
  },

  dropdownList: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },

  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderColor: "#E0E0E0",
  },

  /* Upload */
  uploadBox: {
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
    padding: 22,
    alignItems: "center",
    marginBottom: 10,
  },

  uploadText: {
    color: "#777",
    marginTop: 6,
  },

  /* Input + Mic */
  voiceRow: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BDBDBD",
    borderRadius: 10,
  },

  inputBox: {
    flex: 1,
    borderRadius: 10,
    padding: 14,
    minHeight: 90,
    textAlignVertical: "top",
  },

  micButton: {
    padding: 10,
  },

  audioPreview: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 10,
  },

  submitButton: {
    backgroundColor: "#00796B",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    marginBottom: 40,
  },

  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
});
