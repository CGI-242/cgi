import { View, Text, TextInput, TouchableOpacity, ScrollView, useWindowDimensions, StyleSheet, Modal, FlatList } from "react-native";
import { useState, useMemo, useRef, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { getSommaire, searchArticles, type SommaireNode, type ArticleData, type SearchResult } from "@/lib/data/cgi";
import { getSocialSommaire } from "@/lib/data/social";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { useResponsive } from "@/lib/hooks/useResponsive";
import TreeNode from "@/components/code/TreeNode";
import ContentPanel from "@/components/code/ContentPanel";
import ChapterReader from "@/components/code/ChapterReader";
import MobileCGIBrowser from "@/components/code/MobileCGIBrowser";
import { fonts, fontWeights } from "@/lib/theme/fonts";

type CodeId = "cgi" | "social";

const CODE_OPTIONS: { id: CodeId; icon: keyof typeof Ionicons.glyphMap }[] = [
  { id: "cgi", icon: "book-outline" },
  { id: "social", icon: "people-outline" },
];

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
  const { isMobile, isTablet } = useResponsive();

  const [activeCode, setActiveCode] = useState<CodeId>("cgi");
  const [showCodePicker, setShowCodePicker] = useState(false);

  const sommaire = useMemo(() => {
    if (activeCode === "social") return getSocialSommaire();
    return getSommaire();
  }, [activeCode]);

  // Tous les hooks doivent être avant le return conditionnel
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState("");
  const [selectedNode, setSelectedNode] = useState<SommaireNode | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    tome1: true, "t1-p1": true, "t1-p2": true, "t1-p3": true,
    tome2: true,
    tfnc: true,
  });

  const handleCodeChange = useCallback((code: CodeId) => {
    setActiveCode(code);
    setShowCodePicker(false);
    setSearch("");
    setSelected("");
    setSelectedNode(null);
    setSelectedArticle(null);
    setReaderNode(null);
    readerNodeRef.current = null;
    setExpanded(code === "cgi"
      ? { tome1: true, "t1-p1": true, "t1-p2": true, "t1-p3": true, tome2: true, tfnc: true }
      : { "social-t1": true, "social-t2": true, "social-t3": true, "social-t4": true, "social-t5": true, "social-t6": true, "social-t7": true, "social-t8": true, "social-t9": true, "social-t10": true });
  }, []);
  const [readerNode, setReaderNode] = useState<SommaireNode | null>(null);
  const readerNodeRef = useRef<SommaireNode | null>(null);
  const [scrollToId, setScrollToId] = useState<string | undefined>();
  const [scrollTrigger, setScrollTrigger] = useState(0);
  const debouncedSearch = useDebounce(search, 300);
  const searchResults = useMemo(() => searchArticles(debouncedSearch), [debouncedSearch]);

  // Sur mobile : affichage plein écran avec navigation par cards
  if (isMobile) {
    return (
      <MobileCGIBrowser
        sommaire={sommaire}
        activeCode={activeCode}
        onCodeChange={handleCodeChange}
      />
    );
  }

  // Desktop/Tablet : split sommaire/contenu (plus large sur desktop)
  const sommaireWidth = isTablet ? "38%" : "32%";
  const contentWidth = isTablet ? "62%" : "68%";

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
      <View style={{ backgroundColor: colors.card, paddingHorizontal: 16, paddingVertical: 10, flexDirection: "row", alignItems: "center", borderBottomWidth: 1, borderBottomColor: colors.border, zIndex: 100 }}>
        {/* Sélecteur de code */}
        <TouchableOpacity
          onPress={() => setShowCodePicker(!showCodePicker)}
          style={{ flexDirection: "row", alignItems: "center", marginRight: 16, backgroundColor: colors.input, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 }}
        >
          <Ionicons name={CODE_OPTIONS.find(c => c.id === activeCode)?.icon || "book-outline"} size={18} color={colors.accent} />
          <Text style={{ color: colors.accent, fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: 15, marginLeft: 6 }}>
            {t(`code.selector.${activeCode}`)}
          </Text>
          <Ionicons name="chevron-down" size={16} color={colors.accent} style={{ marginLeft: 4 }} />
        </TouchableOpacity>
        {showCodePicker && (
          <View style={{ position: "absolute", top: 48, left: 16, zIndex: 9999, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 10, shadowColor: "#000", shadowOpacity: 0.15, shadowRadius: 8, elevation: 10, minWidth: 260 }}>
            {CODE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.id}
                onPress={() => handleCodeChange(opt.id)}
                style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 14, paddingVertical: 10, backgroundColor: opt.id === activeCode ? colors.input : "transparent", borderRadius: 8 }}
              >
                <Ionicons name={opt.icon} size={18} color={opt.id === activeCode ? colors.accent : colors.textMuted} />
                <Text style={{ marginLeft: 8, fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 14, color: opt.id === activeCode ? colors.accent : colors.text }}>
                  {t(`code.selector.${opt.id}`)}
                </Text>
                {opt.id === activeCode && <Ionicons name="checkmark" size={16} color={colors.accent} style={{ marginLeft: 8 }} />}
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.input, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 6 }}>
          <Ionicons name="search" size={18} color={colors.textMuted} />
          <TextInput
            style={{ flex: 1, marginLeft: 8, fontSize: 16, color: colors.text, fontFamily: fonts.regular }}
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
              <Text style={{ fontSize: 13, fontFamily: fonts.bold, fontWeight: fontWeights.bold, color: colors.primary, textTransform: "uppercase", letterSpacing: 0.5 }}>
                {activeCode === "cgi" ? t("code.edition") : "Code du travail"}
              </Text>
              <Text style={{ fontSize: 13, fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.textMuted }}>
                {activeCode === "cgi" ? t("code.fullTitle") : "Loi n°45-75 du 15 mars 1975"}
              </Text>
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
