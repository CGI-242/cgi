import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { useAuthStore } from "@/lib/store/auth";
import {
  permissionsApi,
  type MyPermissions,
  type PermissionItem,
  type EffectivePermissions,
} from "@/lib/api/permissions";
import { organizationApi, type OrgMember } from "@/lib/api/organization";
import { useTheme } from "@/lib/theme/ThemeContext";
import MyPermissionsCard from "@/components/permissions/MyPermissionsCard";
import MemberSelector from "@/components/permissions/MemberSelector";
import PermissionToggles from "@/components/permissions/PermissionToggles";

export default function PermissionsScreen() {
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const orgId = user?.entreprise_id != null ? String(user.entreprise_id) : undefined;

  const [myPerms, setMyPerms] = useState<MyPermissions | null>(null);
  const [available, setAvailable] = useState<PermissionItem[]>([]);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Gestion membre
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [memberEffective, setMemberEffective] = useState<EffectivePermissions | null>(null);

  const isOwner = myPerms?.role === "OWNER";

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [myData, availData] = await Promise.all([
        permissionsApi.getMyPermissions(),
        permissionsApi.getAvailable(),
      ]);
      setMyPerms(myData);
      setAvailable(availData);

      if (orgId && (myData.role === "OWNER" || myData.role === "ADMIN")) {
        const membersData = await organizationApi.getMembers(orgId);
        setMembers(membersData.filter((m) => m.userId !== String(user?.id)));
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [orgId, user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadMemberPerms = useCallback(async (userId: string) => {
    try {
      const data = await permissionsApi.getMemberEffective(userId);
      setMemberEffective(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    }
  }, []);

  useEffect(() => {
    if (selectedMemberId) {
      loadMemberPerms(selectedMemberId);
    } else {
      setMemberEffective(null);
    }
  }, [selectedMemberId, loadMemberPerms]);

  const handleTogglePermission = async (userId: string, permission: string, currentlyGranted: boolean) => {
    setActionLoading(true);
    try {
      if (currentlyGranted) {
        await permissionsApi.revokePermission(userId, permission);
      } else {
        await permissionsApi.grantPermission(userId, permission);
      }
      await loadMemberPerms(userId);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReset = (userId: string) => {
    const msg = "Réinitialiser les permissions aux valeurs par défaut du rôle ?";
    const doReset = async () => {
      setActionLoading(true);
      try {
        await permissionsApi.resetToDefaults(userId);
        await loadMemberPerms(userId);
      } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", errMsg);
      } finally {
        setActionLoading(false);
      }
    };

    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doReset();
    } else {
      Alert.alert("Confirmer", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Réinitialiser", onPress: doReset },
      ]);
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

        {/* Mes permissions */}
        {myPerms && (
          <MyPermissionsCard myPerms={myPerms} available={available} colors={colors} />
        )}

        {/* Gestion membres (admin/owner only) */}
        {members.length > 0 && (myPerms?.role === "OWNER" || myPerms?.role === "ADMIN") && (
          <>
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
              PERMISSIONS DES MEMBRES
            </Text>

            <MemberSelector
              members={members}
              selectedMemberId={selectedMemberId}
              onSelect={setSelectedMemberId}
              colors={colors}
            />

            {selectedMemberId && memberEffective && (
              <PermissionToggles
                available={available}
                memberEffective={memberEffective}
                selectedMemberId={selectedMemberId}
                isOwner={isOwner}
                actionLoading={actionLoading}
                onToggle={handleTogglePermission}
                onReset={handleReset}
                colors={colors}
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
