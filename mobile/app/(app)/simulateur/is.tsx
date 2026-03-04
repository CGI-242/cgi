import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.is.title")}
          </Text>

          <View style={{ padding: 12, backgroundColor: colors.card, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: colors.text }}>{t("simulateur.is.description")}</Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.is.baseCalc")}
          </Text>
          <NumberField label={t("simulateur.is.exploitation")} value={produitsExploitation} onChange={setProduitsExploitation} />
          <NumberField label={t("simulateur.is.financial")} value={produitsFinanciers} onChange={setProduitsFinanciers} />
          <NumberField label={t("simulateur.is.hao")} value={produitsHAO} onChange={setProduitsHAO} />
          <NumberField label={t("simulateur.is.withholdings")} value={retenuesLiberatoires} onChange={setRetenuesLiberatoires} />

          <Text style={{ fontSize: 10, color: colors.textMuted }}>{t("simulateur.is.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
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
