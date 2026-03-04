import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";

type Props = {
  favoritesCount: number;
};

const GRID_ITEMS: { icon: keyof typeof Ionicons.glyphMap; title: string; sub: string; route: string }[] = [
  { icon: "book", title: "CGI", sub: "7 000+ articles", route: "/(app)/code" },
  { icon: "chatbubbles", title: "Assistant IA", sub: "Posez vos questions", route: "/(app)/chat" },
  { icon: "stats-chart", title: "Simulateurs", sub: "ITS, IS, Patente", route: "/(app)/simulateur" },
  { icon: "star", title: "Favoris", sub: "0 articles", route: "" },
];

const QUICK_ARTICLES = [
  { num: "Art. 45", desc: "Champ d\u2019application ITS", titre: "Titre I", route: "/(app)/code" },
  { num: "Art. 67", desc: "Barème progressif ITS", titre: "Titre I", route: "/(app)/code" },
  { num: "Art. 100", desc: "Champ d\u2019application IS", titre: "Titre II", route: "/(app)/code" },
];

export default function HomeCards({ favoritesCount }: Props) {
  const { colors } = useTheme();

  const cardBase = {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 18, paddingBottom: 30 }}>
      {/* Welcome */}
      <View style={{ marginBottom: 24 }}>
        <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.textSecondary, marginBottom: 4 }}>
          Bienvenue
        </Text>
        <Text style={{ fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold, fontSize: 24, color: colors.text, letterSpacing: -0.5 }}>
          CGI <Text style={{ color: colors.primary }}>242</Text>
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
          Congo-Brazzaville \u2022 \u00c9dition 2026
        </Text>
      </View>

      {/* Grid 2x2 */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginBottom: 28 }}>
        {GRID_ITEMS.map((item, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => item.route && router.push(item.route as Href)}
            style={{
              ...cardBase,
              flex: 1,
              minWidth: "45%",
              alignItems: "center",
              paddingVertical: 22,
              paddingHorizontal: 14,
            }}
          >
            <Ionicons name={item.icon} size={28} color={colors.primary} style={{ marginBottom: 8 }} />
            <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 14, color: colors.text, marginBottom: 3 }}>
              {item.title}
            </Text>
            <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: colors.textMuted }}>
              {item.title === "Favoris" ? `${favoritesCount} article${favoritesCount > 1 ? "s" : ""}` : item.sub}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Access */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
          <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 14, color: colors.text }}>
            Accès rapide
          </Text>
          <TouchableOpacity onPress={() => router.push("/(app)/code" as Href)}>
            <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 12, color: colors.primary }}>
              Voir tout
            </Text>
          </TouchableOpacity>
        </View>
        {QUICK_ARTICLES.map((art, i) => (
          <TouchableOpacity
            key={i}
            onPress={() => router.push(art.route as Href)}
            style={{
              ...cardBase,
              flexDirection: "row",
              alignItems: "center",
              gap: 14,
              padding: 14,
              marginBottom: 10,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: `${colors.primary}20`,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold, fontSize: 11, color: colors.primary }}>
                {art.num.replace("Art. ", "")}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 13, color: colors.text }}
                numberOfLines={1}
              >
                {art.num} — {art.desc}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: colors.textMuted }}>
                {art.titre}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        ))}
      </View>

      {/* Deadline card */}
      <View
        style={{
          ...cardBase,
          backgroundColor: `${colors.primary}10`,
          borderColor: `${colors.primary}25`,
          padding: 16,
        }}
      >
        <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 12, color: colors.primary, marginBottom: 6 }}>
          {"\ud83d\udcc5"} Prochaine échéance
        </Text>
        <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 13, color: colors.text }}>
          20 Avril 2026 — TVA Mars
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: colors.textMuted, marginTop: 2 }}>
          Déclaration et paiement TVA du mois de mars
        </Text>
      </View>
    </ScrollView>
  );
}
