import { useState, useMemo } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  calculerSoldeLiquidation,
  type SoldeLiquidationInput,
  type TypeContribuable,
} from "@/lib/services/solde-liquidation.service";
import { formatNumber, formatInputNumber } from "@/lib/services/fiscal-common";
import TableRow from "@/components/simulateur/TableRow";

export default function SoldeLiquidationScreen() {
  const [resultatFiscal, setResultatFiscal] = useState("");
  const [typeContribuable, setTypeContribuable] = useState<TypeContribuable>("general");
  const [acompte1, setAcompte1] = useState("");
  const [acompte2, setAcompte2] = useState("");
  const [acompte3, setAcompte3] = useState("");
  const [acompte4, setAcompte4] = useState("");

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
        <Text style={{ fontSize: 24, fontWeight: "900", color: "#00c17c" }}>
          Solde de liquidation
        </Text>
        <Text style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>
          IS calculé sur résultat fiscal - acomptes versés (Art. 86A & 86G)
        </Text>
      </View>

      {/* Layout 50/50 */}
      <View className="flex-1 flex-row">
        {/* Colonne gauche - Formulaire */}
        <ScrollView
          style={{ width: "50%" }}
          contentContainerStyle={{ padding: 12, paddingBottom: 40 }}
        >
          {/* Info */}
          <View
            className="p-3 bg-gray-50"
            style={{ borderRadius: 8, marginBottom: 12 }}
          >
            <Text style={{ fontSize: 11, color: "#374151" }}>
              L'IS est calculé en appliquant le taux (25% ou 33%) au résultat
              fiscal. Le solde = IS calculé - acomptes trimestriels déjà versés.
            </Text>
          </View>

          {/* Résultat fiscal */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Résultat fiscal (bénéfice imposable)
          </Text>
          <View
            className="flex-row items-center bg-white px-3"
            style={{
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#00815d",
              height: 48,
              marginBottom: 12,
            }}
          >
            <TextInput
              className="flex-1 text-base font-bold text-text"
              value={resultatFiscal}
              onChangeText={(t) => setResultatFiscal(formatInputNumber(t))}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor="#9ca3af"
            />
            <Text
              style={{ fontSize: 12, color: "#6b7280", fontWeight: "600" }}
            >
              FCFA
            </Text>
          </View>

          {/* Type contribuable */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Type de contribuable (Art. 86A)
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 16 }}>
            {([
              { value: "general" as TypeContribuable, label: "Général", taux: "28%" },
              { value: "microfinance" as TypeContribuable, label: "Microfinance / Enseignement", taux: "25%" },
              { value: "mines" as TypeContribuable, label: "Mines / Immobilier", taux: "28%" },
              { value: "etranger" as TypeContribuable, label: "Étrangère", taux: "35%" },
            ]).map((t) => (
              <TouchableOpacity
                key={t.value}
                style={{
                  width: "48%",
                  paddingVertical: 8,
                  alignItems: "center",
                  backgroundColor: typeContribuable === t.value ? "#00815d" : "#e5e7eb",
                  borderRadius: 6,
                }}
                onPress={() => setTypeContribuable(t.value)}
              >
                <Text
                  style={{
                    color: typeContribuable === t.value ? "#fff" : "#374151",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  {t.label} ({t.taux})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Acomptes */}
          <Text
            style={{
              fontSize: 12,
              fontWeight: "600",
              color: "#374151",
              marginBottom: 6,
            }}
          >
            Acomptes versés (minimum de perception Art. 86C)
          </Text>
          <NumberField
            label="1er trimestre (15 mars)"
            value={acompte1}
            onChange={setAcompte1}
          />
          <NumberField
            label="2e trimestre (15 juin)"
            value={acompte2}
            onChange={setAcompte2}
          />
          <NumberField
            label="3e trimestre (15 sept.)"
            value={acompte3}
            onChange={setAcompte3}
          />
          <NumberField
            label="4e trimestre (15 déc.)"
            value={acompte4}
            onChange={setAcompte4}
          />

          <Text style={{ fontSize: 10, color: "#9ca3af", marginTop: 4 }}>
            Art. 86A (taux IS), Art. 86C (acomptes), Art. 86G (solde)
          </Text>
        </ScrollView>

        {/* Colonne droite - Résultats */}
        <ScrollView
          style={{
            width: "50%",
            borderLeftWidth: 1,
            borderLeftColor: "#e5e7eb",
          }}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {result ? (
            <View>
              {/* IS calculé */}
              <View
                style={{
                  backgroundColor: "#f3f4f6",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}
                >
                  IS CALCULÉ (Art. 86A)
                </Text>
              </View>
              <TableRow
                label="Résultat fiscal"
                value={formatNumber(result.resultatFiscal)}
              />
              <TableRow
                label="Bénéfice arrondi (< 1 000 négligé)"
                value={formatNumber(result.beneficeArrondi)}
                bg="#f9fafb"
              />
              <TableRow
                label={`Taux IS (${result.tauxIS}%)`}
                value={`${result.tauxIS}%`}
                bg="#f9fafb"
              />
              <View
                style={{
                  backgroundColor: "#fef2f2",
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderTopWidth: 1,
                  borderTopColor: "#e5e7eb",
                }}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "700",
                      color: "#991b1b",
                    }}
                  >
                    IS À PAYER
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: "#b91c1c",
                    }}
                  >
                    {formatNumber(result.isCalcule)}
                  </Text>
                </View>
              </View>

              {/* Détail acomptes */}
              <View
                style={{
                  backgroundColor: "#f3f4f6",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}
                >
                  ACOMPTES VERSÉS (Art. 86C)
                </Text>
              </View>
              {result.detailAcomptes.map((a) => (
                <TableRow
                  key={a.label}
                  label={a.label}
                  value={a.montant > 0 ? formatNumber(a.montant) : "—"}
                />
              ))}
              <View
                style={{
                  backgroundColor: "#00815d10",
                  paddingHorizontal: 14,
                  paddingVertical: 10,
                  borderTopWidth: 1,
                  borderTopColor: "#e5e7eb",
                }}
              >
                <View className="flex-row items-center justify-between">
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: "600",
                      color: "#00815d",
                    }}
                  >
                    TOTAL ACOMPTES
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: "800",
                      color: "#00815d",
                    }}
                  >
                    {formatNumber(result.totalAcomptes)}
                  </Text>
                </View>
              </View>

              {/* Solde */}
              <View
                style={{
                  backgroundColor: "#f3f4f6",
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                }}
              >
                <Text
                  style={{ fontSize: 12, fontWeight: "700", color: "#374151" }}
                >
                  SOLDE DE LIQUIDATION (Art. 86G)
                </Text>
              </View>
              <TableRow
                label="IS calculé - Acomptes"
                value={`${formatNumber(result.isCalcule)} - ${formatNumber(result.totalAcomptes)}`}
                bg="#f9fafb"
              />

              {result.creditImpot ? (
                <View
                  style={{
                    backgroundColor: "#ecfdf5",
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#e5e7eb",
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#059669",
                      }}
                    >
                      CRÉDIT D'IMPÔT
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: "#059669",
                      }}
                    >
                      {formatNumber(Math.abs(result.solde))}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#6b7280",
                      marginTop: 4,
                    }}
                  >
                    Trop-perçu imputable sur les exercices suivants
                  </Text>
                </View>
              ) : (
                <View
                  style={{
                    backgroundColor: "#fef2f2",
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    borderTopWidth: 1,
                    borderTopColor: "#e5e7eb",
                  }}
                >
                  <View className="flex-row items-center justify-between">
                    <Text
                      style={{
                        fontSize: 12,
                        fontWeight: "700",
                        color: "#991b1b",
                      }}
                    >
                      SOLDE À PAYER
                    </Text>
                    <Text
                      style={{
                        fontSize: 16,
                        fontWeight: "800",
                        color: "#b91c1c",
                      }}
                    >
                      {formatNumber(result.solde)}
                    </Text>
                  </View>
                  <Text
                    style={{
                      fontSize: 10,
                      color: "#6b7280",
                      marginTop: 4,
                    }}
                  >
                    À verser spontanément après déclaration (Art. 86G)
                  </Text>
                </View>
              )}
            </View>
          ) : (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                padding: 32,
              }}
            >
              <Ionicons name="calculator-outline" size={40} color="#d1d5db" />
              <Text
                style={{
                  fontSize: 13,
                  color: "#9ca3af",
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                Saisissez le résultat fiscal pour voir le calcul
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
      <Text style={{ fontSize: 11, color: "#6b7280", marginBottom: 3 }}>
        {label}
      </Text>
      <View
        className="flex-row items-center bg-white px-3"
        style={{
          borderRadius: 6,
          height: 40,
          borderWidth: 1,
          borderColor: "#e5e7eb",
        }}
      >
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
