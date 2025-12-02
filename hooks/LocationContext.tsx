import * as Location from "expo-location";
import React, { createContext, useContext, useEffect, useState } from "react";

type LocationContextType = {
  location: any;
  address: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<boolean>;
  revokePermission: () => void;
};

const LocationContext = createContext<LocationContextType>({
  location: null,
  address: null,
  hasPermission: false,
  requestPermission: async () => false,
  revokePermission: () => {},
});

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async (): Promise<boolean> => {
    try {
      console.log("📍 Requesting location permission...");

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        console.warn("❌ Location permission not granted");
        setHasPermission(false);
        return false;
      }

      setHasPermission(true);
      console.log("✅ Permission granted, fetching location...");

      const currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setLocation(currentLocation);

      const { latitude, longitude } = currentLocation.coords;

      const places = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (places.length > 0) {
        const p = places[0];
        const readableAddress = [
          p.name,
          p.street,
          p.city,
          p.region,
          p.postalCode,
          p.country,
        ]
          .filter(Boolean)
          .join(", ");

        setAddress(readableAddress);
        console.log("🏠 Address:", readableAddress);
      }

      return true;
    } catch (error) {
      console.error("🚨 Error getting location or address:", error);
      return false;
    }
  };

  // 👇 App-level "turn off" location (cannot remove OS permission)
  const revokePermission = () => {
    setHasPermission(false);
    setLocation(null);
    setAddress(null);
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <LocationContext.Provider
      value={{
        location,
        address,
        hasPermission,
        requestPermission,
        revokePermission,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
