import { useState, useMemo } from "react";
import { View, Text, ScrollView, Switch, StyleSheet } from "react-native";
import { calculerCessionParts, type TypeCession } from "@/lib/services/cession-parts.service";
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

export default function CessionPartsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [prixCession, setPrixCession] = useState("");
  const [typeCession, setTypeCession] = useState<TypeCession>("actionsStandard");
  const [contratPetrolier, setContratPetrolier] = useState(false);

  const TYPES: { value: TypeCession; label: string }[] = [
    { value: "actionsStandard", label: t("simulateur.cessionParts.standard") },
    { value: "participations", label: t("simulateur.cessionParts.participations") },
    { value: "changementControle", label: t("simulateur.cessionParts.controlChange") },
  ];

  const result = useMemo(() => {
    const montant = parseFloat(prixCession.replace(/\s/g, "")) || 0;
    if (montant <= 0) return null;
    return calculerCessionParts({ prixCession: montant, typeCession, contratPetrolier });
  }, [prixCession, typeCession, contratPetrolier]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.cessionParts.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("simulateur.cessionParts.description")}</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.cessionParts.typeLabel")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeCession} onChange={setTypeCession} direction="column" fontSize={12} />

          <NumberField label={t("simulateur.cessionParts.amount")} value={prixCession} onChange={setPrixCession} />

          {typeCession === "participations" && (
            <View style={[styles.switchRow, { backgroundColor: colors.card }]}>
              <View style={styles.flex1}>
                <Text style={[styles.switchLabel, { color: colors.text }]}>{t("simulateur.cessionParts.petroleum")}</Text>
                <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>{t("simulateur.cessionParts.petroleumDesc")}</Text>
              </View>
              <Switch
                value={contratPetrolier}
                onValueChange={setContratPetrolier}
                trackColor={{ false: colors.disabled, true: `${colors.primary}80` }}
                thumbColor={contratPetrolier ? colors.primary : colors.textMuted}
              />
            </View>
          )}

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>{t("simulateur.cessionParts.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.cessionParts.calcSection")} />
              <TableRow label={t("simulateur.cessionParts.amount")} value={formatNumber(result.prixCession)} bold />
              <TableRow label={`${t("simulateur.cessionParts.rate")} (${result.articleRef})`} value={`${result.taux}%`} bg={colors.background} />

              <SimulateurSection label={t("simulateur.cessionParts.detailSection")} />
              <TableRow label={t("simulateur.cessionParts.duties")} value={formatNumber(result.droits)} bold />
              {result.minimumApplique && (
                <TableRow label={t("simulateur.cessionParts.minimumApplied")} value="1 000 000 FCFA" bg={colors.background} color={colors.primary} />
              )}
              <TableRow label={t("simulateur.cessionParts.additionalCents")} value={`+ ${formatNumber(result.centimesAdditionnels)}`} bg={colors.background} />
              <ResultHighlight label={t("simulateur.cessionParts.totalDue")} value={formatNumber(result.total)} variant="danger" />
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.cessionParts.enterAmount")} />
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    marginBottom: 12,
  },
  flex1: {
    flex: 1,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  switchDesc: {
    fontSize: 12,
  },
  legalRef: {
    fontSize: 12,
    marginTop: 12,
  },
});
