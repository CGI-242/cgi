import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  calculerIts,
  calculerNombreParts,
  type SituationFamiliale,
  type PeriodeRevenu,
} from "@/lib/services/its.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";

const SITUATIONS: { value: SituationFamiliale; label: string }[] = [
  { value: "celibataire", label: "Celibataire" },
  { value: "marie", label: "Marie(e)" },
  { value: "divorce", label: "Divorce(e)" },
  { value: "veuf", label: "Veuf/Veuve" },
];

export default function ItsScreen() {
  const [salaireBrut, setSalaireBrut] = useState("");
  const [periode, setPeriode] = useState<PeriodeRevenu>("mensuel");
  const [situation, setSituation] = useState<SituationFamiliale>("celibataire");
  const [enfants, setEnfants] = useState(0);
  const [appliquerCharge, setAppliquerCharge] = useState(true);

  const nombreParts = useMemo(
    () => calculerNombreParts(situation, enfants, appliquerCharge),
    [situation, enfants, appliquerCharge]
  );

  const result = useMemo(() => {
    const montant = parseFloat(salaireBrut.replace(/\s/g, "")) || 0;
    if (montant <= 0) return null;
    return calculerIts({
      salaireBrut: montant,
      periode,
      situationFamiliale: situation,
      nombreEnfants: enfants,
      appliquerChargeFamille: appliquerCharge,
    });
  }, [salaireBrut, periode, situation, enfants, appliquerCharge]);

  return (
    <View className="flex-1 bg-background">
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingHorizontal: 24, paddingTop: 48, paddingBottom: 24 }}>
        <TouchableOpacity
          onPress={() => router.push("/(app)/simulateur")}
          className="flex-row items-center mb-3"
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
          <Text className="text-white ml-2 text-base">Simulateurs</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: "900", color: "#00c17c" }}>Simulateur ITS</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
          Impot sur les Traitements et Salaires - Art. 116 CGI 2026
        </Text>
      </View>

      {/* Layout 50/50 */}
      <View className="flex-1 flex-row">
        {/* Colonne gauche 50% - Formulaire */}
        <ScrollView style={{ width: "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          {/* Info banner */}
          <View className="p-3 bg-gray-50" style={{ borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: "#374151" }}>
              L'ITS est calcule selon le bareme progressif Art. 116 CGI 2026,
              apres deduction CNSS (4%) et frais professionnels (20%).
            </Text>
          </View>

          {/* Situation familiale + Enfants/QF cote a cote */}
          <View className="flex-row" style={{ gap: 10, marginBottom: 12 }}>
            {/* Gauche : boutons situation empilés */}
            <View style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#6b7280", marginBottom: 2 }}>Statut</Text>
              {SITUATIONS.map((s) => (
                <TouchableOpacity
                  key={s.value}
                  className="py-2 items-center"
                  style={{ backgroundColor: situation === s.value ? "#00815d" : "#e5e7eb", borderRadius: 6 }}
                  onPress={() => setSituation(s.value)}
                >
                  <Text style={{ color: situation === s.value ? "#fff" : "#374151", fontSize: 12, fontWeight: "600" }}>{s.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {/* Droite : enfants + QF + parts */}
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 11, fontWeight: "600", color: "#6b7280", marginBottom: 2 }}>Enfants a charge</Text>
              <View className="flex-row items-center" style={{ marginBottom: 10 }}>
                <TouchableOpacity className="w-8 h-8 items-center justify-center bg-gray-200" style={{ borderRadius: 4 }} onPress={() => setEnfants(Math.max(0, enfants - 1))}>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>-</Text>
                </TouchableOpacity>
                <Text style={{ minWidth: 28, textAlign: "center", fontSize: 16, fontWeight: "700", color: "#374151" }}>{enfants}</Text>
                <TouchableOpacity className="w-8 h-8 items-center justify-center bg-gray-200" style={{ borderRadius: 4 }} onPress={() => setEnfants(Math.min(20, enfants + 1))}>
                  <Text style={{ fontSize: 16, fontWeight: "700" }}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity className="flex-row items-center px-3 py-2" style={{ backgroundColor: appliquerCharge ? "#00815d20" : "#e5e7eb", borderRadius: 6, marginBottom: 10 }} onPress={() => setAppliquerCharge(!appliquerCharge)}>
                <Ionicons name={appliquerCharge ? "checkbox" : "square-outline"} size={16} color={appliquerCharge ? "#00815d" : "#9ca3af"} />
                <Text style={{ fontSize: 12, fontWeight: "600", color: appliquerCharge ? "#00815d" : "#6b7280", marginLeft: 6 }}>Quotient familial</Text>
              </TouchableOpacity>
              <View className="px-3 py-2 items-center" style={{ backgroundColor: "#00815d15", borderRadius: 6 }}>
                <Text style={{ fontSize: 14, fontWeight: "700", color: "#00815d" }}>{nombreParts} parts</Text>
              </View>
            </View>
          </View>

          {/* Periode */}
          <View className="flex-row" style={{ gap: 8, marginBottom: 12 }}>
            {(["mensuel", "annuel"] as PeriodeRevenu[]).map((p) => (
              <TouchableOpacity
                key={p}
                className="flex-1 py-2 items-center"
                style={{ backgroundColor: periode === p ? "#00815d" : "#e5e7eb", borderRadius: 8 }}
                onPress={() => setPeriode(p)}
              >
                <Text style={{ color: periode === p ? "#fff" : "#374151", fontWeight: "700", fontSize: 13 }}>
                  {p === "mensuel" ? "Mensuel" : "Annuel"}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Salaire brut */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 6 }}>
            Salaire brut {periode === "mensuel" ? "mensuel" : "annuel"}
          </Text>
          <View className="flex-row items-center bg-white px-3" style={{ borderRadius: 8, borderWidth: 2, borderColor: "#00815d", height: 48 }}>
            <TextInput
              className="flex-1 text-base font-bold text-text"
              value={salaireBrut}
              onChangeText={(t) => setSalaireBrut(formatInputNumber(t))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9ca3af"
            />
            <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "600" }}>FCFA</Text>
          </View>

          {/* References */}
          <Text style={{ fontSize: 10, color: "#9ca3af", marginTop: 12 }}>
            Art. 40 (CNSS 4%), Art. 41 (Frais 20%), Art. 116 (Bareme ITS 2026)
          </Text>
        </ScrollView>

        {/* Colonne droite 50% - Resultats */}
        <ScrollView style={{ width: "50%", borderLeftWidth: 1, borderLeftColor: "#e5e7eb" }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              {/* Section CALCUL MENSUEL */}
              <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>CALCUL MENSUEL</Text>
              </View>
              <TableRow label="SALAIRE BRUT (Mensuel)" value={formatNumber(result.revenuBrutAnnuel / 12)} bold />
              <TableRow label="C.N.S.S. (Mensuel) - 4%" value={`- ${formatNumber(result.retenueCnssMensuelle)}`} bg="#f9fafb" color="#b91c1c" />
              <TableRow label="NET IMPOSABLE [Mensuel] (80%)" value={formatNumber(Math.round(result.revenuNetImposable / 12))} />

              {/* Section CALCUL ANNUEL */}
              <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>CALCUL ANNUEL</Text>
              </View>
              <TableRow label="SALAIRE BRUT (Annuel)" value={formatNumber(result.revenuBrutAnnuel)} />
              <TableRow label="C.N.S.S. (Annuel)" value={`- ${formatNumber(result.retenueCnss)}`} bg="#f9fafb" color="#b91c1c" />
              <TableRow label="SALAIRE NET (Annuel)" value={formatNumber(result.revenuBrutAnnuel - result.retenueCnss)} />
              <TableRow label="NET IMPOSABLE [Annuel] (80%)" value={formatNumber(result.revenuNetImposable)} bg="#f9fafb" bold />

              {/* Quotient familial */}
              <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>QUOTIENT FAMILIAL</Text>
                    <Text style={{ fontSize: 10, color: "#6b7280" }}>Net imposable / {nombreParts} parts</Text>
                  </View>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#374151" }}>{formatNumber(result.revenuParPart)}</Text>
                </View>
              </View>

              {/* Section IMPOT A PAYER */}
              <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>IMPOT A PAYER</Text>
              </View>
              <TableRow label="ITS (Annuel)" value={formatNumber(result.itsAnnuel)} />
              <View style={{ backgroundColor: "#fef2f2", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#991b1b" }}>ITS (Mensuel)</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#b91c1c" }}>{formatNumber(result.itsMensuel)}</Text>
                </View>
              </View>

              {/* Repartition 35/65 */}
              <TableRow label="Employe (35%)" value={formatNumber(Math.round(result.itsMensuel * 0.35))} bg="#f9fafb" />
              <TableRow label="Employeur (65%)" value={formatNumber(Math.round(result.itsMensuel * 0.65))} />

              {/* Salaire net */}
              <View style={{ backgroundColor: "#f0fdf4", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#166534" }}>SALAIRE NET (Mensuel)</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#166534" }}>{formatNumber(Math.round(result.salaireNetMensuel))}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color="#d1d5db" />
              <Text style={{ fontSize: 13, color: "#9ca3af", marginTop: 12, textAlign: "center" }}>
                Saisissez un salaire brut pour voir les resultats
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}
