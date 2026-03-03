import { useState, useMemo } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { calculerEnregistrement, type TypeActe, type ZoneImmat } from "@/lib/services/enregistrement.service";
import { formatNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";
import SimulateurSection from "@/components/simulateur/SimulateurSection";
import NumberField from "@/components/simulateur/NumberField";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";

type Category = "contrats" | "baux" | "mutations" | "fonds" | "divers";

const ACTES_PAR_CATEGORIE: Record<Category, { value: TypeActe; labelKey: string }[]> = {
  contrats: [
    { value: "contrat", labelKey: "simulateur.enreg.contrat" },
    { value: "marchePublic", labelKey: "simulateur.enreg.marchePublic" },
  ],
  baux: [
    { value: "bail", labelKey: "simulateur.enreg.bail" },
    { value: "bailIllimite", labelKey: "simulateur.enreg.bailIllimite" },
    { value: "cessionBail", labelKey: "simulateur.enreg.cessionBail" },
  ],
  mutations: [
    { value: "mutationImmo", labelKey: "simulateur.enreg.mutationImmo" },
    { value: "mutationImmoImmat", labelKey: "simulateur.enreg.mutationImmoImmat" },
  ],
  fonds: [
    { value: "fondsCommerce", labelKey: "simulateur.enreg.fondsCommerce" },
    { value: "cessionActions", labelKey: "simulateur.enreg.cessionActions" },
  ],
  divers: [
    { value: "venteMobiliere", labelKey: "simulateur.enreg.venteMobiliere" },
    { value: "partage", labelKey: "simulateur.enreg.partage" },
  ],
};

export default function EnregistrementScreen() {
  const { t } = useTranslation();
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [montant, setMontant] = useState("");
  const [category, setCategory] = useState<Category>("contrats");
  const [typeActe, setTypeActe] = useState<TypeActe>("contrat");
  const [zoneImmat, setZoneImmat] = useState<ZoneImmat>("centreVille");

  const CATEGORIES: { value: Category; label: string }[] = [
    { value: "contrats", label: t("simulateur.enreg.catContrats") },
    { value: "baux", label: t("simulateur.enreg.catBaux") },
    { value: "mutations", label: t("simulateur.enreg.catMutations") },
    { value: "fonds", label: t("simulateur.enreg.catFonds") },
    { value: "divers", label: t("simulateur.enreg.catDivers") },
  ];

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setTypeActe(ACTES_PAR_CATEGORIE[cat][0].value);
  };

  const result = useMemo(() => {
    const m = parseFloat(montant.replace(/\s/g, "")) || 0;
    if (m <= 0) return null;
    return calculerEnregistrement({ typeActe, montant: m, zoneImmat });
  }, [montant, typeActe, zoneImmat]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ flex: 1, flexDirection: isMobile ? "column" : "row" }}>
        <ScrollView style={{ width: isMobile ? "100%" : "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          <View style={{ marginBottom: 12, padding: 12, backgroundColor: colors.card }}>
            <Text style={{ fontSize: 11, color: colors.text }}>
              {t("simulateur.enreg.description")}
            </Text>
          </View>

          {/* Catégorie */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.enreg.categoryLabel")}
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
            <View style={{ flexDirection: "row", gap: 6 }}>
              {CATEGORIES.map((cat) => (
                <TouchableOpacity
                  key={cat.value}
                  style={{ paddingVertical: 6, paddingHorizontal: 12, backgroundColor: category === cat.value ? colors.primary : colors.border }}
                  onPress={() => handleCategoryChange(cat.value)}
                >
                  <Text style={{ color: category === cat.value ? "#fff" : colors.text, fontWeight: "700", fontSize: 11 }}>{cat.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Type d'acte */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
            {t("simulateur.enreg.acteLabel")}
          </Text>
          <View style={{ gap: 4, marginBottom: 12 }}>
            {ACTES_PAR_CATEGORIE[category].map((acte) => (
              <TouchableOpacity
                key={acte.value}
                style={{ paddingVertical: 8, paddingHorizontal: 12, backgroundColor: typeActe === acte.value ? colors.primary : colors.border }}
                onPress={() => setTypeActe(acte.value)}
              >
                <Text style={{ color: typeActe === acte.value ? "#fff" : colors.text, fontWeight: "600", fontSize: 12 }}>{t(acte.labelKey)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Zone immatriculation (si mutation immat) */}
          {typeActe === "mutationImmoImmat" && (
            <>
              <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text, marginBottom: 6 }}>
                {t("simulateur.enreg.zoneLabel")}
              </Text>
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                {([
                  { value: "centreVille" as ZoneImmat, label: t("simulateur.enreg.centreVille") },
                  { value: "urbainRural" as ZoneImmat, label: t("simulateur.enreg.urbainRural") },
                ]).map((z) => (
                  <TouchableOpacity
                    key={z.value}
                    style={{ flex: 1, paddingVertical: 8, alignItems: "center", backgroundColor: zoneImmat === z.value ? colors.primary : colors.border }}
                    onPress={() => setZoneImmat(z.value)}
                  >
                    <Text style={{ color: zoneImmat === z.value ? "#fff" : colors.text, fontWeight: "700", fontSize: 12 }}>{z.label}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </>
          )}

          <NumberField label={t("simulateur.enreg.amount")} value={montant} onChange={setMontant} colors={colors} />

          <Text style={{ fontSize: 10, color: colors.textMuted, marginTop: 12 }}>
            {t("simulateur.enreg.legalRef")}
          </Text>
        </ScrollView>

        <ScrollView style={{ width: isMobile ? "100%" : "50%", borderLeftWidth: isMobile ? 0 : 1, borderLeftColor: colors.border, borderTopWidth: isMobile ? 1 : 0, borderTopColor: colors.border }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              <SimulateurSection label={t("simulateur.enreg.calcSection")} colors={colors} />
              <TableRow label={t("simulateur.enreg.acteType")} value={result.libelle} />
              <TableRow label={t("simulateur.enreg.baseAmount")} value={formatNumber(result.montant)} bg={colors.background} bold />
              <TableRow label={`${t("simulateur.enreg.rateApplied")} (${result.articleRef})`} value={`${result.taux}%`} />

              <SimulateurSection label={t("simulateur.enreg.detailSection")} colors={colors} />
              <TableRow label={t("simulateur.enreg.duties")} value={formatNumber(result.droits)} bold />
              <TableRow label={t("simulateur.enreg.additionalCents")} value={`+ ${formatNumber(result.centimesAdditionnels)}`} bg={colors.background} />

              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: colors.border }}>
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>{t("simulateur.enreg.totalDue")}</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.total)}</Text>
                </View>
              </View>

              <View style={{ paddingHorizontal: 14, paddingVertical: 8, backgroundColor: `${colors.primary}10` }}>
                <Text style={{ fontSize: 10, color: colors.primary, fontWeight: "600" }}>
                  {t("simulateur.enreg.deadlineNote")}
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color={colors.disabled} />
              <Text style={{ fontSize: 13, color: colors.textMuted, marginTop: 12, textAlign: "center" }}>
                {t("simulateur.enreg.enterAmount")}
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
