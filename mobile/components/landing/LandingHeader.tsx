import { View, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#D4A843";

interface Props {
  isMobile: boolean;
  onScrollTo?: (section: string) => void;
}

export default function LandingHeader({ isMobile, onScrollTo }: Props) {
  const { t } = useTranslation();
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingVertical: 20,
        paddingHorizontal: isMobile ? 16 : 32,
        borderBottomWidth: 1,
        borderBottomColor: "rgba(255,255,255,0.08)",
        backgroundColor: "#1A3A5C",
        zIndex: 100,
      }}
    >
      {/* Logo */}
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
        <Text style={{ fontSize: 22, fontFamily: fonts.bold, fontWeight: fontWeights.bold, color: "#e8e6e1" }}>
          NORMX <Text style={{ color: GOLD }}>AI</Text>
        </Text>
      </View>

      {/* Navigation centrale */}
      {!isMobile && (
        <View style={{ flexDirection: "row", gap: 32, alignItems: "center" }}>
          <TouchableOpacity onPress={() => onScrollTo?.("produits")}>
            <Text style={{ fontSize: 16, color: "#b0b0b8", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              Produits
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onScrollTo?.("features")}>
            <Text style={{ fontSize: 16, color: "#b0b0b8", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              Fonctionnalités
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onScrollTo?.("tarifs")}>
            <Text style={{ fontSize: 16, color: "#b0b0b8", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              Tarifs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onScrollTo?.("contact")}>
            <Text style={{ fontSize: 16, color: "#b0b0b8", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
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
            <Text style={{ fontSize: 15, color: "#b0b0b8", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
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
            <Text style={{ color: "#1A3A5C", fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 15 /* CTA button on gold bg */ }}>
              Essai gratuit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
