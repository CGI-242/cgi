import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@/lib/theme/ThemeContext";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

export default function ConfidentialiteScreen() {
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
              Politique de confidentialité
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
            1. Responsable du traitement
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
            Le responsable du traitement des données personnelles collectées via l'application CGI 242 est NORMX AI, éditeur de CGI 242, dont le siège social est situé au 5 rue Benjamin Raspail, Creil.{"\n\n"}
            Pour toute question relative à la protection de vos données, vous pouvez contacter notre responsable des données à l'adresse : contact@normx.ai
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
            2. Données collectées
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
            Nous collectons les données suivantes :{"\n"}
            — Données d'identification : nom, prénom, adresse email{"\n"}
            — Données de connexion : logs de connexion, adresse IP{"\n"}
            — Données d'utilisation : historique des recherches, questions posées à l'IA, simulations effectuées{"\n"}
            — Données d'organisation : appartenance à une entreprise, rôle
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
            3. Finalités du traitement
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
            Vos données sont traitées pour les finalités suivantes :{"\n"}
            — Gestion de votre compte utilisateur et authentification{"\n"}
            — Fourniture des services (consultation CGI, simulations, chat IA){"\n"}
            — Amélioration de la qualité du service et personnalisation{"\n"}
            — Gestion des abonnements et de la facturation{"\n"}
            — Respect de nos obligations légales
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
            4. Base légale
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
            Le traitement de vos données repose sur :{"\n"}
            — L'exécution du contrat (fourniture du service){"\n"}
            — Votre consentement (pour les cookies non essentiels){"\n"}
            — Notre intérêt légitime (amélioration du service, sécurité){"\n"}
            — Le respect d'obligations légales
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
            5. Durée de conservation
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
            Vos données personnelles sont conservées pendant la durée de votre inscription au service, puis archivées pendant une durée de 3 ans à compter de la suppression de votre compte, conformément aux obligations légales applicables.
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
            6. Partage des données
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
            Vos données ne sont pas vendues à des tiers. Elles peuvent être partagées avec :{"\n"}
            — Les membres de votre organisation (données de profil){"\n"}
            — Nos sous-traitants techniques (hébergement, envoi d'emails){"\n"}
            — Les autorités compétentes sur demande légale
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
            7. Hébergement
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
            Les données de l'application CGI 242 sont hébergées par OVH SAS, dont le siège social est situé à Roubaix, France. OVH est certifié ISO 27001 et garantit un hébergement conforme aux normes européennes de protection des données.
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
            8. Sécurité
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
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des données en transit (TLS) et au repos, authentification à deux facteurs, journalisation des accès, sauvegardes régulières.
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
            9. Vos droits
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
            Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez des droits suivants :{"\n"}
            — Droit d'accès à vos données personnelles{"\n"}
            — Droit de rectification des données inexactes{"\n"}
            — Droit à l'effacement (droit à l'oubli){"\n"}
            — Droit à la limitation du traitement{"\n"}
            — Droit à la portabilité de vos données{"\n"}
            — Droit d'opposition au traitement{"\n\n"}
            Pour exercer ces droits, contactez-nous par email à contact@normx.ai. Nous nous engageons à répondre dans un délai de 30 jours.
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
            10. Cookies
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
            L'application utilise des cookies essentiels au fonctionnement du service (authentification, préférences). Aucun cookie publicitaire ou de traçage n'est utilisé.
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
            11. Modifications
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
            Nous nous réservons le droit de modifier la présente politique de confidentialité. En cas de modification substantielle, vous serez informé par notification dans l'application ou par email à l'adresse associée à votre compte.
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
            12. Contact
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
            Pour toute question concernant cette politique de confidentialité ou pour exercer vos droits, contactez NORMX AI :{"\n\n"}
            Email : contact@normx.ai{"\n"}
            Siège : 5 rue Benjamin Raspail, Creil
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
