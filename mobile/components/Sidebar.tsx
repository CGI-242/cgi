import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import { useTranslation } from "react-i18next";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

interface NavItem {
  label: string;
  icon: IoniconsName;
  route?: string;
  disabled?: boolean;
}

interface ProfileItem {
  label: string;
  icon: IoniconsName;
  action: () => void;
  color?: string;
  separator?: boolean;
}

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentRoute: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: "sidebar.dashboard", icon: "home-outline", route: "/(app)" },
  { label: "sidebar.code", icon: "book-outline", route: "/(app)/code" },
  { label: "sidebar.simulators", icon: "calculator-outline", route: "/(app)/simulateur" },
  { label: "sidebar.chat", icon: "chatbubbles-outline", route: "/(app)/chat" },
];

function isRouteActive(currentRoute: string, itemRoute: string): boolean {
  if (itemRoute === "/(app)") {
    return currentRoute === "/" || currentRoute === "/(app)";
  }
  return currentRoute.startsWith(itemRoute.replace("/(app)", ""));
}

export default function Sidebar({ collapsed, onToggle, currentRoute }: SidebarProps) {
  const { colors } = useTheme();
  const logout = useAuthStore((s) => s.logout);
  const { t } = useTranslation();

  const profileItems: ProfileItem[] = [
    {
      label: t("sidebar.profile"),
      icon: "person-outline",
      action: () => router.push("/(app)/profil"),
    },
    {
      label: t("sidebar.settings"),
      icon: "settings-outline",
      action: () => router.push("/(app)/parametres"),
    },
    {
      label: t("sidebar.logout"),
      icon: "log-out-outline",
      action: () => logout(),
      color: colors.danger,
      separator: true,
    },
  ];

  const isCollapsed = collapsed;
  const sidebarWidth = isCollapsed ? 60 : 220;

  const handleNavPress = (route: string) => {
    router.push(route as any);
  };

  const handleProfileAction = (action: () => void) => {
    action();
  };

  return (
    <View
      style={{
        width: sidebarWidth,
        backgroundColor: colors.sidebar,
        paddingTop: 16,
        paddingBottom: 16,
        justifyContent: "space-between",
      }}
    >
      {/* Header : logo + bouton toggle */}
      <View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: isCollapsed ? "center" : "space-between",
            paddingHorizontal: isCollapsed ? 0 : 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
            marginBottom: 8,
          }}
        >
          {isCollapsed ? (
            <Text style={{ color: colors.accent, fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: 22 }}>C</Text>
          ) : (
            <View>
              <Text style={{ color: colors.accent, fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: 20 }}>CGI 242</Text>
              <Text style={{ color: colors.textMuted, fontSize: 11, fontFamily: fonts.regular }}>{t("sidebar.subtitle")}</Text>
            </View>
          )}
          {!isCollapsed && (
            <TouchableOpacity onPress={onToggle} accessibilityLabel={t("sidebar.collapse")} accessibilityRole="button">
              <Ionicons name="chevron-back-outline" size={20} color={colors.sidebarText} />
            </TouchableOpacity>
          )}
        </View>

        {isCollapsed && (
          <TouchableOpacity
            onPress={onToggle}
            style={{ alignItems: "center", paddingVertical: 8, marginBottom: 4 }}
            accessibilityLabel={t("sidebar.expand")}
            accessibilityRole="button"
          >
            <Ionicons name="chevron-forward-outline" size={20} color={colors.sidebarText} />
          </TouchableOpacity>
        )}

        {/* Navigation modules */}
        {NAV_ITEMS.map((item) => {
          const active = !item.disabled && item.route ? isRouteActive(currentRoute, item.route) : false;
          const disabled = !!item.disabled;

          return (
            <TouchableOpacity
              key={item.label}
              onPress={() => {
                if (!disabled && item.route) {
                  handleNavPress(item.route);
                }
              }}
              disabled={disabled}
              accessibilityLabel={t(item.label)}
              accessibilityRole="button"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                paddingVertical: 10,
                paddingHorizontal: isCollapsed ? 0 : 16,
                backgroundColor: active ? colors.input : "transparent",
                borderLeftWidth: active ? 3 : 0,
                borderLeftColor: active ? colors.accent : "transparent",
                opacity: disabled ? 0.5 : 1,
              }}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={active ? colors.accent : colors.sidebarText}
              />
              {!isCollapsed && (
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      color: active ? colors.accent : colors.sidebarText,
                      fontSize: 14,
                      fontFamily: fonts.regular,
                      fontWeight: active ? "700" : "400",
                    }}
                  >
                    {t(item.label)}
                  </Text>
                  {disabled && (
                    <View
                      style={{
                        backgroundColor: colors.input,
                        
                        paddingHorizontal: 5,
                        paddingVertical: 1,
                        marginLeft: 8,
                      }}
                    >
                      <Text style={{ fontSize: 9, fontFamily: fonts.bold, fontWeight: fontWeights.bold, color: colors.textMuted }}>{t("common.comingSoon")}</Text>
                    </View>
                  )}
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Spacer implicite via justifyContent: space-between sur le parent */}

      {/* Section profil (bas) */}
      <View>
        <View style={{ borderTopWidth: 1, borderTopColor: colors.border, marginBottom: 8 }} />
        {profileItems.map((item) => (
          <View key={item.label}>
            {item.separator && (
              <View style={{ borderTopWidth: 1, borderTopColor: colors.border, marginHorizontal: isCollapsed ? 8 : 16, marginVertical: 4 }} />
            )}
            <TouchableOpacity
              onPress={() => handleProfileAction(item.action)}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: isCollapsed ? "center" : "flex-start",
                paddingVertical: 10,
                paddingHorizontal: isCollapsed ? 0 : 16,
              }}
            >
              <Ionicons name={item.icon} size={20} color={item.color || colors.sidebarText} />
              {!isCollapsed && (
                <Text
                  style={{
                    color: item.color || colors.sidebarText,
                    fontSize: 14,
                    fontFamily: fonts.regular,
                    fontWeight: item.color ? "600" : "400",
                    marginLeft: 12,
                  }}
                >
                  {item.label}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
}
