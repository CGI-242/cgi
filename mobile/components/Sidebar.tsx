import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";

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
  { label: "Dashboard", icon: "home-outline", route: "/(app)" },
  { label: "Code CGI", icon: "book-outline", route: "/(app)/code" },
  { label: "Simulateurs", icon: "calculator-outline", route: "/(app)/simulateur" },
  { label: "Chat IA", icon: "chatbubbles-outline", route: "/(app)/chat" },
  { label: "Alertes", icon: "notifications-outline", route: "/(app)/alertes" },
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

  const profileItems: ProfileItem[] = [
    {
      label: "Mon profil",
      icon: "person-outline",
      action: () => router.push("/(app)/profil"),
    },
    {
      label: "Paramètres",
      icon: "settings-outline",
      action: () => router.push("/(app)/parametres"),
    },
    {
      label: "Se déconnecter",
      icon: "log-out-outline",
      action: () => logout(),
      color: "#e74c3c",
      separator: true,
    },
  ];

  const sidebarWidth = collapsed ? 60 : 220;

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
            justifyContent: collapsed ? "center" : "space-between",
            paddingHorizontal: collapsed ? 0 : 16,
            paddingBottom: 12,
            borderBottomWidth: 1,
            borderBottomColor: "#333",
            marginBottom: 8,
          }}
        >
          {collapsed ? (
            <Text style={{ color: colors.accent, fontWeight: "900", fontSize: 22 }}>C</Text>
          ) : (
            <View>
              <Text style={{ color: colors.accent, fontWeight: "900", fontSize: 20 }}>CGI 242</Text>
              <Text style={{ color: "rgba(255,255,255,0.4)", fontSize: 11 }}>Code Général des Impôts</Text>
            </View>
          )}
          {!collapsed && (
            <TouchableOpacity onPress={onToggle} accessibilityLabel="Replier la sidebar" accessibilityRole="button">
              <Ionicons name="chevron-back-outline" size={20} color={colors.sidebarText} />
            </TouchableOpacity>
          )}
        </View>

        {collapsed && (
          <TouchableOpacity
            onPress={onToggle}
            style={{ alignItems: "center", paddingVertical: 8, marginBottom: 4 }}
            accessibilityLabel="Déployer la sidebar"
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
                  router.push(item.route as any);
                }
              }}
              disabled={disabled}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                paddingVertical: 10,
                paddingHorizontal: collapsed ? 0 : 16,
                backgroundColor: active ? "#333" : "transparent",
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
              {!collapsed && (
                <View style={{ flexDirection: "row", alignItems: "center", flex: 1, marginLeft: 12 }}>
                  <Text
                    style={{
                      color: active ? colors.accent : colors.sidebarText,
                      fontSize: 14,
                      fontWeight: active ? "700" : "400",
                    }}
                  >
                    {item.label}
                  </Text>
                  {disabled && (
                    <View
                      style={{
                        backgroundColor: "#333",
                        borderRadius: 3,
                        paddingHorizontal: 5,
                        paddingVertical: 1,
                        marginLeft: 8,
                      }}
                    >
                      <Text style={{ fontSize: 9, fontWeight: "700", color: colors.textMuted }}>BIENTÔT</Text>
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
        <View style={{ borderTopWidth: 1, borderTopColor: "#333", marginBottom: 8 }} />
        {profileItems.map((item) => (
          <View key={item.label}>
            {item.separator && (
              <View style={{ borderTopWidth: 1, borderTopColor: "#444", marginHorizontal: collapsed ? 8 : 16, marginVertical: 4 }} />
            )}
            <TouchableOpacity
              onPress={item.action}
              accessibilityLabel={item.label}
              accessibilityRole="button"
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: collapsed ? "center" : "flex-start",
                paddingVertical: 10,
                paddingHorizontal: collapsed ? 0 : 16,
              }}
            >
              <Ionicons name={item.icon} size={20} color={item.color || colors.sidebarText} />
              {!collapsed && (
                <Text
                  style={{
                    color: item.color || colors.sidebarText,
                    fontSize: 14,
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
