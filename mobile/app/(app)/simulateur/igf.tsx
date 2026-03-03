import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerIGF, type TypeActiviteIGF } from "@/lib/services/igf.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";

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
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.igf.description")}
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.igf.activityType")}
          </Text>
          <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
            {TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={{ flex: 1, paddingVertical: 8, alignItems: "center", backgroundColor: typeActivite === tp.value ? colors.primary : colors.border }}
                onPress={() => setTypeActivite(tp.value)}
              >
                <Text style={{ color: typeActivite === tp.value ? "#fff" : colors.text, fontWeight: "700", fontSize: 11 }}>{tp.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <NumberField label={t("simulateur.igf.turnover")} value={chiffreAffaires} onChange={setChiffreAffaires} colors={colors} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.igf.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.igf.bracketDetail")} colors={colors} />
              {result.tranches.map((tr, i) => (
                <TableRow key={i} label={`${tr.tranche} (${tr.taux}%)`} value={formatNumber(tr.montant)} bg={i % 2 === 0 ? colors.card : colors.background} />
              ))}

              <SimulateurSection label={t("simulateur.igf.resultSection")} colors={colors} />
              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.igf.annualIGF")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.igfAnnuel)}</Text>
                </View>
              </View>

              <View style={{ backgroundColor: `${colors.primary}10`, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>{t("simulateur.igf.quarterlyIGF")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: colors.primary }}>{formatNumber(result.igfTrimestriel)}</Text>
                </View>
              </View>

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: colors.card }}>
                <Text style={{ fontSize: 10, color: colors.textSecondary }}>
                  {t("simulateur.igf.paymentNote")}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.igf.enterTurnover")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
