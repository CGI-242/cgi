import { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { calculerIBA, type RegimeIBA } from "@/lib/services/iba.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import OptionButtonGroup from "@/components/simulateur/OptionButtonGroup";
import ResultHighlight from "@/components/simulateur/ResultHighlight";
import SimulateurEmptyState from "@/components/simulateur/SimulateurEmptyState";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";

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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.iba.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("simulateur.iba.description")}</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.iba.regimeLabel")}
          </Text>
          <OptionButtonGroup options={REGIMES} selected={regime} onChange={setRegime} fontSize={13} />

          <NumberField label={t("simulateur.iba.turnover")} value={chiffreAffaires} onChange={setChiffreAffaires} />
          {regime === "reel" && (
            <NumberField label={t("simulateur.iba.expenses")} value={charges} onChange={setCharges} />
          )}

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>{t("simulateur.iba.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.iba.calcSection")} />
              <TableRow label={t("simulateur.iba.turnover")} value={formatNumber(result.chiffreAffaires)} bold />
              {result.regime === "reel" && (
                <TableRow label={t("simulateur.iba.expenses")} value={`- ${formatNumber(result.chargesDeductibles)}`} bg={colors.background} color={colors.danger} />
              )}
              <TableRow label={t("simulateur.iba.taxableProfit")} value={formatNumber(result.beneficeImposable)} />
              <TableRow label={t("simulateur.iba.regime")} value={result.regime === "reel" ? t("simulateur.iba.real") : t("simulateur.iba.flat")} bg={colors.background} />
              <TableRow label={t("simulateur.iba.effectiveRate")} value={`${result.taux}%`} />

              <SimulateurSection label={t("simulateur.iba.taxSection")} />
              <ResultHighlight label={t("simulateur.iba.taxDue")} value={formatNumber(result.impot)} variant="danger" />
              <ResultHighlight label={t("simulateur.iba.netProfit")} value={formatNumber(result.beneficeNet)} variant="success" />
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.iba.enterTurnover")} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  rowContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 12,
    paddingBottom: 40,
  },
  resultScrollContent: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: fontWeights.heading,
    fontFamily: fonts.heading,
    marginBottom: 12,
  },
  descriptionBox: {
    marginBottom: 12,
    padding: 12,
  },
  descriptionText: {
    fontSize: 11,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginBottom: 6,
  },
  legalRef: {
    fontSize: 10,
    marginTop: 12,
  },
});
