import { Stack } from "expo-router";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function LegalLayout() {
  const { colors } = useTheme();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    />
  );
}
