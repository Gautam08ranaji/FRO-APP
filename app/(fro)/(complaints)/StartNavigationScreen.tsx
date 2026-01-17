import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import React from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import RemixIcon, { IconName } from "react-native-remix-icon";

/* ================= CONSTANTS ================= */

const DESTINATION = {
  latitude: 12.9716,
  longitude: 77.5946
};

/* ================= SCREEN ================= */

export default function StartNavigationScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const colors = theme.colors;

  /* ================= OPEN GOOGLE MAPS ================= */

  const openGoogleMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${DESTINATION.latitude},${DESTINATION.longitude}`,
      android: `google.navigation:q=${DESTINATION.latitude},${DESTINATION.longitude}`
    });

    if (url) {
      Linking.openURL(url);
    }
  };

  return (
    <BodyLayout
      type="screen"
      screenName={t("navigation.screenTitle")}
      scrollContentStyle={{ paddingHorizontal: 0 }}
    >
      {/* ================= REAL MAP ================= */}
      <View
        style={[
          styles.mapContainer,
          {
            borderColor: colors.colorBorder
          }
        ]}
      >
        <MapView
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: DESTINATION.latitude,
            longitude: DESTINATION.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01
          }}
          showsUserLocation
          showsMyLocationButton
          loadingEnabled
        >
          <Marker
            coordinate={DESTINATION}
            title={t("navigation.name")}
            description={t("navigation.fullAddress")}
          />
        </MapView>
      </View>

      {/* ================= DETAILS CARD ================= */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.colorBgSurface,
            borderColor: colors.colorBorder
          }
        ]}
      >
        <Text style={[styles.name, { color: colors.colorTextPrimary }]}>
          {t("navigation.name")}
        </Text>

        {/* Distance */}
        <View style={styles.row}>
          <RemixIcon
            name={"map-pin-2-line" as IconName}
            size={18}
            color={colors.colorTextSecondary}
          />
          <Text style={[styles.rowText, { color: colors.colorTextSecondary }]}>
            {t("navigation.distance")}: {t("navigation.distanceValue")}
          </Text>
        </View>

        {/* ETA */}
        <View style={styles.row}>
          <RemixIcon
            name={"navigation-line" as IconName}
            size={18}
            color={colors.colorTextSecondary}
          />
          <Text style={[styles.rowText, { color: colors.colorTextSecondary }]}>
            {t("navigation.eta")}: {t("navigation.etaValue")}
          </Text>
        </View>

        {/* Address */}
        <Text style={[styles.label, { color: colors.colorTextSecondary }]}>
          {t("navigation.address")}:
        </Text>

        <Text style={[styles.address, { color: colors.colorTextPrimary }]}>
          {t("navigation.fullAddress")}
        </Text>
      </View>

      {/* ================= OPEN GOOGLE MAPS ================= */}
      <TouchableOpacity
        onPress={openGoogleMaps}
        style={[styles.primaryBtn, { backgroundColor: colors.btnPrimaryBg }]}
      >
        <RemixIcon
          name={"navigation-fill" as IconName}
          size={18}
          color={colors.btnPrimaryText}
          style={{ marginRight: 6 }}
        />
        <Text style={[styles.primaryBtnText, { color: colors.btnPrimaryText }]}>
          {t("navigation.openMaps")}
        </Text>
      </TouchableOpacity>

      {/* ================= ON THE WAY ================= */}
      <TouchableOpacity
        style={[
          styles.secondaryBtn,
          {
            borderColor: colors.btnSecondaryBorder,
            backgroundColor: colors.colorBgSurface
          }
        ]}
      >
        <Text
          style={[
            styles.secondaryBtnText,
            { color: colors.colorPrimary500 }
          ]}
        >
          {t("navigation.onTheWay")}
        </Text>
      </TouchableOpacity>
    </BodyLayout>
  );
}

/* ================= STYLES ================= */

const styles = StyleSheet.create({
  mapContainer: {
    height: 180,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 12,
    overflow: "hidden" // REQUIRED for rounded corners
  },

  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    borderWidth: 1
  },

  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10
  },

  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6
  },

  rowText: {
    marginLeft: 6,
    fontSize: 14
  },

  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "500"
  },

  address: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20
  },

  primaryBtn: {
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22
  },

  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600"
  },

  secondaryBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14
  },

  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "600"
  }
});
