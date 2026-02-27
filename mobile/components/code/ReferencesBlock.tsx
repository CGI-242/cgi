// mobile/components/code/ReferencesBlock.tsx
// Bloc de références croisées (articles liés) dans ArticleDetail

import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import type { ArticleData } from "@/lib/data/cgi";
import type { ArticleReference } from "@/lib/api/chat";

type Props = {
  references: ArticleReference[];
  referencedBy: ArticleReference[];
  loading: boolean;
  onSelectArticle?: (article: ArticleData) => void;
};

function makeArticleData(ref: ArticleReference): ArticleData {
  return {
    article: `Art. ${ref.numero}`,
    titre: ref.titre,
    texte: [],
    mots_cles: [],
    statut: "",
    section: "",
    annee_application: 0,
  };
}

export default function ReferencesBlock({
  references,
  referencedBy,
  loading,
  onSelectArticle,
}: Props) {
  if (loading) {
    return (
      <View style={{ paddingVertical: 16, alignItems: "center" }}>
        <ActivityIndicator size="small" color="#00815d" />
      </View>
    );
  }

  if (references.length === 0 && referencedBy.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: "#f0f9ff",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: "#00815d",
        padding: 12,
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontSize: 14, fontWeight: "700", color: "#00815d", marginBottom: 10 }}>
        Articles liés
      </Text>

      {references.length > 0 && (
        <View style={{ marginBottom: referencedBy.length > 0 ? 12 : 0 }}>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 6 }}>
            Cet article référence :
          </Text>
          {references.map((ref) => (
            <TouchableOpacity
              key={ref.id}
              onPress={() => onSelectArticle?.(makeArticleData(ref))}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4 }}
            >
              <Text style={{ fontSize: 13, color: "#00815d", marginRight: 4 }}>→</Text>
              <Text style={{ fontSize: 13, color: "#00815d", fontWeight: "600" }}>
                Art. {ref.numero}
              </Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginLeft: 4, flex: 1 }} numberOfLines={1}>
                — {ref.titre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {referencedBy.length > 0 && (
        <View>
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 6 }}>
            Référencé par :
          </Text>
          {referencedBy.map((ref) => (
            <TouchableOpacity
              key={ref.id}
              onPress={() => onSelectArticle?.(makeArticleData(ref))}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4 }}
            >
              <Text style={{ fontSize: 13, color: "#6366f1", marginRight: 4 }}>←</Text>
              <Text style={{ fontSize: 13, color: "#6366f1", fontWeight: "600" }}>
                Art. {ref.numero}
              </Text>
              <Text style={{ fontSize: 12, color: "#6b7280", marginLeft: 4, flex: 1 }} numberOfLines={1}>
                — {ref.titre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
