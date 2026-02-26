import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";
import * as Speech from "expo-speech";
import type { ArticleData } from "@/lib/data/cgi";
import ArticleText from "./ArticleText";

type Props = {
  article: ArticleData;
  onBack: () => void;
};

/** Limite de caracteres par segment pour la synthese vocale */
const SPEECH_MAX_CHUNK = 3_000;

export default function ArticleDetail({ article, onBack }: Props) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const stoppedRef = useRef(false);

  useEffect(() => {
    return () => {
      stoppedRef.current = true;
      Speech.stop();
    };
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
    <ScrollView className="flex-1 p-6">
      <View className="flex-row items-center justify-between mb-4">
        <TouchableOpacity onPress={handleBack} className="flex-row items-center">
          <Ionicons name="arrow-back" size={18} color="#00815d" />
          <Text className="text-primary text-sm ml-2">Retour aux articles</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handlePlay}
          className={`flex-row items-center px-3 py-2 ${isSpeaking ? "bg-danger" : "bg-primary"}`}
          style={{ borderWidth: 0 }}
        >
          <Ionicons
            name={isSpeaking ? "stop" : "volume-high"}
            size={16}
            color="#fff"
          />
          <Text className="text-white text-xs font-semibold ml-2">
            {isSpeaking ? "Stop" : "Ecouter"}
          </Text>
        </TouchableOpacity>
      </View>

      <View className="flex-row items-center mb-2">
        <View className="bg-primary-light px-2 py-1">
          <Text className="text-xs text-primary font-semibold">{article.statut}</Text>
        </View>
      </View>

      <Text className="text-2xl font-bold text-text mb-1">{article.article}</Text>
      <Text className="text-base text-muted italic mb-6">{article.titre}</Text>

      <View
        className="bg-card p-5 mb-6"
        style={{ shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 }}
      >
        <ArticleText texte={article.texte} />
      </View>

      {article.mots_cles.length > 0 && (
        <View>
          <Text className="text-xs font-bold text-muted mb-2 uppercase">Mots-cles</Text>
          <View className="flex-row flex-wrap">
            {article.mots_cles.map((mc) => (
              <View key={mc} className="bg-primary-light px-2 py-1 mr-2 mb-2">
                <Text className="text-xs text-primary">{mc}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}
