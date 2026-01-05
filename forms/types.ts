export type FieldType =
  | "input"
  | "textarea"
  | "dropdown"
  | "radio"
  | "date";

export type FieldProps = {
  label: string;
  value?: any;
  onChange: (value: any) => void;
  options?: string[];
};
