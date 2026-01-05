import BodyLayout from "@/components/layout/BodyLayout";
import FormRenderer from "@/forms/FormRenderer";
import { useLocalSearchParams } from "expo-router";
import React from "react";

export default function DynamicFormScreen() {
  const params = useLocalSearchParams();
  


  const handleSubmit = (data: any) => {
    console.log("FORM DATA SUBMITTED:", data);
    // Your submission logic here
  };

  // Get screen title from params or use default
  const screenTitle = (params.title as string) || "Dynamic Form";

  return (
    <BodyLayout type="screen" screenName={screenTitle}>
      <FormRenderer
        onSubmit={handleSubmit}
      />
    </BodyLayout>
  );
}