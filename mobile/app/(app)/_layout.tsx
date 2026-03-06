import { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, Platform, ActivityIndicator } from "react-native";
import { Redirect, Stack, usePathname, router, type Href } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useOnlineStatus } from "@/lib/hooks/useOnlineStatus";
import { useOfflineSync } from "@/lib/hooks/useOfflineSync";
import { usePushNotifications } from "@/lib/hooks/usePushNotifications";
import Sidebar from "@/components/Sidebar";
import SessionExpiredModal from "@/components/SessionExpiredModal";
import PaywallScreen from "@/components/paywall/PaywallScreen";
import MobileHeader from "@/components/mobile/MobileHeader";
import MobileTabBar, { type TabKey } from "@/components/mobile/MobileTabBar";
import SearchOverlay from "@/components/mobile/SearchOverlay";
import { api } from "@/lib/api/client";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";

function getInitials(prenom?: string, nom?: string) {
  return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase() || "U";
}

const PAGE_TITLES: Record<string, string> = {
  "/plus": "plus.title",
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
  "/simulateur/cession-parts": "simulateur.cessionParts.title",
  "/simulateur/contribution-fonciere": "simulateur.foncier.title",
  "/simulateur/paie": "simulateur.paie.title",
  "/simulateur/retenue-source": "simulateur.rts.title",
  "/calendrier": "calendrier.title",
  "/abonnement": "settings.managementSubscription",
  "/organisation": "settings.managementOrganization",
  "/analytics": "settings.managementAnalytics",
  "/audit": "settings.managementAudit",
  "/permissions": "settings.managementPermissions",
  "/admin": "settings.managementAdmin",
  "/securite": "settings.twoFactor",
};

