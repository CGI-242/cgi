import { View, Text, TouchableOpacity, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const GOLD = "#c8a03c";

interface Props {
  isMobile: boolean;
}

export default function LandingContact({ isMobile }: Props) {
  return (
    <View style={{ paddingVertical: 60, paddingHorizontal: 24 }}>
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
        Contactez-nous
      </Text>
      <Text
        style={{
          textAlign: "center",
          color: "#5a5a65",
          fontSize: 15,
          fontFamily: fonts.light,
          fontWeight: fontWeights.light,
          marginBottom: 40,
        }}
      >
        Une question ? Notre équipe vous répond sous 24h
      </Text>

      <View
        style={{
          flexDirection: isMobile ? "column" : "row",
          gap: 20,
          maxWidth: 800,
          alignSelf: "center",
          width: "100%",
          justifyContent: "center",
        }}
      >
        {/* Email */}
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:contact@normx.ai")}
          activeOpacity={0.7}
          style={{
            flex: isMobile ? undefined : 1,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(200,160,60,0.15)",
            backgroundColor: "rgba(200,160,60,0.03)",
            padding: 28,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "rgba(200,160,60,0.12)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="mail-outline" size={24} color={GOLD} />
          </View>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontWeight: fontWeights.semiBold,
              fontSize: 15,
              color: "#e8e6e1",
              marginBottom: 6,
            }}
          >
            Email
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
              fontSize: 14,
              color: GOLD,
            }}
          >
            contact@normx.ai
          </Text>
        </TouchableOpacity>

        {/* Localisation */}
        <View
          style={{
            flex: isMobile ? undefined : 1,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
            backgroundColor: "rgba(255,255,255,0.015)",
            padding: 28,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.05)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="location-outline" size={24} color="#5a5a65" />
          </View>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontWeight: fontWeights.semiBold,
              fontSize: 15,
              color: "#e8e6e1",
              marginBottom: 6,
            }}
          >
            Siège
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
              fontSize: 14,
              color: "#5a5a65",
              textAlign: "center",
            }}
          >
            Brazzaville, République du Congo
          </Text>
        </View>

        {/* Horaires */}
        <View
          style={{
            flex: isMobile ? undefined : 1,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: "rgba(255,255,255,0.06)",
            backgroundColor: "rgba(255,255,255,0.015)",
            padding: 28,
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: 48,
              height: 48,
              borderRadius: 12,
              backgroundColor: "rgba(255,255,255,0.05)",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 16,
            }}
          >
            <Ionicons name="time-outline" size={24} color="#5a5a65" />
          </View>
          <Text
            style={{
              fontFamily: fonts.semiBold,
              fontWeight: fontWeights.semiBold,
              fontSize: 15,
              color: "#e8e6e1",
              marginBottom: 6,
            }}
          >
            Support
          </Text>
          <Text
            style={{
              fontFamily: fonts.regular,
              fontWeight: fontWeights.regular,
              fontSize: 14,
              color: "#5a5a65",
              textAlign: "center",
            }}
          >
            Lun — Ven, 8h — 18h (WAT)
          </Text>
        </View>
      </View>
    </View>
  );
}
