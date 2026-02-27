import { View, Text, ScrollView } from "react-native";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function ConfidentialiteScreen() {
  const { colors } = useTheme();

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 20 }}>
          <Text style={{ fontSize: 12, color: colors.textMuted, marginBottom: 20, fontStyle: "italic" }}>
            Dernière mise à jour : 1er janvier 2026
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>1. Responsable du traitement</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Le responsable du traitement des données personnelles collectées via l'application CGI 242 est l'éditeur de l'application. Pour toute question relative à la protection de vos données, vous pouvez nous contacter via les coordonnées indiquées dans l'application.
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>2. Données collectées</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Nous collectons les données suivantes :{"\n"}
            — Données d'identification : nom, prénom, adresse email{"\n"}
            — Données de connexion : logs de connexion, adresse IP{"\n"}
            — Données d'utilisation : historique des recherches, questions posées à l'IA, simulations effectuées{"\n"}
            — Données d'organisation : appartenance à une entreprise, rôle
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>3. Finalités du traitement</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Vos données sont traitées pour les finalités suivantes :{"\n"}
            — Gestion de votre compte utilisateur et authentification{"\n"}
            — Fourniture des services (consultation CGI, simulations, chat IA){"\n"}
            — Amélioration de la qualité du service et personnalisation{"\n"}
            — Gestion des abonnements et de la facturation{"\n"}
            — Respect de nos obligations légales
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>4. Base légale</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Le traitement de vos données repose sur :{"\n"}
            — L'exécution du contrat (fourniture du service){"\n"}
            — Votre consentement (pour les cookies non essentiels){"\n"}
            — Notre intérêt légitime (amélioration du service, sécurité){"\n"}
            — Le respect d'obligations légales
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>5. Durée de conservation</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Vos données personnelles sont conservées pendant la durée de votre inscription au service, puis archivées pendant une durée de 3 ans à compter de la suppression de votre compte, conformément aux obligations légales applicables.
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>6. Partage des données</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Vos données ne sont pas vendues à des tiers. Elles peuvent être partagées avec :{"\n"}
            — Les membres de votre organisation (données de profil){"\n"}
            — Nos sous-traitants techniques (hébergement, envoi d'emails){"\n"}
            — Les autorités compétentes sur demande légale
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>7. Sécurité</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Nous mettons en oeuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des données en transit (TLS) et au repos, authentification à deux facteurs, journalisation des accès, sauvegardes régulières.
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>8. Vos droits</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez des droits suivants :{"\n"}
            — Droit d'accès à vos données personnelles{"\n"}
            — Droit de rectification des données inexactes{"\n"}
            — Droit à l'effacement (droit à l'oubli){"\n"}
            — Droit à la limitation du traitement{"\n"}
            — Droit à la portabilité de vos données{"\n"}
            — Droit d'opposition au traitement{"\n\n"}
            Pour exercer ces droits, contactez-nous via l'application ou par email. Nous nous engageons à répondre dans un délai de 30 jours.
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>9. Cookies</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            L'application utilise des cookies essentiels au fonctionnement du service (authentification, préférences). Aucun cookie publicitaire ou de traçage n'est utilisé.
          </Text>

          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginTop: 20, marginBottom: 8 }}>10. Modifications</Text>
          <Text style={{ fontSize: 14, color: colors.text, lineHeight: 22 }}>
            Nous nous réservons le droit de modifier la présente politique de confidentialité. En cas de modification substantielle, vous serez informé par notification dans l'application ou par email.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
