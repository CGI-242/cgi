import { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { calculerIBA } from "@/lib/services/iba.service";
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

export default function IbaScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();

  // Résultat comptable
  const [produitsExploitation, setProduitsExploitation] = useState("");
  const [produitsFinanciers, setProduitsFinanciers] = useState("");
  const [produitsHAO, setProduitsHAO] = useState("");
  const [charges, setCharges] = useState("");

  // Résultat fiscal
  const [reintegrations, setReintegrations] = useState("");
  const [deductions, setDeductions] = useState("");
  const [ard, setArd] = useState("");
  const [reportDeficitaire, setReportDeficitaire] = useState("");

  // ASDI
  const [montantAchats, setMontantAchats] = useState("");

  const parse = (v: string) => parseFloat(v.replace(/\s/g, "")) || 0;

  const result = useMemo(() => {
    const pe = parse(produitsExploitation);
    if (pe <= 0) return null;
    return calculerIBA({
      produitsExploitation: pe,
      produitsFinanciers: parse(produitsFinanciers),
      produitsHAO: parse(produitsHAO),
      charges: parse(charges),
      reintegrations: parse(reintegrations),
      deductions: parse(deductions),
      ard: parse(ard),
      reportDeficitaire: parse(reportDeficitaire),
      montantAchatsImportations: parse(montantAchats),
    });
  }, [produitsExploitation, produitsFinanciers, produitsHAO, charges, reintegrations, deductions, ard, reportDeficitaire, montantAchats]);

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

          {/* Résultat comptable */}
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>
            {t("simulateur.iba.rcSection")}
          </Text>
          <NumberField label={t("simulateur.iba.produitsExploitation")} value={produitsExploitation} onChange={setProduitsExploitation} />
          <NumberField label={t("simulateur.iba.produitsFinanciers")} value={produitsFinanciers} onChange={setProduitsFinanciers} />
          <NumberField label={t("simulateur.iba.produitsHAO")} value={produitsHAO} onChange={setProduitsHAO} />
          <NumberField label={t("simulateur.iba.charges")} value={charges} onChange={setCharges} />

          {/* Résultat fiscal */}
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>
            {t("simulateur.iba.rfSection")}
          </Text>
          <NumberField label={t("simulateur.iba.reintegrations")} value={reintegrations} onChange={setReintegrations} />
          <NumberField label={t("simulateur.iba.deductionsFiscales")} value={deductions} onChange={setDeductions} />
          <NumberField label={t("simulateur.iba.ard")} value={ard} onChange={setArd} />
          <NumberField label={t("simulateur.iba.reportDeficitaire")} value={reportDeficitaire} onChange={setReportDeficitaire} />

          {/* ASDI */}
          <Text style={[styles.sectionLabel, { color: colors.primary }]}>
            {t("simulateur.iba.asdiSection")}
          </Text>
          <NumberField label={t("simulateur.iba.achatsImportations")} value={montantAchats} onChange={setMontantAchats} />

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>{t("simulateur.iba.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              {/* Résultat comptable */}
              <SimulateurSection label={t("simulateur.iba.rcSection")} />
              <TableRow label={t("simulateur.iba.produitsExploitation")} value={formatNumber(result.totalProduits)} bold />
              <TableRow label={t("simulateur.iba.charges")} value={`- ${formatNumber(result.charges)}`} bg={colors.background} color={colors.danger} />
              <ResultHighlight label={t("simulateur.iba.rc")} value={formatNumber(result.resultatComptable)} variant="primary" />

              {/* Résultat fiscal */}
              <SimulateurSection label={t("simulateur.iba.rfSection")} />
              <TableRow label={t("simulateur.iba.rc")} value={formatNumber(result.resultatComptable)} />
              {result.reintegrations > 0 && (
                <TableRow label={t("simulateur.iba.reintegrations")} value={`+ ${formatNumber(result.reintegrations)}`} bg={colors.background} color={colors.success} />
              )}
              {result.deductions > 0 && (
                <TableRow label={t("simulateur.iba.deductionsFiscales")} value={`- ${formatNumber(result.deductions)}`} bg={colors.background} color={colors.danger} />
              )}
              {result.ard > 0 && (
                <TableRow label={t("simulateur.iba.ard")} value={`- ${formatNumber(result.ard)}`} bg={colors.background} color={colors.danger} />
              )}
              {result.reportDeficitaire > 0 && (
                <TableRow label={t("simulateur.iba.reportDeficitaire")} value={`- ${formatNumber(result.reportDeficitaire)}`} bg={colors.background} color={colors.danger} />
              )}
              <ResultHighlight label={t("simulateur.iba.rf")} value={formatNumber(result.resultatFiscal)} variant="primary" />

              {/* IBA brut vs Minimum */}
              <SimulateurSection label={t("simulateur.iba.ibaBrutSection")} />
              <TableRow label={t("simulateur.iba.ibaBrutLabel")} value={formatNumber(result.ibaBrut)} />
              <TableRow label={t("simulateur.iba.rateApplied")} value={`${result.tauxIBA}%`} bg={colors.background} />
              <TableRow label={t("simulateur.iba.minPerceptionBase")} value={formatNumber(result.baseMinimumPerception)} />
              <TableRow label={t("simulateur.iba.minPerceptionRate")} value={`${result.tauxMinimum}%`} bg={colors.background} />
              <TableRow label={t("simulateur.iba.minPerceptionAmount")} value={formatNumber(result.minimumPerception)} />
              {result.minimumApplique && (
                <TableRow label={t("simulateur.iba.minApplied")} value={t("simulateur.iba.minAppliedYes")} color={colors.warning} />
              )}
              <ResultHighlight label={t("simulateur.iba.ibaRetenu")} value={formatNumber(result.ibaRetenu)} variant="primary" />

              {/* ASDI */}
              {result.asdi > 0 && (
                <>
                  <SimulateurSection label={t("simulateur.iba.asdiSection")} />
                  <TableRow label={t("simulateur.iba.asdiLabel")} value={`- ${formatNumber(result.asdi)}`} color={colors.danger} />
                  <TableRow label={t("simulateur.iba.asdiDetail")} value={`${result.tauxASDI}% × ${formatNumber(result.montantAchatsImportations)}`} bg={colors.background} />
                </>
              )}

              {/* Résultat final */}
              <SimulateurSection label={t("simulateur.iba.taxSection")} />
              <ResultHighlight label={t("simulateur.iba.taxDue")} value={formatNumber(result.ibaNet)} variant="danger" />
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
    fontSize: 24,
    fontWeight: fontWeights.heading,
    fontFamily: fonts.heading,
    marginBottom: 12,
  },
  descriptionBox: {
    marginBottom: 12,
    padding: 12,
  },
  descriptionText: {
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 6,
  },
  legalRef: {
    fontSize: 12,
    marginTop: 12,
  },
});
