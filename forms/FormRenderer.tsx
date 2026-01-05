import { useTheme } from "@/theme/ThemeContext";
import { useLocalSearchParams } from "expo-router";
import React, { useCallback, useMemo, useState } from "react";
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

// Define proper types
type FieldProps = {
  label: string;
  value: any;
  options?: any[];
  onChange: (val: any) => void;
  placeholder?: string;
  required?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: string;
};

type FormField = {
  key: string;
  label: string;
  type: string;
  placeholder?: string;
  required?: boolean;
  options?: any[];
};

type Props = {
  payload?: Record<string, any>;
  onSubmit?: (data: any) => void;
};

export default function FormRenderer({ payload: propPayload, onSubmit: propOnSubmit }: Props) {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const params = useLocalSearchParams();
  
  // Memoize the default payload to prevent recreation on every render
  const defaultPayload = useMemo(() => ({
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
  }), []);

  // Parse params once and memoize
  const parsedParams = useMemo(() => {
    if (params.payload) {
      try {
        return {
          payload: JSON.parse(params.payload as string),
          title: params.title as string || "Form"
        };
      } catch (error) {
        console.error("Error parsing payload from params:", error);
        return null;
      }
    }
    return null;
  }, [params.payload, params.title]);

  // Determine initial payload
  const initialPayload = useMemo(() => {
    // Priority 1: Navigation params
    if (parsedParams?.payload) {
      return parsedParams.payload;
    }
    // Priority 2: Props
    if (propPayload) {
      return propPayload;
    }
    // Priority 3: Fallback to NGO payload
    return defaultPayload;
  }, [parsedParams, propPayload, defaultPayload]);

  const [formData, setFormData] = useState<Record<string, any>>(initialPayload);
  
  // Memoize form title to prevent unnecessary updates
  const formTitle = useMemo(() => {
    if (parsedParams?.title) {
      return parsedParams.title;
    }
    return "Dynamic Form";
  }, [parsedParams]);

  // Determine form type based on payload keys (memoized)
  const formType = useMemo(() => {
    const payload = initialPayload;
    if ('contactName' in payload || 'contactEmail' in payload || 'contactPhone' in payload) {
      return "NGO";
    } else if ('address' in payload && Object.keys(payload).length <= 9) {
      return "Hospital";
    } else if ('isEnabled' in payload) {
      return "NGO";
    }
    return "Centre";
  }, [initialPayload]);

  // Use auto-form schema with memoization
  const schema = useAutoFormSchema(formData) as FormField[];

  // Handle field changes
  const handleFieldChange = useCallback((fieldKey: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));
  }, []);

  const handleSubmit = useCallback(() => {
    if (propOnSubmit) {
      propOnSubmit(formData);
    } else {
      console.log(`Submitting ${formType} Form:`, formData);
      alert(`${formType} form submitted successfully!`);
    }
  }, [formData, formType, propOnSubmit]);

  // Helper function to get appropriate props for each field type
  const getFieldSpecificProps = useCallback((field: FormField): Partial<FieldProps> => {
    const baseProps = {
      placeholder: field.placeholder,
      required: field.required,
    };

    switch (field.type) {
      case 'textarea':
        return {
          ...baseProps,
          multiline: true,
          numberOfLines: 4,
        };
      case 'email':
        return {
          ...baseProps,
          keyboardType: 'email-address',
        };
      case 'phone':
        return {
          ...baseProps,
          keyboardType: 'phone-pad',
        };
      case 'url':
        return {
          ...baseProps,
          keyboardType: 'url',
        };
      case 'number':
        return {
          ...baseProps,
          keyboardType: 'numeric',
        };
      default:
        return baseProps;
    }
  }, []);

  // If no schema generated yet, show loading
  if (schema.length === 0) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.colorBgSurface }]}>
        <View style={styles.loadingContainer}>
          <Text style={{ color: theme.colors.text }}>Loading form...</Text>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      style={[styles.container, { backgroundColor: theme.colors.colorBgSurface }]}
      contentContainerStyle={{
        padding: 16,
        paddingBottom: insets.bottom + 100,
      }}
    >
      <View style={styles.headerContainer}>
        <Text style={[styles.formTitle, { color: theme.colors.text }]}>
          {formTitle}
        </Text>
        {formType && (
          <View style={[styles.formTypeBadge, { backgroundColor: theme.colors.colorPrimary50 }]}>
            <Text style={[styles.formTypeText, { color: theme.colors.primary }]}>
              {formType}
            </Text>
          </View>
        )}
      </View>

      {schema.map((field) => {
        const Component = FieldRegistry[field.type as keyof typeof FieldRegistry];
        if (!Component) {
          console.warn(`No component registered for field type: ${field.type}`);
          return null;
        }

        const fieldSpecificProps = getFieldSpecificProps(field);
        const fieldProps: FieldProps = {
          label: field.label,
          value: formData[field.key],
          options: field.options,
          onChange: (val) => handleFieldChange(field.key, val),
          ...fieldSpecificProps,
        };

        return (
          <View key={field.key} style={styles.fieldWrapper}>
            <Component {...fieldProps} />
          </View>
        );
      })}

      <View style={[styles.summaryContainer, { borderColor: theme.colors.border }]}>
        <Text style={[styles.summaryTitle, { color: theme.colors.text }]}>
          Summary
        </Text>
        <Text style={[styles.summaryText, { color: theme.colors.colorTextSecondary }]}>
          {formType} • {Object.keys(formData).length} fields
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.submitBtn, { backgroundColor: theme.colors.primary }]}
        activeOpacity={0.85}
        onPress={handleSubmit}
      >
        <Text style={[styles.submitText, { color: theme.colors.colorBgPage }]}>
          Submit {formType}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  headerContainer: {
    marginBottom: 24,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  formTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
  },
  formTypeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  formTypeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  fieldWrapper: {
    marginBottom: 16,
  },
  summaryContainer: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
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