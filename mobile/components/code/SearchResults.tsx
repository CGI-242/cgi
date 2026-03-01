import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import type { ArticleData } from "@/lib/data/cgi";

type Props = {
  query: string;
  results: ArticleData[];
  onSelectArticle: (article: ArticleData) => void;
};

export default function SearchResults({ query, results, onSelectArticle }: Props) {
  const { colors } = useTheme();

  if (results.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
        <Ionicons name="search-outline" size={64} color={colors.textMuted} />
        <Text style={{ fontSize: 18, color: colors.textMuted, marginTop: 16, textAlign: "center" }}>
          Aucun resultat pour "{query}"
        </Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>
          Essayez avec un autre terme (article, mot-cle, texte)
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
        {results.length} resultat{results.length > 1 ? "s" : ""} pour "{query}"
      </Text>

      {results.map((art) => (
        <TouchableOpacity
          key={art.article}
          style={{
            backgroundColor: colors.card,
            padding: 16,
            marginBottom: 12,
            shadowColor: "#000",
            shadowOpacity: 0.05,
            shadowRadius: 4,
            elevation: 2,
          }}
          onPress={() => onSelectArticle(art)}
        >
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>{art.article}</Text>
            <View style={{ backgroundColor: colors.primary + "20", paddingHorizontal: 8, paddingVertical: 4 }}>
              <Text style={{ fontSize: 12, color: colors.primary }}>{art.statut}</Text>
            </View>
          </View>
          <Text style={{ fontSize: 14, color: colors.text, marginBottom: 8 }}>{art.titre}</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted }} numberOfLines={2}>
            {art.texte.find((t) => t.length > 0) || ""}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8 }}>
            {art.mots_cles.slice(0, 3).map((mc) => (
              <Text key={mc} style={{ fontSize: 12, color: colors.primary, marginRight: 8 }}>#{mc}</Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
