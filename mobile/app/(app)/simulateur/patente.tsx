import { useState, useMemo } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerPatente, type PatenteInput } from "@/lib/services/patente.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import OptionButtonGroup from "@/components/simulateur/OptionButtonGroup";
import SimulateurEmptyState from "@/components/simulateur/SimulateurEmptyState";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";

export default function PatenteScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [chiffreAffaires, setChiffreAffaires] = useState("");
  const [regime, setRegime] = useState<PatenteInput["regime"]>("reel");
  const [isStandBy, setIsStandBy] = useState(false);
  const [dernierePatente, setDernierePatente] = useState("");
  const [isNouvelle, setIsNouvelle] = useState(false);
  const [nombreEntites, setNombreEntites] = useState(1);

  const REGIMES: { value: PatenteInput["regime"]; label: string }[] = [
    { value: "reel", label: t("simulateur.patente.real") },
    { value: "forfait", label: t("simulateur.patente.flat") },
    { value: "tpe", label: t("simulateur.patente.tpe") },
    { value: "pe", label: t("simulateur.patente.pe") },
  ];

  const result = useMemo(() => {
    return calculerPatente({
      chiffreAffaires: parseFloat(chiffreAffaires.replace(/\s/g, "")) || 0,
      regime,
      isEntrepriseNouvelle: isNouvelle,
      isStandBy,
      dernierePatente: parseFloat(dernierePatente.replace(/\s/g, "")) || 0,
      nombreEntitesFiscales: nombreEntites,
    });
  }, [chiffreAffaires, regime, isStandBy, dernierePatente, isNouvelle, nombreEntites]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.patente.title")}
          </Text>

          <View style={{ padding: 12, backgroundColor: colors.card, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: colors.text }}>{t("simulateur.patente.description")}</Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>{t("simulateur.patente.taxRegime")}</Text>
          <OptionButtonGroup options={REGIMES} selected={regime} onChange={setRegime} fontSize={11} />

          <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: colors.card, marginBottom: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>{t("simulateur.patente.standby")}</Text>
              <Text style={{ fontSize: 10, color: colors.textSecondary }}>{t("simulateur.patente.standbyDesc")}</Text>
            </View>
            <Switch value={isStandBy} onValueChange={setIsStandBy} trackColor={{ false: colors.disabled, true: `${colors.primary}80` }} thumbColor={isStandBy ? colors.primary : colors.textMuted} />
          </View>
          {isStandBy && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 3 }}>{t("simulateur.patente.lastPatente")}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, height: 40, borderWidth: 1, borderColor: colors.border }}>
                <TextInput style={{ flex: 1, fontSize: 14, fontWeight: "600", color: colors.text }} value={dernierePatente} onChangeText={(v) => setDernierePatente(formatInputNumber(v))} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} />
                <Text style={{ fontSize: 10, color: colors.textMuted }}>FCFA</Text>
              </View>
            </View>
          )}

          {!isStandBy && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>{t("simulateur.patente.turnover")}</Text>
              <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, borderWidth: 2, borderColor: colors.primary, height: 48 }}>
                <TextInput style={{ flex: 1, fontSize: 16, fontWeight: "700", color: colors.text }} value={chiffreAffaires} onChangeText={(v) => setChiffreAffaires(formatInputNumber(v))} keyboardType="numeric" placeholder="0" placeholderTextColor={colors.textMuted} />
                <Text style={{ fontSize: 12, color: colors.textSecondary, fontWeight: "600" }}>FCFA</Text>
              </View>
            </View>
          )}

          <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: colors.card, marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: colors.text, flex: 1 }}>{t("simulateur.patente.newCompany")}</Text>
            <Switch value={isNouvelle} onValueChange={setIsNouvelle} trackColor={{ false: colors.disabled, true: `${colors.primary}80` }} thumbColor={isNouvelle ? colors.primary : colors.textMuted} />
          </View>
          <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: colors.card, marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: colors.text, flex: 1 }}>{t("simulateur.patente.fiscalEntities")}</Text>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center", backgroundColor: colors.border }} onPress={() => setNombreEntites(Math.max(1, nombreEntites - 1))}>
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text }}>-</Text>
              </TouchableOpacity>
              <Text style={{ minWidth: 24, textAlign: "center", fontSize: 14, fontWeight: "700", color: colors.text }}>{nombreEntites}</Text>
              <TouchableOpacity style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center", backgroundColor: colors.border }} onPress={() => setNombreEntites(nombreEntites + 1)}>
                <Text style={{ fontSize: 15, fontWeight: "700", color: colors.text }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ fontSize: 10, color: colors.textMuted }}>{t("simulateur.patente.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result && result.patenteNette > 0 ? (
            <View>
              {result.tranches.length > 0 && (
                <>
                  <SimulateurSection label={t("simulateur.patente.trancheDetail")} />
                  {result.tranches.map((tr, i) => (
                    <View key={tr.tranche} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: i % 2 === 0 ? colors.card : colors.background, paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
                      <Text style={{ fontSize: 11, color: colors.textSecondary, flex: 1 }}>{tr.tranche}</Text>
                      <Text style={{ fontSize: 10, fontWeight: "600", color: colors.primary, marginHorizontal: 6 }}>{tr.taux.toFixed(3)}%</Text>
                      <Text style={{ fontSize: 11, fontWeight: "600", color: colors.text, width: 80, textAlign: "right" }}>{formatNumber(Math.round(tr.montant))}</Text>
                    </View>
                  ))}
                  <View style={{ backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                      <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>{t("simulateur.patente.grossPatente")}</Text>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: colors.text }}>{formatNumber(Math.round(result.patenteBrute))}</Text>
                    </View>
                  </View>
                </>
              )}

              <SimulateurSection label={t("simulateur.patente.reductions")} />
              {result.reductionStandBy > 0 && (
                <TableRow label={t("simulateur.patente.standbyReduction")} value={`- ${formatNumber(Math.round(result.reductionStandBy))}`} color={colors.danger} />
              )}
              <TableRow label={t("simulateur.patente.halfReduction")} value={`- ${formatNumber(Math.round(result.reduction50Pourcent))}`} bg={colors.background} color={colors.danger} />

              <View style={{ backgroundColor: `${colors.primary}10`, paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: colors.primary }}>{t("simulateur.patente.netPatente")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: colors.primary }}>{formatNumber(result.patenteNette)}</Text>
                </View>
              </View>

              {result.nombreEntites > 1 && (
                <TableRow label={`${t("common.perEntity")} (${result.nombreEntites})`} value={formatNumber(result.patenteParEntite)} bg={colors.background} bold />
              )}

              <View style={{ backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="calendar-outline" size={14} color={colors.text} />
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginLeft: 6 }}>{t("common.deadline")} : {result.dateEcheance}</Text>
                </View>
              </View>

              <View style={{ backgroundColor: colors.background, paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
                {result.references.map((ref) => (
                  <Text key={ref} style={{ fontSize: 10, color: colors.textMuted }}>{ref}</Text>
                ))}
              </View>
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.enterDataToSee")} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
