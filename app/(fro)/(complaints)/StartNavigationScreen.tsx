import BodyLayout from "@/components/layout/BodyLayout";
import { useTheme } from "@/theme/ThemeContext";
import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import RemixIcon, { IconName } from "react-native-remix-icon";

/* ================= FALLBACK LOCATION ================= */

const STATIC_DESTINATION = {
  latitude: 28.56719,
  longitude: 77.320892,
};

/* ⚠️ Use UNRESTRICTED (WEB) Google Directions API key */
const GOOGLE_MAPS_API_KEY = "AIzaSyDVl4s2zlYODWTIpEfzYePa_hj5nrWksuE";

/* ================= HELPERS ================= */

const getDestinationFromItem = (item: any) => {
  // Case 1: geographicLocation object
  if (
    item?.geographicLocation?.latitude &&
    item?.geographicLocation?.longitude
  ) {
    return {
      latitude: Number(item.geographicLocation.latitude),
      longitude: Number(item.geographicLocation.longitude),
      isStatic: false,
    };
  }

  // Case 2: "lat,lng" string
  if (typeof item?.location === "string" && item.location.includes(",")) {
    const [lat, lng] = item.location.split(",");
    if (!isNaN(Number(lat)) && !isNaN(Number(lng))) {
      return {
        latitude: Number(lat),
        longitude: Number(lng),
        isStatic: false,
      };
    }
  }

  // ❌ Fallback
  return {
    ...STATIC_DESTINATION,
    isStatic: true,
  };
};

/* ================= SCREEN ================= */

export default function StartNavigationScreen() {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const colors = theme.colors;

  const params = useLocalSearchParams();
  const item = params.item ? JSON.parse(params.item as string) : null;

  console.log("nav item", item);

  const destination = getDestinationFromItem(item);

  const mapRef = useRef<MapView>(null);

  const [userLocation, setUserLocation] =
    useState<Location.LocationObjectCoords | null>(null);

  const [distance, setDistance] = useState<number | null>(null);
  const [duration, setDuration] = useState<number | null>(null);

  /* ================= GET USER LOCATION ================= */

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.log("❌ Location permission denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setUserLocation(location.coords);
    })();
  }, []);

  /* ================= AUTO ZOOM ================= */

  useEffect(() => {
    if (!userLocation || !mapRef.current) return;

    mapRef.current.fitToCoordinates(
      [
        {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
        },
        {
          latitude: destination.latitude,
          longitude: destination.longitude,
        },
      ],
      {
        edgePadding: { top: 60, right: 40, bottom: 60, left: 40 },
        animated: true,
      },
    );
  }, [userLocation, destination]);

  /* ================= OPEN GOOGLE MAPS ================= */

  const openGoogleMaps = () => {
    const lat = destination.latitude;
    const lng = destination.longitude;

    const url = Platform.select({
      ios: `http://maps.apple.com/?daddr=${lat},${lng}`,
      android: `google.navigation:q=${lat},${lng}`,
    });

    if (url) Linking.openURL(url);
  };

  /* ================= RENDER ================= */

  return (
    <BodyLayout
      type="screen"
      screenName={t("navigation.screenTitle")}
      scrollContentStyle={{ paddingHorizontal: 0 }}
    >
      {/* ================= MAP ================= */}
      <View style={[styles.mapContainer, { borderColor: colors.colorBorder }]}>
        <MapView
          ref={mapRef}
          provider={PROVIDER_GOOGLE}
          style={StyleSheet.absoluteFillObject}
          showsUserLocation
          showsMyLocationButton
        >
          <Marker
            coordinate={{
              latitude: destination.latitude,
              longitude: destination.longitude,
            }}
            title={item?.contactName || "Destination"}
            description={item?.completeAddress || "Location"}
          />

          {userLocation && (
            <MapViewDirections
              origin={userLocation}
              destination={{
                latitude: destination.latitude,
                longitude: destination.longitude,
              }}
              apikey={GOOGLE_MAPS_API_KEY}
              strokeWidth={5}
              strokeColor="#1E90FF"
              mode="DRIVING"
              onReady={(result) => {
                setDistance(result.distance);
                setDuration(result.duration);

                mapRef.current?.fitToCoordinates(result.coordinates, {
                  edgePadding: {
                    top: 60,
                    right: 40,
                    bottom: 60,
                    left: 40,
                  },
                  animated: true,
                });
              }}
              onError={(err) => console.log("❌ DIRECTIONS ERROR:", err)}
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
            borderColor: colors.colorBorder,
          },
        ]}
      >
        <Text style={[styles.name, { color: colors.colorTextPrimary }]}>
          {item?.contactName || "Unknown"}
        </Text>

        <View style={styles.row}>
          <RemixIcon
            name={"map-pin-2-line" as IconName}
            size={18}
            color={colors.colorTextSecondary}
          />
          <Text style={[styles.rowText, { color: colors.colorTextSecondary }]}>
            Distance: {distance ? `${distance.toFixed(1)} km` : "--"}
          </Text>
        </View>

        <View style={styles.row}>
          <RemixIcon
            name={"navigation-line" as IconName}
            size={18}
            color={colors.colorTextSecondary}
          />
          <Text style={[styles.rowText, { color: colors.colorTextSecondary }]}>
            ETA: {duration ? `${Math.ceil(duration)} min` : "--"}
          </Text>
        </View>

        <Text style={[styles.label, { color: colors.colorTextSecondary }]}>
          Address:
        </Text>

        <Text style={[styles.address, { color: colors.colorTextPrimary }]}>
          {item?.completeAddress || "Address not available"}
        </Text>

        {destination.isStatic && (
          <Text style={{ color: "orange", fontSize: 12, marginTop: 6 }}>
            📍 Location shown is static (exact location not available)
          </Text>
        )}
      </View>

      {/* ================= BUTTONS ================= */}
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
          Open in Maps
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.secondaryBtn,
          {
            borderColor: colors.btnSecondaryBorder,
            backgroundColor: colors.colorBgSurface,
          },
        ]}
      >
        <Text
          style={[styles.secondaryBtnText, { color: colors.colorPrimary500 }]}
        >
          On the Way
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
    overflow: "hidden",
  },
  card: {
    borderRadius: 16,
    padding: 16,
    marginTop: 18,
    borderWidth: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  rowText: {
    marginLeft: 6,
    fontSize: 14,
  },
  label: {
    marginTop: 12,
    fontSize: 13,
    fontWeight: "500",
  },
  address: {
    marginTop: 4,
    fontSize: 14,
    lineHeight: 20,
  },
  primaryBtn: {
    height: 50,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 22,
  },
  primaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryBtn: {
    height: 50,
    borderRadius: 10,
    borderWidth: 1.6,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 14,
  },
  secondaryBtnText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
