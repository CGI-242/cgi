import { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { calculerIS, type IsInput } from "@/lib/services/is.service";
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

export default function IsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [produitsExploitation, setProduitsExploitation] = useState("");
  const [produitsFinanciers, setProduitsFinanciers] = useState("");
  const [produitsHAO, setProduitsHAO] = useState("");
  const [retenuesLiberatoires, setRetenuesLiberatoires] = useState("");

  const result = useMemo(() => {
    const input: IsInput = {
      produitsExploitation: parseFloat(produitsExploitation.replace(/\s/g, "")) || 0,
      produitsFinanciers: parseFloat(produitsFinanciers.replace(/\s/g, "")) || 0,
      produitsHAO: parseFloat(produitsHAO.replace(/\s/g, "")) || 0,
      retenuesLiberatoires: parseFloat(retenuesLiberatoires.replace(/\s/g, "")) || 0,
    };
    if (input.produitsExploitation === 0) return null;
    return calculerIS(input);
  }, [produitsExploitation, produitsFinanciers, produitsHAO, retenuesLiberatoires]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.is.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("simulateur.is.description")}</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.is.baseCalc")}
          </Text>
          <NumberField label={t("simulateur.is.exploitation")} value={produitsExploitation} onChange={setProduitsExploitation} />
          <NumberField label={t("simulateur.is.financial")} value={produitsFinanciers} onChange={setProduitsFinanciers} />
          <NumberField label={t("simulateur.is.hao")} value={produitsHAO} onChange={setProduitsHAO} />
          <NumberField label={t("simulateur.is.withholdings")} value={retenuesLiberatoires} onChange={setRetenuesLiberatoires} />

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>{t("simulateur.is.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.is.minPerception")} />
              <TableRow label={t("simulateur.is.base")} value={formatNumber(result.baseMinimumPerception)} />
              <TableRow label={t("simulateur.is.rateApplied")} value={`${result.tauxMinimum}%`} bg={colors.background} />
              <ResultHighlight label={t("simulateur.is.annualMin")} value={formatNumber(result.minimumPerceptionAnnuel)} variant="primary" />

              <SimulateurSection label={t("simulateur.is.quarterlyInstalments")} />
              {result.acomptes.map((a) => (
                <TableRow key={a.label} label={a.label} value={formatNumber(a.montant)} />
              ))}

              <ResultHighlight label={t("simulateur.is.totalToPay")} value={formatNumber(result.minimumPerceptionAnnuel)} variant="primary" note={t("simulateur.is.imputNote")} />
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.is.enterProducts")} />
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
    padding: 12,
    marginBottom: 12,
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
  },
});
