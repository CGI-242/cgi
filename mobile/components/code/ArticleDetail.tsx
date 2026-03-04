// mobile/components/code/ArticleDetail.tsx
// Vue détaillée d'un article CGI avec synthèse vocale et références croisées

import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import type { ArticleData } from "@/lib/data/cgi";
import ArticleText from "./ArticleText";
import ReferencesBlock from "./ReferencesBlock";
import { getArticleReferences, type ArticleReference } from "@/lib/api/chat";
import { createLogger } from "@/lib/utils/logger";

const log = createLogger("article");

type Props = {
  article: ArticleData;
  onBack: () => void;
  onSelectArticle?: (article: ArticleData) => void;
};

const SPEECH_MAX_CHUNK = 3_000;

export default function ArticleDetail({ article, onBack, onSelectArticle }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isSpeaking, setIsSpeaking] = useState(false);
  const stoppedRef = useRef(false);
  const [references, setReferences] = useState<ArticleReference[]>([]);
  const [referencedBy, setReferencedBy] = useState<ArticleReference[]>([]);
  const [loadingRefs, setLoadingRefs] = useState(false);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      Speech.stop();
    };
  }, [article]);

  // Charger les références croisées
  useEffect(() => {
    const numero = article.article.replace(/^Art\.\s*/, "").trim();
    setLoadingRefs(true);
    setReferences([]);
    setReferencedBy([]);
    getArticleReferences(numero)
      .then((data) => {
        setReferences(data.references);
        setReferencedBy(data.referencedBy);
      })
      .catch((err) => log.warn("Erreur chargement références", err))
      .finally(() => setLoadingRefs(false));
  }, [article]);

  const prepareForSpeech = (text: string): string => {
    let result = text;
    result = result.replace(/\b([A-Z]{2,6})\b/g, (match) => match.split("").join(". ") + ".");
    result = result.replace(/\((\d+)\)/g, "");
    result = result.replace(/(\d+)°/g, "$1");
    return result;
  };

  const getChunks = (): string[] => {
    const letterNames: Record<string, string> = {
      A: "a", B: "bé", C: "cé", D: "dé", E: "e", F: "effe",
    };
    const articleName = article.article
      .replace(/Art\.\s*(\d+)\s*([A-Z])(?!\w)/g, (_, num, letter) =>
        `Article ${num} ${letterNames[letter] || letter}`)
      .replace(/Art\.\s*(\d+)(er)?/g, "Article $1$2");

    const lines = [
      articleName,
      prepareForSpeech(article.titre),
      ...article.texte.filter((t) => t.length > 0).map(prepareForSpeech),
    ];

    const chunks: string[] = [];
    let current = "";

    for (const line of lines) {
      if (current.length + line.length + 5 > SPEECH_MAX_CHUNK) {
        if (current) chunks.push(current);
        current = line;
      } else {
        current = current ? `${current} ... ${line}` : line;
      }
    }
    if (current) chunks.push(current);

    return chunks;
  };

  const speakChunk = (chunks: string[], index: number) => {
    if (stoppedRef.current || index >= chunks.length) {
      setIsSpeaking(false);
      return;
    }

    Speech.speak(chunks[index], {
      language: "fr-FR",
      rate: 0.9,
      onDone: () => speakChunk(chunks, index + 1),
      onStopped: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  const handlePlay = async () => {
    if (isSpeaking) {
      stoppedRef.current = true;
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }

    stoppedRef.current = false;
    setIsSpeaking(true);
    const chunks = getChunks();
    speakChunk(chunks, 0);
  };

  const handleBack = () => {
    stoppedRef.current = true;
    Speech.stop();
    onBack();
  };

  return (
    <ScrollView style={{ flex: 1, padding: 24 }}>
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <TouchableOpacity onPress={handleBack} style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons name="arrow-back" size={18} color={colors.primary} />
          <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, color: colors.primary, fontSize: 15, marginLeft: 8 }}>{t("articleDetail.backToArticles")}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlay}
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 12,
            paddingVertical: 8,
            backgroundColor: isSpeaking ? colors.danger : colors.primary,
          }}
        >
          <Ionicons
            name={isSpeaking ? "stop" : "volume-high"}
            size={16}
            color={colors.sidebarText}
          />
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, color: colors.sidebarText, fontSize: 14, marginLeft: 8 }}>
            {isSpeaking ? t("articleDetail.stop") : t("articleDetail.listen")}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 8 }}>
        <View style={{ backgroundColor: colors.primary + "20", paddingHorizontal: 8, paddingVertical: 4 }}>
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 14, color: colors.primary }}>{article.statut}</Text>
        </View>
      </View>

      <Text style={{ fontFamily: fonts.heading, fontWeight: fontWeights.heading, fontSize: 28, color: colors.text, marginBottom: 4 }}>{article.article}</Text>
      <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 17, color: colors.textMuted, fontStyle: "italic", marginBottom: 24 }}>{article.titre}</Text>

      <View
        style={{
          backgroundColor: colors.card,
          padding: 20,
          marginBottom: 24,
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 6,
          elevation: 2,
        }}
      >
        <ArticleText texte={article.texte} />
      </View>

      {article.mots_cles.length > 0 && (
        <View>
          <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 12, color: colors.textMuted, marginBottom: 8, textTransform: "uppercase" }}>{t("articleDetail.keywords")}</Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {article.mots_cles.map((mc) => (
              <View key={mc} style={{ backgroundColor: colors.primary + "20", paddingHorizontal: 8, paddingVertical: 4, marginRight: 8, marginBottom: 8 }}>
                <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 12, color: colors.primary }}>{mc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      <ReferencesBlock
        references={references}
        referencedBy={referencedBy}
        loading={loadingRefs}
        onSelectArticle={onSelectArticle}
      />
    </ScrollView>
  );
}
