import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
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
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.irfLoyers.title")}
          </Text>

          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>{t("simulateur.irfLoyers.description")}</Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.irfLoyers.tenantType")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeLocataire} onChange={setTypeLocataire} fontSize={12} />

          <NumberField label={t("simulateur.irfLoyers.annualRent")} value={loyersBruts} onChange={setLoyersBruts} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>{t("simulateur.irfLoyers.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
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

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: `${colors.primary}10` }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>{t("simulateur.irfLoyers.deadline")}: {result.echeance}</Text>
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
