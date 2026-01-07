import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function SubmittedCentreTab() {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Submitted Centres</Text>
        <Text style={styles.subtitle}>
          Submitted centre list will appear here
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    elevation: 2,
  },

  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#212121",
    marginBottom: 6,
  },

  subtitle: {
    fontSize: 14,
    color: "#757575",
  },
});
