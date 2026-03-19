import { View, Text, TouchableOpacity, Linking } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#D4A843";

const CODE_OPTIONS = [
  { id: "cgi", icon: "book-outline" as const, label: "Code Général des Impôts", desc: "CGI 242 — Édition 2026", available: true },
  { id: "social", icon: "people-outline" as const, label: "Code Social", desc: "Travail & Sécurité sociale", available: true },
  { id: "hydrocarbures", icon: "flame-outline" as const, label: "Code des Hydrocarbures", desc: "Loi n°2024-28", available: false },
  { id: "douanier", icon: "shield-checkmark-outline" as const, label: "Code Douanier", desc: "CEMAC", available: false },
];

interface Props {
  isMobile: boolean;
  onScrollTo?: (section: string) => void;
}

export default function LandingHeader({ isMobile, onScrollTo }: Props) {
  const { t } = useTranslation();
  const [codeDropdownOpen, setCodeDropdownOpen] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: isMobile ? 16 : 32,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(0,0,0,0.08)",
        backgroundColor: "#ffffff",
        zIndex: 100,
      }}
    >
      {/* Logo + Dropdown */}
      <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
        <View
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: GOLD,
          }}
        >
          <Text
            style={{
              fontFamily: fonts.black,
              fontWeight: fontWeights.black,
              fontSize: 19,
              color: "#1A3A5C",
            }}
          >
            N
          </Text>
        </View>
        <Text style={{ fontSize: 22, fontFamily: fonts.bold, fontWeight: fontWeights.bold, color: "#1A3A5C" }}>
          NORMX <Text style={{ color: GOLD }}>AI</Text>
        </Text>

        {/* Dropdown Codes */}
        {!isMobile && (
          <View style={{ marginLeft: 8 }}>
            <TouchableOpacity
              onPress={() => setCodeDropdownOpen(!codeDropdownOpen)}
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: "rgba(26,58,92,0.06)",
                borderRadius: 8,
                paddingHorizontal: 12,
                paddingVertical: 6,
              }}
            >
              <Ionicons name="book-outline" size={15} color={GOLD} />
              <Text style={{ color: GOLD, fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 14, marginLeft: 6 }}>
                Codes
              </Text>
              <Ionicons name="chevron-down" size={14} color={GOLD} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
            {codeDropdownOpen && (
              <View
                style={{
                  position: "absolute",
                  top: 38,
                  left: 0,
                  zIndex: 9999,
                  backgroundColor: "#12121a",
                  borderWidth: 1,
                  borderColor: "rgba(255,255,255,0.1)",
                  borderRadius: 12,
                  minWidth: 300,
                  padding: 6,
                  shadowColor: "#000",
                  shadowOpacity: 0.4,
                  shadowRadius: 16,
                  elevation: 10,
                }}
              >
                {CODE_OPTIONS.map((opt) => (
                  <TouchableOpacity
                    key={opt.id}
                    onPress={() => {
                      setCodeDropdownOpen(false);
                      if (opt.available) router.push("/(auth)");
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 10,
                      opacity: opt.available ? 1 : 0.5,
                    }}
                  >
                    <View
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: 9,
                        backgroundColor: "rgba(200,160,60,0.1)",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <Ionicons name={opt.icon} size={16} color={GOLD} />
                    </View>
                    <View style={{ marginLeft: 10, flex: 1 }}>
                      <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 14, color: "#e8e6e1" }}>
                        {opt.label}
                      </Text>
                      <Text style={{ fontSize: 12, color: "#5a5a65", marginTop: 1 }}>{opt.desc}</Text>
                    </View>
                    {!opt.available && (
                      <View style={{ backgroundColor: "rgba(255,255,255,0.06)", paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 }}>
                        <Text style={{ fontSize: 11, fontWeight: "700", color: "#5a5a65" }}>Bientôt</Text>
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
      </View>

      {/* Navigation centrale */}
      {!isMobile && (
        <View style={{ flexDirection: "row", gap: 32, alignItems: "center" }}>
          <TouchableOpacity onPress={() => onScrollTo?.("produits")}>
            <Text style={{ fontSize: 16, color: "#4a4a5a", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              Produits
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onScrollTo?.("features")}>
            <Text style={{ fontSize: 16, color: "#4a4a5a", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              Fonctionnalités
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onScrollTo?.("tarifs")}>
            <Text style={{ fontSize: 16, color: "#4a4a5a", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              Tarifs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onScrollTo?.("contact")}>
            <Text style={{ fontSize: 16, color: "#4a4a5a", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              Contact
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Auth buttons */}
      <View style={{ flexDirection: "row", gap: isMobile ? 8 : 16, alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => router.push("/(auth)")}
          style={{ padding: 8 }}
        >
          {isMobile ? (
            <Ionicons name="person-circle-outline" size={28} color="#4a4a5a" />
          ) : (
            <Text style={{ fontSize: 15, color: "#4a4a5a", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              {t("landing.login")}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(auth)/register")}
          style={{
            paddingVertical: 9,
            paddingHorizontal: isMobile ? 12 : 22,
            borderRadius: 8,
            backgroundColor: GOLD,
            flexDirection: "row",
            alignItems: "center",
            gap: 6,
          }}
        >
          {isMobile ? (
            <Ionicons name="rocket-outline" size={20} color="#1A3A5C" />
          ) : (
            <Text style={{ color: "#1A3A5C", fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 15 }}>
              Essai gratuit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
