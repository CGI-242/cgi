import { useState, useMemo } from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import { calculerIGF, type BaseIGF } from "@/lib/services/igf.service";
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

export default function IgfScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [chiffreAffaires, setChiffreAffaires] = useState("");
  const [baseImposition, setBaseImposition] = useState<BaseIGF>("ca");

  const BASES: { value: BaseIGF; label: string }[] = [
    { value: "ca", label: t("simulateur.igf.baseCa") },
    { value: "marge", label: t("simulateur.igf.baseMarge") },
  ];

  const result = useMemo(() => {
    const ca = parseFloat(chiffreAffaires.replace(/\s/g, "")) || 0;
    if (ca <= 0) return null;
    return calculerIGF({ chiffreAffaires: ca, baseImposition });
  }, [chiffreAffaires, baseImposition]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.igf.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("simulateur.igf.description")}</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.igf.taxBase")}
          </Text>
          <OptionButtonGroup options={BASES} selected={baseImposition} onChange={setBaseImposition} />

          <NumberField label={t("simulateur.igf.turnover")} value={chiffreAffaires} onChange={setChiffreAffaires} />

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>{t("simulateur.igf.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.igf.resultSection")} />
              <TableRow label={t("simulateur.igf.taxableBase")} value={formatNumber(result.baseImposable)} bg={colors.card} />
              <TableRow label={t("simulateur.igf.appliedRate")} value={`${result.taux}%`} bg={colors.background} />

              <ResultHighlight label={t("simulateur.igf.annualIGF")} value={formatNumber(result.igfAnnuel)} variant="danger" />
              <ResultHighlight label={t("simulateur.igf.quarterlyIGF")} value={formatNumber(result.igfTrimestriel)} variant="primary" />

              <View style={[styles.noteBox, { backgroundColor: colors.card }]}>
                <Text style={[styles.noteText, { color: colors.textSecondary }]}>{t("simulateur.igf.paymentNote")}</Text>
              </View>
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.igf.enterTurnover")} />
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
  },
});
