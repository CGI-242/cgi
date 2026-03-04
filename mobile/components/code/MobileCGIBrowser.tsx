import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState, useMemo, useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { searchArticles, type SommaireNode, type ArticleData } from "@/lib/data/cgi";
import { useDebounce } from "@/lib/hooks/useDebounce";
import ChapterReader from "./ChapterReader";
import ArticleText from "./ArticleText";
import { fonts, fontWeights } from "@/lib/theme/fonts";

type Props = {
  sommaire: SommaireNode[];
};

function countArticles(node: SommaireNode): number {
  let count = node.articles?.length || 0;
  if (node.children) {
    for (const child of node.children) count += countArticles(child);
  }
  return count;
}

// ── Card réutilisable ──
function Card({ children, onPress }: { children: React.ReactNode; onPress?: () => void }) {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: 14,
        padding: 16,
        marginBottom: 10,
      }}
    >
      {children}
    </TouchableOpacity>
  );
}

// ── Liste de noeuds (tomes, parties, chapitres...) ──
function NodeListView({ nodes, onSelect, title }: {
  nodes: SommaireNode[];
  onSelect: (node: SommaireNode) => void;
  title?: string;
}) {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
      {title && (
        <Text style={{ fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold, fontSize: 18, color: colors.text, marginBottom: 16 }}>
          {title}
        </Text>
      )}
      {nodes.map((node) => {
        const artCount = countArticles(node);
        const hasChildren = (node.children && node.children.length > 0) || (node.articles && node.articles.length > 0);
        return (
          <Card key={node.id} onPress={() => onSelect(node)}>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text
                  style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 14, color: colors.text }}
                  numberOfLines={2}
                >
                  {node.label}
                </Text>
                {artCount > 0 && (
                  <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
                    {artCount} article{artCount > 1 ? "s" : ""}
                  </Text>
                )}
              </View>
              {hasChildren && <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />}
            </View>
          </Card>
        );
      })}
      {nodes.length === 0 && (
        <View style={{ alignItems: "center", paddingTop: 40 }}>
          <Ionicons name="construct-outline" size={36} color={colors.textMuted} style={{ marginBottom: 12 }} />
          <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 14, color: colors.textMuted }}>
            Contenu en cours d'intégration
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

// ── Vue article détaillé ──
function ArticleDetailView({ article, onBack }: { article: ArticleData; onBack: () => void }) {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <Text style={{ fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: 20, color: colors.primary, marginBottom: 4 }}>
        {article.article}
      </Text>
      {article.titre ? (
        <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 15, color: colors.text, marginBottom: 14 }}>
          {article.titre}
        </Text>
      ) : null}

      <ArticleText texte={article.texte} />

      {article.mots_cles && article.mots_cles.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 16 }}>
          {article.mots_cles.map((mc, i) => (
            <Text
              key={i}
              style={{
                fontFamily: fonts.regular,
                fontWeight: fontWeights.regular,
                fontSize: 10,
                color: colors.textMuted,
                backgroundColor: colors.border,
                paddingHorizontal: 8,
                paddingVertical: 2,
                borderRadius: 4,
                overflow: "hidden",
              }}
            >
              {mc}
            </Text>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

// ── Résultats de recherche ──
function SearchResultsView({ results, onSelect }: { results: ArticleData[]; onSelect: (art: ArticleData) => void }) {
  const { colors } = useTheme();

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
      <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 13, color: colors.textSecondary, marginBottom: 12 }}>
        {results.length} résultat{results.length > 1 ? "s" : ""}
      </Text>
      {results.slice(0, 50).map((art, i) => (
        <Card key={`${art.article}-${i}`} onPress={() => onSelect(art)}>
          <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 13, color: colors.primary, marginBottom: 2 }}>
            {art.article}
          </Text>
          {art.titre ? (
            <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 12, color: colors.text, marginBottom: 4 }}>
              {art.titre}
            </Text>
          ) : null}
          <Text
            style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}
            numberOfLines={2}
          >
            {art.texte.join(" ")}
          </Text>
        </Card>
      ))}
    </ScrollView>
  );
}

