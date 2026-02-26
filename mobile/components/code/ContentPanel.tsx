import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
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
  if (selectedArticle) {
    return (
      <ArticleDetail
        article={selectedArticle}
        onBack={() => onSelectArticle(null)}
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
      <View className="flex-1 justify-center items-center px-8">
        <Ionicons name="book-outline" size={64} color="#ccc" />
        <Text className="text-xl text-muted mt-4 text-center">
          Selectionnez un element dans le sommaire
        </Text>
        <Text className="text-sm text-muted mt-2 text-center">
          Naviguez dans l'arborescence du Code General des Impots
        </Text>
      </View>
    );
  }

  const hasArticles = selectedNode.articles && selectedNode.articles.length > 0;
  const hasChildren = selectedNode.children && selectedNode.children.length > 0;

  return (
    <ScrollView className="flex-1 p-6">
      <Text className="text-xs text-primary font-semibold uppercase tracking-wide mb-2">
        {hasArticles
          ? `${selectedNode.articles!.length} article${selectedNode.articles!.length > 1 ? "s" : ""}`
          : "Section"}
      </Text>
      <Text className="text-xl font-bold text-text mb-6">{selectedNode.label}</Text>

      {hasArticles &&
        selectedNode.articles!.map((art) => (
          <TouchableOpacity
            key={art.article}
            className="bg-card p-4 mb-3 flex-row items-center justify-between"
            style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
            onPress={() => onSelectArticle(art)}
          >
            <View className="flex-1">
              <Text className="text-base font-bold text-text">{art.article}</Text>
              <Text className="text-sm text-muted mt-1" numberOfLines={2}>
                {art.titre}
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#888" />
          </TouchableOpacity>
        ))}

      {hasChildren && (
        <View className={hasArticles ? "mt-4" : ""}>
          {!hasArticles && (
            <Text className="text-sm text-muted mb-4">
              Selectionnez une sous-section pour voir les articles.
            </Text>
          )}
          {selectedNode.children!.map((child) => (
            <TouchableOpacity
              key={child.id}
              className="bg-card p-4 mb-2 flex-row items-center"
              style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 }}
              onPress={() => onSelectChild(child, selectedNode.id)}
            >
              <Ionicons name="folder-outline" size={20} color="#00815d" style={{ marginRight: 12 }} />
              <Text className="text-sm text-text flex-1">{child.label}</Text>
              <Ionicons name="chevron-forward" size={16} color="#888" />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}
