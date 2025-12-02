import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import RemixIcon from "react-native-remix-icon";

interface Props {
    icon: string;
    count: number | string;
    title: string;
    bg?: string;
    iconBg?: string
    iconColor?: string
    countColor?:string
    titleColor?:string
    onPress?: () => void;
}

export default function ReusableCard({
    icon,
    count,
    title,
    bg = "#FFFFFF",
    iconBg = "#2F80ED20",
    iconColor = "#FFFFFF",
    countColor,
    titleColor,
    onPress,
}: Props) {
    return (
        <TouchableOpacity
            onPress={onPress}
            style={{
                backgroundColor: bg,
                padding: 16,
                borderRadius: 14,
                flex: 1,              // ⭐ auto-expand
                minWidth: 0,          // ⭐ required for flex:1 to shrink
                elevation: 6,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 3 },

            }}
        >

            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View
                    style={{
                        backgroundColor: iconBg,
                        padding: 10,
                        borderRadius: 12,
                    }}
                >
                    <RemixIcon name={icon as any} size={30} color={iconColor} />
                </View>

                <Text style={{ fontSize: 22, fontWeight: "600", color: countColor }}>
                    {count}
                </Text>
            </View>

            <Text style={{ marginTop: 10, fontSize: 20, color: titleColor }}>
                {title}
            </Text>
        </TouchableOpacity>
    );
}