const PAGE_PARENTS: Record<string, { path: string; titleKey: string }> = {
  "/profil": { path: "/plus", titleKey: "plus.title" },
  "/parametres": { path: "/plus", titleKey: "plus.title" },
  "/securite": { path: "/plus", titleKey: "plus.title" },
  "/abonnement": { path: "/plus", titleKey: "plus.title" },
  "/organisation": { path: "/plus", titleKey: "plus.title" },
  "/analytics": { path: "/plus", titleKey: "plus.title" },
  "/audit": { path: "/plus", titleKey: "plus.title" },
  "/permissions": { path: "/plus", titleKey: "plus.title" },
  "/admin": { path: "/plus", titleKey: "plus.title" },
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
  "/simulateur/cession-parts": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/contribution-fonciere": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/paie": { path: "/simulateur", titleKey: "simulateur.title" },
  "/simulateur/retenue-source": { path: "/simulateur", titleKey: "simulateur.title" },
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
  const [searchVisible, setSearchVisible] = useState(false);
  const [subStatus, setSubStatus] = useState<string | null>(null);
  const [subLoading, setSubLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated) {
      api.get("/subscription/quota")
        .then((res) => setSubStatus(res.data.status))
        .catch(() => setSubStatus(null))
        .finally(() => setSubLoading(false));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated && !loggedOut) {
    return <Redirect href="/(auth)" />;
  }

  if (!isAuthenticated && loggedOut) {
    return null;
  }

  if (subLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 14 }}>{t("abonnement.loadingSubscription")}</Text>
      </View>
    );
  }

  if (subStatus === "EXPIRED" && user?.globalRole !== "ADMIN") {
    return <PaywallScreen />;
  }

  const isHome = pathname === "/" || pathname === "/(app)";
  const pageTitleKey = !isHome ? PAGE_TITLES[pathname] : null;
  const parent = !isHome ? PAGE_PARENTS[pathname] : null;

  // ── Mapping route → onglet actif pour MobileTabBar ──
  const getActiveTab = (): TabKey => {
    if (pathname.startsWith("/code")) return "cgi";
    if (pathname.startsWith("/simulateur")) return "sim";
    if (pathname.startsWith("/calendrier")) return "cal";
    if (pathname.startsWith("/chat")) return "chat";
    if (pathname.startsWith("/plus") || pathname.startsWith("/profil") || pathname.startsWith("/parametres") || pathname.startsWith("/securite") || pathname.startsWith("/abonnement")) return "plus";
    return "home";
  };

  const handleMobileTabPress = useCallback((tab: TabKey) => {
    const routes: Record<TabKey, string> = {
      home: "/(app)",
      cgi: "/(app)/code",
      sim: "/(app)/simulateur",
      cal: "/(app)/calendrier",
      chat: "/(app)/chat",
      plus: "/(app)/plus",
    };
    router.push(routes[tab] as Href);
  }, []);

  // Titre dynamique pour le header mobile
  const getMobileTitle = (): string => {
    if (isHome) return "NORMX Tax";
    if (pageTitleKey) return t(pageTitleKey);
    return "CGI 242";
  };

  // Bouton retour : visible si on n'est pas sur un écran principal
  const mobileShowBack = !isHome && !(["/code", "/simulateur", "/calendrier", "/chat", "/plus"].includes(pathname));

  const handleMobileBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(app)" as Href);
    }
  }, []);

  // ── Stack commun (partagé mobile + desktop) ──
  const stackScreens = (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: Platform.OS === "web" ? "none" : "slide_from_right",
        contentStyle: { backgroundColor: colors.background },
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
      <Stack.Screen name="simulateur/cession-parts" />
      <Stack.Screen name="simulateur/contribution-fonciere" />
      <Stack.Screen name="simulateur/paie" />
      <Stack.Screen name="simulateur/retenue-source" />
      <Stack.Screen name="calendrier/index" />
      <Stack.Screen name="chat/index" />
      <Stack.Screen name="abonnement/index" />
      <Stack.Screen name="admin/index" />
      <Stack.Screen name="plus/index" />
      <Stack.Screen name="profil/index" />
      <Stack.Screen name="parametres/index" />
      <Stack.Screen name="organisation/index" />
      <Stack.Screen name="securite/index" />
      <Stack.Screen name="analytics/index" />
      <Stack.Screen name="audit/index" />
      <Stack.Screen name="permissions/index" />
    </Stack>
  );

  // ══════════════════════════════════════════════
  // Sur mobile : MobileHeader + Stack + MobileTabBar
  // ══════════════════════════════════════════════
  if (isMobile) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <MobileHeader
          title={getMobileTitle()}
          showBack={mobileShowBack}
          onBack={handleMobileBack}
          onSearch={() => setSearchVisible(true)}
          rightElement={
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <TouchableOpacity onPress={toggleTheme} hitSlop={8}>
                <Ionicons name={mode === "dark" ? "moon" : "sunny"} size={18} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          }
        />
        <SearchOverlay visible={searchVisible} onClose={() => setSearchVisible(false)} />

        {/* Bannière offline */}
        {!isOnline && (
          <View style={{ backgroundColor: colors.warning, paddingHorizontal: 16, paddingVertical: 6, flexDirection: "row", alignItems: "center", justifyContent: "center" }}>
            <Ionicons name="cloud-offline-outline" size={14} color={colors.userBubbleText} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.userBubbleText, fontSize: 12, fontWeight: "600" }}>{t("offline.banner")}</Text>
          </View>
        )}

        {/* Contenu — vrais écrans via Stack */}
        <View style={{ flex: 1 }}>
          {stackScreens}
        </View>

        <MobileTabBar active={getActiveTab()} onTabPress={handleMobileTabPress} />
        <SessionExpiredModal />
      </View>
    );
  }

  // ══════════════════════════════════════════════
  // Sur desktop/tablet : Sidebar + Header + Stack
  // ══════════════════════════════════════════════
  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentRoute={pathname}
      />
      <View style={{ flex: 1 }}>
        {/* Header principal */}
        <View style={{ backgroundColor: colors.headerBg, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 10 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity onPress={() => router.push("/(app)")} accessibilityLabel={t("common.home")} accessibilityRole="link">
                <Text style={{ color: isHome ? colors.accent : colors.textMuted, fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: isHome ? 28 : 16, letterSpacing: 1 }}>
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
                  <Text style={{ color: colors.accent, fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 16 }}>
                    {t(pageTitleKey)}
                  </Text>
                </>
              )}
              {isHome && (
                <Text style={{ color: colors.textMuted, fontSize: 12, marginLeft: 8 }}>{t("sidebar.subtitle")}</Text>
              )}
            </View>

            <View style={{ flexDirection: "row", alignItems: "center" }}>
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

              <TouchableOpacity
                onPress={toggleTheme}
                accessibilityLabel={t("settings.darkMode")}
                accessibilityRole="button"
                style={{ padding: 6, marginRight: 4 }}
              >
                <Ionicons name={mode === "dark" ? "moon" : "sunny"} size={20} color={colors.sidebarText} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push("/(app)/profil")}
                accessibilityLabel={t("profil.title")}
                accessibilityRole="button"
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
        {stackScreens}
      </View>
      <SessionExpiredModal />
    </View>
  );
}
