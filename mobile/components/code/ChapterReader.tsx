import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRef, useEffect, useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import type { SommaireNode } from "@/lib/data/types";
import type { ArticleData } from "@/lib/data/types";
import ArticleText from "./ArticleText";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import type { ThemeColors } from "@/lib/theme/colors";

type Props = {
  chapter: SommaireNode;
  colors: ThemeColors;
  scrollToId?: string;
  scrollTrigger?: number;
};

function useSpeech(article: ArticleData) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const stoppedRef = useRef(false);

  const toggle = useCallback(() => {
    if (isSpeaking) {
      stoppedRef.current = true;
      Speech.stop();
      setIsSpeaking(false);
      return;
    }

    stoppedRef.current = false;
    setIsSpeaking(true);

    const text = [article.article, article.titre, ...article.texte.filter((t) => t.length > 0)].join(" ... ");
    const chunks: string[] = [];
    for (let i = 0; i < text.length; i += 3000) {
      chunks.push(text.slice(i, i + 3000));
    }

    const speakNext = (idx: number) => {
      if (stoppedRef.current || idx >= chunks.length) {
        setIsSpeaking(false);
        return;
      }
      Speech.speak(chunks[idx], {
        language: "fr-FR",
        rate: 0.9,
        onDone: () => speakNext(idx + 1),
        onStopped: () => setIsSpeaking(false),
        onError: () => setIsSpeaking(false),
      });
    };
    speakNext(0);
  }, [isSpeaking, article]);

  useEffect(() => {
    return () => { stoppedRef.current = true; Speech.stop(); };
  }, [article]);

  return { isSpeaking, toggle };
}

function ArticleBlock({ article, colors }: { article: ArticleData; colors: ThemeColors }) {
  const { isSpeaking, toggle } = useSpeech(article);

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 15, color: colors.text, flex: 1 }}>
          {article.article} — {article.titre}
        </Text>
        <TouchableOpacity
          onPress={toggle}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: isSpeaking ? colors.danger : colors.accent,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
          }}
        >
          <Ionicons name={isSpeaking ? "stop" : "volume-high"} size={12} color={colors.sidebarText} />
        </TouchableOpacity>
      </View>
      <ArticleText texte={article.texte} />
      {article.mots_cles && article.mots_cles.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 6 }}>
          {article.mots_cles.map((mc: string, i: number) => (
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
      <View style={{ height: 1, backgroundColor: colors.border, marginTop: 16, opacity: 0.5 }} />
    </View>
  );
}

type PositionEntry = { y: number; parentId?: string };

function getAbsoluteY(positions: Record<string, PositionEntry>, id: string): number | undefined {
  let y = 0;
  let current: string | undefined = id;
  while (current) {
    const entry: PositionEntry | undefined = positions[current];
    if (!entry) return undefined;
    y += entry.y;
    current = entry.parentId;
  }
  return y;
}

type NodeBlockProps = {
  node: SommaireNode;
  colors: ThemeColors;
  positions: React.MutableRefObject<Record<string, PositionEntry>>;
  parentId?: string;
  depth: number;
};

function NodeBlock({ node, colors, positions, parentId, depth }: NodeBlockProps) {
  const isSection = depth === 0;
  const isSub = depth === 1;

  return (
    <View
      style={isSection ? { marginBottom: 24 } : isSub ? { marginTop: 8, marginBottom: 16 } : { marginTop: 4 }}
      onLayout={(e) => {
        positions.current[node.id] = { y: e.nativeEvent.layout.y, ...(parentId ? { parentId } : {}) };
      }}
    >
      {/* Titre */}
      {isSection ? (
        <View style={{ marginBottom: 12 }}>
          <View style={{ height: 2, backgroundColor: colors.accent, marginBottom: 10, opacity: 0.4 }} />
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 17, color: colors.accent }}>
            {node.label}
          </Text>
        </View>
      ) : isSub ? (
        <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: colors.primary, marginBottom: 10 }}>
          {node.label}
        </Text>
      ) : (
        <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 15, color: colors.text, marginBottom: 8 }}>
          {node.label}
        </Text>
      )}

      {/* Articles de ce nœud */}
      {node.articles && node.articles.length > 0 && node.articles.map((art) => (
        <ArticleBlock key={art.article} article={art} colors={colors} />
      ))}

      {/* Enfants (récursif) */}
      {node.children && node.children.length > 0 && node.children.map((child) => (
        <NodeBlock
          key={child.id}
          node={child}
          colors={colors}
          positions={positions}
          parentId={node.id}
          depth={depth + 1}
        />
      ))}
    </View>
  );
}

export default function ChapterReader({ chapter, colors, scrollToId, scrollTrigger }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const nodePositions = useRef<Record<string, PositionEntry>>({});

  useEffect(() => {
    // Réinitialiser les positions quand le chapitre change
    nodePositions.current = {};
  }, [chapter]);

  useEffect(() => {
    if (!scrollToId || !scrollTrigger) return;

    const timer = setTimeout(() => {
      const sv = scrollRef.current;
      if (!sv) return;

      if (scrollToId === "__top__") {
        sv.scrollTo({ y: 0, animated: true });
        return;
      }

      const y = getAbsoluteY(nodePositions.current, scrollToId);
      if (y !== undefined) {
        sv.scrollTo({ y, animated: true });
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [scrollToId, scrollTrigger]);

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      scrollEventThrottle={16}
    >
      {/* Titre du chapitre */}
      <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 22, color: colors.text, marginBottom: 20 }}>
        {chapter.label}
      </Text>

      {/* Articles directement dans le chapitre */}
      {chapter.articles && chapter.articles.length > 0 && chapter.articles.map((art) => (
        <ArticleBlock key={art.article} article={art} colors={colors} />
      ))}

      {/* Sections du chapitre (rendu récursif) */}
      {chapter.children && chapter.children.length > 0 && chapter.children.map((section) => (
        <NodeBlock
          key={section.id}
          node={section}
          colors={colors}
          positions={nodePositions}
          depth={0}
        />
      ))}
    </ScrollView>
  );
}
