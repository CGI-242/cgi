import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

export default function CGUScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* En-tête avec logo */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 24,
            gap: 12,
          }}
        >
          <View
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              backgroundColor: "rgba(200,160,60,0.13)",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text
              style={{
                fontFamily: fonts.headingBlack,
                fontWeight: fontWeights.headingBlack,
                fontSize: 20,
                color: GOLD,
              }}
            >
              N
            </Text>
          </View>
          <View>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontWeight: fontWeights.bold,
                fontSize: 18,
                color: colors.text,
              }}
            >
              NORMX <Text style={{ color: GOLD }}>Tax</Text>
            </Text>
            <Text
              style={{
                fontFamily: fonts.regular,
                fontWeight: fontWeights.regular,
                fontSize: 13,
                color: colors.textMuted,
              }}
            >
              Conditions Générales d'Utilisation
            </Text>
          </View>
        </View>

        <View
          style={{
            backgroundColor: colors.card,
            borderWidth: 1,
            borderColor: colors.border,
            borderRadius: 16,
            padding: 20,
          }}
        >
          <Text
            style={{
              fontSize: 12,
              color: colors.textMuted,
              marginBottom: 20,
              fontStyle: "italic",
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            Dernière mise à jour : 1er janvier 2026
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              fontWeight: fontWeights.bold,
              color: colors.text,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Article 1 — Objet
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 22,
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de l'application CGI 242, éditée par NORMX AI, siège social au 5 rue Benjamin Raspail, Creil. CGI 242 est une plateforme numérique dédiée à la consultation du Code Général des Impôts de la République du Congo, aux simulations fiscales et à l'assistance par intelligence artificielle.
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              fontWeight: fontWeights.bold,
              color: colors.text,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Article 2 — Accès au service
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 22,
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            L'accès à l'application nécessite la création d'un compte utilisateur. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants de connexion. Tout accès non autorisé doit être signalé immédiatement.
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              fontWeight: fontWeights.bold,
              color: colors.text,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Article 3 — Description des services
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 22,
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            CGI 242 propose les services suivants :{"\n"}
            — Consultation intégrale du Code Général des Impôts à jour{"\n"}
            — 14 simulateurs fiscaux : ITS, IS, TVA, Patente, Taxe foncière, Taxe immobilière, Droits d'enregistrement, Solde de liquidation, IRF, IRPP, Retenue à la source, Contribution spéciale de solidarité, Taxe sur les transferts de fonds, Centimes additionnels{"\n"}
            — Assistant IA pour les questions fiscales{"\n"}
            — Recherche vocale intégrée{"\n"}
            — Mode hors-ligne pour la consultation sans connexion{"\n"}
            — Alertes sur les modifications législatives{"\n"}
            — Gestion d'organisation et de membres
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              fontWeight: fontWeights.bold,
              color: colors.text,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Article 4 — Abonnements et tarification
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 22,
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            L'application propose différents plans d'abonnement. Les tarifs sont exprimés en Francs CFA (XAF) et sont soumis aux taxes applicables. Le renouvellement est annuel sauf résiliation expresse de l'utilisateur avant l'échéance.
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              fontWeight: fontWeights.bold,
              color: colors.text,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Article 5 — Propriété intellectuelle
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 22,
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            L'ensemble du contenu de l'application (textes, graphismes, logiciels, bases de données) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation préalable écrite.
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              fontWeight: fontWeights.bold,
              color: colors.text,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Article 6 — Responsabilités
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 22,
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            Les informations fournies par l'application, y compris les réponses de l'assistant IA et les résultats des simulateurs, ont un caractère informatif et ne sauraient se substituer à un conseil fiscal professionnel. NORMX AI ne saurait être tenu responsable des décisions prises sur la base de ces informations.{"\n\n"}
            Pour toute question relative à l'utilisation du service, vous pouvez contacter NORMX AI à l'adresse : contact@normx-ai.com
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              fontWeight: fontWeights.bold,
              color: colors.text,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Article 7 — Résiliation
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 22,
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            L'utilisateur peut résilier son compte à tout moment depuis les paramètres de l'application. NORMX AI se réserve le droit de suspendre ou résilier un compte en cas de violation des présentes CGU, sans préavis ni indemnité.
          </Text>

          <Text
            style={{
              fontSize: 16,
              fontFamily: fonts.bold,
              fontWeight: fontWeights.bold,
              color: colors.text,
              marginTop: 20,
              marginBottom: 8,
            }}
          >
            Article 8 — Droit applicable
          </Text>
          <Text
            style={{
              fontSize: 14,
              color: colors.text,
              lineHeight: 22,
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
            }}
          >
            Les présentes CGU sont soumises au droit de la République du Congo. En cas de litige, les tribunaux de Brazzaville seront seuls compétents, à défaut de résolution amiable.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
