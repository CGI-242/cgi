import { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { calculerTVA, type TypeOperation } from "@/lib/services/tva.service";
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

export default function TvaScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [caHT, setCaHT] = useState("");
  const [achatsHT, setAchatsHT] = useState("");
  const [typeOperation, setTypeOperation] = useState<TypeOperation>("taxable");

  const TYPES: { value: TypeOperation; label: string }[] = [
    { value: "taxable", label: t("simulateur.tva.taxable") },
    { value: "exoneree", label: t("simulateur.tva.exempt") },
    { value: "export", label: t("simulateur.tva.export") },
  ];

  const result = useMemo(() => {
    const ca = parseFloat(caHT.replace(/\s/g, "")) || 0;
    const achats = parseFloat(achatsHT.replace(/\s/g, "")) || 0;
    if (ca <= 0) return null;
    return calculerTVA({ caHT: ca, achatsHT: achats, typeOperation });
  }, [caHT, achatsHT, typeOperation]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.tva.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("simulateur.tva.description")}</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.tva.operationType")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeOperation} onChange={setTypeOperation} />

          <NumberField label={t("simulateur.tva.revenueHT")} value={caHT} onChange={setCaHT} />
          <NumberField label={t("simulateur.tva.purchasesHT")} value={achatsHT} onChange={setAchatsHT} />

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>{t("simulateur.tva.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.tva.collectedSection")} />
              <TableRow label={t("simulateur.tva.revenueHT")} value={formatNumber(result.caHT)} bold />
              <TableRow label={t("simulateur.tva.ttcAmount")} value={formatNumber(result.montantTTC)} bg={colors.background} />
              <TableRow label={`${t("simulateur.tva.collectedVAT")} (${result.taux}%)`} value={formatNumber(result.tvaCollectee)} />

              <SimulateurSection label={t("simulateur.tva.deductibleSection")} />
              <TableRow label={t("simulateur.tva.purchasesHT")} value={formatNumber(result.achatsHT)} />
              <TableRow label={`${t("simulateur.tva.deductibleVAT")} (${result.taux}%)`} value={`- ${formatNumber(result.tvaDeductible)}`} bg={colors.background} color={colors.danger} />

              <SimulateurSection label={t("simulateur.tva.balanceSection")} />
              {result.tvaDue > 0 ? (
                <ResultHighlight label={t("simulateur.tva.vatDue")} value={formatNumber(result.tvaDue)} variant="danger" />
              ) : (
                <ResultHighlight label={t("simulateur.tva.vatCredit")} value={formatNumber(result.creditTva)} variant="success" />
              )}

              <View style={[styles.noteBox, { backgroundColor: `${colors.primary}10` }]}>
                <Text style={[styles.noteText, { color: colors.primary }]}>{t("simulateur.tva.deadlineNote")}</Text>
              </View>
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.tva.enterRevenue")} />
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  legalRef: {
    fontSize: 12,
    marginTop: 12,
  },
  noteBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  noteText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
