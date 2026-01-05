import { useTheme } from "@/theme/ThemeContext";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

type Props = {
  search: string;
};

export default function SubmittedCentreTab({ search }: Props) {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <RemixIcon
        name="information-line"
        size={28}
        color={theme.colors.primary}
      />
      <Text style={styles.text}>
        No submitted centres found
      </Text>
      {search.length > 0 && (
        <Text style={styles.searchHint}>
          for “{search}”
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginTop: 80,
    alignItems: "center",
  },
  text: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  searchHint: {
    marginTop: 4,
    fontSize: 12,
    color: "#999",
  },
});
