import { View, Text, ScrollView } from "react-native";
import type { SommaireNode } from "@/lib/data/types";
import ArticleText from "./ArticleText";

type Props = {
  chapter: SommaireNode;
  colors: any;
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

function SectionBlock({ node, colors }: { node: SommaireNode; colors: any }) {
  return (
    <View style={{ marginBottom: 24 }}>
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
        <View key={sub.id} style={{ marginTop: 8, marginBottom: 16 }}>
          <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 10 }}>
            {sub.label}
          </Text>
          {renderArticles(sub, colors)}

          {/* Niveau supplémentaire (paragraphes) si nécessaire */}
          {sub.children?.map((para) => (
            <View key={para.id} style={{ marginTop: 4 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.textMuted, marginBottom: 8 }}>
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

export default function ChapterReader({ chapter, colors }: Props) {
  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
      {/* Titre du chapitre */}
      <Text style={{ fontSize: 18, fontWeight: "bold", color: colors.text, marginBottom: 20 }}>
        {chapter.label}
      </Text>

      {/* Articles directement dans le chapitre (si présents) */}
      {renderArticles(chapter, colors)}

      {/* Sections du chapitre */}
      {chapter.children?.map((section) => (
        <SectionBlock key={section.id} node={section} colors={colors} />
      ))}
    </ScrollView>
  );
}
