import { useState, useMemo, useCallback } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import {
  calculerPaie,
  calculerAvantagesForfaitaires,
  type ProfilSalarie,
  type ZoneTOL,
  type SituationFamiliale,
  type RubriquesInput,
} from "@/lib/services/paie.service";
import { calculateQuotient } from "@/lib/services/fiscal-common";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import OptionButtonGroup from "@/components/simulateur/OptionButtonGroup";
import ResultHighlight from "@/components/simulateur/ResultHighlight";
import SimulateurEmptyState from "@/components/simulateur/SimulateurEmptyState";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const RUBRIQUES_VIDES: RubriquesInput = {
  salaireBase: 0, primesImposables: 0, heuresSup: 0, congesAnnuels: 0,
  primeTransport: 0, primeRepresentation: 0, primePanier: 0, primeSalissure: 0,
  avLogement: 0, avDomesticite: 0, avElectricite: 0,
  avVoiture: 0, avTelephone: 0, avNourriture: 0,
};

function parseField(v: string): number {
  return parseInt(v.replace(/\s/g, ""), 10) || 0;
}

export default function PaieScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();

  // --- État saisie ---
  const [profil, setProfil] = useState<ProfilSalarie>("national");
  const [situation, setSituation] = useState<SituationFamiliale>("celibataire");
  const [enfants, setEnfants] = useState(0);
  const [zoneTOL, setZoneTOL] = useState<ZoneTOL>("peripherie");
  const [moisJanvier, setMoisJanvier] = useState(false);
  const [forfaitaire, setForfaitaire] = useState(false);

  // Champs textuels (formatés avec espaces)
  const [fields, setFields] = useState<Record<keyof RubriquesInput, string>>({
    salaireBase: "", primesImposables: "", heuresSup: "", congesAnnuels: "",
    primeTransport: "", primeRepresentation: "", primePanier: "", primeSalissure: "",
    avLogement: "", avDomesticite: "", avElectricite: "",
    avVoiture: "", avTelephone: "", avNourriture: "",
  });

  const setField = useCallback((key: keyof RubriquesInput, v: string) => {
    setFields((prev) => ({ ...prev, [key]: v }));
  }, []);

  // Salaire de présence (pour calcul forfaitaire)
  const salairePresence = useMemo(() => {
    return parseField(fields.salaireBase) + parseField(fields.primesImposables)
      + parseField(fields.heuresSup) + parseField(fields.congesAnnuels);
  }, [fields.salaireBase, fields.primesImposables, fields.heuresSup, fields.congesAnnuels]);

  // Application des avantages forfaitaires
  const handleToggleForfaitaire = useCallback((val: boolean) => {
    setForfaitaire(val);
    if (val && salairePresence > 0) {
      const av = calculerAvantagesForfaitaires(salairePresence);
      setFields((prev) => ({
        ...prev,
        avLogement: av.avLogement ? formatInputNumber(String(av.avLogement)) : "",
        avDomesticite: av.avDomesticite ? formatInputNumber(String(av.avDomesticite)) : "",
        avElectricite: av.avElectricite ? formatInputNumber(String(av.avElectricite)) : "",
        avVoiture: av.avVoiture ? formatInputNumber(String(av.avVoiture)) : "",
        avTelephone: av.avTelephone ? formatInputNumber(String(av.avTelephone)) : "",
        avNourriture: av.avNourriture ? formatInputNumber(String(av.avNourriture)) : "",
      }));
    }
  }, [salairePresence]);

  // Rubriques numériques
  const rubriques = useMemo<RubriquesInput>(() => {
    const r = { ...RUBRIQUES_VIDES };
    for (const key of Object.keys(r) as (keyof RubriquesInput)[]) {
      r[key] = parseField(fields[key]);
    }
    return r;
  }, [fields]);

  // Calcul brut imposable (hors primes exonérées Art. 114-A)
  const brutImposable = useMemo(() => {
    const sp = rubriques.salaireBase + rubriques.primesImposables + rubriques.heuresSup + rubriques.congesAnnuels;
    const av = rubriques.avLogement + rubriques.avDomesticite + rubriques.avElectricite
      + rubriques.avVoiture + rubriques.avTelephone + rubriques.avNourriture;
    return sp + av;
  }, [rubriques]);

  // Total des primes exonérées (Art. 114-A)
  const totalExonere = useMemo(() => {
    return rubriques.primeTransport + rubriques.primeRepresentation + rubriques.primePanier + rubriques.primeSalissure;
  }, [rubriques]);

  // Résultat
  const result = useMemo(() => {
    if (rubriques.salaireBase <= 0) return null;
    return calculerPaie({
      rubriques,
      profilSalarie: profil,
      situationFamiliale: situation,
      nombreEnfants: enfants,
      zoneTOL,
      moisJanvier,
    });
  }, [rubriques, profil, situation, enfants, zoneTOL, moisJanvier]);

  const isResident = profil !== "non_resident";

  // Nombre de parts calculé indépendamment du résultat
  const nombreParts = useMemo(() => {
    if (!isResident) return 1;
    return calculateQuotient(situation, enfants, true);
  }, [situation, enfants, isResident]);

  const PROFILS: { value: ProfilSalarie; label: string }[] = [
    { value: "national", label: t("simulateur.paie.profilNational") },
    { value: "etranger_resident", label: t("simulateur.paie.profilEtranger") },
    { value: "non_resident", label: t("simulateur.paie.profilNonResident") },
  ];

  const SITUATIONS: { value: SituationFamiliale; label: string }[] = [
    { value: "celibataire", label: t("simulateur.paie.single") },
    { value: "marie", label: t("simulateur.paie.married") },
    { value: "divorce", label: t("simulateur.paie.divorced") },
    { value: "veuf", label: t("simulateur.paie.widowed") },
  ];

  const ZONES: { value: ZoneTOL; label: string }[] = [
    { value: "centre_ville", label: t("simulateur.paie.centreVille") },
    { value: "peripherie", label: t("simulateur.paie.peripherie") },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        {/* --- COLONNE GAUCHE : Saisie --- */}
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <Text style={{ fontSize: 22, fontWeight: fontWeights.heading, fontFamily: fonts.heading, color: colors.text, marginBottom: 12 }}>
            {t("simulateur.paie.title")}
          </Text>

          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 13, color: colors.text }}>{t("simulateur.paie.description")}</Text>
          </View>

          {/* Profil salarié */}
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginBottom: 2 }}>{t("simulateur.paie.profil")}</Text>
          <OptionButtonGroup options={PROFILS} selected={profil} onChange={setProfil} fontSize={13} />

          {/* Situation familiale (résidents uniquement) */}
          {isResident && (
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 12, marginTop: 8 }}>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginBottom: 2 }}>{t("simulateur.paie.status")}</Text>
                <OptionButtonGroup options={SITUATIONS} selected={situation} onChange={setSituation} direction="column" fontSize={13} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginBottom: 2 }}>{t("simulateur.paie.dependents")}</Text>
                <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 10 }}>
                  <TouchableOpacity accessibilityLabel={t("simulateur.decreaseDependents")} accessibilityRole="button" style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.border }} onPress={() => setEnfants(Math.max(0, enfants - 1))}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>-</Text>
                  </TouchableOpacity>
                  <Text style={{ minWidth: 28, textAlign: "center", fontSize: 16, fontWeight: "700", color: colors.text }}>{enfants}</Text>
                  <TouchableOpacity accessibilityLabel={t("simulateur.increaseDependents")} accessibilityRole="button" style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center", backgroundColor: colors.border }} onPress={() => setEnfants(Math.min(20, enfants + 1))}>
                    <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>+</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ paddingHorizontal: 12, paddingVertical: 8, alignItems: "center", backgroundColor: `${colors.primary}15` }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: colors.primary }}>
                    {nombreParts} {t("common.parts")}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Section Rémunération de base */}
          <SimulateurSection label={t("simulateur.paie.sectionBase")} />
          <NumberField label={t("simulateur.paie.salaireBase")} value={fields.salaireBase} onChange={(v) => setField("salaireBase", v)} />
          <NumberField label={t("simulateur.paie.primesImposables")} value={fields.primesImposables} onChange={(v) => setField("primesImposables", v)} />
          <NumberField label={t("simulateur.paie.heuresSup")} value={fields.heuresSup} onChange={(v) => setField("heuresSup", v)} />
          <NumberField label={t("simulateur.paie.congesAnnuels")} value={fields.congesAnnuels} onChange={(v) => setField("congesAnnuels", v)} />

          {/* Section Indemnités & Primes */}
          <SimulateurSection label={t("simulateur.paie.sectionIndemnites")} />
          <NumberField label={`${t("simulateur.paie.primeTransport")} (${t("simulateur.paie.primeTransportNote")})`} value={fields.primeTransport} onChange={(v) => setField("primeTransport", v)} />
          <NumberField label={`${t("simulateur.paie.primeRepresentation")} (${t("simulateur.paie.primeRepresentationNote")})`} value={fields.primeRepresentation} onChange={(v) => setField("primeRepresentation", v)} />
          <NumberField label={t("simulateur.paie.primePanier")} value={fields.primePanier} onChange={(v) => setField("primePanier", v)} />
          <NumberField label={t("simulateur.paie.primeSalissure")} value={fields.primeSalissure} onChange={(v) => setField("primeSalissure", v)} />

          {/* Section Avantages en nature */}
          <SimulateurSection label={t("simulateur.paie.sectionAvantages")} />
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 8, marginBottom: 8, backgroundColor: `${colors.primary}10` }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}>{t("simulateur.paie.toggleForfaitaire")}</Text>
            <Switch value={forfaitaire} onValueChange={handleToggleForfaitaire} trackColor={{ false: colors.border, true: colors.primary }} />
          </View>
          <NumberField label={t("simulateur.paie.avLogement")} value={fields.avLogement} onChange={(v) => setField("avLogement", v)} />
          <NumberField label={t("simulateur.paie.avDomesticite")} value={fields.avDomesticite} onChange={(v) => setField("avDomesticite", v)} />
          <NumberField label={t("simulateur.paie.avElectricite")} value={fields.avElectricite} onChange={(v) => setField("avElectricite", v)} />
          <NumberField label={t("simulateur.paie.avVoiture")} value={fields.avVoiture} onChange={(v) => setField("avVoiture", v)} />
          <NumberField label={t("simulateur.paie.avTelephone")} value={fields.avTelephone} onChange={(v) => setField("avTelephone", v)} />
          <NumberField label={t("simulateur.paie.avNourriture")} value={fields.avNourriture} onChange={(v) => setField("avNourriture", v)} />

          {/* Affichage surligné du brut imposable */}
          <View style={{ marginTop: 12, padding: 14, backgroundColor: `${colors.primary}15` }}>
            <Text style={{ fontSize: 14, fontWeight: "600", color: colors.textSecondary }}>{t("simulateur.paie.salaireBrutImposable")}</Text>
            <Text style={{ fontSize: 22, fontWeight: "800", color: colors.primary }}>{formatNumber(brutImposable)} FCFA</Text>
            {totalExonere > 0 && (
              <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 4 }}>
                {t("simulateur.paie.elementsExoneres")} : {formatNumber(totalExonere)} FCFA
              </Text>
            )}
          </View>

          {/* Zone TOL */}
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.textSecondary, marginTop: 12, marginBottom: 2 }}>{t("simulateur.paie.zoneTOL")}</Text>
          <OptionButtonGroup options={ZONES} selected={zoneTOL} onChange={setZoneTOL} fontSize={13} />

          {/* Taxe régionale (janvier uniquement) */}
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 8, marginTop: 8, backgroundColor: `${colors.primary}10` }}>
            <Text style={{ fontSize: 13, fontWeight: "600", color: colors.primary }}>{t("simulateur.paie.moisJanvier")}</Text>
            <Switch value={moisJanvier} onValueChange={setMoisJanvier} trackColor={{ false: colors.border, true: colors.primary }} />
          </View>

          <Text style={{ fontSize: 12, color: colors.textMuted, marginTop: 12 }}>{t("simulateur.paie.legalRef")}</Text>
        </ScrollView>

        {/* --- COLONNE DROITE : Résultats --- */}
        <ScrollView
          style={{
            width: isMobile ? "100%" : "50%",
            borderLeftWidth: isMobile ? 0 : 1,
            borderLeftColor: colors.border,
            borderTopWidth: isMobile ? 1 : 0,
            borderTopColor: colors.border,
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {result ? (
            <View>
              {/* Bases de calcul */}
              <SimulateurSection label={t("simulateur.paie.sectionBases")} />
              <TableRow label={t("simulateur.paie.baseBrut")} value={formatNumber(result.salaireBrutTotal)} bold />
              <TableRow label={t("simulateur.paie.brutTaxable")} value={formatNumber(result.salaireBrutTotal - result.cnssSalarieMensuel)} bg={colors.background} />
              <TableRow label={t("simulateur.paie.baseITS")} value={formatNumber(result.baseITS)} />

              {/* Retenues salarié */}
              <SimulateurSection label={t("simulateur.paie.sectionRetenues")} />
              <TableRow label={t("simulateur.paie.cnssSalarie")} value={`- ${formatNumber(result.cnssSalarieMensuel)}`} color={colors.danger} />
              <TableRow
                label={result.modeCalculIts === "bareme" ? t("simulateur.paie.itsLabel") : t("simulateur.paie.itsForfaitaire")}
                value={`- ${formatNumber(result.itsMensuel)}`}
                bg={colors.background}
                color={colors.danger}
              />
              <TableRow label={t("simulateur.paie.tolLabel")} value={`- ${formatNumber(result.tolMensuel)}`} color={colors.danger} />
              <TableRow label={t("simulateur.paie.camuLabel")} value={`- ${formatNumber(result.camuMensuel)}`} color={colors.danger} />
              <TableRow label={t("simulateur.paie.taxeRegionale")} value={`- ${formatNumber(result.taxeRegionale)}`} bg={colors.background} color={colors.danger} />

              <ResultHighlight label={t("simulateur.paie.totalRetenues")} value={formatNumber(result.totalRetenuesSalarie)} variant="danger" />
              <ResultHighlight label={t("simulateur.paie.salaireNet")} value={formatNumber(result.salaireNetMensuel)} variant="success" />

              {/* Charges patronales */}
              <SimulateurSection label={t("simulateur.paie.sectionPatronales")} />
              <TableRow label={t("simulateur.paie.cnssVieillesse")} value={formatNumber(result.cnssVieillessePatronale)} />
              <TableRow label={t("simulateur.paie.cnssAF")} value={formatNumber(result.cnssAFPatronale)} bg={colors.background} />
              <TableRow label={t("simulateur.paie.cnssPF")} value={formatNumber(result.cnssPFPatronale)} />
              <TableRow label={`${t("simulateur.paie.tusLabel")} (${result.tauxTUS * 100}%)`} value={formatNumber(result.tusMensuel)} bg={colors.background} />
              <ResultHighlight label={t("simulateur.paie.totalPatronales")} value={formatNumber(result.totalChargesPatronales)} variant="primary" />
              <ResultHighlight label={t("simulateur.paie.coutEmployeur")} value={formatNumber(result.coutTotalEmployeur)} variant="danger" />

              {/* Récapitulatif annuel */}
              <SimulateurSection label={t("simulateur.paie.sectionRecap")} />
              <TableRow label={t("simulateur.paie.brutAnnuel")} value={formatNumber(result.salaireBrutTotal * 12)} bold />
              <TableRow label={t("simulateur.paie.netAnnuel")} value={formatNumber(result.salaireNetAnnuel)} bg={colors.background} bold />
              <TableRow label={t("simulateur.paie.chargesAnnuelles")} value={formatNumber(result.totalChargesPatronales * 12)} />
              <TableRow label={t("simulateur.paie.coutAnnuel")} value={formatNumber(result.coutTotalEmployeur * 12)} bg={colors.background} bold />
              <TableRow label={t("simulateur.paie.tauxEffectif")} value={`${result.tauxEffectif.toFixed(1)}%`} />
            </View>
          ) : (
            <SimulateurEmptyState message={t("simulateur.paie.enterSalary")} />
          )}
        </ScrollView>
      </View>
    </View>
  );
}
