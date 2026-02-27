import { View, Text, ScrollView, Platform } from "react-native";
import { TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function CGUScreen() {
  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingTop: Platform.OS === "ios" ? 56 : 16, paddingBottom: 16, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Conditions Générales d'Utilisation</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 20 }}>
          <Text style={styles.lastUpdate}>Dernière mise à jour : 1er janvier 2026</Text>

          <Text style={styles.articleTitle}>Article 1 — Objet</Text>
          <Text style={styles.paragraph}>
            Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation de l'application CGI 242, plateforme numérique dédiée à la consultation du Code Général des Impôts de la République du Congo, aux simulations fiscales et à l'assistance par intelligence artificielle.
          </Text>

          <Text style={styles.articleTitle}>Article 2 — Accès au service</Text>
          <Text style={styles.paragraph}>
            L'accès à l'application nécessite la création d'un compte utilisateur. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants de connexion. Tout accès non autorisé doit être signalé immédiatement.
          </Text>

          <Text style={styles.articleTitle}>Article 3 — Description des services</Text>
          <Text style={styles.paragraph}>
            CGI 242 propose les services suivants :{"\n"}
            — Consultation du Code Général des Impôts à jour{"\n"}
            — Simulateurs fiscaux (ITS, IS, Patente, Solde de liquidation){"\n"}
            — Assistant IA pour les questions fiscales{"\n"}
            — Alertes sur les modifications législatives{"\n"}
            — Gestion d'organisation et de membres
          </Text>

          <Text style={styles.articleTitle}>Article 4 — Abonnements et tarification</Text>
          <Text style={styles.paragraph}>
            L'application propose différents plans d'abonnement. Les tarifs sont exprimés en Francs CFA (XAF) et sont soumis aux taxes applicables. Le renouvellement est annuel sauf résiliation expresse de l'utilisateur avant l'échéance.
          </Text>

          <Text style={styles.articleTitle}>Article 5 — Propriété intellectuelle</Text>
          <Text style={styles.paragraph}>
            L'ensemble du contenu de l'application (textes, graphismes, logiciels, bases de données) est protégé par le droit de la propriété intellectuelle. Toute reproduction ou représentation, totale ou partielle, est interdite sans autorisation préalable écrite.
          </Text>

          <Text style={styles.articleTitle}>Article 6 — Responsabilités</Text>
          <Text style={styles.paragraph}>
            Les informations fournies par l'application, y compris les réponses de l'assistant IA et les résultats des simulateurs, ont un caractère informatif et ne sauraient se substituer à un conseil fiscal professionnel. L'éditeur ne saurait être tenu responsable des décisions prises sur la base de ces informations.
          </Text>

          <Text style={styles.articleTitle}>Article 7 — Résiliation</Text>
          <Text style={styles.paragraph}>
            L'utilisateur peut résilier son compte à tout moment depuis les paramètres de l'application. L'éditeur se réserve le droit de suspendre ou résilier un compte en cas de violation des présentes CGU, sans préavis ni indemnité.
          </Text>

          <Text style={styles.articleTitle}>Article 8 — Droit applicable</Text>
          <Text style={styles.paragraph}>
            Les présentes CGU sont soumises au droit de la République du Congo. En cas de litige, les tribunaux de Brazzaville seront seuls compétents, à défaut de résolution amiable.
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
  articleTitle: {
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
