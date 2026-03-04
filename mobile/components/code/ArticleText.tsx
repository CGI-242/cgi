import { View, Text } from "react-native";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";

type Props = {
  texte: string[];
};

function getLineType(line: string) {
  if (/^\([ivx]+\)\s/.test(line)) return "roman";
  if (/^\d+°\s/.test(line)) return "degree";
  if (/^\d+\)\s/.test(line) || /^\d+\.\s/.test(line)) return "numbered";
  if (/^[a-z]\)\s/.test(line)) return "lettered";
  if (/^-\s/.test(line) || line.startsWith("- ") || line.startsWith("• ") || line.startsWith("○ ")) return "dash";
  if (/^\d+[A-Z]?\.\d+\./.test(line)) return "subsection";
  return "paragraph";
}

export default function ArticleText({ texte }: Props) {
  const { colors } = useTheme();

  function renderInlineRoman(text: string) {
    const parts = text.split(/(\([ivx]+\))/g);
    if (parts.length === 1) return <Text selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular }}>{text}</Text>;

    return (
      <Text selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular }}>
        {parts.map((part, i) =>
          /^\([ivx]+\)$/.test(part) ? (
            <Text key={i} selectable={false} style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, color: colors.primary }}>{part}</Text>
          ) : (
            <Text key={i} selectable={false}>{part}</Text>
          )
        )}
      </Text>
    );
  }

  return (
    <View>
      {texte.map((line, i) => {
        if (line === "") return <View key={i} style={{ height: 14 }} />;

        const type = getLineType(line);

        if (type === "subsection") {
          return (
            <View key={i} style={{ marginTop: 16, marginBottom: 8 }}>
              <Text selectable={false} style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 15, color: colors.primary }}>{line}</Text>
            </View>
          );
        }

        if (type === "degree") {
          const marker = line.match(/^(\d+°)/)?.[1] || "";
          return (
            <View key={i} style={{ flexDirection: "row", paddingLeft: 8, marginBottom: 8 }}>
              <Text selectable={false} style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 15, color: "#D4A017", minWidth: 30 }}>
                {marker}
              </Text>
              <Text selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.text, lineHeight: 22, flex: 1 }}>
                {renderInlineRoman(line.replace(/^\d+°\s*/, ""))}
              </Text>
            </View>
          );
        }

        if (type === "numbered") {
          return (
            <View key={i} style={{ flexDirection: "row", paddingLeft: 8, marginBottom: 8 }}>
              <Text selectable={false} style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 15, color: colors.primary, width: 24 }}>
                {line.match(/^(\d+[\.\)])/)?.[1]}
              </Text>
              <Text selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.text, lineHeight: 22, flex: 1 }}>
                {renderInlineRoman(line.replace(/^\d+[\.\)]\s*/, ""))}
              </Text>
            </View>
          );
        }

        if (type === "lettered") {
          return (
            <View key={i} style={{ flexDirection: "row", paddingLeft: 24, marginBottom: 4 }}>
              <Text selectable={false} style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 15, color: colors.textMuted, width: 20 }}>
                {line.match(/^([a-z]\))/)?.[1]}
              </Text>
              <Text selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.text, lineHeight: 22, flex: 1 }}>
                {renderInlineRoman(line.replace(/^[a-z]\)\s*/, ""))}
              </Text>
            </View>
          );
        }

        if (type === "roman") {
          const marker = line.match(/^(\([ivx]+\))/)?.[1] || "";
          return (
            <View key={i} style={{ flexDirection: "row", paddingLeft: 40, marginBottom: 4 }}>
              <Text selectable={false} style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 14, color: colors.primary, width: 28 }}>
                {marker}
              </Text>
              <Text selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.text, lineHeight: 22, flex: 1 }}>
                {line.replace(/^\([ivx]+\)\s*/, "")}
              </Text>
            </View>
          );
        }

        if (type === "dash") {
          const isSubBullet = line.startsWith("○ ");
          return (
            <View key={i} style={{ flexDirection: "row", marginBottom: 4, paddingLeft: isSubBullet ? 24 : 16 }}>
              <Text selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.primary, marginRight: 8 }}>•</Text>
              <Text selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.text, lineHeight: 22, flex: 1 }}>
                {renderInlineRoman(line.replace(/^[-•○]\s*/, ""))}
              </Text>
            </View>
          );
        }

        return (
          <Text key={i} selectable={false} style={{ fontFamily: fonts.regular, fontWeight: fontWeights.regular, fontSize: 15, color: colors.text, lineHeight: 22, marginBottom: 8 }}>
            {renderInlineRoman(line)}
          </Text>
        );
      })}
    </View>
  );
}
