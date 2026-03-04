import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { calculerContributionFonciere, type TypePropriete, type ZoneUrbaine, type CultureRurale } from "@/lib/services/contribution-fonciere.service";
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

export default function ContributionFonciereScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [typePropriete, setTypePropriete] = useState<TypePropriete>("bati");
  const [valeurLocative, setValeurLocative] = useState("");
  const [surfaceM2, setSurfaceM2] = useState("");
  const [surfaceHa, setSurfaceHa] = useState("");
  const [tauxCommunal, setTauxCommunal] = useState("15");
  const [zoneUrbaine, setZoneUrbaine] = useState<ZoneUrbaine>("zone1");
  const [cultureRurale, setCultureRurale] = useState<CultureRurale>("autres_cultures");

  const TYPES: { value: TypePropriete; label: string }[] = [
    { value: "bati", label: t("simulateur.foncier.bati") },
    { value: "nonBatiUrbain", label: t("simulateur.foncier.nonBatiUrbain") },
    { value: "nonBatiRural", label: t("simulateur.foncier.nonBatiRural") },
  ];

  const ZONES: { value: ZoneUrbaine; label: string }[] = [
    { value: "zone1", label: t("simulateur.foncier.zone1") },
    { value: "zone2", label: t("simulateur.foncier.zone2") },
    { value: "zone3", label: t("simulateur.foncier.zone3") },
    { value: "zone4", label: t("simulateur.foncier.zone4") },
  ];

  const CULTURES: { value: CultureRurale; label: string }[] = [
    { value: "cafe_palmier", label: t("simulateur.foncier.cafePalmier") },
    { value: "forestier", label: t("simulateur.foncier.forestier") },
    { value: "autres_cultures", label: t("simulateur.foncier.autresCultures") },
    { value: "elevage", label: t("simulateur.foncier.elevage") },
    { value: "non_mis_valeur", label: t("simulateur.foncier.nonMisValeur") },
  ];

  const result = useMemo(() => {
    const vl = parseFloat(valeurLocative.replace(/\s/g, "")) || 0;
    const sm = parseFloat(surfaceM2.replace(/\s/g, "")) || 0;
    const sh = parseFloat(surfaceHa.replace(/\s/g, "")) || 0;
    const tc = parseFloat(tauxCommunal.replace(/\s/g, "")) || 0;

    if (typePropriete === "bati" && vl <= 0) return null;
    if (typePropriete === "nonBatiUrbain" && sm <= 0) return null;
    if (typePropriete === "nonBatiRural" && sh <= 0) return null;
    if (tc <= 0) return null;

    return calculerContributionFonciere({ typePropriete, valeurLocative: vl, tauxCommunal: tc, surfaceM2: sm, zoneUrbaine, surfaceHa: sh, cultureRurale });
  }, [typePropriete, valeurLocative, surfaceM2, surfaceHa, tauxCommunal, zoneUrbaine, cultureRurale]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.foncier.title")}
          </Text>

          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>{t("simulateur.foncier.description")}</Text>
          </View>

          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.foncier.typeLabel")}
          </Text>
          <OptionButtonGroup options={TYPES} selected={typePropriete} onChange={setTypePropriete} direction="column" fontSize={12} />

          {typePropriete === "bati" && (
            <NumberField label={t("simulateur.foncier.rentalValue")} value={valeurLocative} onChange={setValeurLocative} />
          )}

          {typePropriete === "nonBatiUrbain" && (
            <>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
                {t("simulateur.foncier.zoneLabel")}
              </Text>
              <OptionButtonGroup options={ZONES} selected={zoneUrbaine} onChange={setZoneUrbaine} fontSize={11} />
              <NumberField label={t("simulateur.foncier.surfaceM2")} value={surfaceM2} onChange={setSurfaceM2} />
            </>
          )}

          {typePropriete === "nonBatiRural" && (
            <>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
                {t("simulateur.foncier.cultureLabel")}
              </Text>
              <OptionButtonGroup options={CULTURES} selected={cultureRurale} onChange={setCultureRurale} direction="column" fontSize={11} />
              <NumberField label={t("simulateur.foncier.surfaceHa")} value={surfaceHa} onChange={setSurfaceHa} />
            </>
          )}

          <View style={{ marginBottom: 8 }}>
            <Text style={{ fontSize: 11, color: colors.textSecondary, marginBottom: 3 }}>
              {t("simulateur.foncier.communalRate")} (max {typePropriete === "bati" ? "20" : "40"}%)
            </Text>
            <View style={{ flexDirection: "row", alignItems: "center", backgroundColor: colors.card, paddingHorizontal: 12, height: 40, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
                {[5, 10, 15, 20, ...(typePropriete !== "bati" ? [30, 40] : [])].map((v) => (
                  <TouchableOpacity
                    key={v}
                    style={{ paddingVertical: 4, paddingHorizontal: 8, backgroundColor: tauxCommunal === String(v) ? colors.primary : "transparent" }}
                    onPress={() => setTauxCommunal(String(v))}
                  >
                    <Text style={{ color: tauxCommunal === String(v) ? colors.sidebarText : colors.text, fontWeight: "600", fontSize: 11 }}>{v}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>{t("simulateur.foncier.legalRef")}</Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.foncier.calcSection")} />
              <TableRow label={t("simulateur.foncier.grossBase")} value={formatNumber(result.basebrute)} bold />
              {result.tauxAbattement > 0 && (
                <TableRow label={`${t("simulateur.foncier.deduction")} (${result.tauxAbattement}%)`} value={`- ${formatNumber(result.abattement)}`} bg={colors.background} color={colors.danger} />
              )}
              <TableRow label={t("simulateur.foncier.netBase")} value={formatNumber(result.baseNette)} bold />
              <TableRow label={`${t("simulateur.foncier.communalRate")} (max ${result.tauxMax}%)`} value={`${result.tauxCommunal}%`} bg={colors.background} />

              <SimulateurSection label={t("simulateur.foncier.resultSection")} />
              {result.impot > 0 ? (
                <ResultHighlight label={typePropriete === "bati" ? "CFPB" : "CFPNB"} value={formatNumber(result.impot)} variant="danger" />
              ) : (
                <View style={{ backgroundColor: colors.citationsBg, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: colors.success }}>
                    {t("simulateur.foncier.underMinimum")}
                  </Text>
                </View>
              )}

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: `${colors.primary}10` }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>{result.articleRef}</Text>
              </View>
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.foncier.enterData")} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
