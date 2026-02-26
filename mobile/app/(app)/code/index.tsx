import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, useWindowDimensions, StyleSheet } from "react-native";
import { useState, useMemo } from "react";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { getSommaire, searchArticles, type SommaireNode, type ArticleData } from "@/lib/data/cgi";
import { useDebounce } from "@/lib/hooks/useDebounce";
import TreeNode from "@/components/code/TreeNode";
import ContentPanel from "@/components/code/ContentPanel";

const styles = StyleSheet.create({
  searchInput: { borderWidth: 0 },
  searchBar: { borderWidth: 0 },
  sommaire: { borderRightWidth: 1, borderRightColor: "#e0e0e0" },
  separator: { height: 1, backgroundColor: "#e0e0e0", marginHorizontal: 12, marginBottom: 4 },
});

export default function CodeCGI() {
  const sommaire = useMemo(() => getSommaire(), []);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [selectedNode, setSelectedNode] = useState<SommaireNode | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    tome1: true, "t1-p1": true, "t1-p2": true, "t1-p3": true,
    tome2: true,
    tfnc: true,
  });
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const sommaireWidth = isMobile ? "35%" : "30%";
  const contentWidth = isMobile ? "65%" : "70%";

  const debouncedSearch = useDebounce(search, 300);
  const searchResults = useMemo(() => searchArticles(debouncedSearch), [debouncedSearch]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (node: SommaireNode) => {
    setSelected(node.id);
    setSelectedNode(node);
    setSelectedArticle(null);
  };

  const handleSelectChild = (child: SommaireNode, parentId: string) => {
    setExpanded((prev) => ({ ...prev, [parentId]: true, [child.id]: true }));
    handleSelect(child);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSelectedArticle(null);
  };

  return (
    <View className="flex-1 bg-background">
      {/* Header recherche */}
      <View style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 16, paddingVertical: 12, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.push("/(app)")} className="mr-3" style={{ padding: 4 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#00c17c", fontWeight: "900", fontSize: 18, marginRight: 16 }}>Code CGI</Text>
        <View className="flex-1 bg-white/20 flex-row items-center px-3 py-2" style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#fff" />
          <TextInput
            className="flex-1 ml-2 text-white text-sm border-0"
            style={styles.searchInput}
            placeholder="Rechercher un article, mot-cle..."
            placeholderTextColor="rgba(255,255,255,0.6)"
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={18} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Split layout */}
      <View className="flex-1 flex-row">
        {/* Sommaire */}
        <ScrollView
          className="bg-card"
          style={[styles.sommaire, { width: sommaireWidth }]}
          removeClippedSubviews
        >
          <View className="py-2">
            <View className="px-3 py-2 mb-1">
              <Text className="text-xs font-bold text-primary uppercase tracking-wide">
                Edition 2026
              </Text>
              <Text className="text-xs text-muted">Code General des Impots</Text>
            </View>
            <View style={styles.separator} />
            {sommaire.map((tome) => (
              <TreeNode
                key={tome.id}
                node={tome}
                level={0}
                selected={selected}
                onSelect={handleSelect}
                expanded={expanded}
                onToggle={toggleExpand}
              />
            ))}
          </View>
        </ScrollView>

        {/* Contenu */}
        <View style={{ width: contentWidth }}>
          <ContentPanel
            selectedNode={selectedNode}
            selectedArticle={selectedArticle}
            onSelectArticle={setSelectedArticle}
            onSelectChild={handleSelectChild}
            searchQuery={search}
            searchResults={searchResults}
          />
        </View>
      </View>
    </View>
  );
}
