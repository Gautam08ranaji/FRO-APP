import { useTheme } from '@/theme/ThemeContext';
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AppleMaps, GoogleMaps } from "expo-maps";
import React from "react";
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { router } from "expo-router";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default function ConfirmLocationScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const [confirmed, setConfirmed] = React.useState(false);
  const [manualMode, setManualMode] = React.useState(false);
  const [selectedAddress, setSelectedAddress] = React.useState("");

  const location = { latitude: 25.5872, longitude: 83.5806 };

  const dummyAddresses = [
    "ग्राम राजपुरा, थाना नगर, गाज़ीपुर, उत्तर प्रदेश",
    "कुष्णानगर कॉलोनी, पोस्ट आफिस, गाज़ीपुर, उत्तर प्रदेश",
    "शिवपुरी मोहल्ला, पुरानी सड़क, गाज़ीपुर, उत्तर प्रदेश"
  ];

  const MapComponent = Platform.OS === "ios" ? AppleMaps.View : GoogleMaps.View;

  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* MAP */}
      <MapComponent
        style={styles.map}
        cameraPosition={{ coordinates: location, zoom: 14 }}
        markers={[{ coordinate: location }]}
      />

      {/* POPUP */}
      {!manualMode && (
        <View style={styles.popupContainer}>
          <View
            style={[
              styles.popup,
              { backgroundColor: theme.colors.btnSosBg }
            ]}
          >
            <Ionicons name="alert-circle" size={20} color={theme.colors.colorTextInverse} />

            <Text
              style={[
                styles.popupText,
                theme.typography.fontBodySmall,
                { color: theme.colors.colorBgSurface }
              ]}
            >
              {t("ConfirmLocation.popupDistance")}{" "}
              <Text style={{ fontWeight: "bold" }}>
                2.3 {t("ConfirmLocation.kmAway")}
              </Text>
            </Text>
          </View>

          <View
            style={[
              styles.pathLine,
              { backgroundColor: theme.colors.btnSosBg }
            ]}
          />
        </View>
      )}

      {/* BOTTOM SHEET */}
      <LinearGradient
        colors={["#F34A4A", "#630505"]}
        style={styles.bottomSheet}
      >
        {/* MANUAL MODE */}
        {manualMode ? (
          <>
            <TextInput
              placeholder={t("ConfirmLocation.searchAddress")}
              placeholderTextColor={theme.colors.inputPlaceholder}
              style={[
                styles.searchBox,
                theme.typography.fontBody,
                {
                  backgroundColor: theme.colors.inputBg,
                  color: theme.colors.inputText,
                  borderColor: theme.colors.inputBorder
                }
              ]}
            />

            <ScrollView style={{ width: "100%" }} contentContainerStyle={{ paddingBottom: 50 }}>
              {dummyAddresses.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.addressRow,
                    { borderBottomColor: theme.colors.colorAccent300 }
                  ]}
                  onPress={() => setSelectedAddress(item)}
                >
                  <Text
                    style={[
                      styles.addressText,
                      theme.typography.fontBody,
                      { color: theme.colors.btnSosText }
                    ]}
                  >
                    {item}
                  </Text>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color={theme.colors.colorTextInverse}
                  />
                </TouchableOpacity>
              ))}

              {selectedAddress ? (
                <View
                  style={[
                    styles.selectedBox,
                    { backgroundColor: theme.colors.colorAccent700 }
                  ]}
                >
                  <Text
                    style={[
                      styles.selectedText,
                      theme.typography.fontInput,
                      { color: theme.colors.btnSosText }
                    ]}
                  >
                    {selectedAddress}
                  </Text>

                  <TouchableOpacity
                    style={[
                      styles.saveBtn,
                      { backgroundColor: theme.colors.colorAccent100 }
                    ]}
                    onPress={() => {
                      setManualMode(false);
                      setConfirmed(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.saveBtnText,
                        theme.typography.fontBody,
                        { color: theme.colors.btnSosBg }
                      ]}
                    >
                      {t("ConfirmLocation.savedAddressUse")}
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : null}
            </ScrollView>
          </>
        ) : (
          <>
            {/* ICON */}
            <Ionicons name="location" size={32} color={theme.colors.btnSosText} />

            <Text
              style={[
                styles.heading,
                theme.typography.fontH1,
                { color: theme.colors.btnSosText }
              ]}
            >
              {confirmed
                ? t("ConfirmLocation.sendingLocation")
                : t("ConfirmLocation.confirmHeading")}
            </Text>

            {/* BEFORE CONFIRM */}
            {!confirmed ? (
              <>
                {/* YES BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: theme.colors.colorAccent100 }
                  ]}
                  onPress={() => setConfirmed(true)}
                >
                  <Text
                    style={[
                      styles.primaryBtnText,
                      theme.typography.fontButtonLarge,
                      { color: theme.colors.btnSosBg, }
                    ]}
                  >
                    {t("ConfirmLocation.yesCorrect")}
                  </Text>
                </TouchableOpacity>

                {/* MANUAL BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.secondaryBtn,
                    { backgroundColor: theme.colors.btnSosText }
                  ]}
                  onPress={() => setManualMode(true)}
                >
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      theme.typography.fontBody,
                      { color: theme.colors.btnSosBg }
                    ]}
                  >
                    {t("ConfirmLocation.notCorrect")}
                  </Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                {/* CALL BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: theme.colors.colorAccent100 }
                  ]}
                >
                  <Text
                    style={[
                      styles.primaryBtnText,
                      theme.typography.fontBodyLarge,
                      { color: theme.colors.colorAccent700 }
                    ]}
                  >
                    {t("ConfirmLocation.call14567")}
                  </Text>
                </TouchableOpacity>

                {/* GOT HELP BUTTON */}
                <TouchableOpacity
                  style={[
                    styles.secondaryBtn,
                    { backgroundColor: theme.colors.btnSosText }
                  ]}
                  onPress={() => router.push("/(tabs)/(dashboard)/endRequestConfirmation")}
                >
                  <Text
                    style={[
                      styles.secondaryBtnText,
                      theme.typography.fontButtonLarge,
                      { color: theme.colors.btnSosBg ,
                      
                      }
                    ]}
                  >
                    {t("ConfirmLocation.gotHelp")}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </>
        )}
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },

  popupContainer: {
    position: "absolute",
    top: 90,
    left: 20,
  },

  popup: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    maxWidth: width * 0.75,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },

  popupText: {
    fontSize: 13,
  },

  pathLine: {
    width: 3,
    height: 80,
    marginLeft: 20,
    borderRadius: 5,
  },

  bottomSheet: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 25,
    paddingHorizontal: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    alignItems: "center",
    maxHeight: "55%",
  },

  heading: {
    marginTop: 12,
    marginBottom: 25,
    textAlign: "center",
  },

  searchBox: {
    width: "100%",
    padding: 12,
    borderRadius: 12,
    fontSize: 15,
    marginBottom: 20,
    borderWidth: 1,
  },

  addressRow: {
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  addressText: {
    flex: 1,
    paddingRight: 10,
  },

  selectedBox: {
    padding: 15,
    borderRadius: 10,
    width: "100%",
    marginTop: 20,
  },

  selectedText: {
    fontSize: 14,
  },

  saveBtn: {
    marginTop: 20,
    padding: 14,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },

  saveBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },

  primaryBtn: {
    width: "100%",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 14,
  },

  primaryBtnText: {
    fontSize: 16,
    fontWeight: "700",
  },

  secondaryBtn: {
    width: "100%",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    
  },

  secondaryBtnText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
