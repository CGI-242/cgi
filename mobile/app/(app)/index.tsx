import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState, useMemo } from "react";
import { router } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";
import { Ionicons } from "@expo/vector-icons";

function getInitials(prenom?: string, nom?: string) {
  return ((prenom?.[0] || "") + (nom?.[0] || "")).toUpperCase() || "U";
}

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Bonjour";
  if (h < 18) return "Bon après-midi";
  return "Bonsoir";
}

const ECHEANCES = [
  { date: "15 mars", label: "Minimum perception IS (T1)", icon: "business-outline" as const },
  { date: "15 juin", label: "Minimum perception IS (T2)", icon: "business-outline" as const },
  { date: "15 sept.", label: "Minimum perception IS (T3)", icon: "business-outline" as const },
  { date: "15 déc.", label: "Minimum perception IS (T4)", icon: "business-outline" as const },
  { date: "15/mois", label: "TVA (mensuel)", icon: "receipt-outline" as const },
  { date: "15/mois", label: "ITS (mensuel)", icon: "people-outline" as const },
  { date: "15 avr.", label: "Patente annuelle", icon: "storefront-outline" as const },
  { date: "15 mars", label: "IRPP annuel", icon: "person-outline" as const },
  { date: "15 mai", label: "IRF (1ère échéance)", icon: "home-outline" as const },
  { date: "20 août", label: "IRF (2ème échéance)", icon: "home-outline" as const },
  { date: "15 nov.", label: "IRF (3ème échéance)", icon: "home-outline" as const },
];

const STATS = [
  { label: "Articles CGI", value: "7 000+", icon: "document-text-outline" as const, bg: "#e6f7f0", color: "#00815d" },
  { label: "Simulateurs", value: "4", icon: "calculator-outline" as const, bg: "#eef2ff", color: "#4f46e5" },
  { label: "Textes TFNC", value: "60+", icon: "library-outline" as const, bg: "#fef3c7", color: "#d97706" },
  { label: "Édition", value: "2026", icon: "calendar-outline" as const, bg: "#f3e8ff", color: "#9333ea" },
];

const QUICK_ACTIONS = [
  {
    label: "Consulter le CGI 2026",
    desc: "Code Général des Impôts en vigueur",
    icon: "book-outline" as const,
    bg: "#e6f7f0",
    color: "#00815d",
    route: "/(app)/code",
  },
  {
    label: "Simuler un impôt",
    desc: "ITS, Minimum IS, Patente, Solde IS",
    icon: "calculator-outline" as const,
    bg: "#eef2ff",
    color: "#4f46e5",
    route: "/(app)/simulateur",
  },
  {
    label: "Chat IA fiscal",
    desc: "Assistant fiscal intelligent",
    icon: "chatbubbles-outline" as const,
    bg: "#e0f2fe",
    color: "#0284c7",
    route: "/(app)/chat",
  },
];

const MOIS: Record<string, number> = {
  jan: 0, "fev": 1, "fév": 1, mars: 2, avr: 3, mai: 4, juin: 5,
  juil: 6, "aout": 7, "août": 7, sept: 8, oct: 9, nov: 10, "dec": 11, "déc": 11,
};

function trierEcheances(echeances: typeof ECHEANCES) {
  const now = new Date();
  const mois = now.getMonth();
  const jour = now.getDate();

  function joursAvant(dateStr: string): number {
    if (dateStr === "15/mois") {
      return jour <= 15 ? 15 - jour : 30 - jour + 15;
    }
    const m = dateStr.match(/(\d+)\s+(\w+)/);
    if (!m) return 999;
    const d = parseInt(m[1]);
    const mo = MOIS[m[2].replace(".", "")];
    if (mo === undefined) return 999;
    if (mo > mois || (mo === mois && d >= jour)) {
      return (mo - mois) * 30 + (d - jour);
    }
    return (mo + 12 - mois) * 30 + (d - jour);
  }

  return [...echeances].sort((a, b) => joursAvant(a.date) - joursAvant(b.date));
}

