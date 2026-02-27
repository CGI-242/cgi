import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Redirect, Stack, usePathname, router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useOfflineSync } from "@/lib/hooks/useOfflineSync";
import { usePushNotifications } from "@/lib/hooks/usePushNotifications";
import Sidebar from "@/components/Sidebar";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";

function getInitials(prenom?: string, nom?: string) {
  return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase() || "U";
}

const PAGE_TITLES: Record<string, string> = {
  "/profil": "profil.title",
  "/parametres": "settings.title",
  "/alertes": "alertes.title",
  "/chat": "chat.title",
  "/code": "code.title",
  "/simulateur": "simulateur.title",
  "/simulateur/its": "simulateur.its.title",
  "/simulateur/is": "simulateur.is.title",
  "/simulateur/patente": "simulateur.patente.title",
  "/simulateur/solde-liquidation": "simulateur.solde.title",
  "/abonnement": "settings.managementSubscription",
  "/organisation": "settings.managementOrganization",
  "/analytics": "settings.managementAnalytics",
  "/audit": "settings.managementAudit",
  "/permissions": "settings.managementPermissions",
  "/admin": "settings.managementAdmin",
  "/securite": "settings.twoFactor",
  "/legal/cgu": "settings.terms",
  "/legal/confidentialite": "settings.privacy",
};

export default function AppLayout() {
  const { mode, toggleTheme, colors } = useTheme();
  const { t, i18n } = useTranslation();
  useOfflineSync();
  usePushNotifications();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const loggedOut = useAuthStore((s) => s.loggedOut);
  const user = useAuthStore((s) => s.user);
  const isOnline = useOnlineStatus();
  const pathname = usePathname();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  if (!isAuthenticated) {
    if (loggedOut) {
      return <Redirect href="/(auth)/logout" />;
    }
    return <Redirect href="/(auth)" />;
  }

  const isHome = pathname === "/" || pathname === "/(app)";
  const pageTitleKey = !isHome ? PAGE_TITLES[pathname] : null;

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentRoute={pathname}
      />
      <View style={{ flex: 1 }}>
        {/* Header principal — toujours visible */}
        <View style={{ backgroundColor: colors.headerBg, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {/* Breadcrumb / fil d'Ariane */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => router.push("/(app)")}>
                <Text style={{ color: isHome ? colors.accent : colors.textMuted, fontWeight: "900", fontSize: isHome ? 28 : 16, letterSpacing: 1 }}>
                  CGI 242
                </Text>
              </TouchableOpacity>
              {!isHome && pageTitleKey && (
                <>
                  <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ marginHorizontal: 6 }} />
                  <Text style={{ color: colors.accent, fontWeight: "700", fontSize: 16 }}>
                    {t(pageTitleKey)}
                  </Text>
                </>
              )}
              {isHome && (
                <Text style={{ color: colors.textMuted, fontSize: 12, marginLeft: 8 }}>{t("sidebar.subtitle")}</Text>
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {/* Toggle langue */}
              <TouchableOpacity
                onPress={() => i18n.changeLanguage(i18n.language === "fr" ? "en" : "fr")}
                accessibilityLabel={t("settings.languageSelect")}
                accessibilityRole="button"
                style={{ padding: 6, borderRadius: 6, marginRight: 4 }}
              >
                <Text style={{ color: colors.sidebarText, fontSize: 13, fontWeight: "700" }}>
                  {i18n.language === "fr" ? "FR" : "EN"}
                </Text>
              </TouchableOpacity>

              {/* Toggle thème */}
              <TouchableOpacity
                onPress={toggleTheme}
                accessibilityLabel={t("settings.darkMode")}
                accessibilityRole="button"
                style={{ padding: 6, borderRadius: 6, marginRight: 4 }}
              >
                <Ionicons name={mode === "dark" ? "moon" : "sunny"} size={20} color={colors.sidebarText} />
              </TouchableOpacity>

              {/* Notifications */}
              <TouchableOpacity
                onPress={() => router.push("/(app)/alertes")}
                accessibilityLabel={t("dashboard.notifications")}
                accessibilityRole="button"
                style={{ padding: 6, borderRadius: 6, marginRight: 6 }}
              >
                <Ionicons name="notifications-outline" size={20} color={colors.sidebarText} />
              </TouchableOpacity>

              {/* Avatar */}
              <TouchableOpacity
                onPress={() => router.push("/(app)/profil")}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 15,
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: "#fff", fontWeight: "800", fontSize: 12 }}>
                  {getInitials(user?.prenom, user?.nom)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Bannière offline */}
        {!isOnline && (
          <View style={{ backgroundColor: colors.warning, paddingHorizontal: 16, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="cloud-offline-outline" size={16} color={colors.sidebarText} style={{ marginRight: 8 }} />
            <Text style={{ color: colors.sidebarText, fontSize: 13, fontWeight: "600" }}>
              {t("offline.banner")}
            </Text>
          </View>
        )}

        {/* Contenu */}
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "slide_from_right",
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="code/index" />
          <Stack.Screen name="simulateur/index" />
          <Stack.Screen name="simulateur/its" />
          <Stack.Screen name="simulateur/is" />
          <Stack.Screen name="simulateur/patente" />
          <Stack.Screen name="simulateur/solde-liquidation" />
          <Stack.Screen name="chat/index" />
          <Stack.Screen name="abonnement/index" />
          <Stack.Screen name="admin/index" />
          <Stack.Screen name="profil/index" />
          <Stack.Screen name="parametres/index" />
          <Stack.Screen name="organisation/index" />
          <Stack.Screen name="securite/index" />
          <Stack.Screen name="analytics/index" />
          <Stack.Screen name="audit/index" />
          <Stack.Screen name="permissions/index" />
          <Stack.Screen name="alertes/index" />
          <Stack.Screen name="legal/cgu" />
          <Stack.Screen name="legal/confidentialite" />
        </Stack>
      </View>
    </View>
  );
}
