import { View, Text, TouchableOpacity, Linking } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import { Ionicons } from "@expo/vector-icons";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

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
        borderBottomColor: "rgba(255,255,255,0.04)",
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
              fontSize: 17,
              color: "#08080d",
            }}
          >
            N
          </Text>
        </View>
        <Text style={{ fontSize: 20, fontFamily: fonts.bold, fontWeight: fontWeights.bold, color: "#e8e6e1" }}>
          NORMX <Text style={{ color: GOLD }}>Tax</Text>
        </Text>
      </View>

      {/* Navigation centrale */}
      {!isMobile && (
        <View style={{ flexDirection: "row", gap: 32, alignItems: "center" }}>
          <TouchableOpacity onPress={() => onScrollTo?.("tarifs")}>
            <Text style={{ fontSize: 14, color: "#6a6a75", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
              Tarifs
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => onScrollTo?.("contact")}>
            <Text style={{ fontSize: 14, color: "#6a6a75", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
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
            <Ionicons name="person-circle-outline" size={28} color="#6a6a75" />
          ) : (
            <Text style={{ fontSize: 13, color: "#6a6a75", fontFamily: fonts.medium, fontWeight: fontWeights.medium }}>
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
            <Ionicons name="rocket-outline" size={20} color="#08080d" />
          ) : (
            <Text style={{ color: "#08080d", fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 13 }}>
              Essai gratuit
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
