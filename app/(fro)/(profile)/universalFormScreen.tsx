import BodyLayout from "@/components/layout/BodyLayout";
import FormRenderer from "@/forms/FormRenderer";
import React from "react";

export default function DynamicFormScreen() {
  const payload = {

  name: "",
  descriptions: "",
  state: "",
  stateId: null,
  district: "",
  districtId: null,
  city: "",
  latLong: "",
  address: "",
  contactName: "",
  contactPhone: "",
  contactWebsite: "",
  contactEmail: "",
  isEnabled: true,


  };

  return (
    <BodyLayout type={"screen"} screenName="Dynamic Form">
      <FormRenderer
        payload={payload}
        onSubmit={(data) => {
          console.log("FORM DATA", data);
        }}
      />
    </BodyLayout>
  );
}
