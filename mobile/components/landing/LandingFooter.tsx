import { View, Text } from "react-native";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

interface Props {
  isMobile: boolean;
}

export default function LandingFooter({ isMobile }: Props) {
  return (
    <View
      style={{
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.03)",
        paddingVertical: 28,
        paddingHorizontal: 24,
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 12, color: "#2a2a35", fontFamily: fonts.regular }}>
        {`\u00a9 2026 NORMX AI \u2014 Tous droits r\u00e9serv\u00e9s`}
      </Text>
      <Text style={{ fontSize: 11, color: "#3a3a45", marginTop: 6, fontFamily: fonts.regular }}>
        {"Propuls\u00e9 par "}
        <Text style={{ color: GOLD, fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold }}>NORMX AI</Text>
        {" \u2014 Marque d\u00e9pos\u00e9e INPI n\u00b05146181"}
      </Text>
    </View>
  );
}
