import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerIS, type IsInput } from "@/lib/services/is.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function IsScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [produitsExploitation, setProduitsExploitation] = useState("");
  const [produitsFinanciers, setProduitsFinanciers] = useState("");
  const [produitsHAO, setProduitsHAO] = useState("");
  const [retenuesLiberatoires, setRetenuesLiberatoires] = useState("");
  const [deficitConsecutif, setDeficitConsecutif] = useState(false);

  const result = useMemo(() => {
    const input: IsInput = {
      produitsExploitation: parseFloat(produitsExploitation.replace(/\s/g, "")) || 0,
      produitsFinanciers: parseFloat(produitsFinanciers.replace(/\s/g, "")) || 0,
      produitsHAO: parseFloat(produitsHAO.replace(/\s/g, "")) || 0,
      retenuesLiberatoires: parseFloat(retenuesLiberatoires.replace(/\s/g, "")) || 0,
      deficitConsecutif,
    };
    if (input.produitsExploitation === 0) return null;
    return calculerIS(input);
  }, [
    produitsExploitation,
    produitsFinanciers,
    produitsHAO,
    retenuesLiberatoires,
    deficitConsecutif,
  ]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Layout 50/50 */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Colonne gauche - Formulaire */}
        <ScrollView style={{ width: "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          {/* Info */}
          <View style={{ padding: 12, backgroundColor: colors.card, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.is.description")}
            </Text>
          </View>

          {/* Base minimum de perception */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.is.baseCalc")}
          </Text>
          <NumberField label={t("simulateur.is.exploitation")} value={produitsExploitation} onChange={setProduitsExploitation} colors={colors} />
          <NumberField label={t("simulateur.is.financial")} value={produitsFinanciers} onChange={setProduitsFinanciers} colors={colors} />
          <NumberField label={t("simulateur.is.hao")} value={produitsHAO} onChange={setProduitsHAO} colors={colors} />
          <NumberField label={t("simulateur.is.withholdings")} value={retenuesLiberatoires} onChange={setRetenuesLiberatoires} colors={colors} />

          {/* Deficit */}
          <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: colors.card, marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>{t("simulateur.is.deficit")}</Text>
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>{t("simulateur.is.deficitDesc")}</Text>
            </View>
            <Switch
              value={deficitConsecutif}
              onValueChange={setDeficitConsecutif}
              trackColor={{ false: colors.disabled, true: `${colors.primary}80` }}
              thumbColor={deficitConsecutif ? colors.primary : colors.textMuted}
            />
          </View>

          <Text style={{ fontSize: 10, color: colors.textMuted }}>
            {t("simulateur.is.legalRef")}
          </Text>
        </ScrollView>

        {/* Colonne droite - Resultats */}
        <ScrollView style={{ width: "50%", borderLeftWidth: 1, borderLeftColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              {/* Minimum de perception */}
              <SimulateurSection label={t("simulateur.is.minPerception")} colors={colors} />
              <TableRow label={t("simulateur.is.base")} value={formatNumber(result.baseMinimumPerception)} />
              <TableRow label={t("simulateur.is.rateApplied")} value={`${result.tauxMinimum}%`} bg={colors.background} />
              <View style={{ backgroundColor: `${colors.primary}10`, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>{t("simulateur.is.annualMin")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: colors.primary }}>{formatNumber(result.minimumPerceptionAnnuel)}</Text>
                </View>
              </View>

              {/* 4 acomptes */}
              <SimulateurSection label={t("simulateur.is.quarterlyInstalments")} colors={colors} />
              {result.acomptes.map((a) => (
                <TableRow key={a.label} label={a.label} value={formatNumber(a.montant)} />
              ))}

              {/* Total */}
              <View style={{ backgroundColor: "#eff6ff", paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#1e40af" }}>{t("simulateur.is.totalToPay")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#1e40af" }}>{formatNumber(result.minimumPerceptionAnnuel)}</Text>
                </View>
                <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>
                  {t("simulateur.is.imputNote")}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.is.enterProducts")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
