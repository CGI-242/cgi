import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts, fontWeights } from "@/lib/theme/fonts";

interface Props {
  isMobile: boolean;
  loaded: boolean;
}

const GOLD = "#c8a03c";

const FEATURES = [
  { icon: "book-outline" as const, title: "Code des Impôts", desc: "2 248 articles du CGI 2026 avec navigation hiérarchique par tomes, titres et chapitres", color: "#00815d" },
  { icon: "chatbubbles-outline" as const, title: "Assistant IA", desc: "Posez vos questions fiscales en langage naturel, obtenez les références exactes du CGI", color: "#0284c7" },
  { icon: "calculator-outline" as const, title: "14 Simulateurs", desc: "ITS, IS, Patente, TVA, IRCM, IRF, IBA, IGF, Enregistrement, Foncier et plus", color: "#4f46e5" },
  { icon: "mic-outline" as const, title: "Recherche vocale", desc: "Dictez votre recherche en français, trouvez l'article pertinent instantanément", color: "#9333ea" },
  { icon: "calendar-outline" as const, title: "Échéances fiscales", desc: "Calendrier des échéances TVA, ITS, Patente, IRPP et IRF triées par urgence", color: "#ef4444" },
  { icon: "cloud-offline-outline" as const, title: "Mode hors-ligne", desc: "Tout le CGI et les simulateurs accessibles même sans connexion internet", color: "#d97706" },
  { icon: "people-outline" as const, title: "Gestion d'équipe", desc: "Invitez collaborateurs et associés, gérez les rôles et permissions de votre cabinet", color: "#0891b2" },
  { icon: "language-outline" as const, title: "Multilingue", desc: "Interface disponible en français et anglais, avec thème clair et sombre", color: "#c8a03c" },
];

export default function LandingFeatures({ isMobile, loaded }: Props) {
  return (
    <View
      style={{
        maxWidth: 1060,
        alignSelf: "center",
        width: "100%",
        paddingHorizontal: 24,
        paddingBottom: 60,
      }}
    >
      <Text
        style={{
          fontFamily: fonts.headingBlack,
          fontWeight: fontWeights.headingBlack,
          fontSize: isMobile ? 28 : 36,
          color: "#e8e6e1",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Tout ce dont vous avez besoin
      </Text>
      <Text
        style={{
          fontSize: isMobile ? 14 : 16,
          color: "#5a5a65",
          textAlign: "center",
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 36,
        }}
      >
        Une plateforme complète pour maîtriser la fiscalité africaine
      </Text>
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        {FEATURES.map((feat, i) => (
          <View
            key={i}
            style={{
              width: isMobile ? "100%" : "48%",
              flexGrow: 1,
              flexBasis: isMobile ? "100%" : 220,
              backgroundColor: "rgba(255,255,255,0.015)",
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.05)",
              borderRadius: 16,
              padding: isMobile ? 22 : 28,
              opacity: loaded ? 1 : 0,
            }}
          >
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                backgroundColor: `${feat.color}15`,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <Ionicons name={feat.icon} size={22} color={feat.color} />
            </View>
            <Text
              style={{
                fontSize: 15,
                fontFamily: fonts.bold,
                fontWeight: fontWeights.bold,
                color: "#e8e6e1",
                marginBottom: 6,
              }}
            >
              {feat.title}
            </Text>
            <Text
              style={{
                fontSize: 13,
                color: "#5a5a65",
                lineHeight: 20,
                fontFamily: fonts.light,
                fontWeight: fontWeights.light,
              }}
            >
              {feat.desc}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
