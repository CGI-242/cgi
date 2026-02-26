import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { ArticleData } from "@/lib/data/cgi";

type Props = {
  query: string;
  results: ArticleData[];
  onSelectArticle: (article: ArticleData) => void;
};

export default function SearchResults({ query, results, onSelectArticle }: Props) {
  if (results.length === 0) {
    return (
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name="search-outline" size={64} color="#ccc" />
        <Text className="text-lg text-muted mt-4 text-center">
          Aucun resultat pour "{query}"
        </Text>
        <Text className="text-sm text-muted mt-2 text-center">
          Essayez avec un autre terme (article, mot-cle, texte)
        </Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-6">
      <Text className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">
        {results.length} resultat{results.length > 1 ? "s" : ""} pour "{query}"
      </Text>

      {results.map((art) => (
        <TouchableOpacity
          key={art.article}
          className="bg-card p-4 mb-3"
          style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
          onPress={() => onSelectArticle(art)}
        >
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-base font-bold text-text">{art.article}</Text>
            <View className="bg-primary-light px-2 py-1">
              <Text className="text-xs text-primary">{art.statut}</Text>
            </View>
          </View>
          <Text className="text-sm text-text mb-2">{art.titre}</Text>
          <Text className="text-xs text-muted" numberOfLines={2}>
            {art.texte.find((t) => t.length > 0) || ""}
          </Text>
          <View className="flex-row flex-wrap mt-2">
            {art.mots_cles.slice(0, 3).map((mc) => (
              <Text key={mc} className="text-xs text-primary mr-2">#{mc}</Text>
            ))}
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
