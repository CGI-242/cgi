// mobile/components/chat/CitationsBlock.tsx
// Bloc collapsible de citations CGI sous un message assistant

import { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";
import type { Citation } from "@/lib/api/chat";
import { useTheme } from "@/lib/theme/ThemeContext";

const MAX_VISIBLE = 2;

type Props = {
  citations: Citation[];
};

export default function CitationsBlock({ citations }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const visibleCitations = expanded ? citations : citations.slice(0, MAX_VISIBLE);
  const hiddenCount = citations.length - MAX_VISIBLE;

  return (
    <View
      style={{
        backgroundColor: colors.citationsBg,
        
        borderWidth: 1,
        borderColor: colors.primary,
        padding: 10,
        marginTop: 6,
      }}
    >
      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary, marginBottom: 6 }}>
        {t("code.cgiSources")}
      </Text>
      {visibleCitations.map((cit, i) => (
        <View
          key={`${cit.articleNumber}-${i}`}
          style={{
            backgroundColor: colors.card,
            
            padding: 8,
            marginBottom: i < visibleCitations.length - 1 ? 4 : 0,
            borderWidth: 1,
            borderColor: colors.primary + "30",
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>
            Art. {cit.articleNumber}{cit.titre ? ` — ${cit.titre}` : ""}
          </Text>
          <Text
            style={{ fontSize: 11, color: colors.textSecondary, fontStyle: "italic", marginTop: 2 }}
            numberOfLines={2}
          >
            "{cit.excerpt}"
          </Text>
        </View>
      ))}
      {!expanded && hiddenCount > 0 && (
        <TouchableOpacity onPress={() => setExpanded(true)} style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "600" }}>
            {t("code.showMoreSources", { count: hiddenCount })}
          </Text>
        </TouchableOpacity>
      )}
      {expanded && hiddenCount > 0 && (
        <TouchableOpacity onPress={() => setExpanded(false)} style={{ marginTop: 6 }}>
          <Text style={{ fontSize: 11, color: colors.primary, fontWeight: "600" }}>
            {t("code.reduceSources")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
