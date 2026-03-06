import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerIts, calculerNombreParts, type SituationFamiliale, type PeriodeRevenu } from "@/lib/services/its.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import OptionButtonGroup from "@/components/simulateur/OptionButtonGroup";
import ResultHighlight from "@/components/simulateur/ResultHighlight";
import SimulateurEmptyState from "@/components/simulateur/SimulateurEmptyState";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";

export default function ItsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [salaireBrut, setSalaireBrut] = useState("");
  const [periode, setPeriode] = useState<PeriodeRevenu>("mensuel");
  const [situation, setSituation] = useState<SituationFamiliale>("celibataire");
  const [enfants, setEnfants] = useState(0);
  const [appliquerCharge, setAppliquerCharge] = useState(true);

  const SITUATIONS: { value: SituationFamiliale; label: string }[] = [
    { value: "celibataire", label: t("simulateur.its.single") },
    { value: "marie", label: t("simulateur.its.married") },
    { value: "divorce", label: t("simulateur.its.divorced") },
    { value: "veuf", label: t("simulateur.its.widowed") },
  ];

  const nombreParts = useMemo(
    () => calculerNombreParts(situation, enfants, appliquerCharge),
    [situation, enfants, appliquerCharge]
  );

  const result = useMemo(() => {
    const montant = parseFloat(salaireBrut.replace(/\s/g, "")) || 0;
    if (montant <= 0) return null;
    return calculerIts({
      salaireBrut: montant,
      periode,
      situationFamiliale: situation,
      nombreEnfants: enfants,
      appliquerChargeFamille: appliquerCharge,
    });
  }, [salaireBrut, periode, situation, enfants, appliquerCharge]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.its.title")}
          </Text>

          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>{t("simulateur.its.description")}</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, marginBottom: 2 }}>{t("simulateur.its.status")}</Text>
              <OptionButtonGroup options={SITUATIONS} selected={situation} onChange={setSituation} direction="column" fontSize={12} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, marginBottom: 2 }}>{t("simulateur.its.dependents")}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <TouchableOpacity accessibilityLabel={t("simulateur.decreaseDependents")} accessibilityRole="button" style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.border }} onPress={() => setEnfants(Math.max(0, enfants - 1))}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>-</Text>
                </TouchableOpacity>
                <Text style={{ minWidth: 28, textAlign: "center", fontSize: 16, fontWeight: "700", color: colors.text }}>{enfants}</Text>
                <TouchableOpacity accessibilityLabel={t("simulateur.increaseDependents")} accessibilityRole="button" style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.border }} onPress={() => setEnfants(Math.min(20, enfants + 1))}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: appliquerCharge ? `${colors.primary}20` : colors.border, marginBottom: 10 }} onPress={() => setAppliquerCharge(!appliquerCharge)}>
                <Ionicons name={appliquerCharge ? "checkbox" : "square-outline"} size={16} color={appliquerCharge ? colors.primary : colors.textMuted} />
                <Text style={{ fontSize: 12, fontWeight: "600", color: appliquerCharge ? colors.primary : colors.textSecondary, marginLeft: 6 }}>{t("simulateur.its.familyQuotient")}</Text>
              </TouchableOpacity>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", backgroundColor: `${colors.primary}15` }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>{nombreParts} {t("common.parts")}</Text>
              </View>
            </View>
          </View>

          <OptionButtonGroup
            options={[
              { value: "mensuel" as PeriodeRevenu, label: t("simulateur.its.monthly") },
              { value: "annuel" as PeriodeRevenu, label: t("simulateur.its.annual") },
            ]}
            selected={periode}
            onChange={setPeriode}
            fontSize={13}
          />

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {periode === "mensuel" ? t("simulateur.its.grossSalaryMonthly") : t("simulateur.its.grossSalaryAnnual")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, borderWidth: 2, borderColor: colors.primary, height: 48 }}>
            <TextInput
              style={{ flex: 1, fontSize: 16, fontWeight: "700", color: colors.text }}
              value={salaireBrut}
              onChangeText={(v) => setSalaireBrut(formatInputNumber(v))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "600" }}>FCFA</Text>
          </View>

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>{t("simulateur.its.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.its.monthlyCalc")} />
              <TableRow label={t("simulateur.its.grossMonthly")} value={formatNumber(result.revenuBrutAnnuel / 12)} bold />
              <TableRow label={t("simulateur.its.cnssMonthly")} value={`- ${formatNumber(result.retenueCnssMensuelle)}`} bg={colors.background} color={colors.danger} />
              <TableRow label={t("simulateur.its.netTaxableMonthly")} value={formatNumber(Math.round(result.revenuNetImposable / 12))} />

              <SimulateurSection label={t("simulateur.its.annualCalc")} />
              <TableRow label={t("simulateur.its.grossAnnual")} value={formatNumber(result.revenuBrutAnnuel)} />
              <TableRow label={t("simulateur.its.cnssAnnual")} value={`- ${formatNumber(result.retenueCnss)}`} bg={colors.background} color={colors.danger} />
              <TableRow label={t("simulateur.its.netAnnual")} value={formatNumber(result.revenuBrutAnnuel - result.retenueCnss)} />
              <TableRow label={t("simulateur.its.netTaxableAnnual")} value={formatNumber(result.revenuNetImposable)} bg={colors.background} bold />

              <View style={{ backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>{t("simulateur.its.familyQuotientCalc")}</Text>
                    <Text style={{ fontSize: 10, color: colors.textSecondary }}>{t("simulateur.its.netTaxableDivided")} {nombreParts} {t("common.parts")}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>{formatNumber(result.revenuParPart)}</Text>
                </View>
              </View>

              <SimulateurSection label={t("simulateur.its.taxToPay")} />
              <TableRow label={t("simulateur.its.itsAnnual")} value={formatNumber(result.itsAnnuel)} />
              <ResultHighlight label={t("simulateur.its.itsMonthly")} value={formatNumber(result.itsMensuel)} variant="danger" />

              <ResultHighlight label={t("simulateur.its.netSalaryMonthly")} value={formatNumber(Math.round(result.salaireNetMensuel))} variant="success" />
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.its.enterSalary")} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
