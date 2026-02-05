import { useTheme } from "@/theme/ThemeContext";
import React, { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, StyleSheet, Text } from "react-native";
import { LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

type Props = {
  closed: number;
  open: number;
  inProgress: number;
};

export default function DashboardAnimatedChart({
  closed,
  open,
  inProgress,
}: Props) {
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const [chartData, setChartData] = useState([0, 0, 0]);

  useEffect(() => {
    setChartData([closed, open, inProgress]);

    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 900,
      useNativeDriver: true,
    }).start();
  }, [closed, open, inProgress]);

  return (
    <Animated.View style={{ opacity: fadeAnim }}>
      <Text style={[styles.title, { color: theme.colors.colorPrimary600 }]}>
        Case Performance Trend
      </Text>

      <LineChart
        data={{
          labels: ["Closed", "Open", "Progress"],
          datasets: [{ data: chartData }],
        }}
        width={screenWidth - 32}
        height={220}
        yAxisInterval={1}
        bezier
        chartConfig={{
          backgroundGradientFrom: theme.colors.colorBgPage,
          backgroundGradientTo: theme.colors.colorBgPage,
          decimalPlaces: 0,
          color: () => theme.colors.colorPrimary600,
          labelColor: () => theme.colors.colorTextSecondary,
        }}
        style={styles.chart}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  chart: {
    marginVertical: 10,
    borderRadius: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 20,
  },
});
