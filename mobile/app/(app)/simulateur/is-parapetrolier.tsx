import { useState, useMemo } from "react";
import { View, Text, ScrollView, Switch, StyleSheet } from "react-native";
import { calculerIsParapetrolier, type IsParapetrolierInput } from "@/lib/services/is-parapetrolier.service";
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

export default function IsParapetrolierScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [chiffreAffairesHT, setChiffreAffairesHT] = useState("");
  const [montantMobDemob, setMontantMobDemob] = useState("");
  const [montantRemboursements, setMontantRemboursements] = useState("");
  const [isZoneAngola, setIsZoneAngola] = useState(false);

  const result = useMemo(() => {
    const input: IsParapetrolierInput = {
      chiffreAffairesHT: parseFloat(chiffreAffairesHT.replace(/\s/g, "")) || 0,
      montantMobDemob: parseFloat(montantMobDemob.replace(/\s/g, "")) || 0,
      montantRemboursements: parseFloat(montantRemboursements.replace(/\s/g, "")) || 0,
      isZoneAngola,
    };
    if (input.chiffreAffairesHT === 0) return null;
    return calculerIsParapetrolier(input);
  }, [chiffreAffairesHT, montantMobDemob, montantRemboursements, isZoneAngola]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.rowContainer, { flexDirection: isMobile ? "column" : "row" }]}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={styles.scrollContent}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t("simulateur.isPara.title")}
          </Text>

          <View style={[styles.descriptionBox, { backgroundColor: colors.card }]}>
            <Text style={[styles.descriptionText, { color: colors.text }]}>{t("simulateur.isPara.description")}</Text>
          </View>

          <Text style={[styles.fieldLabel, { color: colors.text }]}>
            {t("simulateur.isPara.revenueSection")}
          </Text>
          <NumberField label={t("simulateur.isPara.caHT")} value={chiffreAffairesHT} onChange={setChiffreAffairesHT} />
          <NumberField label={t("simulateur.isPara.mobDemob")} value={montantMobDemob} onChange={setMontantMobDemob} />
          <NumberField label={t("simulateur.isPara.remboursements")} value={montantRemboursements} onChange={setMontantRemboursements} />

          <View style={[styles.switchRow, { backgroundColor: colors.card }]}>
            <View style={styles.switchTextWrap}>
              <Text style={[styles.switchLabel, { color: colors.text }]}>{t("simulateur.isPara.zoneAngola")}</Text>
              <Text style={[styles.switchDesc, { color: colors.textSecondary }]}>{t("simulateur.isPara.zoneAngolaDesc")}</Text>
            </View>
            <Switch value={isZoneAngola} onValueChange={setIsZoneAngola} trackColor={{ false: colors.disabled, true: `${colors.primary}80` }} thumbColor={isZoneAngola ? colors.primary : colors.textMuted} />
          </View>

          <Text style={[styles.legalRef, { color: colors.textMuted }]}>{t("simulateur.isPara.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={[{ width: isMobile ? "100%" : "50%" }, isMobile ? { borderTopWidth: 1, borderTopColor: colors.border } : { borderLeftWidth: 1, borderLeftColor: colors.border }]} contentContainerStyle={styles.resultScrollContent}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.isPara.baseSection")} />
              <TableRow label={t("simulateur.isPara.caHTBrut")} value={formatNumber(result.caHTBrut)} />
              <TableRow label={t("simulateur.isPara.exclusionsLabel")} value={`- ${formatNumber(result.exclusions)}`} bg={colors.background} />
              <TableRow label={t("simulateur.isPara.caHTNet")} value={formatNumber(result.caHTNet)} bold />
              <TableRow label={t("simulateur.isPara.baseForfaitaire")} value={formatNumber(result.baseForfaitaire)} bg={colors.background} />

              <SimulateurSection label={t("simulateur.isPara.isSection")} />
              <TableRow label={t("simulateur.isPara.baseForfaitaireLabel")} value={formatNumber(result.baseForfaitaire)} />
              <TableRow label={t("simulateur.isPara.tauxIS")} value={`${result.tauxIS}%`} bg={colors.background} />
              <ResultHighlight label={t("simulateur.isPara.isForfaitaire")} value={formatNumber(result.isForfaitaire)} variant="primary" />

              <SimulateurSection label={t("simulateur.isPara.ircmSection")} />
              <TableRow label={t("simulateur.isPara.distribReputee")} value={formatNumber(result.distributionReputee)} />
              <TableRow label={t("simulateur.isPara.tauxIRCM")} value={`${result.tauxIRCM}%`} bg={colors.background} />
              <ResultHighlight label={t("simulateur.isPara.ircmForfaitaire")} value={formatNumber(result.ircmForfaitaire)} variant="primary" />

              <SimulateurSection label={t("simulateur.isPara.totalSection")} />
              <TableRow label={t("simulateur.isPara.isLabel")} value={formatNumber(result.isForfaitaire)} />
              <TableRow label={t("simulateur.isPara.ircmLabel")} value={formatNumber(result.ircmForfaitaire)} bg={colors.background} />
              <ResultHighlight label={t("simulateur.isPara.totalISIRCM")} value={formatNumber(result.totalISPlusIRCM)} variant="danger" />
              <TableRow label={t("simulateur.isPara.tauxEffectif")} value={`${result.tauxEffectifCA}%`} />

              <SimulateurSection label={t("simulateur.isPara.mensualitesSection")} />
              <TableRow label={t("simulateur.isPara.mensIS")} value={formatNumber(result.mensualiteIS)} />
              <TableRow label={t("simulateur.isPara.mensIRCM")} value={formatNumber(result.mensualiteIRCM)} bg={colors.background} />
              <ResultHighlight label={t("simulateur.isPara.mensTotal")} value={formatNumber(result.mensualiteTotal)} variant="success" note={t("simulateur.isPara.mensNote")} />
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.isPara.enterCA")} />
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
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    marginTop: 8,
    marginBottom: 8,
  },
  switchTextWrap: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  switchDesc: {
    fontSize: 12,
    marginTop: 2,
  },
  legalRef: {
    fontSize: 12,
  },
});
