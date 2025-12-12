import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const boot = async () => {
      const userData = await AsyncStorage.getItem("user");

      if (!userData) {
        router.replace("/(onboarding)");
        return;
      }

      const user = JSON.parse(userData);

      if (user.role === "FRO") {
        router.replace("/(fro)/(dashboard)");
      } else {
        router.replace("/(frl)/(dashboard)");
      }
    };

    boot();
  }, []);

  return null;
}
