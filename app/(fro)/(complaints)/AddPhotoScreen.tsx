import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import RemixIcon from "react-native-remix-icon";

export default function AddPhotoScreen() {
  const { theme } = useTheme();
  const colors = theme.colors;
  const { t } = useTranslation();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // 📸 Camera
  const openCamera = async () => {
    const result = await launchCamera({
      mediaType: "photo",
      quality: 0.8,
    });

    if (!result.didCancel && result.assets?.length) {
      setSelectedImage(result.assets[0].uri!);
    }
  };

  // 🖼️ Gallery
  const openGallery = async () => {
    const result = await launchImageLibrary({
      mediaType: "photo",
      selectionLimit: 1,
    });

    if (!result.didCancel && result.assets?.length) {
      setSelectedImage(result.assets[0].uri!);
    }
  };

  return (
    <BodyLayout
      type="screen"
      screenName={t("addPhoto.screenTitle")}
      scrollContentStyle={{ paddingHorizontal: 20 }}
    >
      {/* Camera Button */}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.btnPrimaryBg }]}
        onPress={openCamera}
      >
        <RemixIcon name="camera-line" size={20} color="#fff" />
        <Text style={styles.primaryBtnText}>{t("addPhoto.openCamera")}</Text>
      </TouchableOpacity>

      {/* Gallery Button */}
      <TouchableOpacity
        style={[
          styles.outlineBtn,
          { borderColor: colors.btnPrimaryBg },
        ]}
        onPress={openGallery}
      >
        <RemixIcon name="image-line" size={20} color={colors.btnPrimaryBg} />
        <Text style={[styles.outlineBtnText, { color: colors.btnPrimaryBg }]}>
          {t("addPhoto.chooseGallery")}
        </Text>
      </TouchableOpacity>

      {/* Selected Photo */}
      <Text style={[styles.sectionTitle, { color: colors.colorTextPrimary }]}>
        {t("addPhoto.selectedPhoto")}
      </Text>

      <View style={[styles.previewBox, { backgroundColor: colors.colorBgSurface }]}>
        {selectedImage ? (
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        ) : (
          <View style={styles.placeholder}>
            <RemixIcon name="image-line" size={36} color={colors.colorOverlay} />
          </View>
        )}
      </View>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.primaryBtn, { backgroundColor: colors.btnPrimaryBg }]}
        onPress={() => {
          console.log("Saving image:", selectedImage);
        }}
      >
        <Text style={styles.primaryBtnText}>{t("addPhoto.savePhoto")}</Text>
      </TouchableOpacity>
    </BodyLayout>
  );
}

const styles = StyleSheet.create({
  primaryBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  primaryBtnText: {
    fontSize: 16,
    color: "#fff",
    marginLeft: 8,
  },

  outlineBtn: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1.4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },
  outlineBtnText: {
    fontSize: 16,
    marginLeft: 8,
  },

  sectionTitle: {
    fontSize: 14,
    marginBottom: 8,
  },

  previewBox: {
    width: 110,
    height: 110,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
  },

  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },

  placeholder: {
    justifyContent: "center",
    alignItems: "center",
  },
});
