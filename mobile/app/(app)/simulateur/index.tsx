import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const simulateurs = [
  {
    id: "its",
    title: "ITS",
    subtitle: "Impôt sur les Traitements et Salaires",
    description: "Barème progressif Art. 116 CGI 2026",
    icon: "people-outline" as const,
    route: "/(app)/simulateur/its",
  },
  {
    id: "is",
    title: "Minimum IS",
    subtitle: "Minimum de perception",
    description: "Acomptes trimestriels Art. 86B & 86C",
    icon: "business-outline" as const,
    route: "/(app)/simulateur/is",
  },
  {
    id: "patente",
    title: "Patente",
    subtitle: "Contribution des Patentes",
    description: "Barème Art. 306 CGI 2026",
    icon: "storefront-outline" as const,
    route: "/(app)/simulateur/patente",
  },
  {
    id: "solde-liquidation",
    title: "Solde IS",
    subtitle: "Solde de liquidation de l'IS",
    description: "Art. 86G CGI 2026",
    icon: "cash-outline" as const,
    route: "/(app)/simulateur/solde-liquidation",
  },
];

export default function SimulateurHub() {
  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 24, paddingTop: 48, paddingBottom: 32 }}>
        <TouchableOpacity
          onPress={() => router.push("/(app)")}
          className="flex-row items-center mb-4"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text className="text-white ml-2 text-base">Accueil</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 30, fontWeight: "900", color: "#00c17c" }}>Simulateurs</Text>
        <Text className="text-white mt-1" style={{ opacity: 0.85 }}>
          Simulez vos impôts selon le CGI Congo-Brazzaville
        </Text>
      </View>

      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Cards en grille */}
        <View className="flex-row flex-wrap" style={{ gap: 12 }}>
          {simulateurs.map((sim) => (
            <TouchableOpacity
              key={sim.id}
              style={{
                width: "48%",
                backgroundColor: "#fff",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                padding: 16,
              }}
              onPress={() => router.push(sim.route as any)}
            >
              <View
                style={{
                  backgroundColor: "#00815d15",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name={sim.icon} size={24} color="#00815d" />
              </View>
              <Text style={{ fontSize: 18, fontWeight: "800", color: "#00815d", marginBottom: 2 }}>{sim.title}</Text>
              <View className="px-2 py-0.5 self-start" style={{ backgroundColor: "#00815d20", borderRadius: 4, marginBottom: 6 }}>
                <Text style={{ fontSize: 9, fontWeight: "700", color: "#00815d" }}>CGI 2026</Text>
              </View>
              <Text style={{ fontSize: 12, color: "#374151", fontWeight: "500", marginBottom: 2 }}>{sim.subtitle}</Text>
              <Text style={{ fontSize: 10, color: "#6b7280" }}>{sim.description}</Text>
            </TouchableOpacity>
          ))}

          {/* Coming soon cards */}
          {["IBA", "IRCM"].map((title) => (
            <View
              key={title}
              style={{
                width: "48%",
                backgroundColor: "#f9fafb",
                borderRadius: 12,
                borderWidth: 1,
                borderColor: "#e5e7eb",
                padding: 16,
                opacity: 0.5,
              }}
            >
              <View
                style={{
                  backgroundColor: "#9ca3af20",
                  width: 44,
                  height: 44,
                  borderRadius: 12,
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="time-outline" size={24} color="#9ca3af" />
              </View>
              <Text style={{ fontSize: 16, fontWeight: "700", color: "#9ca3af", marginBottom: 4 }}>{title}</Text>
              <Text style={{ fontSize: 10, color: "#9ca3af" }}>Bientôt disponible</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
