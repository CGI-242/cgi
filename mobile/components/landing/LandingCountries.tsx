import { useState } from "react";
import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { router } from "expo-router";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

interface Country {
  name: string;
  code: string;
  cc: string;
  available: boolean;
  region: string;
}

const countries: Country[] = [
  { name: "Congo-Brazzaville", code: "242", cc: "CG", available: true, region: "CEMAC" },
  { name: "R.D. Congo", code: "243", cc: "CD", available: false, region: "OHADA" },
  { name: "Cameroun", code: "237", cc: "CM", available: false, region: "CEMAC" },
  { name: "Gabon", code: "241", cc: "GA", available: false, region: "CEMAC" },
  { name: "Tchad", code: "235", cc: "TD", available: false, region: "CEMAC" },
  { name: "Centrafrique", code: "236", cc: "CF", available: false, region: "CEMAC" },
  { name: "Guin\u00e9e \u00c9q.", code: "240", cc: "GQ", available: false, region: "CEMAC" },
  { name: "S\u00e9n\u00e9gal", code: "221", cc: "SN", available: false, region: "UEMOA" },
  { name: "C\u00f4te d'Ivoire", code: "225", cc: "CI", available: false, region: "UEMOA" },
  { name: "Mali", code: "223", cc: "ML", available: false, region: "UEMOA" },
  { name: "Burkina Faso", code: "226", cc: "BF", available: false, region: "UEMOA" },
  { name: "B\u00e9nin", code: "229", cc: "BJ", available: false, region: "UEMOA" },
  { name: "Togo", code: "228", cc: "TG", available: false, region: "UEMOA" },
  { name: "Niger", code: "227", cc: "NE", available: false, region: "UEMOA" },
  { name: "Guin\u00e9e", code: "224", cc: "GN", available: false, region: "Autre" },
  { name: "Madagascar", code: "261", cc: "MG", available: false, region: "Autre" },
  { name: "Mauritanie", code: "222", cc: "MR", available: false, region: "Autre" },
  { name: "Burundi", code: "257", cc: "BI", available: false, region: "Autre" },
  { name: "Comores", code: "269", cc: "KM", available: false, region: "Autre" },
  { name: "Djibouti", code: "253", cc: "DJ", available: false, region: "Autre" },
  { name: "Rwanda", code: "250", cc: "RW", available: false, region: "Autre" },
];

const regionColors: Record<string, { bg: string; border: string; text: string }> = {
  CEMAC: { bg: "rgba(200,160,60,0.12)", border: "rgba(200,160,60,0.3)", text: "#c8a03c" },
  UEMOA: { bg: "rgba(96,165,250,0.12)", border: "rgba(96,165,250,0.3)", text: "#60a5fa" },
  OHADA: { bg: "rgba(168,130,255,0.1)", border: "rgba(168,130,255,0.25)", text: "#a882ff" },
  Autre: { bg: "rgba(168,130,255,0.1)", border: "rgba(168,130,255,0.25)", text: "#a882ff" },
};

function toFlag(cc: string): string {
  return cc
    .toUpperCase()
    .replace(/./g, (c) => String.fromCodePoint(127397 + c.charCodeAt(0)));
}

interface Props {
  isMobile: boolean;
  loaded: boolean;
}

