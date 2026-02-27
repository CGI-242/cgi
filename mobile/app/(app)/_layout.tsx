import { useState } from "react";
import { View, Text } from "react-native";
import { Redirect, Stack, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useOfflineSync } from "@/lib/hooks/useOfflineSync";
import { usePushNotifications } from "@/lib/hooks/usePushNotifications";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function AppLayout() {
  const { colors } = useTheme();
  useOfflineSync();
  usePushNotifications();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loggedOut = useAuthStore((s) => s.loggedOut);
  const isOnline = useOnlineStatus();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    if (loggedOut) {
      return <Redirect href="/(auth)/logout" />;
    }
    return <Redirect href="/(auth)" />;
  }

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentRoute={pathname}
      />
      <View style={{ flex: 1 }}>
        {!isOnline && (
          <View style={{ backgroundColor: colors.warning, paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="cloud-offline-outline" size={16} color={colors.sidebarText} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.sidebarText, fontSize: 13, fontWeight: "600" }}>
              Mode hors-ligne — Le Code CGI et les simulateurs restent accessibles
            </Text>
          </View>
        )}
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: colors.sidebarText,
            headerTitleStyle: { fontWeight: "bold" },
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="code/index" options={{ headerShown: false }} />
          <Stack.Screen name="simulateur/index" options={{ headerShown: false }} />
          <Stack.Screen name="simulateur/its" options={{ headerShown: false }} />
          <Stack.Screen name="simulateur/is" options={{ headerShown: false }} />
          <Stack.Screen name="simulateur/patente" options={{ headerShown: false }} />
          <Stack.Screen name="simulateur/solde-liquidation" options={{ headerShown: false }} />
          <Stack.Screen name="chat/index" options={{ headerShown: false }} />
          <Stack.Screen name="abonnement/index" options={{ headerShown: false }} />
          <Stack.Screen name="admin/index" options={{ headerShown: false }} />
          <Stack.Screen name="profil/index" options={{ headerShown: false }} />
          <Stack.Screen name="parametres/index" options={{ headerShown: false }} />
          <Stack.Screen name="organisation/index" options={{ headerShown: false }} />
          <Stack.Screen name="securite/index" options={{ headerShown: false }} />
          <Stack.Screen name="analytics/index" options={{ headerShown: false }} />
          <Stack.Screen name="audit/index" options={{ headerShown: false }} />
          <Stack.Screen name="permissions/index" options={{ headerShown: false }} />
          <Stack.Screen name="alertes/index" options={{ headerShown: false }} />
          <Stack.Screen name="legal/cgu" options={{ headerShown: false }} />
          <Stack.Screen name="legal/confidentialite" options={{ headerShown: false }} />
        </Stack>
      </View>
    </View>
  );
}
