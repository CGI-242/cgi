import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import ResultHighlight from "@/components/simulateur/ResultHighlight";
import SimulateurEmptyState from "@/components/simulateur/SimulateurEmptyState";
import {
  genererGrilleCalendrier,
  getEcheancesDuMois,
  getJoursRestants,
  type EcheanceFiscale,
} from "@/lib/services/calendrier-fiscal";
import { fonts, fontWeights } from "@/lib/theme/fonts";

const MOIS_KEYS = [
  "months.january", "months.february", "months.march", "months.april",
  "months.may", "months.june", "months.july", "months.august",
  "months.september", "months.october", "months.november", "months.december",
];

const JOURS_KEYS = [
  "calendrier.jours.lun", "calendrier.jours.mar", "calendrier.jours.mer",
  "calendrier.jours.jeu", "calendrier.jours.ven", "calendrier.jours.sam",
  "calendrier.jours.dim",
];

export default function CalendrierFiscal() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();

  const now = new Date();
  const [moisActuel, setMoisActuel] = useState(now.getMonth());
  const [selectedJour, setSelectedJour] = useState<number | null>(null);
  const annee = 2026;

  const nomMois = t(MOIS_KEYS[moisActuel]);

  const grille = useMemo(
    () => genererGrilleCalendrier(moisActuel, annee),
    [moisActuel, annee]
  );

  const echeancesDuMois = useMemo(
    () => getEcheancesDuMois(moisActuel),
    [moisActuel]
  );

  // Échéances filtrées par jour sélectionné
  const echeancesJourSelectionne = useMemo(() => {
    if (selectedJour === null) return [];
    return echeancesDuMois.filter((e) => e.jour === selectedJour);
  }, [echeancesDuMois, selectedJour]);

  // Prochaine echeance
  const prochaineEcheance = useMemo(() => {
    let best: { echeance: EcheanceFiscale; jours: number } | null = null;
    for (const e of echeancesDuMois) {
      const j = getJoursRestants(e.jour, moisActuel);
      if (j >= 0 && (!best || j < best.jours)) {
        best = { echeance: e, jours: j };
      }
    }
    return best;
  }, [echeancesDuMois, moisActuel]);

  const moisPrecedent = () => {
    setMoisActuel((m) => (m === 0 ? 11 : m - 1));
    setSelectedJour(null);
  };
  const moisSuivant = () => {
    setMoisActuel((m) => (m === 11 ? 0 : m + 1));
    setSelectedJour(null);
  };

  const handleJourPress = (jour: number | null) => {
    if (jour === null) return;
    setSelectedJour((prev) => (prev === jour ? null : jour));
  };

  // ── Grille calendrier ──
  const renderGrille = () => (
    <View style={{ padding: 16 }}>
      {/* Titre */}
      <Text style={{ fontSize: 22, fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold, color: colors.text, marginBottom: 4 }}>
        {t("calendrier.title")}
      </Text>
      <Text style={{ fontSize: 15, fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.textSecondary, marginBottom: 16 }}>
        {t("calendrier.subtitle")}
      </Text>

      {/* Navigation mois */}
      <View style={{
        flexDirection: "row", alignItems: "center", justifyContent: "space-between",
        marginBottom: 16, backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
        borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10,
      }}>
        <TouchableOpacity onPress={moisPrecedent} hitSlop={8} accessibilityLabel="Mois precedent" accessibilityRole="button">
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontFamily: fonts.bold, fontWeight: fontWeights.bold, color: colors.text }}>
          {nomMois} {annee}
        </Text>
        <TouchableOpacity onPress={moisSuivant} hitSlop={8} accessibilityLabel="Mois suivant" accessibilityRole="button">
          <Ionicons name="chevron-forward" size={22} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* En-tete jours */}
      <View style={{ flexDirection: "row", marginBottom: 4 }}>
        {JOURS_KEYS.map((key) => (
          <View key={key} style={{ flex: 1, alignItems: "center", paddingVertical: 6 }}>
            <Text style={{ fontSize: 13, fontFamily: fonts.bold, fontWeight: fontWeights.bold, color: colors.textMuted }}>
              {t(key)}
            </Text>
          </View>
        ))}
      </View>

      {/* Grille jours */}
      {grille.map((semaine, si) => (
        <View key={si} style={{ flexDirection: "row" }}>
          {semaine.map((jour, ji) => {
            const isSelected = jour.jour !== null && jour.jour === selectedJour;
            const hasEcheances = jour.echeances.length > 0 && jour.jour !== null;
            return (
              <TouchableOpacity
                key={`${si}-${ji}`}
                onPress={() => handleJourPress(jour.jour)}
                disabled={jour.jour === null}
                activeOpacity={0.6}
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                  height: 44,
                  borderWidth: isSelected ? 2 : jour.estAujourdhui ? 2 : 0,
                  borderColor: isSelected ? colors.primary : jour.estAujourdhui ? colors.accent : "transparent",
                  backgroundColor: isSelected
                    ? `${colors.primary}25`
                    : hasEcheances
                      ? `${colors.primary}15`
                      : "transparent",
                }}
              >
                {jour.jour !== null && (
                  <>
                    <Text style={{
                      fontSize: 15,
                      fontFamily: isSelected || jour.estAujourdhui ? fonts.extraBold : fonts.regular,
                      fontWeight: isSelected || jour.estAujourdhui ? fontWeights.extraBold : fontWeights.regular,
                      color: jour.estPasse && !isSelected ? colors.textMuted : isSelected ? colors.primary : jour.estAujourdhui ? colors.accent : colors.text,
                    }}>
                      {jour.jour}
                    </Text>
                    {hasEcheances && (
                      <View style={{
                        position: "absolute", top: 2, right: 4,
                        backgroundColor: jour.echeances.some((e) => e.recurrent) ? colors.accent : colors.danger,
                        width: 16, height: 16, borderRadius: 8,
                        alignItems: "center", justifyContent: "center",
                      }}>
                        <Text style={{ fontSize: 11, fontFamily: fonts.extraBold, fontWeight: fontWeights.extraBold, color: "#fff" }}>
                          {jour.echeances.length}
                        </Text>
                      </View>
                    )}
                  </>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      ))}

      {/* Legende */}
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12, marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: colors.border }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 12, height: 12, borderWidth: 2, borderColor: colors.accent }} />
          <Text style={{ fontSize: 13, fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.textMuted }}>{t("calendrier.legendeAujourdhui")}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.danger }} />
          <Text style={{ fontSize: 13, fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.textMuted }}>{t("calendrier.legendeEcheance")}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: colors.accent }} />
          <Text style={{ fontSize: 13, fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.textMuted }}>{t("calendrier.legendeRecurrent")}</Text>
        </View>
      </View>
    </View>
  );

  // ── Liste echeances (panneau droit) ──
  const renderEcheances = () => (
    <View style={{ flex: 1 }}>
      {selectedJour === null ? (
        <>
          {/* Aucun jour sélectionné — invitation + prochaine échéance */}
          <View style={{ paddingTop: 40, alignItems: "center", paddingHorizontal: 20 }}>
            <Ionicons name="calendar-outline" size={40} color={colors.disabled} />
            <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.textSecondary, textAlign: "center", marginTop: 12 }}>
              {t("calendrier.selectDay")}
            </Text>
          </View>

          {prochaineEcheance && (
            <View style={{ marginTop: 24 }}>
              <SimulateurSection label={t("calendrier.prochaineEcheance")} />
              <ResultHighlight
                label={prochaineEcheance.echeance.label}
                value={t("calendrier.dansXJours", { jours: prochaineEcheance.jours })}
                variant="primary"
                note={`${prochaineEcheance.echeance.jour} ${nomMois}`}
              />
            </View>
          )}
        </>
      ) : (
        <>
          <SimulateurSection label={`${selectedJour} ${nomMois} ${annee}`} />

          {echeancesJourSelectionne.length === 0 ? (
            <SimulateurEmptyState message={t("calendrier.aucuneEcheance")} />
          ) : (
            <>
              <View style={{ paddingHorizontal: 14, paddingBottom: 8 }}>
                <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 14, color: colors.textSecondary }}>
                  {echeancesJourSelectionne.length} {echeancesJourSelectionne.length > 1 ? t("calendrier.obligations") : t("calendrier.obligation")}
                </Text>
              </View>
              {echeancesJourSelectionne.map((e, i) => (
                <ResultHighlight
                  key={`${e.descriptionKey}-${i}`}
                  label={e.label}
                  value={e.recurrent ? t("calendrier.legendeRecurrent") : t("calendrier.legendeEcheance")}
                  variant={e.recurrent ? "primary" : "danger"}
                  note={t(e.descriptionKey)}
                />
              ))}
            </>
          )}
        </>
      )}

      {/* Reference legale */}
      <View style={{ padding: 14, marginTop: 16 }}>
        <Text style={{ fontSize: 12, fontFamily: fonts.regular, fontWeight: fontWeights.regular, color: colors.textMuted }}>
          {t("calendrier.legalRef")}
        </Text>
      </View>
    </View>
  );

  // ── Layout responsive ──
  if (isMobile) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
          {renderGrille()}
          <View style={{ borderTopWidth: 1, borderTopColor: colors.border }}>
            {renderEcheances()}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Desktop : 50/50
  return (
    <View style={{ flex: 1, backgroundColor: colors.background, flexDirection: "row" }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {renderGrille()}
      </ScrollView>
      <View style={{ width: 1, backgroundColor: colors.border }} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: 40 }}>
        {renderEcheances()}
      </ScrollView>
    </View>
  );
}
