import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerTVA, type TypeOperation } from "@/lib/services/tva.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";

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
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.tva.description")}
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.tva.operationType")}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={{ flex: 1, paddingVertical: 8, alignItems: "center", backgroundColor: typeOperation === tp.value ? colors.primary : colors.border }}
                onPress={() => setTypeOperation(tp.value)}
              >
                <Text style={{ color: typeOperation === tp.value ? "#fff" : colors.text, fontWeight: "700", fontSize: 11 }}>{tp.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <NumberField label={t("simulateur.tva.revenueHT")} value={caHT} onChange={setCaHT} colors={colors} />
          <NumberField label={t("simulateur.tva.purchasesHT")} value={achatsHT} onChange={setAchatsHT} colors={colors} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.tva.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.tva.collectedSection")} colors={colors} />
              <TableRow label={t("simulateur.tva.revenueHT")} value={formatNumber(result.caHT)} bold />
              <TableRow label={t("simulateur.tva.ttcAmount")} value={formatNumber(result.montantTTC)} bg={colors.background} />
              <TableRow label={`${t("simulateur.tva.collectedVAT")} (${result.taux}%)`} value={formatNumber(result.tvaCollectee)} />

              <SimulateurSection label={t("simulateur.tva.deductibleSection")} colors={colors} />
              <TableRow label={t("simulateur.tva.purchasesHT")} value={formatNumber(result.achatsHT)} />
              <TableRow label={`${t("simulateur.tva.deductibleVAT")} (${result.taux}%)`} value={`- ${formatNumber(result.tvaDeductible)}`} bg={colors.background} color="#b91c1c" />

              <SimulateurSection label={t("simulateur.tva.balanceSection")} colors={colors} />
              {result.tvaDue > 0 ? (
                <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.tva.vatDue")}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.tvaDue)}</Text>
                  </View>
                </View>
              ) : (
                <View style={{ backgroundColor: colors.citationsBg, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#166534" }}>{t("simulateur.tva.vatCredit")}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#166534" }}>{formatNumber(result.creditTva)}</Text>
                  </View>
                </View>
              )}

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: `${colors.primary}10` }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>
                  {t("simulateur.tva.deadlineNote")}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.tva.enterRevenue")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
