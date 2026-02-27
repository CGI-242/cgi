import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  calculerIts,
  calculerNombreParts,
  type SituationFamiliale,
  type PeriodeRevenu,
} from "@/lib/services/its.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function ItsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
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
      {/* Layout 50/50 */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Colonne gauche 50% - Formulaire */}
        <ScrollView style={{ width: "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          {/* Info banner */}
          <View style={{ borderRadius: 8, marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.its.description")}
            </Text>
          </View>

          {/* Situation familiale + Enfants/QF cote a cote */}
          <View style={{ flexDirection: "row", gap: 10, marginBottom: 12 }}>
            {/* Gauche : boutons situation empiles */}
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, marginBottom: 2 }}>{t("simulateur.its.status")}</Text>
              {SITUATIONS.map((s) => (
                <TouchableOpacity
                  key={s.value}
                  style={{ paddingVertical: 8, alignItems: "center", backgroundColor: situation === s.value ? colors.primary : colors.border, borderRadius: 6 }}
                  onPress={() => setSituation(s.value)}
                >
                  <Text style={{ color: situation === s.value ? "#fff" : colors.text, fontSize: 12, fontWeight: "600" }}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Droite : enfants + QF + parts */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: colors.textSecondary, marginBottom: 2 }}>{t("simulateur.its.dependents")}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                <TouchableOpacity style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.border, borderRadius: 4 }} onPress={() => setEnfants(Math.max(0, enfants - 1))}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>-</Text>
                </TouchableOpacity>
                <Text style={{ minWidth: 28, textAlign: "center", fontSize: 16, fontWeight: "700", color: colors.text }}>{enfants}</Text>
                <TouchableOpacity style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.border, borderRadius: 4 }} onPress={() => setEnfants(Math.min(20, enfants + 1))}>
                  <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity style={{ flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, backgroundColor: appliquerCharge ? `${colors.primary}20` : colors.border, borderRadius: 6, marginBottom: 10 }} onPress={() => setAppliquerCharge(!appliquerCharge)}>
                <Ionicons name={appliquerCharge ? "checkbox" : "square-outline"} size={16} color={appliquerCharge ? colors.primary : colors.textMuted} />
                <Text style={{ fontSize: 12, fontWeight: "600", color: appliquerCharge ? colors.primary : colors.textSecondary, marginLeft: 6 }}>{t("simulateur.its.familyQuotient")}</Text>
              </TouchableOpacity>
              <View style={{ paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", backgroundColor: `${colors.primary}15`, borderRadius: 6 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>{nombreParts} {t("common.parts")}</Text>
              </View>
            </View>
          </View>

          {/* Periode */}
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {(["mensuel", "annuel"] as PeriodeRevenu[]).map((p) => (
              <TouchableOpacity
                key={p}
                style={{ flex: 1, paddingVertical: 8, alignItems: "center", backgroundColor: periode === p ? colors.primary : colors.border, borderRadius: 8 }}
                onPress={() => setPeriode(p)}
              >
                <Text style={{ color: periode === p ? "#fff" : colors.text, fontWeight: "700", fontSize: 13 }}>
                  {p === "mensuel" ? t("simulateur.its.monthly") : t("simulateur.its.annual")}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Salaire brut */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {periode === "mensuel" ? t("simulateur.its.grossSalaryMonthly") : t("simulateur.its.grossSalaryAnnual")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, borderRadius: 8, borderWidth: 2, borderColor: colors.primary, height: 48 }}>
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

          {/* References */}
          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.its.legalRef")}
          </Text>
        </ScrollView>

        {/* Colonne droite 50% - Resultats */}
        <ScrollView style={{ width: "50%", borderLeftWidth: 1, borderLeftColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              {/* Section CALCUL MENSUEL */}
              <SectionHeader label={t("simulateur.its.monthlyCalc")} colors={colors} />
              <TableRow label={t("simulateur.its.grossMonthly")} value={formatNumber(result.revenuBrutAnnuel / 12)} bold />
              <TableRow label={t("simulateur.its.cnssMonthly")} value={`- ${formatNumber(result.retenueCnssMensuelle)}`} bg={colors.background} color="#b91c1c" />
              <TableRow label={t("simulateur.its.netTaxableMonthly")} value={formatNumber(Math.round(result.revenuNetImposable / 12))} />

              {/* Section CALCUL ANNUEL */}
              <SectionHeader label={t("simulateur.its.annualCalc")} colors={colors} />
              <TableRow label={t("simulateur.its.grossAnnual")} value={formatNumber(result.revenuBrutAnnuel)} />
              <TableRow label={t("simulateur.its.cnssAnnual")} value={`- ${formatNumber(result.retenueCnss)}`} bg={colors.background} color="#b91c1c" />
              <TableRow label={t("simulateur.its.netAnnual")} value={formatNumber(result.revenuBrutAnnuel - result.retenueCnss)} />
              <TableRow label={t("simulateur.its.netTaxableAnnual")} value={formatNumber(result.revenuNetImposable)} bg={colors.background} bold />

              {/* Quotient familial */}
              <View style={{ backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>{t("simulateur.its.familyQuotientCalc")}</Text>
                    <Text style={{ fontSize: 10, color: colors.textSecondary }}>{t("simulateur.its.netTaxableDivided")} {nombreParts} {t("common.parts")}</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: colors.text }}>{formatNumber(result.revenuParPart)}</Text>
                </View>
              </View>

              {/* Section IMPOT A PAYER */}
              <SectionHeader label={t("simulateur.its.taxToPay")} colors={colors} />
              <TableRow label={t("simulateur.its.itsAnnual")} value={formatNumber(result.itsAnnuel)} />
              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.its.itsMonthly")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.itsMensuel)}</Text>
                </View>
              </View>

              {/* Repartition 35/65 */}
              <TableRow label={t("simulateur.its.employeeShare")} value={formatNumber(Math.round(result.itsMensuel * 0.35))} bg={colors.background} />
              <TableRow label={t("simulateur.its.employerShare")} value={formatNumber(Math.round(result.itsMensuel * 0.65))} />

              {/* Salaire net */}
              <View style={{ backgroundColor: colors.citationsBg, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#166534" }}>{t("simulateur.its.netSalaryMonthly")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#166534" }}>{formatNumber(Math.round(result.salaireNetMensuel))}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.its.enterSalary")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function SectionHeader({ label, colors }: { label: string; colors: any }) {
  return (
    <View style={{ backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 8 }}>
      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.text }}>{label}</Text>
    </View>
  );
}
