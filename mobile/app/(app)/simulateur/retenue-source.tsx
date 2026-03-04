import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { calculerRetenueSource, type TypeRetenue } from "@/lib/services/retenue-source.service";
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

export default function RetenueSourceScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [montantHT, setMontantHT] = useState("");
  const [typeRetenue, setTypeRetenue] = useState<TypeRetenue>("non_resident");

  const TYPES: { value: TypeRetenue; label: string }[] = [
    { value: "non_resident", label: t("simulateur.rts.nonResident") },
    { value: "non_soumis_is", label: t("simulateur.rts.nonSoumisIS") },
    { value: "tresor_public", label: t("simulateur.rts.tresorPublic") },
  ];

  const result = useMemo(() => {
    const montant = parseFloat(montantHT.replace(/\s/g, "")) || 0;
    if (montant <= 0) return null;
    return calculerRetenueSource({ montantHT: montant, typeRetenue });
  }, [montantHT, typeRetenue]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.rts.title")}
          </Text>

          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.rts.description")}
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.rts.typeLabel")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeRetenue} onChange={setTypeRetenue} />

          <NumberField label={t("simulateur.rts.amountHT")} value={montantHT} onChange={setMontantHT} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.rts.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.rts.calcSection")} />
              <TableRow label={t("simulateur.rts.amountHT")} value={formatNumber(result.montantHT)} bold />
              <TableRow label={t("simulateur.rts.rateApplied")} value={`${result.taux}%`} bg={colors.background} />
              <TableRow label={t("simulateur.rts.articleLabel")} value={result.articleRef} bg={colors.background} />
              <ResultHighlight label={t("simulateur.rts.withholdingAmount")} value={formatNumber(result.montantRetenue)} variant="danger" />
              <ResultHighlight label={t("simulateur.rts.netAmount")} value={formatNumber(result.montantNet)} variant="success" />
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.rts.enterAmount")} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
