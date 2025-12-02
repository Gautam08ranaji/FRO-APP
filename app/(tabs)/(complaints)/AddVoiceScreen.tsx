import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import { Audio } from "expo-av";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

export default function VoiceNoteScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;

  
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [sound, setSound] = useState<Audio.Sound | null>(null);

  
  const [isPlaying, setIsPlaying] = useState(false);

  
  const [sec, setSec] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  
  const formatTime = () => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? "0" + s : s}`;
  };


  const startRecording = async () => {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) return;

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    // Reset timer
    setSec(0);
    timerRef.current = setInterval(() => {
      setSec((prev) => prev + 1);
    }, 1000);

    const created = await Audio.Recording.createAsync(
      Audio.RecordingOptionsPresets.HIGH_QUALITY
    );

    setRecording(created.recording);
    setAudioUri(null);
  };

  
  const stopRecording = async () => {
    if (!recording) return;

    if (timerRef.current) clearInterval(timerRef.current);

    await recording.stopAndUnloadAsync();
    const uri = recording.getURI();

    if (uri) setAudioUri(uri);

    setRecording(null);
  };


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

  const pauseAudio = async () => {
    if (!sound) return;
    await sound.pauseAsync();
    setIsPlaying(false);
  };

  
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  return (
    <BodyLayout type="screen" screenName="वॉइस नोट रिकॉर्ड करें">
      {/* TOP CARD */}
      <View
        style={[
          styles.card,
          { backgroundColor: colors.colorBgPage ,elevation:1 },
        ]}
      >
        
        <View
          style={[
            styles.micCircle,
            {  backgroundColor: recording
              ? colors.colorAccent500 +22
              : colors.btnPrimaryBg + 22, },
          ]}
        >
          <RemixIcon
            name="mic-line"
            size={48}
            color={  recording
              ? colors.colorAccent500
              : colors.btnPrimaryBg}
          />
        </View>

        
        <Text style={styles.timer}>{formatTime()}</Text>

        
        <Text style={styles.subtitle}>
          {recording ? "रिकॉर्डिंग चल रही है..." : "रिकॉर्ड करने के लिए तैयार"}
        </Text>
      </View>

      
      <TouchableOpacity
        style={[
          styles.recordBtn,
          {
            backgroundColor: recording
              ? colors.colorAccent500
              : colors.btnPrimaryBg,
          },
        ]}
        onPress={recording ? stopRecording : startRecording}
      >
        <RemixIcon
          name={recording ? "stop-line" : "mic-line"}
          size={22}
          color="#fff"
        />
        <Text style={styles.recordBtnText}>
          {recording ? "रिकॉर्ड रोकें" : "रिकॉर्ड शुरू करें"}
        </Text>
      </TouchableOpacity>

      
      {audioUri && (
        <View style={styles.playBox}>
          <Text style={styles.subtitle}>रिकॉर्ड किया गया वॉइस नोट</Text>

          <TouchableOpacity
            style={[
              styles.playBtn,
              { borderColor: colors.colorAccent500 },
            ]}
            onPress={isPlaying ? pauseAudio : playAudio}
          >
            <RemixIcon
              name={isPlaying ? "pause-circle-line" : "play-circle-line"}
              size={30}
              color={colors.colorAccent500}
            />
            <Text
              style={[
                styles.playText,
                { color: colors.colorAccent500 },
              ]}
            >
              {isPlaying ? "Pause" : "Play"}
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </BodyLayout>
  );
}


const styles = StyleSheet.create({
  card: {
    marginTop: 20,
    padding: 30,
    borderRadius: 16,
    alignItems: "center",
  },

  micCircle: {
    width: 130,
    height: 130,
    borderRadius: 65,
    justifyContent: "center",
    alignItems: "center",
  },

  timer: {
    fontSize: 34,
    fontWeight: "700",
    marginTop: 20,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 8,
    opacity: 0.6,
  },

  recordBtn: {
    height: 52,
    borderRadius: 12,
    marginTop: 35,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  recordBtnText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    marginLeft: 10,
  },

  playBox: {
    marginTop: 40,
    alignItems: "center",
  },

  playBtn: {
    marginTop: 14,
    borderWidth: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  playText: {
    fontSize: 16,
    marginLeft: 8,
  },
});
