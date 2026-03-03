import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerIBA, type RegimeIBA } from "@/lib/services/iba.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";

export default function IbaScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [chiffreAffaires, setChiffreAffaires] = useState("");
  const [charges, setCharges] = useState("");
  const [regime, setRegime] = useState<RegimeIBA>("reel");

  const REGIMES: { value: RegimeIBA; label: string }[] = [
    { value: "reel", label: t("simulateur.iba.real") },
    { value: "forfait", label: t("simulateur.iba.flat") },
  ];

  const result = useMemo(() => {
    const ca = parseFloat(chiffreAffaires.replace(/\s/g, "")) || 0;
    const ch = parseFloat(charges.replace(/\s/g, "")) || 0;
    if (ca <= 0) return null;
    return calculerIBA({ chiffreAffaires: ca, chargesDeductibles: ch, regime });
  }, [chiffreAffaires, charges, regime]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.iba.description")}
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.iba.regimeLabel")}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {REGIMES.map((r) => (
              <TouchableOpacity
                key={r.value}
                style={{ flex: 1, paddingVertical: 8, alignItems: "center", backgroundColor: regime === r.value ? colors.primary : colors.border }}
                onPress={() => setRegime(r.value)}
              >
                <Text style={{ color: regime === r.value ? "#fff" : colors.text, fontWeight: "700", fontSize: 13 }}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <NumberField label={t("simulateur.iba.turnover")} value={chiffreAffaires} onChange={setChiffreAffaires} colors={colors} />
          {regime === "reel" && (
            <NumberField label={t("simulateur.iba.expenses")} value={charges} onChange={setCharges} colors={colors} />
          )}

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.iba.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.iba.calcSection")} colors={colors} />
              <TableRow label={t("simulateur.iba.turnover")} value={formatNumber(result.chiffreAffaires)} bold />
              {result.regime === "reel" && (
                <TableRow label={t("simulateur.iba.expenses")} value={`- ${formatNumber(result.chargesDeductibles)}`} bg={colors.background} color="#b91c1c" />
              )}
              <TableRow label={t("simulateur.iba.taxableProfit")} value={formatNumber(result.beneficeImposable)} />
              <TableRow label={t("simulateur.iba.regime")} value={result.regime === "reel" ? t("simulateur.iba.real") : t("simulateur.iba.flat")} bg={colors.background} />
              <TableRow label={t("simulateur.iba.effectiveRate")} value={`${result.taux}%`} />

              <SimulateurSection label={t("simulateur.iba.taxSection")} colors={colors} />
              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.iba.taxDue")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.impot)}</Text>
                </View>
              </View>

              <View style={{ backgroundColor: colors.citationsBg, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#166534" }}>{t("simulateur.iba.netProfit")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#166534" }}>{formatNumber(result.beneficeNet)}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.iba.enterTurnover")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
