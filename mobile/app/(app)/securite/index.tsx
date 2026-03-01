import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as Clipboard from "expo-clipboard";
import { mfaApi, type MfaStatus, type MfaSetupResult } from "@/lib/api/mfa";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/store/auth";
import { useTheme } from "@/lib/theme/ThemeContext";
import MfaStatusCard from "@/components/securite/MfaStatusCard";
import MfaSetupFlow from "@/components/securite/MfaSetupFlow";
import BackupCodesDisplay from "@/components/securite/BackupCodesDisplay";
import LogoutAllButton from "@/components/securite/LogoutAllButton";

type SetupStep = "idle" | "qr" | "verify" | "backup";

export default function SecuriteScreen() {
  const { colors } = useTheme();
  const logout = useAuthStore((s) => s.logout);
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

  const handleLogoutAll = () => {
    const msg = "Déconnecter tous les appareils ? Vous serez également déconnecté de cet appareil.";
    const doLogoutAll = async () => {
      setActionLoading(true);
      try {
        await authApi.logoutAll();
        await logout();
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", errMsg);
      } finally {
        setActionLoading(false);
      }
    };

    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doLogoutAll();
    } else {
      Alert.alert("Confirmer", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnecter tout", style: "destructive", onPress: doLogoutAll },
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 14 }}>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {error && (
          <View style={{ backgroundColor: `${colors.danger}15`, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: colors.danger, fontSize: 14 }}>{error}</Text>
          </View>
        )}

        <MfaStatusCard status={status} colors={colors} />

        <MfaSetupFlow
          setupStep={setupStep}
          setupData={setupData}
          totpCode={totpCode}
          actionLoading={actionLoading}
          mfaEnabled={!!status?.enabled}
          showDisable={showDisable}
          disablePassword={disablePassword}
          onStartSetup={handleStartSetup}
          onEnableMfa={handleEnableMfa}
          onChangeTotpCode={setTotpCode}
          onRegenerateBackupCodes={handleRegenerateBackupCodes}
          onShowDisable={() => setShowDisable(true)}
          onCancelDisable={() => { setShowDisable(false); setDisablePassword(""); }}
          onChangeDisablePassword={setDisablePassword}
          onDisableMfa={handleDisableMfa}
          colors={colors}
        />

        {setupStep === "backup" && (
          <BackupCodesDisplay
            backupCodes={backupCodes}
            onCopy={copyBackupCodes}
            onDone={() => { setSetupStep("idle"); setBackupCodes([]); }}
            colors={colors}
          />
        )}

        <LogoutAllButton
          actionLoading={actionLoading}
          onLogoutAll={handleLogoutAll}
          colors={colors}
        />
      </ScrollView>
    </View>
  );
}
