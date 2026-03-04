import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { calculerSoldeLiquidation, type SoldeLiquidationInput, type TypeContribuable } from "@/lib/services/solde-liquidation.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import ResultHighlight from "@/components/simulateur/ResultHighlight";
import SimulateurEmptyState from "@/components/simulateur/SimulateurEmptyState";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";

export default function SoldeLiquidationScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [resultatFiscal, setResultatFiscal] = useState("");
  const [typeContribuable, setTypeContribuable] = useState<TypeContribuable>("general");
  const [acompte1, setAcompte1] = useState("");
  const [acompte2, setAcompte2] = useState("");
  const [acompte3, setAcompte3] = useState("");
  const [acompte4, setAcompte4] = useState("");

  const TAXPAYER_TYPES: { value: TypeContribuable; label: string; taux: string }[] = [
    { value: "general", label: t("simulateur.solde.general"), taux: "28%" },
    { value: "microfinance", label: t("simulateur.solde.microfinance"), taux: "25%" },
    { value: "mines", label: t("simulateur.solde.mining"), taux: "28%" },
    { value: "etranger", label: t("simulateur.solde.foreign"), taux: "33%" },
  ];

  const result = useMemo(() => {
    const input: SoldeLiquidationInput = {
      resultatFiscal: parseFloat(resultatFiscal.replace(/\s/g, "")) || 0,
      typeContribuable,
      acompte1: parseFloat(acompte1.replace(/\s/g, "")) || 0,
      acompte2: parseFloat(acompte2.replace(/\s/g, "")) || 0,
      acompte3: parseFloat(acompte3.replace(/\s/g, "")) || 0,
      acompte4: parseFloat(acompte4.replace(/\s/g, "")) || 0,
    };
    if (input.resultatFiscal === 0) return null;
    return calculerSoldeLiquidation(input);
  }, [resultatFiscal, typeContribuable, acompte1, acompte2, acompte3, acompte4]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.solde.title")}
          </Text>

          <View style={{ padding: 12, backgroundColor: colors.card, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: colors.text }}>{t("simulateur.solde.description")}</Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.solde.taxableResult")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, borderWidth: 2, borderColor: colors.primary, height: 48, marginBottom: 12 }}>
            <TextInput
              style={{ flex: 1, fontSize: 16, fontWeight: "700", color: colors.text }}
              value={resultatFiscal}
              onChangeText={(v) => setResultatFiscal(formatInputNumber(v))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "600" }}>FCFA</Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.solde.taxpayerType")}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {TAXPAYER_TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={{ width: "48%", paddingVertical: 8, alignItems: "center", backgroundColor: typeContribuable === tp.value ? colors.primary : colors.border }}
                onPress={() => setTypeContribuable(tp.value)}
              >
                <Text style={{ color: typeContribuable === tp.value ? colors.sidebarText : colors.text, fontSize: 12, fontWeight: "600" }}>
                  {tp.label} ({tp.taux})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.solde.instalmentsPaid")}
          </Text>
          <NumberField label={t("simulateur.solde.q1")} value={acompte1} onChange={setAcompte1} />
          <NumberField label={t("simulateur.solde.q2")} value={acompte2} onChange={setAcompte2} />
          <NumberField label={t("simulateur.solde.q3")} value={acompte3} onChange={setAcompte3} />
          <NumberField label={t("simulateur.solde.q4")} value={acompte4} onChange={setAcompte4} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>{t("simulateur.solde.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.solde.isCalculated")} />
              <TableRow label={t("simulateur.solde.fiscalResult")} value={formatNumber(result.resultatFiscal)} />
              <TableRow label={t("simulateur.solde.roundedProfit")} value={formatNumber(result.beneficeArrondi)} bg={colors.background} />
              <TableRow label={`${t("simulateur.solde.isRate")} (${result.tauxIS}%)`} value={`${result.tauxIS}%`} bg={colors.background} />
              <ResultHighlight label={t("simulateur.solde.isToPay")} value={formatNumber(result.isCalcule)} variant="danger" />

              <SimulateurSection label={t("simulateur.solde.instalmentsPaidTitle")} />
              {result.detailAcomptes.map((a) => (
                <TableRow key={a.label} label={a.label} value={a.montant > 0 ? formatNumber(a.montant) : "\u2014"} />
              ))}
              <ResultHighlight label={t("simulateur.solde.totalInstalments")} value={formatNumber(result.totalAcomptes)} variant="primary" />

              <SimulateurSection label={t("simulateur.solde.settlementBalance")} />
              <TableRow label={t("simulateur.solde.isMinusInstalments")} value={`${formatNumber(result.isCalcule)} - ${formatNumber(result.totalAcomptes)}`} bg={colors.background} />

              {result.creditImpot ? (
                <ResultHighlight label={t("simulateur.solde.taxCredit")} value={formatNumber(Math.abs(result.solde))} variant="success" note={t("simulateur.solde.taxCreditNote")} />
              ) : (
                <ResultHighlight label={t("simulateur.solde.balanceToPay")} value={formatNumber(result.solde)} variant="danger" note={t("simulateur.solde.balanceNote")} />
              )}
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.solde.enterResult")} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
