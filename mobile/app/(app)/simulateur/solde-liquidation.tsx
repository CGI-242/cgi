import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native";
import { calculerSoldeLiquidation, type TypeContribuable } from "@/lib/services/solde-liquidation.service";
import { formatNumber } from "@/lib/services/fiscal-common";
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

  // Résultat comptable — Produits
  const [produitsExploitation, setProduitsExploitation] = useState("");
  const [produitsFinanciers, setProduitsFinanciers] = useState("");
  const [produitsHAO, setProduitsHAO] = useState("");
  // Résultat comptable — Charges
  const [chargesExploitation, setChargesExploitation] = useState("");
  const [chargesFinancieres, setChargesFinancieres] = useState("");
  const [chargesHAO, setChargesHAO] = useState("");

  // Résultat fiscal
  const [reintegrations, setReintegrations] = useState("");
  const [deductions, setDeductions] = useState("");
  const [ard, setArd] = useState("");
  const [reportDeficitaire, setReportDeficitaire] = useState("");

  const [typeContribuable, setTypeContribuable] = useState<TypeContribuable>("general");
  const [acompte1, setAcompte1] = useState("");
  const [acompte2, setAcompte2] = useState("");
  const [acompte3, setAcompte3] = useState("");
  const [acompte4, setAcompte4] = useState("");

  const parse = (v: string) => parseFloat(v.replace(/\s/g, "")) || 0;

  const TAXPAYER_TYPES: { value: TypeContribuable; label: string; taux: string }[] = [
    { value: "general", label: t("simulateur.solde.general"), taux: "28%" },
    { value: "microfinance", label: t("simulateur.solde.microfinance"), taux: "25%" },
    { value: "mines", label: t("simulateur.solde.mining"), taux: "28%" },
  ];

  const result = useMemo(() => {
    const pe = parse(produitsExploitation);
    if (pe === 0) return null;
    return calculerSoldeLiquidation({
      produitsExploitation: pe,
      produitsFinanciers: parse(produitsFinanciers),
      produitsHAO: parse(produitsHAO),
      chargesExploitation: parse(chargesExploitation),
      chargesFinancieres: parse(chargesFinancieres),
      chargesHAO: parse(chargesHAO),
      reintegrations: parse(reintegrations),
      deductions: parse(deductions),
      ard: parse(ard),
      reportDeficitaire: parse(reportDeficitaire),
      typeContribuable,
      acompte1: parse(acompte1),
      acompte2: parse(acompte2),
      acompte3: parse(acompte3),
      acompte4: parse(acompte4),
    });
  }, [produitsExploitation, produitsFinanciers, produitsHAO, chargesExploitation, chargesFinancieres, chargesHAO, reintegrations, deductions, ard, reportDeficitaire, typeContribuable, acompte1, acompte2, acompte3, acompte4]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.solde.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("simulateur.solde.description")}</Text>
          </View>

          {/* Résultat comptable */}
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>
            {t("simulateur.solde.rcSection")}
          </Text>
          <NumberField label={t("simulateur.solde.produitsExploitation")} value={produitsExploitation} onChange={setProduitsExploitation} />
          <NumberField label={t("simulateur.solde.produitsFinanciers")} value={produitsFinanciers} onChange={setProduitsFinanciers} />
          <NumberField label={t("simulateur.solde.produitsHAO")} value={produitsHAO} onChange={setProduitsHAO} />
          <NumberField label={t("simulateur.solde.chargesExploitation")} value={chargesExploitation} onChange={setChargesExploitation} />
          <NumberField label={t("simulateur.solde.chargesFinancieres")} value={chargesFinancieres} onChange={setChargesFinancieres} />
          <NumberField label={t("simulateur.solde.chargesHAO")} value={chargesHAO} onChange={setChargesHAO} />

          {/* Résultat fiscal */}
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>
            {t("simulateur.solde.rfSection")}
          </Text>
          <NumberField label={t("simulateur.solde.reintegrations")} value={reintegrations} onChange={setReintegrations} />
          <NumberField label={t("simulateur.solde.deductionsFiscales")} value={deductions} onChange={setDeductions} />
          <NumberField label={t("simulateur.solde.ard")} value={ard} onChange={setArd} />
          <NumberField label={t("simulateur.solde.reportDeficitaire")} value={reportDeficitaire} onChange={setReportDeficitaire} />

          {/* Type contribuable */}
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>
            {t("simulateur.solde.taxpayerType")}
          </Text>
          <View style={styles.taxpayerGrid}>
            {TAXPAYER_TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={[styles.taxpayerButton, { backgroundColor: typeContribuable === tp.value ? colors.primary : colors.border }]}
                onPress={() => setTypeContribuable(tp.value)}
              >
                <Text style={[styles.taxpayerButtonText, { color: typeContribuable === tp.value ? colors.sidebarText : colors.text }]}>
                  {tp.label} ({tp.taux})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Acomptes versés */}
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>
            {t("simulateur.solde.instalmentsPaid")}
          </Text>
          <NumberField label={t("simulateur.solde.q1")} value={acompte1} onChange={setAcompte1} />
          <NumberField label={t("simulateur.solde.q2")} value={acompte2} onChange={setAcompte2} />
          <NumberField label={t("simulateur.solde.q3")} value={acompte3} onChange={setAcompte3} />
          <NumberField label={t("simulateur.solde.q4")} value={acompte4} onChange={setAcompte4} />

          <Text style={[styles.legalRefSmall, { color: colors.textMuted }]}>{t("simulateur.solde.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              {/* Résultat comptable */}
              <SimulateurSection label={t("simulateur.solde.rcSection")} />
              <TableRow label={t("simulateur.solde.totalProduits")} value={formatNumber(result.totalProduits)} bold />
              <TableRow label={t("simulateur.solde.totalCharges")} value={`- ${formatNumber(result.totalCharges)}`} bg={colors.background} color={colors.danger} />
              <ResultHighlight label={t("simulateur.solde.rc")} value={formatNumber(result.resultatComptable)} variant="primary" />

              {/* Résultat fiscal */}
              <SimulateurSection label={t("simulateur.solde.rfSection")} />
              <TableRow label={t("simulateur.solde.rc")} value={formatNumber(result.resultatComptable)} />
              {result.reintegrations > 0 && (
                <TableRow label={t("simulateur.solde.reintegrations")} value={`+ ${formatNumber(result.reintegrations)}`} bg={colors.background} color={colors.success} />
              )}
              {result.deductions > 0 && (
                <TableRow label={t("simulateur.solde.deductionsFiscales")} value={`- ${formatNumber(result.deductions)}`} bg={colors.background} color={colors.danger} />
              )}
              {result.ard > 0 && (
                <TableRow label={t("simulateur.solde.ard")} value={`- ${formatNumber(result.ard)}`} bg={colors.background} color={colors.danger} />
              )}
              {result.reportDeficitaire > 0 && (
                <TableRow label={t("simulateur.solde.reportDeficitaire")} value={`- ${formatNumber(result.reportDeficitaire)}`} bg={colors.background} color={colors.danger} />
              )}
              <ResultHighlight label={t("simulateur.solde.rf")} value={formatNumber(result.resultatFiscal)} variant="primary" />

              {/* IS calculé */}
              <SimulateurSection label={t("simulateur.solde.isCalculated")} />
              <TableRow label={t("simulateur.solde.roundedProfit")} value={formatNumber(result.beneficeArrondi)} bg={colors.background} />
              <TableRow label={`${t("simulateur.solde.isRate")} (${result.tauxIS}%)`} value={`${result.tauxIS}%`} bg={colors.background} />
              <ResultHighlight label={t("simulateur.solde.isToPay")} value={formatNumber(result.isCalcule)} variant="danger" />

              {/* Acomptes */}
              <SimulateurSection label={t("simulateur.solde.instalmentsPaidTitle")} />
              {result.detailAcomptes.map((a) => (
                <TableRow key={a.label} label={a.label} value={a.montant > 0 ? formatNumber(a.montant) : "\u2014"} />
              ))}
              <ResultHighlight label={t("simulateur.solde.totalInstalments")} value={formatNumber(result.totalAcomptes)} variant="primary" />

              {/* Solde */}
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
    fontSize: 24,
    fontWeight: fontWeights.heading,
    fontFamily: fonts.heading,
    marginBottom: 12,
  },
  descriptionBox: {
    padding: 12,
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 12,
    marginBottom: 6,
  },
  taxpayerGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 16,
  },
  taxpayerButton: {
    width: "48%",
    paddingVertical: 8,
    alignItems: "center",
  },
  taxpayerButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  legalRefSmall: {
    fontSize: 12,
    marginTop: 4,
  },
});
