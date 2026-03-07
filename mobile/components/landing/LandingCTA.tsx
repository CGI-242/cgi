import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

export default function LandingCTA() {
  return (
    <View style={{ alignItems: "center", paddingVertical: 60, paddingHorizontal: 24 }}>
      <Text
        style={{
          fontFamily: fonts.headingBlack,
          fontWeight: fontWeights.headingBlack,
          fontSize: 42,
          color: "#e8e6e1",
          textAlign: "center",
          marginBottom: 12,
        }}
      >
        {`Prêt à essayer ?`}
      </Text>
      <Text
        style={{
          color: "#5a5a65",
          fontSize: 17,
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 28,
        }}
      >
        {`7 jours gratuits \u2014 Commencez avec le CGI 242`}
      </Text>
      <TouchableOpacity
        onPress={() => router.push("/(auth)/register")}
        style={{
          paddingVertical: 15,
          paddingHorizontal: 38,
          borderRadius: 12,
          backgroundColor: GOLD,
        }}
      >
        <Text
          style={{
            color: "#08080d",
            fontSize: 18,
            fontFamily: fonts.extraBold,
            fontWeight: fontWeights.extraBold,
          }}
        >
          {`Démarrer l'essai gratuit`}
        </Text>
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 14,
          fontSize: 14,
          color: "#3a3a45",
          fontFamily: fonts.regular,
        }}
      >
        Aucune carte bancaire requise
      </Text>
    </View>
  );
}
