import { useTheme } from "@/theme/ThemeContext";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FieldRegistry } from "./FieldRegistry";
import { useAutoFormSchema } from "./useAutoFormSchema";

type Props = {
  payload: Record<string, any>;
  onSubmit: (data: any) => void;
};

export default function FormRenderer({ payload, onSubmit }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const schema = useAutoFormSchema(payload);
  const [formData, setFormData] = useState(payload);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[
        styles.container,
        { backgroundColor: theme.colors.colorBgSurface },
      ]}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 100,
      }}
    >
      {/* FORM FIELDS */}
      {schema.map((field) => {
        const Component = FieldRegistry[field.type];
        if (!Component) return null;

        return (
          <View key={field.key} style={styles.fieldWrapper}>
            <Component
              label={field.label}
              value={formData[field.key]}
              options={field.options}
              onChange={(val) =>
                setFormData((prev) => ({
                  ...prev,
                  [field.key]: val,
                }))
              }
            />
          </View>
        );
      })}

      {/* SUBMIT BUTTON */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          { backgroundColor: theme.colors.primary },
        ]}
        activeOpacity={0.85}
        onPress={() => onSubmit(formData)}
      >
        <Text
          style={[
            styles.submitText,
            { color: theme.colors.colorBgPage },
          ]}
        >
          Submit
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  fieldWrapper: {
    marginBottom: 0,
  },

  submitBtn: {
    height: 52,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  submitText: {
    fontSize: 16,
    fontWeight: "600",
  },
});
