import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { searchArticles, type SommaireNode, type ArticleData } from "@/lib/data/cgi";
import { useDebounce } from "@/lib/hooks/useDebounce";
import ChapterReader from "./ChapterReader";
import ArticleText from "./ArticleText";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import { useFavoritesStore } from "@/lib/store/favorites";

const NODE_ICONS: { icon: keyof typeof Ionicons.glyphMap; color: string }[] = [
  { icon: "book-outline", color: "#00815d" },
  { icon: "document-text-outline", color: "#4f46e5" },
  { icon: "receipt-outline", color: "#d97706" },
  { icon: "briefcase-outline", color: "#9333ea" },
  { icon: "shield-checkmark-outline", color: "#0891b2" },
  { icon: "business-outline", color: "#dc2626" },
  { icon: "library-outline", color: "#ca8a04" },
  { icon: "folder-open-outline", color: "#059669" },
];

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
      {nodes.map((node, idx) => {
        const artCount = countArticles(node);
        const hasChildren = (node.children && node.children.length > 0) || (node.articles && node.articles.length > 0);
        const ic = NODE_ICONS[idx % NODE_ICONS.length];
        return (
          <Card key={node.id} onPress={() => onSelect(node)}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  backgroundColor: `${ic.color}18`,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Ionicons name={ic.icon} size={20} color={ic.color} />
              </View>
              <View style={{ flex: 1 }}>
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

// ── Lecteur audio pour article ──
function AudioPlayer({ text, colors }: { text: string; colors: any }) {
  const { t } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [progress, setProgress] = useState(0);
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTime = useRef(0);
  // Estimation : ~150 mots/min en français
  const estimatedDuration = Math.max((text.split(/\s+/).length / 150) * 60, 5);

  const startSpeech = async () => {
    setIsSpeaking(true);
    setProgress(0);
    startTime.current = Date.now();
    progressInterval.current = setInterval(() => {
      const elapsed = (Date.now() - startTime.current) / 1000;
      const pct = Math.min(elapsed / estimatedDuration, 0.98);
      setProgress(pct);
    }, 500);

    Speech.speak(text, {
      language: "fr-FR",
      rate: 0.9,
      onDone: () => {
        setIsSpeaking(false);
        setProgress(1);
        if (progressInterval.current) clearInterval(progressInterval.current);
        setTimeout(() => setProgress(0), 1500);
      },
      onStopped: () => {
        setIsSpeaking(false);
        setProgress(0);
        if (progressInterval.current) clearInterval(progressInterval.current);
      },
    });
  };

  const stopSpeech = async () => {
    await Speech.stop();
    setIsSpeaking(false);
    setProgress(0);
    if (progressInterval.current) clearInterval(progressInterval.current);
  };

  useEffect(() => {
    return () => {
      Speech.stop();
      if (progressInterval.current) clearInterval(progressInterval.current);
    };
  }, []);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: `${colors.primary}12`,
        borderRadius: 12,
        padding: 10,
        marginBottom: 14,
        gap: 10,
      }}
    >
      <TouchableOpacity
        onPress={isSpeaking ? stopSpeech : startSpeech}
        style={{
          width: 36,
          height: 36,
          borderRadius: 18,
          backgroundColor: colors.primary,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Ionicons name={isSpeaking ? "stop" : "play"} size={16} color="#fff" />
      </TouchableOpacity>

      <View style={{ flex: 1 }}>
        <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 12, color: colors.text, marginBottom: 4 }}>
          {isSpeaking ? t("articleDetail.stop") : t("articleDetail.listen")}
        </Text>
        <View style={{ height: 4, backgroundColor: colors.border, borderRadius: 2, overflow: "hidden" }}>
          <View
            style={{
              height: 4,
              backgroundColor: colors.primary,
              borderRadius: 2,
              width: `${Math.round(progress * 100)}%` as unknown as number,
            }}
          />
        </View>
      </View>
    </View>
  );
}

// ── Vue article détaillé ──
function ArticleDetailView({ article, onBack }: { article: ArticleData; onBack: () => void }) {
  const { colors } = useTheme();
  const isFavorite = useFavoritesStore((s) => s.isFavorite(article.article));
  const toggleFavorite = useFavoritesStore((s) => s.toggleFavorite);

  const fullText = [article.article, article.titre, ...article.texte].filter(Boolean).join(". ");

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
        <Text style={{ fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: 20, color: colors.primary, flex: 1 }}>
          {article.article}
        </Text>
        <TouchableOpacity onPress={() => toggleFavorite(article.article)} hitSlop={8} style={{ padding: 4 }}>
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={22}
            color={isFavorite ? "#ef4444" : colors.textMuted}
          />
        </TouchableOpacity>
      </View>
      {article.titre ? (
        <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 15, color: colors.text, marginBottom: 14 }}>
          {article.titre}
        </Text>
      ) : null}

      <AudioPlayer text={fullText} colors={colors} />

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
          <View style={{ flexDirection: "row", gap: 12 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                backgroundColor: `${colors.primary}15`,
                alignItems: "center",
                justifyContent: "center",
                marginTop: 2,
              }}
            >
              <Ionicons name="document-text-outline" size={18} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
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
            </View>
          </View>
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
        <ChapterReader chapter={currentNode} colors={colors} />
      ) : (
        // Racine : liste des tomes
        <NodeListView nodes={sommaire} onSelect={handleSelectNode} title={t("code.fullTitle")} />
      )}
    </View>
  );
}
