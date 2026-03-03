import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerIRCM, type TypeRevenuIRCM } from "@/lib/services/ircm.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";

export default function IrcmScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [montantBrut, setMontantBrut] = useState("");
  const [typeRevenu, setTypeRevenu] = useState<TypeRevenuIRCM>("dividendes");

  const TYPES: { value: TypeRevenuIRCM; label: string }[] = [
    { value: "dividendes", label: t("simulateur.ircm.dividends") },
    { value: "interets", label: t("simulateur.ircm.interests") },
    { value: "plusValues", label: t("simulateur.ircm.capitalGains") },
  ];

  const result = useMemo(() => {
    const montant = parseFloat(montantBrut.replace(/\s/g, "")) || 0;
    if (montant <= 0) return null;
    return calculerIRCM({ montantBrut: montant, typeRevenu });
  }, [montantBrut, typeRevenu]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.ircm.description")}
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.ircm.revenueType")}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={{ flex: 1, paddingVertical: 8, alignItems: "center", backgroundColor: typeRevenu === tp.value ? colors.primary : colors.border }}
                onPress={() => setTypeRevenu(tp.value)}
              >
                <Text style={{ color: typeRevenu === tp.value ? "#fff" : colors.text, fontWeight: "700", fontSize: 11 }}>{tp.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <NumberField label={t("simulateur.ircm.grossAmount")} value={montantBrut} onChange={setMontantBrut} colors={colors} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.ircm.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.ircm.calcSection")} colors={colors} />
              <TableRow label={t("simulateur.ircm.grossAmount")} value={formatNumber(result.montantBrut)} bold />
              <TableRow label={t("simulateur.ircm.rateApplied")} value={`${result.taux}%`} bg={colors.background} />

              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.ircm.taxDue")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.impot)}</Text>
                </View>
              </View>

              <View style={{ backgroundColor: colors.citationsBg, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#166534" }}>{t("simulateur.ircm.netAmount")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#166534" }}>{formatNumber(result.montantNet)}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.ircm.enterAmount")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
