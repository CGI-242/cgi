import { View, Text, ScrollView, Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function ConfidentialiteScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingTop: Platform.OS === "ios" ? 56 : 16, paddingBottom: 16, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Politique de confidentialité</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 20 }}>
          <Text style={styles.lastUpdate}>Dernière mise à jour : 1er janvier 2026</Text>

          <Text style={styles.sectionTitle}>1. Responsable du traitement</Text>
          <Text style={styles.paragraph}>
            Le responsable du traitement des données personnelles collectées via l'application CGI 242 est l'éditeur de l'application. Pour toute question relative à la protection de vos données, vous pouvez nous contacter via les coordonnées indiquées dans l'application.
          </Text>

          <Text style={styles.sectionTitle}>2. Données collectées</Text>
          <Text style={styles.paragraph}>
            Nous collectons les données suivantes :{"\n"}
            — Données d'identification : nom, prénom, adresse email{"\n"}
            — Données de connexion : logs de connexion, adresse IP{"\n"}
            — Données d'utilisation : historique des recherches, questions posées à l'IA, simulations effectuées{"\n"}
            — Données d'organisation : appartenance à une entreprise, rôle
          </Text>

          <Text style={styles.sectionTitle}>3. Finalités du traitement</Text>
          <Text style={styles.paragraph}>
            Vos données sont traitées pour les finalités suivantes :{"\n"}
            — Gestion de votre compte utilisateur et authentification{"\n"}
            — Fourniture des services (consultation CGI, simulations, chat IA){"\n"}
            — Amélioration de la qualité du service et personnalisation{"\n"}
            — Gestion des abonnements et de la facturation{"\n"}
            — Respect de nos obligations légales
          </Text>

          <Text style={styles.sectionTitle}>4. Base légale</Text>
          <Text style={styles.paragraph}>
            Le traitement de vos données repose sur :{"\n"}
            — L'exécution du contrat (fourniture du service){"\n"}
            — Votre consentement (pour les cookies non essentiels){"\n"}
            — Notre intérêt légitime (amélioration du service, sécurité){"\n"}
            — Le respect d'obligations légales
          </Text>

          <Text style={styles.sectionTitle}>5. Durée de conservation</Text>
          <Text style={styles.paragraph}>
            Vos données personnelles sont conservées pendant la durée de votre inscription au service, puis archivées pendant une durée de 3 ans à compter de la suppression de votre compte, conformément aux obligations légales applicables.
          </Text>

          <Text style={styles.sectionTitle}>6. Partage des données</Text>
          <Text style={styles.paragraph}>
            Vos données ne sont pas vendues à des tiers. Elles peuvent être partagées avec :{"\n"}
            — Les membres de votre organisation (données de profil){"\n"}
            — Nos sous-traitants techniques (hébergement, envoi d'emails){"\n"}
            — Les autorités compétentes sur demande légale
          </Text>

          <Text style={styles.sectionTitle}>7. Sécurité</Text>
          <Text style={styles.paragraph}>
            Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données : chiffrement des données en transit (TLS) et au repos, authentification à deux facteurs, journalisation des accès, sauvegardes régulières.
          </Text>

          <Text style={styles.sectionTitle}>8. Vos droits</Text>
          <Text style={styles.paragraph}>
            Conformément à la réglementation applicable en matière de protection des données personnelles, vous disposez des droits suivants :{"\n"}
            — Droit d'accès à vos données personnelles{"\n"}
            — Droit de rectification des données inexactes{"\n"}
            — Droit à l'effacement (droit à l'oubli){"\n"}
            — Droit à la limitation du traitement{"\n"}
            — Droit à la portabilité de vos données{"\n"}
            — Droit d'opposition au traitement{"\n\n"}
            Pour exercer ces droits, contactez-nous via l'application ou par email. Nous nous engageons à répondre dans un délai de 30 jours.
          </Text>

          <Text style={styles.sectionTitle}>9. Cookies</Text>
          <Text style={styles.paragraph}>
            L'application utilise des cookies essentiels au fonctionnement du service (authentification, préférences). Aucun cookie publicitaire ou de traçage n'est utilisé.
          </Text>

          <Text style={styles.sectionTitle}>10. Modifications</Text>
          <Text style={styles.paragraph}>
            Nous nous réservons le droit de modifier la présente politique de confidentialité. En cas de modification substantielle, vous serez informé par notification dans l'application ou par email.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = {
  lastUpdate: {
    fontSize: 12,
    color: "#9ca3af",
    marginBottom: 20,
    fontStyle: "italic" as const,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700" as const,
    color: "#1f2937",
    marginTop: 20,
    marginBottom: 8,
  },
  paragraph: {
    fontSize: 14,
    color: "#374151",
    lineHeight: 22,
  },
};