// ── Composant principal ──
export default function MobileCGIBrowser({ sommaire }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();

  // Navigation par pile de noeuds
  const [navStack, setNavStack] = useState<SommaireNode[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<ArticleData | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  const searchResults = useMemo(() => searchArticles(debouncedSearch), [debouncedSearch]);

  const currentNode = navStack.length > 0 ? navStack[navStack.length - 1] : null;

  const goBack = useCallback(() => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else if (navStack.length > 0) {
      setNavStack((prev) => prev.slice(0, -1));
    }
  }, [selectedArticle, navStack]);

  const handleSelectNode = useCallback((node: SommaireNode) => {
    setSelectedArticle(null);
    setNavStack((prev) => [...prev, node]);
  }, []);

  const handleSelectArticle = useCallback((art: ArticleData) => {
    setSelectedArticle(art);
    setSearch("");
  }, []);

  const showBack = navStack.length > 0 || selectedArticle !== null;
  const isSearching = debouncedSearch.length >= 2;

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header navigation + recherche */}
      <View style={{ backgroundColor: colors.card, paddingHorizontal: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          {showBack && (
            <TouchableOpacity onPress={goBack} hitSlop={8}>
              <Ionicons name="arrow-back" size={20} color={colors.primary} />
            </TouchableOpacity>
          )}
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center", backgroundColor: colors.input, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 6 }}>
            <Ionicons name="search" size={16} color={colors.textMuted} />
            <TextInput
              style={{ flex: 1, marginLeft: 8, fontSize: 14, color: colors.text, fontFamily: fonts.regular }}
              placeholder={t("code.searchPlaceholder")}
              placeholderTextColor={colors.textMuted}
              value={search}
              onChangeText={(v) => { setSearch(v); setSelectedArticle(null); }}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>
        {/* Breadcrumb */}
        {navStack.length > 0 && !isSearching && (
          <View style={{ flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginTop: 8, gap: 4 }}>
            <TouchableOpacity onPress={() => { setNavStack([]); setSelectedArticle(null); }}>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: colors.primary }}>CGI</Text>
            </TouchableOpacity>
            {navStack.map((node, i) => (
              <View key={node.id} style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="chevron-forward" size={10} color={colors.textMuted} style={{ marginHorizontal: 2 }} />
                <TouchableOpacity onPress={() => { setNavStack((prev) => prev.slice(0, i + 1)); setSelectedArticle(null); }}>
                  <Text
                    style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: i === navStack.length - 1 ? colors.text : colors.primary }}
                    numberOfLines={1}
                  >
                    {node.label.length > 25 ? node.label.slice(0, 25) + "..." : node.label}
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Contenu */}
      {isSearching ? (
        <SearchResultsView results={searchResults} onSelect={handleSelectArticle} />
      ) : selectedArticle ? (
        <ArticleDetailView article={selectedArticle} onBack={goBack} />
      ) : currentNode ? (
        // Noeud sélectionné : afficher ses articles + enfants
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 30 }}>
          <Text style={{ fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold, fontSize: 17, color: colors.text, marginBottom: 14 }}>
            {currentNode.label}
          </Text>

          {/* Articles du noeud */}
          {currentNode.articles && currentNode.articles.length > 0 && currentNode.articles.map((art) => (
            <Card key={art.article} onPress={() => handleSelectArticle(art)}>
              <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 14, color: colors.primary, marginBottom: 2 }}>
                {art.article}
              </Text>
              {art.titre ? (
                <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 13, color: colors.text, marginBottom: 4 }}>
                  {art.titre}
                </Text>
              ) : null}
              <Text
                style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 12, color: colors.textSecondary, lineHeight: 18 }}
                numberOfLines={3}
              >
                {art.texte.join(" ")}
              </Text>
            </Card>
          ))}

          {/* Sous-noeuds */}
          {currentNode.children && currentNode.children.length > 0 && currentNode.children.map((child) => {
            const artCount = countArticles(child);
            return (
              <Card key={child.id} onPress={() => handleSelectNode(child)}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 14, color: colors.text }} numberOfLines={2}>
                      {child.label}
                    </Text>
                    {artCount > 0 && (
                      <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 11, color: colors.textMuted, marginTop: 3 }}>
                        {artCount} article{artCount > 1 ? "s" : ""}
                      </Text>
                    )}
                  </View>
                  <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
                </View>
              </Card>
            );
          })}
        </ScrollView>
      ) : (
        // Racine : liste des tomes
        <NodeListView nodes={sommaire} onSelect={handleSelectNode} title={t("code.fullTitle")} />
      )}
    </View>
  );
}
