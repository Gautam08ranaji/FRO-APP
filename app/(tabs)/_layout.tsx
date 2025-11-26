import { HapticTab } from '@/components/haptic-tab';
import { useTheme } from '@/theme/ThemeContext'; // ✅ Your theme
import { Tabs } from 'expo-router';
import React from 'react';
import RemixIcon from 'react-native-remix-icon';

export default function TabLayout() {
  const { theme } = useTheme(); // ✅ Access your theme values

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        // ✅ Apply theme colors
        tabBarActiveTintColor: theme.colors.btnPrimaryBg,
        tabBarInactiveTintColor: theme.colors.colorTextSecondary,
        tabBarStyle: {
          backgroundColor: theme.colors.background,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 8,
        },

        tabBarButton: HapticTab, // Keep haptic feedback
      }}
    >
      <Tabs.Screen
        name="(dashboard)"
        options={{
          title: 'Home',

          // ✅ Icon with theme-aware color
          tabBarIcon: ({ color }) => (
              <RemixIcon name="home-3-line" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(complaints)"
        options={{
          title: 'complaints',

          // ✅ Icon with theme-aware color
          tabBarIcon: ({ color }) => (
              <RemixIcon name="customer-service-line" size={28} color={color} />
          ),
        }}
      />

            <Tabs.Screen
        name="(info)"
        options={{
          title: 'Info',

          // ✅ Icon with theme-aware color
          tabBarIcon: ({ color }) => (
            <RemixIcon name="article-line" size={28} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="(profile)"
        options={{
          title: 'Profile',

          // ✅ Icon with theme-aware color
          tabBarIcon: ({ color }) => (
            <RemixIcon name="user-line" size={28} color={color} />
          ),
        }}
      />


    </Tabs>
  );
}
