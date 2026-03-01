import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useRef, useEffect, useCallback, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import type { SommaireNode } from "@/lib/data/types";
import type { ArticleData } from "@/lib/data/types";
import ArticleText from "./ArticleText";

type Props = {
  chapter: SommaireNode;
  colors: any;
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

function ArticleBlock({ article, colors }: { article: ArticleData; colors: any }) {
  const { isSpeaking, toggle } = useSpeech(article);

  return (
    <View style={{ marginBottom: 20 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
        <Text style={{ fontSize: 13, fontWeight: "bold", color: colors.text, flex: 1 }}>
          {article.article} — {article.titre}
        </Text>
        <TouchableOpacity
          onPress={toggle}
          style={{
            paddingHorizontal: 8,
            paddingVertical: 4,
            backgroundColor: isSpeaking ? "#e74c3c" : colors.accent,
            flexDirection: "row",
            alignItems: "center",
            marginLeft: 8,
          }}
        >
          <Ionicons name={isSpeaking ? "stop" : "volume-high"} size={12} color="#fff" />
        </TouchableOpacity>
      </View>
      <ArticleText texte={article.texte} />
      {article.mots_cles && article.mots_cles.length > 0 && (
        <View style={{ flexDirection: "row", flexWrap: "wrap", marginTop: 8, gap: 6 }}>
          {article.mots_cles.map((mc: string, i: number) => (
            <Text
              key={i}
              style={{
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

function renderArticles(node: SommaireNode, colors: any) {
  const elements: React.ReactNode[] = [];
  if (node.articles) {
    for (const art of node.articles) {
      elements.push(<ArticleBlock key={art.article} article={art} colors={colors} />);
    }
  }
  return elements;
}

type SectionBlockProps = {
  node: SommaireNode;
  colors: any;
  registerRef: (id: string, ref: View | null) => void;
};

function SectionBlock({ node, colors, registerRef }: SectionBlockProps) {
  return (
    <View
      style={{ marginBottom: 24 }}
      ref={(r) => registerRef(node.id, r)}
    >
      {/* Titre section */}
      <View style={{ marginBottom: 12 }}>
        <View style={{ height: 2, backgroundColor: colors.accent, marginBottom: 10, opacity: 0.4 }} />
        <Text style={{ fontSize: 15, fontWeight: "600", color: colors.accent }}>
          {node.label}
        </Text>
      </View>

      {/* Articles directement dans la section */}
      {renderArticles(node, colors)}

      {/* Sous-sections */}
      {node.children?.map((sub) => (
        <View
          key={sub.id}
          style={{ marginTop: 8, marginBottom: 16 }}
          ref={(r) => registerRef(sub.id, r)}
        >
          <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary, marginBottom: 10 }}>
            {sub.label}
          </Text>
          {renderArticles(sub, colors)}

          {/* Niveau supplémentaire (paragraphes) */}
          {sub.children?.map((para) => (
            <View
              key={para.id}
              style={{ marginTop: 4 }}
              ref={(r) => registerRef(para.id, r)}
            >
              <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
                {para.label}
              </Text>
              {renderArticles(para, colors)}
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

export default function ChapterReader({ chapter, colors, scrollToId, scrollTrigger }: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const nodeRefs = useRef<Record<string, View | null>>({});
  const scrollOffset = useRef(0);

  const registerRef = useCallback((id: string, ref: View | null) => {
    nodeRefs.current[id] = ref;
  }, []);

  useEffect(() => {
    if (!scrollToId || !scrollTrigger) return;

    const timer = setTimeout(() => {
      const sv = scrollRef.current;
      if (!sv) return;

      // Remonter en haut
      if (scrollToId === "__top__") {
        sv.scrollTo({ y: 0, animated: true });
        return;
      }

      const targetView = nodeRefs.current[scrollToId];
      if (!targetView) return;

      // measure donne (x, y, width, height, pageX, pageY)
      // pageY = position absolue sur l'écran
      targetView.measure((_x, _y, _w, _h, _pageX, pageY) => {
        (sv as any).measure((_sx: number, _sy: number, _sw: number, _sh: number, _spx: number, spy: number) => {
          const relativeY = pageY - spy + scrollOffset.current;
          sv.scrollTo({ y: relativeY, animated: true });
        });
      });
    }, 200);

    return () => clearTimeout(timer);
  }, [scrollToId, scrollTrigger]);

  return (
    <ScrollView
      ref={scrollRef}
      style={{ flex: 1 }}
      contentContainerStyle={{ padding: 20, paddingBottom: 60 }}
      onScroll={(e) => { scrollOffset.current = e.nativeEvent.contentOffset.y; }}
      scrollEventThrottle={16}
    >
      {/* Titre du chapitre */}
      <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text, marginBottom: 20 }}>
        {chapter.label}
      </Text>

      {/* Articles directement dans le chapitre */}
      {renderArticles(chapter, colors)}

      {/* Sections du chapitre */}
      {chapter.children?.map((section) => (
        <SectionBlock
          key={section.id}
          node={section}
          colors={colors}
          registerRef={registerRef}
        />
      ))}
    </ScrollView>
  );
}
