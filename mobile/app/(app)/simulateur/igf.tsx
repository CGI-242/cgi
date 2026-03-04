import { useState, useMemo } from "react";
import { View, Text, ScrollView } from "react-native";
import { calculerIGF, type TypeActiviteIGF } from "@/lib/services/igf.service";
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
  const [typeActivite, setTypeActivite] = useState<TypeActiviteIGF>("commerce");

  const TYPES: { value: TypeActiviteIGF; label: string }[] = [
    { value: "commerce", label: t("simulateur.igf.commerce") },
    { value: "services", label: t("simulateur.igf.services") },
    { value: "artisanat", label: t("simulateur.igf.craft") },
  ];

  const result = useMemo(() => {
    const ca = parseFloat(chiffreAffaires.replace(/\s/g, "")) || 0;
    if (ca <= 0) return null;
    return calculerIGF({ chiffreAffaires: ca, typeActivite });
  }, [chiffreAffaires, typeActivite]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.igf.title")}
          </Text>

          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>{t("simulateur.igf.description")}</Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.igf.activityType")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typeActivite} onChange={setTypeActivite} />

          <NumberField label={t("simulateur.igf.turnover")} value={chiffreAffaires} onChange={setChiffreAffaires} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>{t("simulateur.igf.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.igf.bracketDetail")} />
              {result.tranches.map((tr, i) => (
                <TableRow key={i} label={`${tr.tranche} (${tr.taux}%)`} value={formatNumber(tr.montant)} bg={i % 2 === 0 ? colors.card : colors.background} />
              ))}

              <SimulateurSection label={t("simulateur.igf.resultSection")} />
              <ResultHighlight label={t("simulateur.igf.annualIGF")} value={formatNumber(result.igfAnnuel)} variant="danger" />
              <ResultHighlight label={t("simulateur.igf.quarterlyIGF")} value={formatNumber(result.igfTrimestriel)} variant="primary" />

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.card }}>
                <Text style={{ fontSize: 10, color: colors.textSecondary }}>{t("simulateur.igf.paymentNote")}</Text>
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
