import { fieldLabelMap } from "./fieldLabelMap";

const HIDDEN_FIELDS = ["id", "createdDate", "modifiedDate"];

export type FormField = {
  key: string;
  label: string;
  type: "input" | "textarea" | "date" | "radio" | "dropdown";
  options?: string[];
};

export const useAutoFormSchema = (
  payload: Record<string, any>
): FormField[] => {
  return Object.keys(payload)
    .filter((key) => !HIDDEN_FIELDS.includes(key))
    .map((key) => {
      let type: FormField["type"] = "input";
      let options: string[] | undefined;

      /* ---------- DATE ---------- */
      if (key === "dob" || key.toLowerCase().includes("date")) {
        type = "date";
      }

      /* ---------- RADIO ---------- */
      if (key === "gender") {
        type = "radio";
        options = ["Male", "Female", "Other"];
      }

      /* ---------- TEXTAREA ---------- */
      if (
        key.toLowerCase().includes("address") ||
        key === "additionalInfo"
      ) {
        type = "textarea";
      }

      /* ---------- DROPDOWN ---------- */
      if (key === "state") {
        type = "dropdown";
        options = ["Delhi", "Maharashtra", "Karnataka"];
      }

      if (key === "district") {
        type = "dropdown";
        options = ["District 1", "District 2", "District 3"];
      }

      return {
        key,
        label: fieldLabelMap[key] || key,
        type,
        options,
      };
    });
};
