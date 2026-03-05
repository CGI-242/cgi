import { View, Text, Linking, TouchableOpacity } from "react-native";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";
const BG = "#0a0a12";
const TITLE_COLOR = "#e8e6e1";
const LINK_COLOR = "#5a5a65";
const LINK_HOVER = "#8a8a95";

interface Props {
  isMobile: boolean;
}

function FooterLink({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <TouchableOpacity onPress={onPress} style={{ marginBottom: 10 }}>
      <Text
        style={{
          fontFamily: fonts.regular,
          fontWeight: fontWeights.regular,
          fontSize: 13,
          color: LINK_COLOR,
          lineHeight: 20,
        }}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        fontFamily: fonts.semiBold,
        fontWeight: fontWeights.semiBold,
        fontSize: 13,
        color: TITLE_COLOR,
        marginBottom: 16,
        textTransform: "uppercase",
        letterSpacing: 1.2,
      }}
    >
      {children}
    </Text>
  );
}

export default function LandingFooter({ isMobile }: Props) {
  const scrollToSection = (id: string) => {
    if (typeof document !== "undefined") {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <View
      style={{
        backgroundColor: BG,
        borderTopWidth: 1,
        borderTopColor: "rgba(255,255,255,0.04)",
        paddingTop: 48,
        paddingBottom: 0,
      }}
    >
      {/* Colonnes principales */}
      <View
        style={{
          maxWidth: 1060,
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: 24,
          flexDirection: isMobile ? "column" : "row",
          gap: isMobile ? 36 : 0,
        }}
      >
        {/* Colonne 1 — Marque */}
        <View style={{ flex: isMobile ? undefined : 1.3, marginBottom: isMobile ? 0 : 0 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
            <View
              style={{
                width: 32,
                height: 32,
                borderRadius: 8,
                backgroundColor: "rgba(200,160,60,0.13)",
                alignItems: "center",
                justifyContent: "center",
                marginRight: 10,
              }}
            >
              <Text
                style={{
                  fontFamily: fonts.headingBlack,
                  fontWeight: fontWeights.headingBlack,
                  fontSize: 18,
                  color: GOLD,
                }}
              >
                N
              </Text>
            </View>
            <Text
              style={{
                fontFamily: fonts.bold,
                fontWeight: fontWeights.bold,
                fontSize: 17,
                color: TITLE_COLOR,
              }}
            >
              NORMX{" "}
              <Text style={{ color: GOLD }}>Tax</Text>
            </Text>
          </View>
          <Text
            style={{
              fontFamily: fonts.light,
              fontWeight: fontWeights.light,
              fontSize: 13,
              color: LINK_COLOR,
              lineHeight: 20,
            }}
          >
            L'intelligence fiscale africaine.
          </Text>
        </View>

        {/* Colonne 2 — Produit */}
        <View style={{ flex: isMobile ? undefined : 1 }}>
          <SectionTitle>Produit</SectionTitle>
          <FooterLink label="Fonctionnalités" onPress={() => scrollToSection("features")} />
          <FooterLink label="Simulateurs" onPress={() => scrollToSection("simulateurs")} />
          <FooterLink label="Assistant IA" onPress={() => scrollToSection("assistant")} />
          <FooterLink label="Tarifs" onPress={() => scrollToSection("tarifs")} />
        </View>

        {/* Colonne 3 — Légal */}
        <View style={{ flex: isMobile ? undefined : 1 }}>
          <SectionTitle>Légal</SectionTitle>
          <FooterLink
            label="CGU"
            onPress={() => Linking.openURL("https://cgi242.normx.ai/conditions")}
          />
          <FooterLink
            label="Politique de confidentialité"
            onPress={() => Linking.openURL("https://cgi242.normx.ai/confidentialite")}
          />
        </View>

        {/* Colonne 4 — Contact */}
        <View style={{ flex: isMobile ? undefined : 1 }}>
          <SectionTitle>Contact</SectionTitle>
          <TouchableOpacity
            onPress={() => Linking.openURL("mailto:contact@normx.ai")}
            style={{ marginBottom: 10 }}
          >
            <Text
              style={{
                fontFamily: fonts.regular,
                fontWeight: fontWeights.regular,
                fontSize: 13,
                color: GOLD,
                lineHeight: 20,
              }}
            >
              contact@normx.ai
            </Text>
          </TouchableOpacity>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
              fontSize: 13,
              color: LINK_COLOR,
              lineHeight: 20,
            }}
          >
            Brazzaville, Congo
          </Text>
        </View>
      </View>

      {/* Barre du bas */}
      <View
        style={{
          maxWidth: 1060,
          width: "100%",
          alignSelf: "center",
          paddingHorizontal: 24,
          marginTop: 40,
          borderTopWidth: 1,
          borderTopColor: "rgba(255,255,255,0.06)",
          paddingVertical: 20,
          flexDirection: isMobile ? "column" : "row",
          justifyContent: "space-between",
          alignItems: isMobile ? "center" : "center",
          gap: isMobile ? 8 : 0,
        }}
      >
        <Text
          style={{
            fontFamily: fonts.regular,
            fontWeight: fontWeights.regular,
            fontSize: 12,
            color: "#2a2a35",
          }}
        >
          © 2026 NORMX AI — Tous droits réservés
        </Text>
        <Text
          style={{
            fontFamily: fonts.regular,
            fontWeight: fontWeights.regular,
            fontSize: 12,
            color: "#3a3a45",
          }}
        >
          Marque déposée INPI n°5146181
        </Text>
      </View>
    </View>
  );
}
