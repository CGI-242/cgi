import { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { calculerMinPerception, type TypeImpot } from "@/lib/services/is.service";
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

export default function IsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [typeImpot, setTypeImpot] = useState<TypeImpot>("is");
  const [produitsExploitation, setProduitsExploitation] = useState("");
  const [produitsFinanciers, setProduitsFinanciers] = useState("");
  const [produitsHAO, setProduitsHAO] = useState("");
  const [retenuesLiberatoires, setRetenuesLiberatoires] = useState("");

  const TYPES: { value: TypeImpot; label: string }[] = [
    { value: "is", label: t("simulateur.is.tabIS") },
    { value: "iba", label: t("simulateur.is.tabIBA") },
  ];

  const result = useMemo(() => {
    const pe = parseFloat(produitsExploitation.replace(/\s/g, "")) || 0;
    if (pe === 0) return null;
    return calculerMinPerception({
      typeImpot,
      produitsExploitation: pe,
      produitsFinanciers: parseFloat(produitsFinanciers.replace(/\s/g, "")) || 0,
      produitsHAO: parseFloat(produitsHAO.replace(/\s/g, "")) || 0,
      retenuesLiberatoires: parseFloat(retenuesLiberatoires.replace(/\s/g, "")) || 0,
    });
  }, [typeImpot, produitsExploitation, produitsFinanciers, produitsHAO, retenuesLiberatoires]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.is.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>
              {typeImpot === "is" ? t("simulateur.is.descriptionIS") : t("simulateur.is.descriptionIBA")}
            </Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.is.typeLabel")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeImpot} onChange={setTypeImpot} fontSize={13} />

          <Text style={[styles.fieldLabel, { color: colors.text, marginTop: 12 }]}>
            {t("simulateur.is.baseCalc")}
          </Text>
          <NumberField label={t("simulateur.is.exploitation")} value={produitsExploitation} onChange={setProduitsExploitation} />
          <NumberField label={t("simulateur.is.financial")} value={produitsFinanciers} onChange={setProduitsFinanciers} />
          <NumberField label={t("simulateur.is.hao")} value={produitsHAO} onChange={setProduitsHAO} />
          {typeImpot === "is" && (
            <NumberField label={t("simulateur.is.withholdings")} value={retenuesLiberatoires} onChange={setRetenuesLiberatoires} />
          )}

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>
            {typeImpot === "is" ? t("simulateur.is.legalRefIS") : t("simulateur.is.legalRefIBA")}
          </Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={typeImpot === "is" ? t("simulateur.is.minPerceptionIS") : t("simulateur.is.minPerceptionIBA")} />
              <TableRow label={t("simulateur.is.base")} value={formatNumber(result.baseMinimumPerception)} />
              <TableRow label={t("simulateur.is.rateApplied")} value={`${result.tauxMinimum}%`} bg={colors.background} />
              <ResultHighlight label={t("simulateur.is.annualMin")} value={formatNumber(result.minimumPerceptionAnnuel)} variant="primary" />

              <SimulateurSection label={t("simulateur.is.quarterlyInstalments")} />
              {result.acomptes.map((a) => (
                <TableRow key={a.label} label={a.label} value={formatNumber(a.montant)} />
              ))}

              <ResultHighlight
                label={t("simulateur.is.totalToPay")}
                value={formatNumber(result.minimumPerceptionAnnuel)}
                variant="primary"
                note={typeImpot === "is" ? t("simulateur.is.imputNoteIS") : t("simulateur.is.imputNoteIBA")}
              />
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
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
  },
  legalRef: {
    fontSize: 12,
    marginTop: 12,
  },
});
