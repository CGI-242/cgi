import { View, Text } from "react-native";

type Props = {
  texte: string[];
};

function getLineType(line: string) {
  if (/^\([ivx]+\)\s/.test(line)) return "roman";
  if (/^\d+\)\s/.test(line) || /^\d+\.\s/.test(line)) return "numbered";
  if (/^[a-z]\)\s/.test(line)) return "lettered";
  if (/^-\s/.test(line) || line.startsWith("- ") || line.startsWith("• ") || line.startsWith("○ ")) return "dash";
  if (/^\d+[A-Z]?\.\d+\./.test(line)) return "subsection";
  return "paragraph";
}

function renderInlineRoman(text: string) {
  const parts = text.split(/(\([ivx]+\))/g);
  if (parts.length === 1) return <Text selectable={false}>{text}</Text>;

  return (
    <Text selectable={false}>
      {parts.map((part, i) =>
        /^\([ivx]+\)$/.test(part) ? (
          <Text key={i} selectable={false} className="font-bold text-primary">{part}</Text>
        ) : (
          <Text key={i} selectable={false}>{part}</Text>
        )
      )}
    </Text>
  );
}

export default function ArticleText({ texte }: Props) {
  return (
    <View>
      {texte.map((line, i) => {
        if (line === "") return <View key={i} style={{ height: 14 }} />;

        const type = getLineType(line);

        if (type === "subsection") {
          return (
            <View key={i} className="mt-4 mb-2">
              <Text selectable={false} className="text-sm font-bold text-primary">{line}</Text>
            </View>
          );
        }

        if (type === "numbered") {
          return (
            <View key={i} className="flex-row pl-2 mb-2">
              <Text selectable={false} className="text-sm text-primary font-semibold" style={{ width: 24 }}>
                {line.match(/^(\d+[\.\)])/)?.[1]}
              </Text>
              <Text selectable={false} className="text-sm text-text leading-5 flex-1">
                {renderInlineRoman(line.replace(/^\d+[\.\)]\s*/, ""))}
              </Text>
            </View>
          );
        }

        if (type === "lettered") {
          return (
            <View key={i} className="flex-row pl-6 mb-1">
              <Text selectable={false} className="text-sm text-muted font-semibold" style={{ width: 20 }}>
                {line.match(/^([a-z]\))/)?.[1]}
              </Text>
              <Text selectable={false} className="text-sm text-text leading-5 flex-1">
                {renderInlineRoman(line.replace(/^[a-z]\)\s*/, ""))}
              </Text>
            </View>
          );
        }

        if (type === "roman") {
          const marker = line.match(/^(\([ivx]+\))/)?.[1] || "";
          return (
            <View key={i} className="flex-row pl-10 mb-1">
              <Text selectable={false} className="text-xs text-primary font-semibold" style={{ width: 28 }}>
                {marker}
              </Text>
              <Text selectable={false} className="text-sm text-text leading-5 flex-1">
                {line.replace(/^\([ivx]+\)\s*/, "")}
              </Text>
            </View>
          );
        }

        if (type === "dash") {
          const isSubBullet = line.startsWith("○ ");
          return (
            <View key={i} className="flex-row mb-1" style={{ paddingLeft: isSubBullet ? 24 : 16 }}>
              <Text selectable={false} className="text-sm text-primary mr-2">•</Text>
              <Text selectable={false} className="text-sm text-text leading-5 flex-1">
                {renderInlineRoman(line.replace(/^[-•○]\s*/, ""))}
              </Text>
            </View>
          );
        }

        return (
          <Text key={i} selectable={false} className="text-sm text-text leading-5 mb-2">
            {renderInlineRoman(line)}
          </Text>
        );
      })}
    </View>
  );
}
