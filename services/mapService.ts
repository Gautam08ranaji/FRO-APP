// services/mapService.ts
import axios from "axios";

const GOOGLE_MAPS_API_KEY = "AIzaSyDVl4s2zlYODWTIpEfzYePa_hj5nrWksuE";

export const getDirections = async (
  origin: { latitude: number; longitude: number },
  destination: { latitude: number; longitude: number },
) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin.latitude},${origin.longitude}&destination=${destination.latitude},${destination.longitude}&key=${GOOGLE_MAPS_API_KEY}&mode=driving`,
    );

    if (response.data.routes.length > 0) {
      const points = decodePolyline(
        response.data.routes[0].overview_polyline.points,
      );
      return points;
    }
    return [];
  } catch (error) {
    console.error("Directions error:", error);
    return [];
  }
};

// Helper function to decode Google Maps polyline
const decodePolyline = (encoded: string) => {
  let points = [];
  let index = 0,
    len = encoded.length;
  let lat = 0,
    lng = 0;

  while (index < len) {
    let b,
      shift = 0,
      result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = result & 1 ? ~(result >> 1) : result >> 1;
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = result & 1 ? ~(result >> 1) : result >> 1;
    lng += dlng;

    points.push({ latitude: lat * 1e-5, longitude: lng * 1e-5 });
  }

  return points;
};
