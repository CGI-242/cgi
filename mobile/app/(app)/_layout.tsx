import { useState } from "react";
import { View, Text } from "react-native";
import { Redirect, Stack, usePathname } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import Sidebar from "@/components/Sidebar";

export default function AppLayout() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const isOnline = useOnlineStatus();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
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
          <View style={{ backgroundColor: "#f59e0b", paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="cloud-offline-outline" size={16} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: "#fff", fontSize: 13, fontWeight: "600" }}>
              Mode hors-ligne — Le Code CGI et les simulateurs restent accessibles
            </Text>
          </View>
        )}
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: "#00815d" },
            headerTintColor: "#fff",
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
        </Stack>
      </View>
    </View>
  );
}
