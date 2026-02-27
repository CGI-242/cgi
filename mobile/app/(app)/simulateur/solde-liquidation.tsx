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
  calculerSoldeLiquidation,
  type SoldeLiquidationInput,
  type TypeContribuable,
} from "@/lib/services/solde-liquidation.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";

export default function SoldeLiquidationScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const [resultatFiscal, setResultatFiscal] = useState("");
  const [typeContribuable, setTypeContribuable] = useState<TypeContribuable>("general");
  const [acompte1, setAcompte1] = useState("");
  const [acompte2, setAcompte2] = useState("");
  const [acompte3, setAcompte3] = useState("");
  const [acompte4, setAcompte4] = useState("");

  const TAXPAYER_TYPES: { value: TypeContribuable; label: string; taux: string }[] = [
    { value: "general", label: t("simulateur.solde.general"), taux: "28%" },
    { value: "microfinance", label: t("simulateur.solde.microfinance"), taux: "25%" },
    { value: "mines", label: t("simulateur.solde.mining"), taux: "28%" },
    { value: "etranger", label: t("simulateur.solde.foreign"), taux: "35%" },
  ];

  const result = useMemo(() => {
    const input: SoldeLiquidationInput = {
      resultatFiscal: parseFloat(resultatFiscal.replace(/\s/g, "")) || 0,
      typeContribuable,
      acompte1: parseFloat(acompte1.replace(/\s/g, "")) || 0,
      acompte2: parseFloat(acompte2.replace(/\s/g, "")) || 0,
      acompte3: parseFloat(acompte3.replace(/\s/g, "")) || 0,
      acompte4: parseFloat(acompte4.replace(/\s/g, "")) || 0,
    };
    if (input.resultatFiscal === 0) return null;
    return calculerSoldeLiquidation(input);
  }, [resultatFiscal, typeContribuable, acompte1, acompte2, acompte3, acompte4]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Layout 50/50 */}
      <View style={{ flex: 1, flexDirection: "row" }}>
        {/* Colonne gauche - Formulaire */}
        <ScrollView style={{ width: "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          {/* Info */}
          <View style={{ padding: 12, backgroundColor: colors.card, borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.solde.description")}
            </Text>
          </View>

          {/* Resultat fiscal */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.solde.taxableResult")}
          </Text>
          <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, borderRadius: 8, borderWidth: 2, borderColor: colors.primary, height: 48, marginBottom: 12 }}>
            <TextInput
              style={{ flex: 1, fontSize: 16, fontWeight: "700", color: colors.text }}
              value={resultatFiscal}
              onChangeText={(v) => setResultatFiscal(formatInputNumber(v))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textMuted}
            />
            <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "600" }}>FCFA</Text>
          </View>

          {/* Type contribuable */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.solde.taxpayerType")}
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {TAXPAYER_TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={{
                  width: "48%",
                  paddingVertical: 8,
                  alignItems: "center",
                  backgroundColor: typeContribuable === tp.value ? colors.primary : colors.border,
                  borderRadius: 6,
                }}
                onPress={() => setTypeContribuable(tp.value)}
              >
                <Text style={{ color: typeContribuable === tp.value ? "#fff" : colors.text, fontSize: 12, fontWeight: "600" }}>
                  {tp.label} ({tp.taux})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Acomptes */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.solde.instalmentsPaid")}
          </Text>
          <NumberField label={t("simulateur.solde.q1")} value={acompte1} onChange={setAcompte1} colors={colors} />
          <NumberField label={t("simulateur.solde.q2")} value={acompte2} onChange={setAcompte2} colors={colors} />
          <NumberField label={t("simulateur.solde.q3")} value={acompte3} onChange={setAcompte3} colors={colors} />
          <NumberField label={t("simulateur.solde.q4")} value={acompte4} onChange={setAcompte4} colors={colors} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 4 }}>
            {t("simulateur.solde.legalRef")}
          </Text>
        </ScrollView>

        {/* Colonne droite - Resultats */}
        <ScrollView style={{ width: "50%", borderLeftWidth: 1, borderLeftColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              {/* IS calcule */}
              <SectionHeader label={t("simulateur.solde.isCalculated")} colors={colors} />
              <TableRow label={t("simulateur.solde.fiscalResult")} value={formatNumber(result.resultatFiscal)} />
              <TableRow label={t("simulateur.solde.roundedProfit")} value={formatNumber(result.beneficeArrondi)} bg={colors.background} />
              <TableRow label={`${t("simulateur.solde.isRate")} (${result.tauxIS}%)`} value={`${result.tauxIS}%`} bg={colors.background} />
              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.solde.isToPay")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.isCalcule)}</Text>
                </View>
              </View>

              {/* Detail acomptes */}
              <SectionHeader label={t("simulateur.solde.instalmentsPaidTitle")} colors={colors} />
              {result.detailAcomptes.map((a) => (
                <TableRow key={a.label} label={a.label} value={a.montant > 0 ? formatNumber(a.montant) : "\u2014"} />
              ))}
              <View style={{ backgroundColor: `${colors.primary}10`, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.primary }}>{t("simulateur.solde.totalInstalments")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: colors.primary }}>{formatNumber(result.totalAcomptes)}</Text>
                </View>
              </View>

              {/* Solde */}
              <SectionHeader label={t("simulateur.solde.settlementBalance")} colors={colors} />
              <TableRow label={t("simulateur.solde.isMinusInstalments")} value={`${formatNumber(result.isCalcule)} - ${formatNumber(result.totalAcomptes)}`} bg={colors.background} />

              {result.creditImpot ? (
                <View style={{ backgroundColor: colors.citationsBg, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#059669" }}>{t("simulateur.solde.taxCredit")}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#059669" }}>{formatNumber(Math.abs(result.solde))}</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>
                    {t("simulateur.solde.taxCreditNote")}
                  </Text>
                </View>
              ) : (
                <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.solde.balanceToPay")}</Text>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.solde)}</Text>
                  </View>
                  <Text style={{ fontSize: 10, color: colors.textSecondary, marginTop: 4 }}>
                    {t("simulateur.solde.balanceNote")}
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.solde.enterResult")}
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

function NumberField({
  label,
  value,
  onChange,
  colors,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  colors: any;
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 3 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, borderRadius: 6, height: 40, borderWidth: 1, borderColor: colors.border }}>
        <TextInput
          style={{ flex: 1, fontSize: 14, fontWeight: "600", color: colors.text }}
          value={value}
          onChangeText={(v) => onChange(formatInputNumber(v))}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor={colors.textMuted}
        />
        <Text style={{ fontSize: 10, color: colors.textMuted }}>FCFA</Text>
      </View>
    </View>
  );
}
