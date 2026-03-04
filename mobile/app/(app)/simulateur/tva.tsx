import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.tva.title")}
          </Text>

          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>{t("simulateur.tva.description")}</Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.tva.operationType")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeOperation} onChange={setTypeOperation} />

          <NumberField label={t("simulateur.tva.revenueHT")} value={caHT} onChange={setCaHT} />
          <NumberField label={t("simulateur.tva.purchasesHT")} value={achatsHT} onChange={setAchatsHT} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>{t("simulateur.tva.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
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

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: `${colors.primary}10` }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>{t("simulateur.tva.deadlineNote")}</Text>
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
