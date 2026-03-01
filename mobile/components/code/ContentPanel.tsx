import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import type { SommaireNode, ArticleData } from "@/lib/data/cgi";
import ArticleDetail from "./ArticleDetail";
import SearchResults from "./SearchResults";

type Props = {
  selectedNode: SommaireNode | null;
  selectedArticle: ArticleData | null;
  onSelectArticle: (article: ArticleData | null) => void;
  onSelectChild: (child: SommaireNode, parentId: string) => void;
  searchQuery: string;
  searchResults: ArticleData[];
};

export default function ContentPanel({
  selectedNode,
  selectedArticle,
  onSelectArticle,
  onSelectChild,
  searchQuery,
  searchResults,
}: Props) {
  const { colors } = useTheme();

  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        onBack={() => onSelectArticle(null)}
        onSelectArticle={onSelectArticle}
      />
    );
  }

  if (searchQuery.length >= 2) {
    return (
      <SearchResults
        query={searchQuery}
        results={searchResults}
        onSelectArticle={onSelectArticle}
      />
    );
  }

  if (!selectedNode) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32 }}>
        <Ionicons name="book-outline" size={64} color={colors.textMuted} />
        <Text style={{ fontSize: 20, color: colors.textMuted, marginTop: 16, textAlign: "center" }}>
          Selectionnez un element dans le sommaire
        </Text>
        <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 8, textAlign: "center" }}>
          Naviguez dans l'arborescence du Code General des Impots
        </Text>
      </View>
    );
  }

  const hasArticles = selectedNode.articles && selectedNode.articles.length > 0;
  const hasChildren = selectedNode.children && selectedNode.children.length > 0;

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <Text style={{ fontSize: 12, color: colors.primary, fontWeight: "600", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
        {hasArticles
          ? `${selectedNode.articles!.length} article${selectedNode.articles!.length > 1 ? "s" : ""}`
          : "Section"}
      </Text>
      <Text style={{ fontSize: 20, fontWeight: "bold", color: colors.text, marginBottom: 24 }}>{selectedNode.label}</Text>

      {hasArticles &&
        selectedNode.articles!.map((art) => (
          <TouchableOpacity
            key={art.article}
            style={{
              backgroundColor: colors.card,
              padding: 16,
              marginBottom: 12,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              shadowColor: "#000",
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
            onPress={() => onSelectArticle(art)}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: "bold", color: colors.text }}>{art.article}</Text>
              <Text style={{ fontSize: 14, color: colors.textMuted, marginTop: 4 }} numberOfLines={2}>
                {art.titre}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={colors.textMuted} />
          </TouchableOpacity>
        ))}

      {hasChildren && (
        <View style={hasArticles ? { marginTop: 16 } : {}}>
          {!hasArticles && (
            <Text style={{ fontSize: 14, color: colors.textMuted, marginBottom: 16 }}>
              Selectionnez une sous-section pour voir les articles.
            </Text>
          )}
          {selectedNode.children!.map((child) => (
            <TouchableOpacity
              key={child.id}
              style={{
                backgroundColor: colors.card,
                padding: 16,
                marginBottom: 8,
                flexDirection: "row",
                alignItems: "center",
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
              onPress={() => onSelectChild(child, selectedNode.id)}
            >
              <Ionicons name="folder-outline" size={20} color={colors.primary} style={{ marginRight: 12 }} />
              <Text style={{ fontSize: 14, color: colors.text, flex: 1 }}>{child.label}</Text>
              <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
