import { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { calculerIRFLoyers, type TypeLocataire } from "@/lib/services/irf-loyers.service";
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

export default function IrfLoyersScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [loyersBruts, setLoyersBruts] = useState("");
  const [typeLocataire, setTypeLocataire] = useState<TypeLocataire>("personneMorale");

  const TYPES: { value: TypeLocataire; label: string }[] = [
    { value: "personneMorale", label: t("simulateur.irfLoyers.legalEntity") },
    { value: "personnePhysique", label: t("simulateur.irfLoyers.individual") },
  ];

  const result = useMemo(() => {
    const montant = parseFloat(loyersBruts.replace(/\s/g, "")) || 0;
    if (montant <= 0) return null;
    return calculerIRFLoyers({ loyersBrutsAnnuels: montant, typeLocataire });
  }, [loyersBruts, typeLocataire]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.irfLoyers.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("simulateur.irfLoyers.description")}</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.irfLoyers.tenantType")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeLocataire} onChange={setTypeLocataire} fontSize={12} />

          <NumberField label={t("simulateur.irfLoyers.annualRent")} value={loyersBruts} onChange={setLoyersBruts} />

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>{t("simulateur.irfLoyers.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.irfLoyers.calcSection")} />
              <TableRow label={t("simulateur.irfLoyers.annualRent")} value={formatNumber(result.loyersBrutsAnnuels)} bold />
              <TableRow label={t("simulateur.irfLoyers.monthlyRent")} value={formatNumber(result.loyersBrutsMensuels)} bg={colors.background} />
              <TableRow label={t("simulateur.irfLoyers.rateApplied")} value={`${result.taux}%`} />

              <SimulateurSection label={t("simulateur.irfLoyers.taxSection")} />
              <ResultHighlight label={t("simulateur.irfLoyers.annualTax")} value={formatNumber(result.impotAnnuel)} variant="danger" />
              <TableRow label={t("simulateur.irfLoyers.monthlyTax")} value={formatNumber(result.impotMensuel)} />

              <SimulateurSection label={t("simulateur.irfLoyers.netSection")} />
              <ResultHighlight label={t("simulateur.irfLoyers.netAnnual")} value={formatNumber(result.netAnnuel)} variant="success" />
              <TableRow label={t("simulateur.irfLoyers.netMonthly")} value={formatNumber(result.netMensuel)} bg={colors.background} />

              <View style={[styles.deadlineBox, { backgroundColor: `${colors.primary}10` }]}>
                <Text style={[styles.deadlineText, { color: colors.primary }]}>{t("simulateur.irfLoyers.deadline")}: {result.echeance}</Text>
              </View>
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.irfLoyers.enterRent")} />
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
  deadlineBox: {
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  deadlineText: {
    fontSize: 12,
    fontWeight: "600",
  },
});
