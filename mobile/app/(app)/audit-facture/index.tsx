import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { useTranslation } from "react-i18next";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import { analyzeFacture, type AuditFactureResult } from "@/lib/api/audit-facture";

type FileInfo = { name: string; size: number; blob: Blob };

export default function AuditFacturePage() {
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const { t } = useTranslation();
  const [file, setFile] = useState<FileInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AuditFactureResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const pickFile = async () => {
    if (Platform.OS === "web") {
      inputRef.current?.click();
    } else {
      try {
        const DocumentPicker = await import("expo-document-picker");
        const res = await DocumentPicker.getDocumentAsync({
          type: ["application/pdf", "image/jpeg", "image/png"],
          copyToCacheDirectory: true,
        });
        if (!res.canceled && res.assets?.[0]) {
          const asset = res.assets[0];
          const response = await fetch(asset.uri);
          const blob = await response.blob();
          setFile({ name: asset.name, size: asset.size || 0, blob });
          setResult(null);
          setError(null);
        }
      } catch {
        setError("Erreur lors de la selection du fichier");
      }
    }
  };

  const handleWebFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setFile({ name: f.name, size: f.size, blob: f });
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeFacture(file.blob, file.name);
      setResult(res);
    } catch (err: any) {
      setError(err?.response?.data?.error || "Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = (found: number, total: number) => {
    const pct = found / total;
    if (pct >= 0.85) return colors.success;
    if (pct >= 0.6) return colors.warning;
    return colors.danger;
  };

  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={{ maxWidth: 900, alignSelf: "center", width: "100%", padding: isMobile ? 16 : 32 }}>
        {/* Header */}
        <Text style={{ fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: isMobile ? 24 : 32, color: colors.text, marginBottom: 8 }}>
          Audit Facture
        </Text>
        <Text style={{ fontFamily: fonts.regular, fontSize: 15, color: colors.textSecondary, marginBottom: 24 }}>
          Analysez la conformite de vos factures au CGI 2026 (Art. 32, Art. 22, Art. 7)
        </Text>

        {/* Upload */}
        <TouchableOpacity
          onPress={pickFile}
          style={{
            borderWidth: 2,
            borderStyle: "dashed",
            borderColor: file ? colors.success : colors.border,
            borderRadius: 16,
            padding: 32,
            alignItems: "center",
            backgroundColor: file ? `${colors.success}08` : colors.card,
            marginBottom: 16,
          }}
        >
          <Ionicons name={file ? "document-text" : "cloud-upload-outline"} size={40} color={file ? colors.success : colors.textMuted} />
          {file ? (
            <View style={{ alignItems: "center", marginTop: 12 }}>
              <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: colors.text }}>{file.name}</Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textSecondary, marginTop: 4 }}>{(file.size / 1024).toFixed(0)} Ko</Text>
            </View>
          ) : (
            <View style={{ alignItems: "center", marginTop: 12 }}>
              <Text style={{ fontFamily: fonts.semiBold, fontWeight: fontWeights.semiBold, fontSize: 16, color: colors.text }}>
                Selectionnez une facture
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 13, color: colors.textMuted, marginTop: 4 }}>
                PDF, JPEG ou PNG — 10 Mo max
              </Text>
            </View>
          )}
        </TouchableOpacity>

        {Platform.OS === "web" && (
          <input
            ref={inputRef as any}
            type="file"
            accept="application/pdf,image/jpeg,image/png"
            onChange={handleWebFile as any}
            style={{ display: "none" }}
          />
        )}

        {/* Bouton analyser */}
        <TouchableOpacity
          onPress={handleAnalyze}
          disabled={!file || loading}
          style={{
            backgroundColor: file && !loading ? "#1A3A5C" : colors.disabled,
            borderRadius: 12,
            paddingVertical: 14,
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          {loading ? (
            <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
              <ActivityIndicator color="#fff" size="small" />
              <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: "#fff" }}>
                Analyse en cours...
              </Text>
            </View>
          ) : (
            <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: "#fff" }}>
              Analyser la facture
            </Text>
          )}
        </TouchableOpacity>

        {error && (
          <View style={{ backgroundColor: `${colors.danger}15`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontFamily: fonts.regular, color: colors.danger }}>{error}</Text>
          </View>
        )}

        {/* Resultats */}
        {result && (
          <View style={{ gap: 16 }}>
            {/* Score */}
            <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 24, alignItems: "center", borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontFamily: fonts.headingBlack, fontWeight: fontWeights.headingBlack, fontSize: 48, color: scoreColor(result.score.found, result.score.total) }}>
                {result.score.found}/{result.score.total}
              </Text>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, marginTop: 4 }}>
                mentions obligatoires detectees
              </Text>
            </View>

            {/* Langue */}
            <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Ionicons name={result.langue.conforme ? "checkmark-circle" : "close-circle"} size={22} color={result.langue.conforme ? colors.success : colors.danger} />
                <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: colors.text }}>Langue</Text>
              </View>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary }}>{result.langue.details}</Text>
            </View>

            {/* TVA */}
            <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Ionicons name={result.tva.conforme ? "checkmark-circle" : "alert-circle"} size={22} color={result.tva.conforme ? colors.success : colors.warning} />
                <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: colors.text }}>Taux TVA</Text>
              </View>
              <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary }}>{result.tva.details}</Text>
              {result.tva.tauxApplique && (
                <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 13, color: colors.text, marginTop: 6 }}>
                  Applique : {result.tva.tauxApplique} {result.tva.tauxAttendu ? `| Attendu : ${result.tva.tauxAttendu}` : ""}
                </Text>
              )}
            </View>

            {/* Mentions */}
            <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
              <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: colors.text, marginBottom: 12 }}>
                Mentions obligatoires (Art. 32)
              </Text>
              {result.mentions.map((m, i) => (
                <View key={i} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: colors.border }}>
                  <Ionicons name={m.present ? "checkmark-circle" : "close-circle"} size={18} color={m.present ? colors.success : colors.danger} style={{ marginRight: 10 }} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontFamily: fonts.medium, fontWeight: fontWeights.medium, fontSize: 14, color: colors.text }}>{m.nom}</Text>
                    {m.valeur && (
                      <Text style={{ fontFamily: fonts.regular, fontSize: 12, color: colors.textMuted, marginTop: 2 }} numberOfLines={1}>{m.valeur}</Text>
                    )}
                  </View>
                </View>
              ))}
            </View>

            {/* Risques */}
            {result.risques.length > 0 && (
              <View style={{ backgroundColor: `${colors.danger}08`, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: `${colors.danger}30` }}>
                <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: colors.danger, marginBottom: 12 }}>
                  Risques identifies
                </Text>
                {result.risques.map((r, i) => (
                  <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
                    <Ionicons name="warning" size={16} color={colors.danger} style={{ marginRight: 8, marginTop: 2 }} />
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.text }}>{r.description}</Text>
                      {r.montant && <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 13, color: colors.danger, marginTop: 2 }}>{r.montant}</Text>}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Recommandations */}
            {result.recommandations.length > 0 && (
              <View style={{ backgroundColor: colors.card, borderRadius: 16, padding: 20, borderWidth: 1, borderColor: colors.border }}>
                <Text style={{ fontFamily: fonts.bold, fontWeight: fontWeights.bold, fontSize: 16, color: colors.text, marginBottom: 12 }}>
                  Recommandations
                </Text>
                {result.recommandations.map((r, i) => (
                  <View key={i} style={{ flexDirection: "row", alignItems: "flex-start", marginBottom: 8 }}>
                    <Ionicons name="bulb-outline" size={16} color={colors.primary} style={{ marginRight: 8, marginTop: 2 }} />
                    <Text style={{ fontFamily: fonts.regular, fontSize: 14, color: colors.textSecondary, flex: 1 }}>{r}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </ScrollView>
  );
}
