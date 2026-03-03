import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerIRFLoyers, type TypeLocataire } from "@/lib/services/irf-loyers.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";

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
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.irfLoyers.description")}
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.irfLoyers.tenantType")}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={{ flex: 1, paddingVertical: 8, alignItems: "center", backgroundColor: typeLocataire === tp.value ? colors.primary : colors.border }}
                onPress={() => setTypeLocataire(tp.value)}
              >
                <Text style={{ color: typeLocataire === tp.value ? "#fff" : colors.text, fontWeight: "700", fontSize: 12 }}>{tp.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <NumberField label={t("simulateur.irfLoyers.annualRent")} value={loyersBruts} onChange={setLoyersBruts} colors={colors} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.irfLoyers.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.irfLoyers.calcSection")} colors={colors} />
              <TableRow label={t("simulateur.irfLoyers.annualRent")} value={formatNumber(result.loyersBrutsAnnuels)} bold />
              <TableRow label={t("simulateur.irfLoyers.monthlyRent")} value={formatNumber(result.loyersBrutsMensuels)} bg={colors.background} />
              <TableRow label={t("simulateur.irfLoyers.rateApplied")} value={`${result.taux}%`} />

              <SimulateurSection label={t("simulateur.irfLoyers.taxSection")} colors={colors} />
              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.irfLoyers.annualTax")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.impotAnnuel)}</Text>
                </View>
              </View>
              <TableRow label={t("simulateur.irfLoyers.monthlyTax")} value={formatNumber(result.impotMensuel)} />

              <SimulateurSection label={t("simulateur.irfLoyers.netSection")} colors={colors} />
              <View style={{ backgroundColor: colors.citationsBg, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#166534" }}>{t("simulateur.irfLoyers.netAnnual")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#166534" }}>{formatNumber(result.netAnnuel)}</Text>
                </View>
              </View>
              <TableRow label={t("simulateur.irfLoyers.netMonthly")} value={formatNumber(result.netMensuel)} bg={colors.background} />

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: `${colors.primary}10` }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>{t("simulateur.irfLoyers.deadline")}: {result.echeance}</Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.irfLoyers.enterRent")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
