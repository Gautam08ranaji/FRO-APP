import * as Location from 'expo-location';
import React, { createContext, useContext, useEffect, useState } from 'react';

type LocationContextType = {
  location: any;
  address: string | null;
  hasPermission: boolean;
  requestPermission: () => Promise<void>;
};

const LocationContext = createContext<LocationContextType>({
  location: null,
  address: null,
  hasPermission: false,
  requestPermission: async () => {},
});

export const LocationProvider = ({ children }: { children: React.ReactNode }) => {
  const [location, setLocation] = useState<any>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);

  const requestPermission = async () => {
    try {
      console.log("📍 Requesting location permission...");
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== 'granted') {
        console.warn('❌ Location permission not granted');
        setHasPermission(false);
        return;
      }

      setHasPermission(true);
      console.log("✅ Permission granted, fetching location...");

    const currentLocation = await Location.getCurrentPositionAsync({
  accuracy: Location.Accuracy.High,
});


      setLocation(currentLocation);
      console.log("📍 Current location:", currentLocation);

      // 🗺️ Reverse geocode to get address
      const { latitude, longitude } = currentLocation.coords;
      const places = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (places && places.length > 0) {
        const place = places[0];
        const readableAddress = [
          place.name,
          place.street,
          place.city,
          place.region,
          place.postalCode,
          place.country,
        ]
          .filter(Boolean)
          .join(', ');

        setAddress(readableAddress);
        console.log('🏠 Address:', readableAddress);
      } else {
        console.warn('⚠️ No address found for current location');
      }
    } catch (error) {
      console.error('🚨 Error getting location or address:', error);
    }
  };

  useEffect(() => {
    requestPermission();
  }, []);

  return (
    <LocationContext.Provider value={{ location, address, hasPermission, requestPermission }}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => useContext(LocationContext);
