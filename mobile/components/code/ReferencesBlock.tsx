// mobile/components/code/ReferencesBlock.tsx
// Bloc de références croisées (articles liés) dans ArticleDetail

import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";
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
  const { colors } = useTheme();
  const { t } = useTranslation();

  if (loading) {
    return (
      <View style={{ paddingVertical: 16, alignItems: "center" }}>
        <ActivityIndicator size="small" color={colors.primary} />
      </View>
    );
  }

  if (references.length === 0 && referencedBy.length === 0) {
    return null;
  }

  return (
    <View
      style={{
        backgroundColor: colors.primary + "10",
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 12,
        marginTop: 16,
        marginBottom: 16,
      }}
    >
      <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 18, color: colors.primary, marginBottom: 10 }}>
        {t("code.referencesTitle")}
      </Text>

      {references.length > 0 && (
        <View style={{ marginBottom: referencedBy.length > 0 ? 12 : 0 }}>
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.text, marginBottom: 6 }}>
            {t("code.referencesOut")}
          </Text>
          {references.map((ref) => (
            <TouchableOpacity
              key={ref.id}
              onPress={() => onSelectArticle?.(makeArticleData(ref))}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4 }}
            >
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 17, color: colors.primary, marginRight: 4 }}>→</Text>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 17, color: colors.primary }}>
                Art. {ref.numero}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: colors.textMuted, marginLeft: 4, flex: 1 }} numberOfLines={1}>
                — {ref.titre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {referencedBy.length > 0 && (
        <View>
          <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.text, marginBottom: 6 }}>
            {t("code.referencesIn")}
          </Text>
          {referencedBy.map((ref) => (
            <TouchableOpacity
              key={ref.id}
              onPress={() => onSelectArticle?.(makeArticleData(ref))}
              style={{ flexDirection: "row", alignItems: "center", paddingVertical: 4 }}
            >
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 17, color: colors.accent, marginRight: 4 }}>←</Text>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 17, color: colors.accent }}>
                Art. {ref.numero}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: colors.textMuted, marginLeft: 4, flex: 1 }} numberOfLines={1}>
                — {ref.titre}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
