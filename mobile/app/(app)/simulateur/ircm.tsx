import { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { calculerIRCM, type TypeRevenuIRCM } from "@/lib/services/ircm.service";
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
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.ircm.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>
              {t("simulateur.ircm.description")}
            </Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.ircm.revenueType")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeRevenu} onChange={setTypeRevenu} />

          <NumberField label={t("simulateur.ircm.grossAmount")} value={montantBrut} onChange={setMontantBrut} />

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>
            {t("simulateur.ircm.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.ircm.calcSection")} />
              <TableRow label={t("simulateur.ircm.grossAmount")} value={formatNumber(result.montantBrut)} bold />
              <TableRow label={t("simulateur.ircm.rateApplied")} value={`${result.taux}%`} bg={colors.background} />
              <ResultHighlight label={t("simulateur.ircm.taxDue")} value={formatNumber(result.impot)} variant="danger" />
              <ResultHighlight label={t("simulateur.ircm.netAmount")} value={formatNumber(result.montantNet)} variant="success" />
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.ircm.enterAmount")} />
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
});
