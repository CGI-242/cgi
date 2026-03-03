import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Redirect, Stack, usePathname, router, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useOfflineSync } from "@/lib/hooks/useOfflineSync";
import { usePushNotifications } from "@/lib/hooks/usePushNotifications";
import Sidebar from "@/components/Sidebar";
import SessionExpiredModal from "@/components/SessionExpiredModal";
import PaywallScreen from "@/components/paywall/PaywallScreen";
import { api } from "@/lib/api/client";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { useResponsive } from "@/lib/hooks/useResponsive";

function getInitials(prenom?: string, nom?: string) {
  return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase() || "U";
}

const PAGE_TITLES: Record<string, string> = {
  "/profil": "profil.title",
  "/parametres": "settings.title",
  "/chat": "chat.title",
  "/code": "code.title",
  "/simulateur": "simulateur.title",
  "/simulateur/its": "simulateur.its.title",
  "/simulateur/is": "simulateur.is.title",
  "/simulateur/patente": "simulateur.patente.title",
  "/simulateur/solde-liquidation": "simulateur.solde.title",
  "/simulateur/ircm": "simulateur.ircm.title",
  "/simulateur/irf-loyers": "simulateur.irfLoyers.title",
  "/simulateur/iba": "simulateur.iba.title",
  "/simulateur/tva": "simulateur.tva.title",
  "/simulateur/igf": "simulateur.igf.title",
  "/simulateur/enregistrement": "simulateur.enreg.title",
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

const PAGE_PARENTS: Record<string, { path: string; titleKey: string }> = {
  "/securite": { path: "/parametres", titleKey: "settings.title" },
  "/abonnement": { path: "/parametres", titleKey: "settings.title" },
  "/organisation": { path: "/parametres", titleKey: "settings.title" },
  "/analytics": { path: "/parametres", titleKey: "settings.title" },
  "/audit": { path: "/parametres", titleKey: "settings.title" },
  "/permissions": { path: "/parametres", titleKey: "settings.title" },
  "/admin": { path: "/parametres", titleKey: "settings.title" },
  "/legal/cgu": { path: "/parametres", titleKey: "settings.title" },
  "/legal/confidentialite": { path: "/parametres", titleKey: "settings.title" },
  "/simulateur/its": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/is": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/patente": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/solde-liquidation": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/ircm": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/irf-loyers": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/iba": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/tva": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/igf": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/enregistrement": { path: "/simulateur", titleKey: "simulateur.title" },
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
  const { isMobile } = useResponsive();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/subscription/quota", { _skipAuthRetry: true })
        .then((res) => setSubStatus(res.data.status))
        .catch(() => setSubStatus(null))
        .finally(() => setSubLoading(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    if (loggedOut) {
      return <Redirect href="/(auth)/logout" />;
    }
    return <Redirect href="/(auth)" />;
  }

  if (!subLoading && subStatus === "EXPIRED" && user?.globalRole !== "ADMIN") {
    return <PaywallScreen />;
  }

  const isHome = pathname === "/" || pathname === "/(app)";
  const pageTitleKey = !isHome ? PAGE_TITLES[pathname] : null;
  const parent = !isHome ? PAGE_PARENTS[pathname] : null;

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      {!isMobile && (
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          currentRoute={pathname}
        />
      )}
      <View style={{ flex: 1 }}>
        {/* Header principal — toujours visible */}
        <View style={{ backgroundColor: colors.headerBg, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            {/* Hamburger mobile + Breadcrumb */}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              {isMobile && (
                <TouchableOpacity
                  onPress={() => setMobileSidebarOpen(true)}
                  accessibilityLabel="Menu"
                  accessibilityRole="button"
                  style={{ padding: 6, marginRight: 8 }}
                >
                  <Ionicons name="menu" size={24} color={colors.accent} />
                </TouchableOpacity>
              )}
              <TouchableOpacity onPress={() => router.push("/(app)")}>
                <Text style={{ color: isHome ? colors.accent : colors.textMuted, fontWeight: "900", fontSize: isHome ? 28 : 16, letterSpacing: 1 }}>
                  CGI 242
                </Text>
              </TouchableOpacity>
              {!isHome && pageTitleKey && (
                <>
                  {parent && (
                    <>
                      <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ marginHorizontal: 6 }} />
                      <TouchableOpacity onPress={() => router.push(`/(app)${parent.path}` as Href)}>
                        <Text style={{ color: colors.textMuted, fontWeight: "600", fontSize: 16 }}>
                          {t(parent.titleKey)}
                        </Text>
                      </TouchableOpacity>
                    </>
                  )}
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
                style={{ padding: 6, marginRight: 4 }}
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
                style={{ padding: 6, marginRight: 4 }}
              >
                <Ionicons name={mode === "dark" ? "moon" : "sunny"} size={20} color={colors.sidebarText} />
              </TouchableOpacity>

              {/* Avatar */}
              <TouchableOpacity
                onPress={() => router.push("/(app)/profil")}
                style={{
                  width: 30,
                  height: 30,
                  
                  backgroundColor: colors.primary,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Text style={{ color: colors.sidebarText, fontWeight: "800", fontSize: 12 }}>
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
          <Stack.Screen name="simulateur/ircm" />
          <Stack.Screen name="simulateur/irf-loyers" />
          <Stack.Screen name="simulateur/iba" />
          <Stack.Screen name="simulateur/tva" />
          <Stack.Screen name="simulateur/igf" />
          <Stack.Screen name="simulateur/enregistrement" />
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
          <Stack.Screen name="legal/cgu" />
          <Stack.Screen name="legal/confidentialite" />
        </Stack>
      </View>
      {isMobile && (
        <Sidebar
          collapsed={false}
          onToggle={() => {}}
          currentRoute={pathname}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />
      )}
      <SessionExpiredModal />
    </View>
  );
}
