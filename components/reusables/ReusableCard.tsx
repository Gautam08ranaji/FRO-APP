import React from "react";
import {
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import RemixIcon from "react-native-remix-icon";

interface Props {
  icon: string;
  count: number | string;
  title: string;

  // ✅ Card background
  cardBg?: string;
  bg?: string;

  iconBg?: string;
  iconColor?: string;

  // ✅ Count Controls
  countBg?: string;
  countColor?: string;
  countContainerStyle?: StyleProp<ViewStyle>;
  countTextStyle?: StyleProp<TextStyle>;

  // ✅ Second Optional Title
  subTitle?: number | string;
  subTitleColor?: string;
  subTitleStyle?: StyleProp<TextStyle>;

  titleColor?: string;
  titleStyle?: StyleProp<TextStyle>;

  onPress?: () => void;
}

export default function ReusableCard({
  icon,
  count,
  title,

  // ✅ Card background priority
  cardBg,
  bg = "#FFFFFF",

  iconBg = "#2F80ED20",
  iconColor = "#FFFFFF",

  countBg,
  countColor = "#000",
  countContainerStyle,
  countTextStyle,

  subTitle,
  subTitleColor = "#666",
  subTitleStyle,

  titleColor = "#000",
  titleStyle,

  onPress,
}: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      style={{
        backgroundColor: cardBg ?? bg, // ✅ priority applied
        padding: 16,
        borderRadius: 14,
        flex: 1,
        minWidth: 0,
        elevation: 6,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      }}
    >
      {/* ---------------- TOP ROW ---------------- */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            backgroundColor: iconBg,
            padding: 10,
            borderRadius: 12,
          }}
        >
          <RemixIcon name={icon as any} size={30} color={iconColor} />
        </View>

        {countBg ? (
          <View
            style={[
              {
                backgroundColor: countBg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              },
              countContainerStyle,
            ]}
          >
            <Text
              style={[
                {
                  fontSize: 18,
                  fontWeight: "600",
                  color: countColor,
                },
                countTextStyle,
              ]}
            >
              {count}
            </Text>
          </View>
        ) : (
          <Text
            style={[
              {
                fontSize: 22,
                fontWeight: "600",
                color: countColor,
              },
              countTextStyle,
            ]}
          >
            {count}
          </Text>
        )}
      </View>

      {/* ---------------- TITLES ---------------- */}
      {subTitle ? (
        <Text
          style={[
            {
              marginTop: 14,
              fontSize: 24,
              color: subTitleColor,
            },
            subTitleStyle,
          ]}
        >
          {subTitle}
        </Text>
      ) : null}

      <View style={{ marginTop: subTitle ? 10 : 15 }}>
        <Text
          style={[
            {
              fontSize: 18,
              color: titleColor,
            },
            titleStyle,
          ]}
        >
          {title}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