export default function Dashboard() {
  const user = useAuthStore((s) => s.user);
  const [showNotif, setShowNotif] = useState(false);
  const echeancesTriees = useMemo(() => trierEcheances(ECHEANCES), []);
  const notifCount = 0;

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 20, paddingTop: 32, paddingBottom: 12 }}>
        <View className="flex-row items-center justify-between">
          <View>
            <Text style={{ color: "#00c17c", fontWeight: "900", fontSize: 36, letterSpacing: 1 }}>CGI 242</Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 13 }}>Code Général des Impôts</Text>
          </View>

          <View className="flex-row items-center">
            <TouchableOpacity
              onPress={() => setShowNotif(!showNotif)}
              accessibilityLabel="Notifications"
              accessibilityRole="button"
              style={{ padding: 6, paddingHorizontal: 10, borderRadius: 6, marginRight: 8 }}
            >
              <Ionicons name="notifications-outline" size={22} color="#fff" />
              {notifCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 6,
                    width: 16,
                    height: 16,
                    borderRadius: 8,
                    backgroundColor: "#e74c3c",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ color: "#fff", fontSize: 10, fontWeight: "700" }}>{notifCount}</Text>
                </View>
              )}
            </TouchableOpacity>

            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 16,
                backgroundColor: "#00815d",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 13 }}>
                {getInitials(user?.prenom, user?.nom)}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Panneau notifications */}
      {showNotif && (
        <View
          style={{
            position: "absolute",
            top: 80,
            right: 16,
            left: 16,
            backgroundColor: "#fff",
            borderRadius: 12,
            zIndex: 100,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 16,
            elevation: 10,
          }}
        >
          <View
            className="flex-row items-center justify-between"
            style={{ paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#e5e7eb" }}
          >
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#374151" }}>Notifications</Text>
            <TouchableOpacity onPress={() => setShowNotif(false)} accessibilityLabel="Fermer" accessibilityRole="button">
              <Ionicons name="close" size={22} color="#6b7280" />
            </TouchableOpacity>
          </View>

          <View style={{ paddingVertical: 32, alignItems: "center" }}>
            <Ionicons name="checkmark-circle" size={40} color="#00c17c" style={{ marginBottom: 8 }} />
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#374151" }}>Vous êtes à jour</Text>
            <Text style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Aucune nouvelle notification</Text>
          </View>

          <TouchableOpacity
            style={{
              marginHorizontal: 16,
              marginBottom: 12,
              backgroundColor: "#00815d",
              borderRadius: 8,
              paddingVertical: 10,
              alignItems: "center",
            }}
            onPress={() => setShowNotif(false)}
            accessibilityLabel="Voir toutes les notifications"
            accessibilityRole="button"
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Voir toutes les notifications</Text>
          </TouchableOpacity>
        </View>
      )}

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Bienvenue */}
        <View className="px-4 pt-4 pb-2">
          <Text style={{ fontSize: 22, fontWeight: "800", color: "#1f2937" }}>
            {getGreeting()}, {user?.prenom || "Utilisateur"} !
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280", marginTop: 2 }}>
            Voici un aperçu de votre espace CGI 242
          </Text>
        </View>

        {/* Stats cards — grille 2x2 */}
        <View className="px-4 pt-2">
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
            {STATS.map((s) => (
              <View
                key={s.label}
                style={{
                  flex: 1,
                  minWidth: "45%",
                  backgroundColor: "#fff",
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  padding: 14,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    backgroundColor: s.bg,
                    alignItems: "center",
                    justifyContent: "center",
                    marginRight: 12,
                  }}
                >
                  <Ionicons name={s.icon} size={22} color={s.color} />
                </View>
                <View>
                  <Text style={{ fontSize: 20, fontWeight: "800", color: "#1f2937" }}>{s.value}</Text>
                  <Text style={{ fontSize: 12, color: "#6b7280" }}>{s.label}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Actions rapides */}
        <View className="px-4 pt-4">
          <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937", marginBottom: 10 }}>Actions rapides</Text>
          <View
            style={{
              backgroundColor: "#fff",
              borderRadius: 12,
              borderWidth: 1,
              borderColor: "#e5e7eb",
              overflow: "hidden",
            }}
          >
            {QUICK_ACTIONS.map((a, i) => {
              const disabled = !a.route;
              return (
                <TouchableOpacity
                  key={a.label}
                  onPress={() => a.route && router.push(a.route as any)}
                  disabled={disabled}
                  accessibilityLabel={a.label}
                  accessibilityRole="button"
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 14,
                    paddingVertical: 14,
                    borderBottomWidth: i < QUICK_ACTIONS.length - 1 ? 1 : 0,
                    borderBottomColor: "#f3f4f6",
                    opacity: disabled ? 0.5 : 1,
                  }}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      backgroundColor: a.bg,
                      alignItems: "center",
                      justifyContent: "center",
                      marginRight: 12,
                    }}
                  >
                    <Ionicons name={a.icon} size={20} color={a.color} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 14, fontWeight: "700", color: disabled ? "#9ca3af" : "#1f2937" }}>
                      {a.label}
                    </Text>
                    <Text style={{ fontSize: 12, color: "#9ca3af" }}>{a.desc}</Text>
                  </View>
                  {disabled ? (
                    <View style={{ backgroundColor: "#f3f4f6", borderRadius: 4, paddingHorizontal: 6, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: "700", color: "#9ca3af" }}>BIENTÔT</Text>
                    </View>
                  ) : (
                    <Ionicons name="chevron-forward" size={18} color="#d1d5db" />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Echeances fiscales */}
        <View className="px-4 pt-4">
          <View className="flex-row items-center mb-2">
            <Ionicons name="calendar-outline" size={15} color="#00815d" style={{ marginRight: 6 }} />
            <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>Prochaines échéances fiscales</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
            {echeancesTriees.map((e) => (
              <View
                key={`${e.date}-${e.label}`}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  minWidth: 140,
                }}
              >
                <View className="flex-row items-center mb-1">
                  <Ionicons name={e.icon} size={13} color="#00815d" style={{ marginRight: 5 }} />
                  <Text style={{ fontSize: 14, fontWeight: "700", color: "#00815d" }}>{e.date}</Text>
                </View>
                <Text style={{ fontSize: 13, color: "#374151" }}>{e.label}</Text>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Footer */}
        <View className="px-4 pt-5 items-center">
          <Text style={{ fontSize: 12, color: "#9ca3af" }}>CGI242 v1.0.0 — Édition 2026</Text>
          <Text style={{ fontSize: 11, color: "#d1d5db", marginTop: 1 }}>NormX AI</Text>
        </View>
      </ScrollView>
    </View>
  );
}
