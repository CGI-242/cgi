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
import { calculerIS, type IsInput } from "@/lib/services/is.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";

export default function IsScreen() {
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
        <Text style={{ fontSize: 24, fontWeight: "900", color: "#00c17c" }}>Minimum de perception</Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
          Acomptes trimestriels IS - Art. 86B & 86C CGI 2026
        </Text>
      </View>

      {/* Layout 50/50 */}
      <View className="flex-1 flex-row">
        {/* Colonne gauche - Formulaire */}
        <ScrollView style={{ width: "50%" }} contentContainerStyle={{ padding: 12, paddingBottom: 40 }}>
          {/* Info */}
          <View className="p-3 bg-gray-50" style={{ borderRadius: 8, marginBottom: 12 }}>
            <Text style={{ fontSize: 11, color: "#374151" }}>
              Le minimum de perception est calculé sur les produits de l'entreprise
              au taux de 1% (ou 2% si déficit 2 exercices consécutifs). Il est versé
              en 4 acomptes trimestriels (Art. 86C).
            </Text>
          </View>

          {/* Base minimum de perception */}
          <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151", marginBottom: 6 }}>
            Base de calcul (Art. 86B)
          </Text>
          <NumberField label="Produits d'exploitation" value={produitsExploitation} onChange={setProduitsExploitation} />
          <NumberField label="Produits financiers" value={produitsFinanciers} onChange={setProduitsFinanciers} />
          <NumberField label="Produits HAO" value={produitsHAO} onChange={setProduitsHAO} />
          <NumberField label="Produits ayant fait l'objet de retenues libératoires" value={retenuesLiberatoires} onChange={setRetenuesLiberatoires} />

          {/* Déficit */}
          <View className="flex-row items-center p-3 bg-gray-50" style={{ borderRadius: 8, marginBottom: 12 }}>
            <View className="flex-1">
              <Text style={{ fontSize: 12, fontWeight: "600", color: "#374151" }}>Déficit fiscal 2 exercices</Text>
              <Text style={{ fontSize: 10, color: "#6b7280" }}>Taux passe de 1% à 2% (Art. 86B)</Text>
            </View>
            <Switch
              value={deficitConsecutif}
              onValueChange={setDeficitConsecutif}
              trackColor={{ false: "#d1d5db", true: "#00815d80" }}
              thumbColor={deficitConsecutif ? "#00815d" : "#9ca3af"}
            />
          </View>

          <Text style={{ fontSize: 10, color: "#9ca3af" }}>
            Art. 86B (base et taux), Art. 86C (échéances trimestrielles)
          </Text>
        </ScrollView>

        {/* Colonne droite - Résultats */}
        <ScrollView style={{ width: "50%", borderLeftWidth: 1, borderLeftColor: "#e5e7eb" }} contentContainerStyle={{ paddingBottom: 40 }}>
          {result ? (
            <View>
              {/* Minimum de perception */}
              <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>MINIMUM DE PERCEPTION (Art. 86B)</Text>
              </View>
              <TableRow label="Base (produits - retenues)" value={formatNumber(result.baseMinimumPerception)} />
              <TableRow label={`Taux appliqué`} value={`${result.tauxMinimum}%`} bg="#f9fafb" />
              <View style={{ backgroundColor: "#00815d10", paddingHorizontal: 14, paddingVertical: 10, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ fontSize: 12, fontWeight: "600", color: "#00815d" }}>MINIMUM ANNUEL</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#00815d" }}>{formatNumber(result.minimumPerceptionAnnuel)}</Text>
                </View>
              </View>

              {/* 4 acomptes */}
              <View style={{ backgroundColor: "#f3f4f6", paddingHorizontal: 14, paddingVertical: 8 }}>
                <Text style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}>4 ACOMPTES TRIMESTRIELS (Art. 86C)</Text>
              </View>
              {result.acomptes.map((a) => (
                <TableRow key={a.label} label={a.label} value={formatNumber(a.montant)} />
              ))}

              {/* Total */}
              <View style={{ backgroundColor: "#eff6ff", paddingHorizontal: 14, paddingVertical: 12, borderTopWidth: 1, borderTopColor: "#e5e7eb" }}>
                <View className="flex-row items-center justify-between">
                  <Text style={{ fontSize: 12, fontWeight: "700", color: "#1e40af" }}>TOTAL À VERSER</Text>
                  <Text style={{ fontSize: 16, fontWeight: "800", color: "#1e40af" }}>{formatNumber(result.minimumPerceptionAnnuel)}</Text>
                </View>
                <Text style={{ fontSize: 10, color: "#6b7280", marginTop: 4 }}>
                  Imputable sur l'IS lors de la liquidation (Art. 86G)
                </Text>
              </View>
            </View>
          ) : (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 32 }}>
              <Ionicons name="calculator-outline" size={40} color="#d1d5db" />
              <Text style={{ fontSize: 13, color: "#9ca3af", marginTop: 12, textAlign: "center" }}>
                Saisissez les produits pour calculer le minimum de perception
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <View style={{ marginBottom: 8 }}>
      <Text style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>{label}</Text>
      <View className="flex-row items-center bg-white px-3" style={{ borderRadius: 6, height: 40, borderWidth: 1, borderColor: "#e5e7eb" }}>
        <TextInput
          className="flex-1 text-sm font-semibold text-text"
          value={value}
          onChangeText={(t) => onChange(formatInputNumber(t))}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="#9ca3af"
        />
        <Text style={{ fontSize: 10, color: "#9ca3af" }}>FCFA</Text>
      </View>
    </View>
  );
}
