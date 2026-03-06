import { Platform } from "react-native";
import { Stack } from "expo-router";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function AuthLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "web" ? "none" : "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
