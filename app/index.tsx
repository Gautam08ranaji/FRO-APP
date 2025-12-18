// app/index.tsx
import { useAppSelector } from "@/store/hooks";
import { Redirect } from "expo-router";
import React from "react";

export default function Index() {
  const { token, role } = useAppSelector((state) => state.auth);

  // ⏳ Wait until redux-persist rehydrates
  if (token === undefined) {
    return null;
  }

  // ❌ Not logged in
  if (!token) {
    return <Redirect href="/(onboarding)" />;
  }

  // ✅ Logged in → role based redirect
  if (role === "FRO") {
    return <Redirect href="/(fro)/(dashboard)" />;
  }

  if (role === "FRL") {
    return <Redirect href="/(frl)/(dashboard)" />;
  }

  // Safety fallback
  return <Redirect href="/(onboarding)" />;
}
