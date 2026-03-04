import { View, Text, TextInput, TouchableOpacity, ScrollView, useWindowDimensions, StyleSheet } from "react-native";
import { useState, useMemo, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { getSommaire, searchArticles, type SommaireNode, type ArticleData } from "@/lib/data/cgi";
import { useDebounce } from "@/lib/hooks/useDebounce";
import TreeNode from "@/components/code/TreeNode";
import ContentPanel from "@/components/code/ContentPanel";
import ChapterReader from "@/components/code/ChapterReader";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const styles = StyleSheet.create({
  sommaire: { borderRightWidth: 1 },
  separator: { height: 1, marginHorizontal: 12, marginBottom: 4 },
});

function isDescendant(parent: SommaireNode, childId: string): boolean {
  if (!parent.children) return false;
  for (const child of parent.children) {
    if (child.id === childId) return true;
    if (isDescendant(child, childId)) return true;
  }
  return false;
}

export default function CodeCGI() {
  const { colors } = useTheme();
  const { t } = useTranslation();
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

  // Mode livre
  const [readerNode, setReaderNode] = useState<SommaireNode | null>(null);
  const readerNodeRef = useRef<SommaireNode | null>(null);
  const [scrollToId, setScrollToId] = useState<string | undefined>();
  const [scrollTrigger, setScrollTrigger] = useState(0);

  const debouncedSearch = useDebounce(search, 300);
  const searchResults = useMemo(() => searchArticles(debouncedSearch), [debouncedSearch]);

  const toggleExpand = (id: string) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSelect = (node: SommaireNode) => {
    setSelected(node.id);
    setSelectedNode(node);
    setSelectedArticle(null);

    const hasChildren = node.children && node.children.length > 0;

    // Si on reclique sur le noeud déjà affiché → remonter en haut
    if (readerNodeRef.current && readerNodeRef.current.id === node.id) {
      setScrollToId("__top__");
      setScrollTrigger((n) => n + 1);
      return;
    }

    // Si mode livre actif et le noeud cliqué est un descendant → scroll vers lui
    if (readerNodeRef.current && isDescendant(readerNodeRef.current, node.id)) {
      setScrollToId(node.id);
      setScrollTrigger((n) => n + 1);
      return;
    }

    // Noeud avec enfants → mode livre
    if (hasChildren) {
      readerNodeRef.current = node;
      setReaderNode(node);
      setScrollToId(undefined);
    } else {
      readerNodeRef.current = null;
      setReaderNode(null);
      setScrollToId(undefined);
    }
  };

  const handleSelectChild = (child: SommaireNode, parentId: string) => {
    setExpanded((prev) => ({ ...prev, [parentId]: true, [child.id]: true }));
    handleSelect(child);
  };

  const handleClearSearch = () => {
    setSearch("");
    setSelectedArticle(null);
  };

  const showReader = readerNode && !selectedArticle && search.length < 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Barre de recherche */}
      <View style={{ backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <Text style={{ color: colors.accent, fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: 18, marginRight: 16 }}>{t("code.title")}</Text>
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.input, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={{ flex: 1, marginLeft: 8, fontSize: 14, color: colors.text }}
            placeholder={t("code.searchPlaceholder")}
            placeholderTextColor={colors.textMuted}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={handleClearSearch}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Split layout */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Sommaire */}
        <ScrollView
          style={[styles.sommaire, { width: sommaireWidth, backgroundColor: colors.card, borderRightColor: colors.border }]}
          removeClippedSubviews
        >
          <View style={{ paddingVertical: 8 }}>
            <View style={{ paddingHorizontal: 12, paddingVertical: 8, marginBottom: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "700", color: colors.primary, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {t("code.edition")}
              </Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>{t("code.fullTitle")}</Text>
            </View>
            <View style={[styles.separator, { backgroundColor: colors.border }]} />
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
          {showReader ? (
            <ChapterReader
              chapter={readerNode}
              colors={colors}
              scrollToId={scrollToId}
              scrollTrigger={scrollTrigger}
            />
          ) : (
            <ContentPanel
              selectedNode={selectedNode}
              selectedArticle={selectedArticle}
              onSelectArticle={setSelectedArticle}
              onSelectChild={handleSelectChild}
              searchQuery={search}
              searchResults={searchResults}
            />
          )}
        </View>
      </View>
    </View>
  );
}
