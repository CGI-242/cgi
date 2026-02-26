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
import { calculerPatente, type PatenteInput } from "@/lib/services/patente.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";

const REGIMES: { value: PatenteInput["regime"]; label: string }[] = [
  { value: "reel", label: "Réel" },
  { value: "forfait", label: "Forfaitaire" },
  { value: "tpe", label: "TPE" },
  { value: "pe", label: "PE" },
];

export default function PatenteScreen() {
  const [chiffreAffaires, setChiffreAffaires] = useState("");
  const [regime, setRegime] = useState<PatenteInput["regime"]>("reel");
  const [isStandBy, setIsStandBy] = useState(false);
  const [dernierePatente, setDernierePatente] = useState("");
  const [isNouvelle, setIsNouvelle] = useState(false);
  const [nombreEntites, setNombreEntites] = useState(1);

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
        <Text style={{ fontSize: 24, fontWeight: "900", color: "#00c17c" }}>Simulateur Patente</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
          Contribution des Patentes - Art. 306 CGI 2026
        </Text>
      </View>

      {/* Layout 50/50 */}
      <View className="flex-1 flex-row">
        {/* Colonne gauche - Formulaire */}
        <ScrollView style={{ width: "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          {/* Info */}
          <View className="p-3 bg-gray-50" style={{ borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: "#374151" }}>
              Patente calculée sur le CA HT (N-1). Barème progressif Art. 306,
              réduit de 50%. Échéance : 10-20 avril.
            </Text>
          </View>

          {/* Regime fiscal */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 6 }}>Régime fiscal</Text>
          <View className="flex-row" style={{ gap: 6, marginBottom: 12 }}>
            {REGIMES.map((r) => (
              <TouchableOpacity
                key={r.value}
                className="flex-1 py-2 items-center"
                style={{ backgroundColor: regime === r.value ? "#00815d" : "#e5e7eb", borderRadius: 6 }}
                onPress={() => setRegime(r.value)}
              >
                <Text style={{ color: regime === r.value ? "#fff" : "#374151", fontSize: 11, fontWeight: "600" }}>{r.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Stand-by */}
          <View className="flex-row items-center p-3 bg-gray-50" style={{ borderRadius: 8, marginBottom: 8 }}>
            <View className="flex-1">
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>Entreprise en stand-by</Text>
              <Text style={{ fontSize: 10, color: "#6b7280" }}>25% de la dernière patente (Art. 278)</Text>
            </View>
            <Switch
              value={isStandBy}
              onValueChange={setIsStandBy}
              trackColor={{ false: "#d1d5db", true: "#00815d80" }}
              thumbColor={isStandBy ? "#00815d" : "#9ca3af"}
            />
          </View>
          {isStandBy && (
            <View style={{ marginBottom: 8 }}>
              <Text style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>Dernière patente payée</Text>
              <View className="flex-row items-center bg-white px-3" style={{ borderRadius: 6, height: 40, borderWidth: 1, borderColor: "#e5e7eb" }}>
                <TextInput
                  className="flex-1 text-sm font-semibold text-text"
                  value={dernierePatente}
                  onChangeText={(t) => setDernierePatente(formatInputNumber(t))}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text style={{ fontSize: 10, color: "#9ca3af" }}>FCFA</Text>
              </View>
            </View>
          )}

          {/* Chiffre d'affaires */}
          {!isStandBy && (
            <View style={{ marginBottom: 12 }}>
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 6 }}>Chiffre d'affaires HT (N-1)</Text>
              <View className="flex-row items-center bg-white px-3" style={{ borderRadius: 8, borderWidth: 2, borderColor: "#00815d", height: 48 }}>
                <TextInput
                  className="flex-1 text-base font-bold text-text"
                  value={chiffreAffaires}
                  onChangeText={(t) => setChiffreAffaires(formatInputNumber(t))}
                  keyboardType="numeric"
                  placeholder="0"
                  placeholderTextColor="#9ca3af"
                />
                <Text style={{ fontSize: 12, color: "#6b7280", fontWeight: "600" }}>FCFA</Text>
              </View>
            </View>
          )}

          {/* Options */}
          <View className="flex-row items-center p-3 bg-gray-50" style={{ borderRadius: 8, marginBottom: 8 }}>
            <Text style={{ fontSize: 12, color: "#374151", flex: 1 }}>Entreprise nouvelle</Text>
            <Switch
              value={isNouvelle}
              onValueChange={setIsNouvelle}
              trackColor={{ false: "#d1d5db", true: "#00815d80" }}
              thumbColor={isNouvelle ? "#00815d" : "#9ca3af"}
            />
          </View>
          <View className="flex-row items-center p-3 bg-gray-50" style={{ borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 12, color: "#374151", flex: 1 }}>Entités fiscales (Art. 281)</Text>
            <View className="flex-row items-center">
              <TouchableOpacity className="w-7 h-7 items-center justify-center bg-gray-200" style={{ borderRadius: 4 }} onPress={() => setNombreEntites(Math.max(1, nombreEntites - 1))}>
                <Text style={{ fontSize: 15, fontWeight: "700" }}>-</Text>
              </TouchableOpacity>
              <Text style={{ minWidth: 24, textAlign: "center", fontSize: 14, fontWeight: "700", color: "#374151" }}>{nombreEntites}</Text>
              <TouchableOpacity className="w-7 h-7 items-center justify-center bg-gray-200" style={{ borderRadius: 4 }} onPress={() => setNombreEntites(nombreEntites + 1)}>
                <Text style={{ fontSize: 15, fontWeight: "700" }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={{ fontSize: 10, color: "#9ca3af" }}>
            Art. 278 (Patente), Art. 306 (Barème), Art. 281 (Entités)
          </Text>
        </ScrollView>

        {/* Colonne droite - Résultats */}
        <ScrollView style={{ width: "50%", borderLeftWidth: 1, borderLeftColor: "#e5e7eb" }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result && result.patenteNette > 0 ? (
            <View>
              {/* Tranches */}
              {result.tranches.length > 0 && (
                <>
                  <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 8 }}>
                    <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>DÉTAIL PAR TRANCHES</Text>
                  </View>
                  {result.tranches.map((t, i) => (
                    <View
                      key={t.tranche}
                      className="flex-row items-center justify-between"
                      style={{ backgroundColor: i % 2 === 0 ? "#fff" : "#f9fafb", paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}
                    >
                      <Text style={{ fontSize: 11, color: "#6b7280", flex: 1 }}>{t.tranche}</Text>
                      <Text style={{ fontSize: 10, fontWeight: "600", color: "#00815d", marginHorizontal: 6 }}>{t.taux.toFixed(3)}%</Text>
                      <Text style={{ fontSize: 11, fontWeight: "600", color: "#374151", width: 80, textAlign: "right" }}>{formatNumber(Math.round(t.montant))}</Text>
                    </View>
                  ))}
                  <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                    <View className="flex-row items-center justify-between">
                      <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>PATENTE BRUTE</Text>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>{formatNumber(Math.round(result.patenteBrute))}</Text>
                    </View>
                  </View>
                </>
              )}

              {/* Réductions */}
              <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>RÉDUCTIONS</Text>
              </View>
              {result.reductionStandBy > 0 && (
                <TableRow label="Réduction stand-by (75%)" value={`- ${formatNumber(Math.round(result.reductionStandBy))}`} color="#b91c1c" />
              )}
              <TableRow label="Réduction 50% (Art. 306)" value={`- ${formatNumber(Math.round(result.reduction50Pourcent))}`} bg="#f9fafb" color="#b91c1c" />

              {/* Patente nette */}
              <View style={{ backgroundColor: "#00815d10", paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#00815d" }}>PATENTE NETTE</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#00815d" }}>{formatNumber(result.patenteNette)}</Text>
                </View>
              </View>

              {/* Par entité */}
              {result.nombreEntites > 1 && (
                <TableRow label={`Par entité (${result.nombreEntites})`} value={formatNumber(result.patenteParEntite)} bg="#f9fafb" bold />
              )}

              {/* Échéance */}
              <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                <View className="flex-row items-center">
                  <Ionicons name="calendar-outline" size={14} color="#374151" />
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151", marginLeft: 6 }}>Échéance : {result.dateEcheance}</Text>
                </View>
              </View>

              {/* Références */}
              <View style={{ backgroundColor: "#f9fafb", paddingHorizontal: 14, paddingVertical: 8, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                {result.references.map((ref) => (
                  <Text key={ref} style={{ fontSize: 10, color: "#9ca3af" }}>{ref}</Text>
                ))}
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color="#d1d5db" />
              <Text style={{ fontSize: 13, color: "#9ca3af", marginTop: 12, textAlign: "center" }}>
                Saisissez les données pour voir les résultats
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

