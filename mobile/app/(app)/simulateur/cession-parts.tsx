import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerCessionParts, type TypeCession } from "@/lib/services/cession-parts.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";

export default function CessionPartsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [prixCession, setPrixCession] = useState("");
  const [typeCession, setTypeCession] = useState<TypeCession>("actionsStandard");
  const [contratPetrolier, setContratPetrolier] = useState(false);

  const TYPES: { value: TypeCession; label: string }[] = [
    { value: "actionsStandard", label: t("simulateur.cessionParts.standard") },
    { value: "participations", label: t("simulateur.cessionParts.participations") },
    { value: "changementControle", label: t("simulateur.cessionParts.controlChange") },
  ];

  const result = useMemo(() => {
    const montant = parseFloat(prixCession.replace(/\s/g, "")) || 0;
    if (montant <= 0) return null;
    return calculerCessionParts({ prixCession: montant, typeCession, contratPetrolier });
  }, [prixCession, typeCession, contratPetrolier]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.cessionParts.description")}
            </Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.cessionParts.typeLabel")}
          </Text>
          <View style={{ gap: 4, marginBottom: 12 }}>
            {TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: typeCession === tp.value ? colors.primary : colors.border }}
                onPress={() => setTypeCession(tp.value)}
              >
                <Text style={{ color: typeCession === tp.value ? "#fff" : colors.text, fontWeight: "600", fontSize: 12 }}>{tp.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <NumberField label={t("simulateur.cessionParts.amount")} value={prixCession} onChange={setPrixCession} colors={colors} />

          {typeCession === "participations" && (
            <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: colors.card, marginBottom: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>{t("simulateur.cessionParts.petroleum")}</Text>
                <Text style={{ fontSize: 10, color: colors.textSecondary }}>{t("simulateur.cessionParts.petroleumDesc")}</Text>
              </View>
              <Switch
                value={contratPetrolier}
                onValueChange={setContratPetrolier}
                trackColor={{ false: colors.disabled, true: `${colors.primary}80` }}
                thumbColor={contratPetrolier ? colors.primary : colors.textMuted}
              />
            </View>
          )}

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.cessionParts.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.cessionParts.calcSection")} colors={colors} />
              <TableRow label={t("simulateur.cessionParts.amount")} value={formatNumber(result.prixCession)} bold />
              <TableRow label={`${t("simulateur.cessionParts.rate")} (${result.articleRef})`} value={`${result.taux}%`} bg={colors.background} />

              <SimulateurSection label={t("simulateur.cessionParts.detailSection")} colors={colors} />
              <TableRow label={t("simulateur.cessionParts.duties")} value={formatNumber(result.droits)} bold />
              {result.minimumApplique && (
                <TableRow label={t("simulateur.cessionParts.minimumApplied")} value="1 000 000 FCFA" bg={colors.background} color={colors.primary} />
              )}
              <TableRow label={t("simulateur.cessionParts.additionalCents")} value={`+ ${formatNumber(result.centimesAdditionnels)}`} bg={colors.background} />

              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.cessionParts.totalDue")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.total)}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.cessionParts.enterAmount")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
