import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  TextInput,
  Alert,
  Platform,
  Image,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { mfaApi, type MfaStatus, type MfaSetupResult } from "@/lib/api/mfa";

type SetupStep = "idle" | "qr" | "verify" | "backup";

export default function SecuriteScreen() {
  const [status, setStatus] = useState<MfaStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Setup flow
  const [setupStep, setSetupStep] = useState<SetupStep>("idle");
  const [setupData, setSetupData] = useState<MfaSetupResult | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  // Disable flow
  const [showDisable, setShowDisable] = useState(false);
  const [disablePassword, setDisablePassword] = useState("");

  const loadStatus = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await mfaApi.getStatus();
      setStatus(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadStatus();
  }, [loadStatus]);

  const handleStartSetup = async () => {
    setActionLoading(true);
    try {
      const data = await mfaApi.setup();
      setSetupData(data);
      setSetupStep("qr");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleEnableMfa = async () => {
    if (!totpCode.trim()) return;
    setActionLoading(true);
    try {
      const result = await mfaApi.enable(totpCode.trim());
      setBackupCodes(result.backupCodes);
      setSetupStep("backup");
      setTotpCode("");
      await loadStatus();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Code invalide";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDisableMfa = async () => {
    if (!disablePassword.trim()) return;
    const msg = "Désactiver l'authentification à deux facteurs ?";
    const doDisable = async () => {
      setActionLoading(true);
      try {
        await mfaApi.disable(disablePassword.trim());
        setDisablePassword("");
        setShowDisable(false);
        await loadStatus();
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", errMsg);
      } finally {
        setActionLoading(false);
      }
    };

    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doDisable();
    } else {
      Alert.alert("Confirmer", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Désactiver", style: "destructive", onPress: doDisable },
      ]);
    }
  };

  const handleRegenerateBackupCodes = async () => {
    const msg = "Régénérer les codes de secours ? Les anciens codes seront invalidés.";
    const doRegenerate = async () => {
      setActionLoading(true);
      try {
        const result = await mfaApi.regenerateBackupCodes();
        setBackupCodes(result.backupCodes);
        setSetupStep("backup");
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", errMsg);
      } finally {
        setActionLoading(false);
      }
    };

    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doRegenerate();
    } else {
      Alert.alert("Confirmer", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Régénérer", onPress: doRegenerate },
      ]);
    }
  };

  const copyBackupCodes = async () => {
    try {
      await Clipboard.setStringAsync(backupCodes.join("\n"));
      Alert.alert("Copié", "Codes de secours copiés dans le presse-papiers");
    } catch {
      Alert.alert("Erreur", "Impossible de copier les codes");
    }
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f3f4f6" }}>
        <ActivityIndicator size="large" color="#00815d" />
        <Text style={{ marginTop: 12, color: "#6b7280", fontSize: 14 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingTop: Platform.OS === "ios" ? 56 : 16, paddingBottom: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <View>
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Sécurité</Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Double authentification</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Statut MFA */}
        <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 16 }}>
          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="shield-checkmark" size={24} color={status?.enabled ? "#16a34a" : "#dc2626"} style={{ marginRight: 12 }} />
              <View>
                <Text style={{ fontSize: 16, fontWeight: "700", color: "#1f2937" }}>Authentification 2FA</Text>
                <Text style={{ fontSize: 13, color: "#6b7280" }}>
                  {status?.enabled ? "Protège votre compte avec un code TOTP" : "Non configurée"}
                </Text>
              </View>
            </View>
            <View style={{ backgroundColor: status?.enabled ? "#f0fdf4" : "#fef2f2", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: status?.enabled ? "#16a34a" : "#dc2626" }}>
                {status?.enabled ? "Activé" : "Désactivé"}
              </Text>
            </View>
          </View>
          {status?.enabled && (
            <View style={{ marginTop: 12, flexDirection: "row", alignItems: "center" }}>
              <Ionicons name="key-outline" size={16} color="#6b7280" style={{ marginRight: 6 }} />
              <Text style={{ fontSize: 13, color: "#6b7280" }}>
                {status.backupCodesRemaining} code{status.backupCodesRemaining > 1 ? "s" : ""} de secours restant{status.backupCodesRemaining > 1 ? "s" : ""}
              </Text>
            </View>
          )}
        </View>

        {/* Flow setup (MFA désactivé) */}
        {!status?.enabled && setupStep === "idle" && (
          <TouchableOpacity
            onPress={handleStartSetup}
            disabled={actionLoading}
            style={{ backgroundColor: "#00815d", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 16 }}
          >
            {actionLoading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Activer la double authentification</Text>
              </View>
            )}
          </TouchableOpacity>
        )}

        {/* Étape QR Code */}
        {setupStep === "qr" && setupData && (
          <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 15, fontWeight: "600", color: "#1f2937", marginBottom: 12 }}>
              1. Scannez le QR code avec votre application d'authentification
            </Text>
            <View style={{ alignItems: "center", marginBottom: 16 }}>
              <Image
                source={{ uri: setupData.qrCodeUrl }}
                style={{ width: 200, height: 200, borderRadius: 8 }}
                resizeMode="contain"
              />
            </View>
            <Text style={{ fontSize: 13, color: "#6b7280", marginBottom: 8 }}>
              Ou entrez le code manuellement :
            </Text>
            <View style={{ backgroundColor: "#f3f4f6", borderRadius: 8, padding: 12, marginBottom: 16 }}>
              <Text style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 14, color: "#374151", textAlign: "center" }}>
                {setupData.secret}
              </Text>
            </View>

            <Text style={{ fontSize: 15, fontWeight: "600", color: "#1f2937", marginBottom: 8 }}>
              2. Entrez le code à 6 chiffres
            </Text>
            <TextInput
              value={totpCode}
              onChangeText={setTotpCode}
              placeholder="000000"
              placeholderTextColor="#9ca3af"
              keyboardType="number-pad"
              maxLength={6}
              style={{
                backgroundColor: "#f3f4f6",
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 20,
                color: "#1f2937",
                textAlign: "center",
                letterSpacing: 8,
                marginBottom: 12,
              }}
            />
            <TouchableOpacity
              onPress={handleEnableMfa}
              disabled={actionLoading || totpCode.length < 6}
              style={{
                backgroundColor: totpCode.length < 6 ? "#9ca3af" : "#00815d",
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              {actionLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Activer</Text>
              )}
            </TouchableOpacity>
          </View>
        )}

        {/* Codes de secours */}
        {setupStep === "backup" && backupCodes.length > 0 && (
          <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <Ionicons name="warning-outline" size={20} color="#d97706" style={{ marginRight: 8 }} />
              <Text style={{ fontSize: 15, fontWeight: "600", color: "#1f2937" }}>
                Codes de secours
              </Text>
            </View>
            <Text style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
              Sauvegardez ces codes dans un endroit sûr. Ils vous permettront de vous connecter si vous perdez l'accès à votre application d'authentification.
            </Text>
            <View style={{ backgroundColor: "#f3f4f6", borderRadius: 8, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 12 }}>
              {backupCodes.map((code, i) => (
                <Text
                  key={i}
                  style={{ fontFamily: Platform.OS === "ios" ? "Menlo" : "monospace", fontSize: 14, color: "#374151", lineHeight: 24, textAlign: "center" }}
                >
                  {code}
                </Text>
              ))}
            </View>
            <TouchableOpacity
              onPress={copyBackupCodes}
              style={{ backgroundColor: "#374151", borderRadius: 8, paddingVertical: 10, alignItems: "center", marginBottom: 8 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="copy-outline" size={16} color="#fff" style={{ marginRight: 6 }} />
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Copier les codes</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => { setSetupStep("idle"); setBackupCodes([]); }}
              style={{ backgroundColor: "#00815d", borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>J'ai sauvegardé mes codes</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Gestion MFA activé */}
        {status?.enabled && setupStep === "idle" && (
          <>
            <TouchableOpacity
              onPress={handleRegenerateBackupCodes}
              disabled={actionLoading}
              style={{ backgroundColor: "#374151", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 12 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="refresh-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Régénérer les codes de secours</Text>
              </View>
            </TouchableOpacity>

            {!showDisable ? (
              <TouchableOpacity
                onPress={() => setShowDisable(true)}
                style={{ backgroundColor: "#fef2f2", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="shield-outline" size={18} color="#dc2626" style={{ marginRight: 8 }} />
                  <Text style={{ color: "#dc2626", fontWeight: "600", fontSize: 14 }}>Désactiver la 2FA</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#fca5a5", padding: 16 }}>
                <Text style={{ fontSize: 14, fontWeight: "600", color: "#dc2626", marginBottom: 8 }}>
                  Confirmer la désactivation
                </Text>
                <Text style={{ fontSize: 13, color: "#6b7280", marginBottom: 12 }}>
                  Entrez votre mot de passe pour désactiver la double authentification.
                </Text>
                <TextInput
                  value={disablePassword}
                  onChangeText={setDisablePassword}
                  placeholder="Mot de passe"
                  placeholderTextColor="#9ca3af"
                  secureTextEntry
                  style={{
                    backgroundColor: "#f3f4f6",
                    borderRadius: 8,
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: "#1f2937",
                    marginBottom: 12,
                  }}
                />
                <View style={{ flexDirection: "row", gap: 8 }}>
                  <TouchableOpacity
                    onPress={() => { setShowDisable(false); setDisablePassword(""); }}
                    style={{ flex: 1, backgroundColor: "#f3f4f6", borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
                  >
                    <Text style={{ color: "#374151", fontWeight: "600", fontSize: 14 }}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleDisableMfa}
                    disabled={actionLoading || !disablePassword.trim()}
                    style={{ flex: 1, backgroundColor: "#dc2626", borderRadius: 8, paddingVertical: 10, alignItems: "center" }}
                  >
                    {actionLoading ? (
                      <ActivityIndicator size="small" color="#fff" />
                    ) : (
                      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Désactiver</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
