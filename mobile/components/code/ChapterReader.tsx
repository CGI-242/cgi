import { View, Text, ScrollView } from "react-native";
import { useRef, useEffect, useCallback } from "react";
import type { SommaireNode } from "@/lib/data/types";
import ArticleText from "./ArticleText";

type Props = {
  chapter: SommaireNode;
  colors: any;
  scrollToId?: string;
  scrollTrigger?: number;
};

function ArticleBlock({ article, colors }: { article: any; colors: any }) {
  return (
    <View style={{ marginBottom: 20 }}>
      <Text style={{ fontSize: 13, fontWeight: "bold", color: colors.text, marginBottom: 6 }}>
        {article.article} — {article.titre}
      </Text>
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
      const targetView = nodeRefs.current[scrollToId];
      const sv = scrollRef.current;
      if (!targetView || !sv) return;

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
