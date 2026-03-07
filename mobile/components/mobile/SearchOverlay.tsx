import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, type Href } from "expo-router";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useTranslation } from "react-i18next";
import { searchArticles, type ArticleData } from "@/lib/data/cgi";
import { useDebounce } from "@/lib/hooks/useDebounce";
import { fonts, fontWeights } from "@/lib/theme/fonts";

type Props = {
  visible: boolean;
  onClose: () => void;
};

const QUICK_LINKS: { icon: keyof typeof Ionicons.glyphMap; labelKey: string; route: string }[] = [
  { icon: "book-outline", labelKey: "sidebar.code", route: "/(app)/code" },
  { icon: "stats-chart-outline", labelKey: "sidebar.simulators", route: "/(app)/simulateur" },
  { icon: "chatbubbles-outline", labelKey: "sidebar.chat", route: "/(app)/chat" },
  { icon: "calendar-outline", labelKey: "sidebar.calendrier", route: "/(app)/calendrier" },
];

export default function SearchOverlay({ visible, onClose }: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const inputRef = useRef<TextInput>(null);

  const results = debouncedQuery.length >= 2 ? searchArticles(debouncedQuery).slice(0, 20) : [];

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 200);
    } else {
      setQuery("");
    }
  }, [visible]);

  const handleSelectArticle = (art: ArticleData) => {
    onClose();
    router.push("/(app)/code" as Href);
  };

  const handleQuickLink = (route: string) => {
    onClose();
    router.push(route as Href);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false}>
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        {/* Header recherche */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            paddingHorizontal: 14,
            paddingTop: 14,
            paddingBottom: 10,
            gap: 10,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          }}
        >
          <TouchableOpacity onPress={onClose} hitSlop={8}>
            <Ionicons name="arrow-back" size={22} color={colors.primary} />
          </TouchableOpacity>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: colors.input,
              borderRadius: 12,
              paddingHorizontal: 12,
              paddingVertical: 8,
            }}
          >
            <Ionicons name="search" size={18} color={colors.textMuted} />
            <TextInput
              ref={inputRef}
              style={{
                flex: 1,
                marginLeft: 8,
                fontSize: 17,
                color: colors.text,
                fontFamily: fonts.regular,
              }}
              placeholder={t("code.searchPlaceholder")}
              placeholderTextColor={colors.textMuted}
              value={query}
              onChangeText={setQuery}
              returnKeyType="search"
              autoFocus
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery("")} hitSlop={8}>
                <Ionicons name="close-circle" size={18} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
          {/* Résultats de recherche */}
          {debouncedQuery.length >= 2 ? (
            <>
              <Text
                style={{
                  fontFamily: fonts.semiBold,
                  fontWeight: fontWeights.semiBold,
                  fontSize: 15,
                  color: colors.textSecondary,
                  marginBottom: 12,
                }}
              >
                {results.length} {t("code.article")}(s)
              </Text>
              {results.map((art, i) => (
                <TouchableOpacity
                  key={`${art.article}-${i}`}
                  onPress={() => handleSelectArticle(art)}
                  style={{
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    borderRadius: 12,
                    padding: 14,
                    marginBottom: 8,
                    flexDirection: "row",
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      backgroundColor: `${colors.primary}15`,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="document-text-outline" size={18} color={colors.primary} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 15, color: colors.primary }}>
                      {art.article}
                    </Text>
                    {art.titre && (
                      <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 14, color: colors.text, marginTop: 2 }} numberOfLines={1}>
                        {art.titre}
                      </Text>
                    )}
                    <Text
                      style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 13, color: colors.textMuted, marginTop: 2 }}
                      numberOfLines={2}
                    >
                      {art.texte.join(" ")}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
              {results.length === 0 && (
                <View style={{ alignItems: "center", paddingTop: 40 }}>
                  <Ionicons name="search-outline" size={40} color={colors.textMuted} />
                  <Text style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 16, color: colors.textMuted, marginTop: 12 }}>
                    {t("common.noResults")}
                  </Text>
                </View>
              )}
            </>
          ) : (
            /* Liens rapides quand pas de recherche */
            <>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  fontWeight: fontWeights.bold,
                  fontSize: 17,
                  color: colors.text,
                  marginBottom: 14,
                }}
              >
                {t("dashboard.quickActions")}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
                {QUICK_LINKS.map((link) => (
                  <TouchableOpacity
                    key={link.route}
                    onPress={() => handleQuickLink(link.route)}
                    style={{
                      backgroundColor: colors.card,
                      borderWidth: 1,
                      borderColor: colors.border,
                      borderRadius: 12,
                      padding: 16,
                      width: "48%" as unknown as number,
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 10,
                        backgroundColor: `${colors.primary}15`,
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name={link.icon} size={20} color={colors.primary} />
                    </View>
                    <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 15, color: colors.text }}>
                      {t(link.labelKey)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}
        </ScrollView>
      </View>
    </Modal>
  );
}
