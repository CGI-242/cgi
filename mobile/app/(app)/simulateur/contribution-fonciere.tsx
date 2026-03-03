import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerContributionFonciere, type TypePropriete, type ZoneUrbaine, type CultureRurale } from "@/lib/services/contribution-fonciere.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";

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

    return calculerContributionFonciere({
      typePropriete,
      valeurLocative: vl,
      tauxCommunal: tc,
      surfaceM2: sm,
      zoneUrbaine,
      surfaceHa: sh,
      cultureRurale,
    });
  }, [typePropriete, valeurLocative, surfaceM2, surfaceHa, tauxCommunal, zoneUrbaine, cultureRurale]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.foncier.description")}
            </Text>
          </View>

          {/* Type de propriété */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.foncier.typeLabel")}
          </Text>
          <View style={{ gap: 4, marginBottom: 12 }}>
            {TYPES.map((tp) => (
              <TouchableOpacity
                key={tp.value}
                style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: typePropriete === tp.value ? colors.primary : colors.border }}
                onPress={() => setTypePropriete(tp.value)}
              >
                <Text style={{ color: typePropriete === tp.value ? "#fff" : colors.text, fontWeight: "600", fontSize: 12 }}>{tp.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Inputs selon type */}
          {typePropriete === "bati" && (
            <NumberField label={t("simulateur.foncier.rentalValue")} value={valeurLocative} onChange={setValeurLocative} colors={colors} />
          )}

          {typePropriete === "nonBatiUrbain" && (
            <>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
                {t("simulateur.foncier.zoneLabel")}
              </Text>
              <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                {ZONES.map((z) => (
                  <TouchableOpacity
                    key={z.value}
                    style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: zoneUrbaine === z.value ? colors.primary : colors.border }}
                    onPress={() => setZoneUrbaine(z.value)}
                  >
                    <Text style={{ color: zoneUrbaine === z.value ? "#fff" : colors.text, fontWeight: "600", fontSize: 11 }}>{z.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <NumberField label={t("simulateur.foncier.surfaceM2")} value={surfaceM2} onChange={setSurfaceM2} colors={colors} />
            </>
          )}

          {typePropriete === "nonBatiRural" && (
            <>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
                {t("simulateur.foncier.cultureLabel")}
              </Text>
              <View style={{ gap: 4, marginBottom: 12 }}>
                {CULTURES.map((c) => (
                  <TouchableOpacity
                    key={c.value}
                    style={{ paddingVertical: 6, paddingHorizontal: 10, backgroundColor: cultureRurale === c.value ? colors.primary : colors.border }}
                    onPress={() => setCultureRurale(c.value)}
                  >
                    <Text style={{ color: cultureRurale === c.value ? "#fff" : colors.text, fontWeight: "600", fontSize: 11 }}>{c.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <NumberField label={t("simulateur.foncier.surfaceHa")} value={surfaceHa} onChange={setSurfaceHa} colors={colors} />
            </>
          )}

          {/* Taux communal */}
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
                    <Text style={{ color: tauxCommunal === String(v) ? "#fff" : colors.text, fontWeight: "600", fontSize: 11 }}>{v}%</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.foncier.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.foncier.calcSection")} colors={colors} />
              <TableRow label={t("simulateur.foncier.grossBase")} value={formatNumber(result.basebrute)} bold />
              {result.tauxAbattement > 0 && (
                <TableRow label={`${t("simulateur.foncier.deduction")} (${result.tauxAbattement}%)`} value={`- ${formatNumber(result.abattement)}`} bg={colors.background} color="#b91c1c" />
              )}
              <TableRow label={t("simulateur.foncier.netBase")} value={formatNumber(result.baseNette)} bold />
              <TableRow label={`${t("simulateur.foncier.communalRate")} (max ${result.tauxMax}%)`} value={`${result.tauxCommunal}%`} bg={colors.background} />

              <SimulateurSection label={t("simulateur.foncier.resultSection")} colors={colors} />
              {result.impot > 0 ? (
                <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>
                      {typePropriete === "bati" ? "CFPB" : "CFPNB"}
                    </Text>
                    <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.impot)}</Text>
                  </View>
                </View>
              ) : (
                <View style={{ backgroundColor: colors.citationsBg, paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#166534" }}>
                    {t("simulateur.foncier.underMinimum")}
                  </Text>
                </View>
              )}

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: `${colors.primary}10` }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>
                  {result.articleRef}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.foncier.enterData")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