export default function LandingCountries({ isMobile, loaded }: Props) {
  const [region, setRegion] = useState("Tous");
  const [query, setQuery] = useState("");

  const filtered = countries.filter((c) => {
    if (region !== "Tous" && c.region !== region) return false;
    if (!query) return true;
    return (
      c.name.toLowerCase().includes(query.toLowerCase()) || c.code.includes(query)
    );
  });

  const regions = ["Tous", "CEMAC", "UEMOA", "Autre"];

  return (
    <View style={{ paddingVertical: 40, paddingHorizontal: 24 }}>
      <Text
        style={{
          fontFamily: fonts.headingBlack,
          fontWeight: fontWeights.headingBlack,
          fontSize: isMobile ? 26 : 40,
          color: "#e8e6e1",
          textAlign: "center",
          marginBottom: 8,
        }}
      >
        Choisissez votre pays
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#5a5a65",
          fontSize: 14,
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 32,
        }}
      >
        Un nouveau pays chaque trimestre
      </Text>

      {/* Region filters */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          marginBottom: 16,
          flexWrap: "wrap",
        }}
      >
        {regions.map((r) => {
          const active = region === r;
          const rc = r !== "Tous" ? regionColors[r] : null;
          return (
            <TouchableOpacity
              key={r}
              onPress={() => setRegion(r)}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 20,
                borderRadius: 100,
                backgroundColor: active
                  ? rc
                    ? rc.bg
                    : "rgba(255,255,255,0.08)"
                  : "transparent",
                borderWidth: 1,
                borderColor: active
                  ? rc
                    ? rc.border
                    : "rgba(255,255,255,0.15)"
                  : "rgba(255,255,255,0.06)",
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fonts.semiBold,
                  fontWeight: fontWeights.semiBold,
                  color: active
                    ? rc
                      ? rc.text
                      : "#e8e6e1"
                    : "#6a6a75",
                }}
              >
                {r === "Autre" ? "Autres OHADA" : r}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Search */}
      <View style={{ alignItems: "center", marginBottom: 36 }}>
        <TextInput
          placeholder="Rechercher un pays ou indicatif..."
          placeholderTextColor="#3a3a45"
          value={query}
          onChangeText={setQuery}
          style={{
            width: isMobile ? "100%" : 380,
            maxWidth: "100%",
            paddingVertical: 11,
            paddingHorizontal: 18,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
            backgroundColor: "rgba(255,255,255,0.025)",
            color: "#e8e6e1",
            fontSize: 14,
            fontFamily: fonts.regular,
          }}
        />
      </View>

      {/* Country grid */}
      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          gap: 14,
          maxWidth: 1060,
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        {filtered.map((c, i) => {
          const rc = regionColors[c.region] || regionColors.Autre;
          const Wrapper = c.available ? TouchableOpacity : View;
          return (
            <Wrapper
              key={c.code}
              {...(c.available ? { onPress: () => router.push("/cgi242"), activeOpacity: 0.7 } : {})}
              style={{
                width: isMobile ? "47%" : 185,
                borderRadius: 16,
                padding: isMobile ? 16 : 22,
                alignItems: "center",
                backgroundColor: c.available
                  ? "rgba(200,160,60,0.03)"
                  : "rgba(255,255,255,0.012)",
                borderWidth: 1,
                borderColor: c.available
                  ? "rgba(200,160,60,0.15)"
                  : "rgba(255,255,255,0.04)",
                opacity: loaded ? 1 : 0,
              }}
            >
              <Text
                style={{
                  fontSize: 36,
                  marginBottom: 8,
                  opacity: c.available ? 1 : 0.5,
                }}
              >
                {toFlag(c.cc)}
              </Text>
              <Text
                style={{
                  fontSize: 20,
                  fontFamily: fonts.extraBold,
                  fontWeight: fontWeights.extraBold,
                  color: c.available ? GOLD : "#4a4a55",
                  marginBottom: 3,
                }}
              >
                CGI {c.code}
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontFamily: fonts.semiBold,
                  fontWeight: fontWeights.semiBold,
                  marginBottom: 8,
                  color: c.available ? "#e8e6e1" : "#6a6a75",
                  textAlign: "center",
                }}
              >
                {c.name}
              </Text>
              {c.available ? (
                <View
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 14,
                    borderRadius: 100,
                    backgroundColor: "rgba(74,222,128,0.1)",
                    borderWidth: 1,
                    borderColor: "rgba(74,222,128,0.2)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: fonts.bold,
                      fontWeight: fontWeights.bold,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      color: "#4ade80",
                    }}
                  >
                    Disponible
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    paddingVertical: 4,
                    paddingHorizontal: 14,
                    borderRadius: 100,
                    backgroundColor: "rgba(255,255,255,0.03)",
                    borderWidth: 1,
                    borderColor: "rgba(255,255,255,0.04)",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      fontFamily: fonts.semiBold,
                      fontWeight: fontWeights.semiBold,
                      textTransform: "uppercase",
                      letterSpacing: 0.8,
                      color: "#3a3a45",
                    }}
                  >
                    Bient\u00f4t
                  </Text>
                </View>
              )}
              <Text
                style={{
                  fontSize: 10,
                  color: rc.text,
                  marginTop: 6,
                  fontFamily: fonts.medium,
                  fontWeight: fontWeights.medium,
                }}
              >
                {c.region}
              </Text>
            </Wrapper>
          );
        })}
      </View>

      {filtered.length === 0 && (
        <Text
          style={{
            textAlign: "center",
            padding: 40,
            color: "#4a4a55",
            fontFamily: fonts.regular,
          }}
        >
          Aucun pays ne correspond à votre recherche.
        </Text>
      )}
    </View>
  );
}
