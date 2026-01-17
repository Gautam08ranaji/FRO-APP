import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import * as Location from "expo-location";
import React, { useEffect, useRef, useState } from "react";
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
import MapViewDirections from "react-native-maps-directions";
import RemixIcon, { IconName } from "react-native-remix-icon";

/* ================= CONSTANTS ================= */

const DESTINATION = {
  latitude: 28.56719,
  longitude: 77.320892
};

// 🔑 Use UNRESTRICTED (WEB) key for Directions
const GOOGLE_MAPS_API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";

/* ================= SCREEN ================= */

export default function StartNavigationScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const colors = theme.colors;

  const mapRef = useRef<MapView>(null);
  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  /* ================= GET USER LOCATION ================= */

  useEffect(() => {
    (async () => {
      const { status } =
        await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });

      console.log("USER LOCATION:", location.coords);
      setUserLocation(location.coords);
    })();
  }, []);

  /* ================= AUTO ZOOM TO USER + DESTINATION ================= */

  useEffect(() => {
    if (!userLocation || !mapRef.current) return;

    mapRef.current.fitToCoordinates(
      [
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude
        },
        {
          latitude: DESTINATION.latitude,
          longitude: DESTINATION.longitude
        }
      ],
      {
        edgePadding: {
          top: 60,
          right: 40,
          bottom: 60,
          left: 40
        },
        animated: true
      }
    );
  }, [userLocation]);

  /* ================= OPEN GOOGLE MAPS ================= */

  const openGoogleMaps = () => {
    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${DESTINATION.latitude},${DESTINATION.longitude}`,
      android: `google.navigation:q=${DESTINATION.latitude},${DESTINATION.longitude}`
    });

    if (url) Linking.openURL(url);
  };

  return (
    <BodyLayout
      type="screen"
      screenName={t("navigation.screenTitle")}
      scrollContentStyle={{ paddingHorizontal: 0 }}
    >
      {/* ================= MAP ================= */}
      <View
        style={[
          styles.mapContainer,
          { borderColor: colors.colorBorder }
        ]}
      >
        <MapView
          key={userLocation ? "with-location" : "no-location"}
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          showsUserLocation
          showsMyLocationButton
        >
          {/* Destination Marker */}
          <Marker
            coordinate={DESTINATION}
            title={t("navigation.name")}
            description={t("navigation.fullAddress")}
          />

          {/* Route (Optional but recommended) */}
          {userLocation && (
            <MapViewDirections
              origin={userLocation}
              destination={DESTINATION}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={5}
              strokeColor="#1E90FF"
              mode="DRIVING"
              onError={(err) => {
                console.log("DIRECTIONS ERROR:", err);
              }}
              onReady={(result) => {
                // Refine zoom using actual route
                mapRef.current?.fitToCoordinates(
                  result.coordinates,
                  {
                    edgePadding: {
                      top: 60,
                      right: 40,
                      bottom: 60,
                      left: 40
                    },
                    animated: true
                  }
                );
              }}
            />
          )}
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

        <View style={styles.row}>
          <RemixIcon
            name={"map-pin-2-line" as IconName}
            size={18}
            color={colors.colorTextSecondary}
          />
          <Text
            style={[
              styles.rowText,
              { color: colors.colorTextSecondary }
            ]}
          >
            {t("navigation.distance")}: {t("navigation.distanceValue")}
          </Text>
        </View>

        <View style={styles.row}>
          <RemixIcon
            name={"navigation-line" as IconName}
            size={18}
            color={colors.colorTextSecondary}
          />
          <Text
            style={[
              styles.rowText,
              { color: colors.colorTextSecondary }
            ]}
          >
            {t("navigation.eta")}: {t("navigation.etaValue")}
          </Text>
        </View>

        <Text style={[styles.label, { color: colors.colorTextSecondary }]}>
          {t("navigation.address")}:
        </Text>

        <Text
          style={[
            styles.address,
            { color: colors.colorTextPrimary }
          ]}
        >
          {t("navigation.fullAddress")}
        </Text>
      </View>

      {/* ================= BUTTONS ================= */}
      <TouchableOpacity
        onPress={openGoogleMaps}
        style={[
          styles.primaryBtn,
          { backgroundColor: colors.btnPrimaryBg }
        ]}
      >
        <RemixIcon
          name={"navigation-fill" as IconName}
          size={18}
          color={colors.btnPrimaryText}
          style={{ marginRight: 6 }}
        />
        <Text
          style={[
            styles.primaryBtnText,
            { color: colors.btnPrimaryText }
          ]}
        >
          {t("navigation.openMaps")}
        </Text>
      </TouchableOpacity>

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
    overflow: "hidden"
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
