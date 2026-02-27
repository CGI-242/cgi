import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Switch,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import {
  permissionsApi,
  type MyPermissions,
  type PermissionItem,
  type EffectivePermissions,
} from "@/lib/api/permissions";
import { organizationApi, type OrgMember } from "@/lib/api/organization";

const PERMISSION_LABELS: Record<string, string> = {
  "org.view": "Voir l'organisation",
  "org.edit": "Modifier l'organisation",
  "org.delete": "Supprimer l'organisation",
  "org.members.view": "Voir les membres",
  "org.members.invite": "Inviter des membres",
  "org.members.remove": "Retirer des membres",
  "org.members.role": "Changer les rôles",
  "org.billing.view": "Voir la facturation",
  "org.billing.manage": "Gérer la facturation",
  "analytics.view": "Voir les analytiques",
  "analytics.export": "Exporter les données",
  "audit.view": "Voir les audits",
  "chat.use": "Utiliser le chat IA",
  "code.view": "Consulter le code CGI",
  "simulator.use": "Utiliser les simulateurs",
  "alerts.view": "Voir les alertes fiscales",
};

const ROLE_COLORS: Record<string, string> = {
  OWNER: "#8b5cf6",
  ADMIN: "#3b82f6",
  MEMBER: "#16a34a",
  VIEWER: "#6b7280",
};

const ROLE_LABELS: Record<string, string> = {
  OWNER: "Propriétaire",
  ADMIN: "Administrateur",
  MEMBER: "Membre",
  VIEWER: "Lecteur",
};

export default function PermissionsScreen() {
  const user = useAuthStore((s) => s.user);
  const orgId = user?.entreprise_id;

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
        setMembers(membersData.filter((m) => m.userId !== user?.id));
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
            <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Permissions</Text>
            <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Gestion des droits d'accès</Text>
          </View>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Mes permissions */}
        {myPerms && (
          <>
            <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
              MES PERMISSIONS
            </Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 20 }}>
              <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
                <Ionicons name="person-circle-outline" size={24} color="#374151" style={{ marginRight: 10 }} />
                <Text style={{ fontSize: 15, fontWeight: "600", color: "#1f2937", flex: 1 }}>Mon rôle</Text>
                <View style={{ backgroundColor: `${ROLE_COLORS[myPerms.role] || "#6b7280"}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                  <Text style={{ fontSize: 12, fontWeight: "700", color: ROLE_COLORS[myPerms.role] || "#6b7280" }}>
                    {ROLE_LABELS[myPerms.role] || myPerms.role}
                  </Text>
                </View>
              </View>
              {available.map((perm) => {
                const hasIt = myPerms.permissions.includes(perm.key);
                return (
                  <View key={perm.key} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
                    <Ionicons name={hasIt ? "checkmark-circle" : "close-circle"} size={18} color={hasIt ? "#16a34a" : "#dc2626"} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 13, color: "#374151", flex: 1 }}>{PERMISSION_LABELS[perm.key] || perm.key}</Text>
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Gestion membres (admin/owner only) */}
        {members.length > 0 && (myPerms?.role === "OWNER" || myPerms?.role === "ADMIN") && (
          <>
            <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
              PERMISSIONS DES MEMBRES
            </Text>

            {/* Sélecteur membre */}
            <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", marginBottom: 12, overflow: "hidden" }}>
              {members.map((member, index) => {
                const isSelected = selectedMemberId === member.userId;
                const roleColor = ROLE_COLORS[member.role] || "#6b7280";
                return (
                  <TouchableOpacity
                    key={member.userId}
                    onPress={() => setSelectedMemberId(isSelected ? null : member.userId)}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      padding: 12,
                      backgroundColor: isSelected ? "#f0fdf4" : "#fff",
                      borderTopWidth: index > 0 ? 1 : 0,
                      borderTopColor: "#f3f4f6",
                    }}
                  >
                    <View style={{ width: 32, height: 32, borderRadius: 16, backgroundColor: `${roleColor}20`, justifyContent: "center", alignItems: "center", marginRight: 10 }}>
                      <Text style={{ fontSize: 12, fontWeight: "700", color: roleColor }}>
                        {(member.name || member.email).substring(0, 2).toUpperCase()}
                      </Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 14, fontWeight: "600", color: "#1f2937" }}>{member.name || member.email}</Text>
                      <Text style={{ fontSize: 11, color: "#9ca3af" }}>{ROLE_LABELS[member.role] || member.role}</Text>
                    </View>
                    <Ionicons name={isSelected ? "chevron-up" : "chevron-down"} size={16} color="#9ca3af" />
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Permissions du membre sélectionné */}
            {selectedMemberId && memberEffective && (
              <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 12 }}>
                {available.map((perm) => {
                  const hasIt = memberEffective.effective.includes(perm.key);
                  return (
                    <View key={perm.key} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 13, fontWeight: "500", color: "#374151" }}>
                          {PERMISSION_LABELS[perm.key] || perm.key}
                        </Text>
                      </View>
                      <Switch
                        value={hasIt}
                        onValueChange={() => handleTogglePermission(selectedMemberId, perm.key, hasIt)}
                        disabled={!isOwner || actionLoading}
                        trackColor={{ false: "#e5e7eb", true: "#00c17c" }}
                        thumbColor={hasIt ? "#00815d" : "#f4f3f4"}
                      />
                    </View>
                  );
                })}

                {isOwner && (
                  <TouchableOpacity
                    onPress={() => handleReset(selectedMemberId)}
                    disabled={actionLoading}
                    style={{ backgroundColor: "#f3f4f6", borderRadius: 8, paddingVertical: 10, alignItems: "center", marginTop: 12 }}
                  >
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <Ionicons name="refresh-outline" size={16} color="#374151" style={{ marginRight: 6 }} />
                      <Text style={{ color: "#374151", fontWeight: "600", fontSize: 13 }}>Réinitialiser aux valeurs par défaut</Text>
                    </View>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}
