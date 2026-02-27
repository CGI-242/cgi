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
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import {
  organizationApi,
  type Organization,
  type OrgMember,
  type Invitation,
} from "@/lib/api/organization";

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

export default function OrganisationScreen() {
  const user = useAuthStore((s) => s.user);
  const orgId = user?.entreprise_id;

  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "ADMIN">("MEMBER");

  // Menu ouvert pour un membre
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const currentUserRole = members.find((m) => m.userId === user?.id)?.role;
  const isOwner = currentUserRole === "OWNER";
  const isAdmin = currentUserRole === "ADMIN" || isOwner;

  const loadData = useCallback(async () => {
    if (!orgId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const [orgData, membersData, invData] = await Promise.all([
        organizationApi.getOrganization(orgId),
        organizationApi.getMembers(orgId),
        organizationApi.getInvitations(orgId),
      ]);
      setOrg(orgData);
      setMembers(membersData);
      setInvitations(invData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur inconnue";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [orgId]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleInvite = async () => {
    if (!orgId || !inviteEmail.trim()) return;
    setActionLoading(true);
    try {
      await organizationApi.inviteMember(orgId, inviteEmail.trim(), inviteRole);
      setInviteEmail("");
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveMember = (member: OrgMember) => {
    if (!orgId) return;
    const msg = `Retirer ${member.name || member.email} de l'organisation ?`;
    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doRemoveMember(member.userId);
    } else {
      Alert.alert("Confirmer", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Retirer", style: "destructive", onPress: () => doRemoveMember(member.userId) },
      ]);
    }
  };

  const doRemoveMember = async (userId: string) => {
    if (!orgId) return;
    setActionLoading(true);
    try {
      await organizationApi.removeMember(orgId, userId);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleChangeRole = async (member: OrgMember, newRole: string) => {
    if (!orgId) return;
    setActionLoading(true);
    try {
      await organizationApi.changeMemberRole(orgId, member.userId, newRole);
      setMenuOpenId(null);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelInvitation = async (invId: string) => {
    if (!orgId) return;
    setActionLoading(true);
    try {
      await organizationApi.cancelInvitation(orgId, invId);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleTransferOwnership = (member: OrgMember) => {
    if (!orgId) return;
    const msg = `Transférer la propriété de l'organisation à ${member.name || member.email} ? Cette action est irréversible.`;
    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doTransfer(member.userId);
    } else {
      Alert.alert("Transférer la propriété", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Transférer", style: "destructive", onPress: () => doTransfer(member.userId) },
      ]);
    }
  };

  const doTransfer = async (newOwnerId: string) => {
    if (!orgId) return;
    setActionLoading(true);
    try {
      await organizationApi.transferOwnership(orgId, newOwnerId);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
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

  if (!orgId) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
        <View style={{ backgroundColor: "#1a1a1a", paddingTop: Platform.OS === "ios" ? 56 : 16, paddingBottom: 16, paddingHorizontal: 16, flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Organisation</Text>
        </View>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24 }}>
          <Ionicons name="business-outline" size={48} color="#d1d5db" />
          <Text style={{ marginTop: 12, color: "#6b7280", fontSize: 16, textAlign: "center" }}>
            Vous n'appartenez à aucune organisation
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <View style={{ backgroundColor: "#1a1a1a", paddingTop: Platform.OS === "ios" ? 56 : 16, paddingBottom: 16, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
              <Ionicons name="arrow-back" size={22} color="#fff" />
            </TouchableOpacity>
            <View>
              <Text style={{ color: "#fff", fontSize: 18, fontWeight: "700" }}>Organisation</Text>
              <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>Gestion des membres</Text>
            </View>
          </View>
          <TouchableOpacity onPress={loadData} style={{ padding: 8 }}>
            <Ionicons name="refresh-outline" size={20} color="#00c17c" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Détails organisation */}
        {org && (
          <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: "#00815d", justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                <Ionicons name="business" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 18, fontWeight: "700", color: "#1f2937" }}>{org.name}</Text>
                <Text style={{ fontSize: 13, color: "#6b7280" }}>{org.plan || "Gratuit"} — {org.memberCount} membre{org.memberCount > 1 ? "s" : ""}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Liste membres */}
        <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
          MEMBRES ({members.length})
        </Text>
        {members.map((member) => {
          const roleColor = ROLE_COLORS[member.role] || "#6b7280";
          const initials = (member.name || member.email).substring(0, 2).toUpperCase();
          const isMenuOpen = menuOpenId === member.userId;

          return (
            <View
              key={member.userId}
              style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 14, marginBottom: 8 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Avatar */}
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: `${roleColor}20`, justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: roleColor }}>{initials}</Text>
                </View>
                {/* Infos */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: "#1f2937" }}>{member.name || member.email}</Text>
                  <Text style={{ fontSize: 12, color: "#9ca3af" }}>{member.email}</Text>
                </View>
                {/* Badge rôle */}
                <View style={{ backgroundColor: `${roleColor}20`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8 }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: roleColor }}>{ROLE_LABELS[member.role] || member.role}</Text>
                </View>
                {/* Menu actions */}
                {isAdmin && member.role !== "OWNER" && (
                  <TouchableOpacity onPress={() => setMenuOpenId(isMenuOpen ? null : member.userId)} style={{ padding: 4 }}>
                    <Ionicons name="ellipsis-vertical" size={18} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>

              {/* Menu dropdown */}
              {isMenuOpen && isAdmin && member.role !== "OWNER" && (
                <View style={{ marginTop: 10, backgroundColor: "#f9fafb", borderRadius: 8, padding: 8 }}>
                  {/* Changer rôle */}
                  {(["MEMBER", "ADMIN", "VIEWER"] as const).filter((r) => r !== member.role).map((role) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => handleChangeRole(member, role)}
                      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8 }}
                    >
                      <Ionicons name="swap-horizontal-outline" size={16} color="#374151" style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 13, color: "#374151" }}>Rôle → {ROLE_LABELS[role]}</Text>
                    </TouchableOpacity>
                  ))}
                  {/* Retirer */}
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(member)}
                    style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: "#e5e7eb", marginTop: 4 }}
                  >
                    <Ionicons name="person-remove-outline" size={16} color="#dc2626" style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 13, color: "#dc2626" }}>Retirer de l'organisation</Text>
                  </TouchableOpacity>
                  {/* Transférer propriété */}
                  {isOwner && (
                    <TouchableOpacity
                      onPress={() => handleTransferOwnership(member)}
                      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: "#e5e7eb", marginTop: 4 }}
                    >
                      <Ionicons name="arrow-forward-circle-outline" size={16} color="#8b5cf6" style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 13, color: "#8b5cf6" }}>Transférer la propriété</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </View>
          );
        })}

        {/* Section inviter */}
        {isAdmin && (
          <>
            <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4, marginTop: 16 }}>
              INVITER UN MEMBRE
            </Text>
            <View style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 16, marginBottom: 16 }}>
              <TextInput
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="Adresse email"
                placeholderTextColor="#9ca3af"
                keyboardType="email-address"
                autoCapitalize="none"
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
              {/* Sélecteur rôle */}
              <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
                {(["MEMBER", "ADMIN"] as const).map((role) => (
                  <TouchableOpacity
                    key={role}
                    onPress={() => setInviteRole(role)}
                    style={{
                      flex: 1,
                      paddingVertical: 10,
                      borderRadius: 8,
                      alignItems: "center",
                      backgroundColor: inviteRole === role ? "#00815d" : "#f3f4f6",
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "600", color: inviteRole === role ? "#fff" : "#374151" }}>
                      {ROLE_LABELS[role]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={handleInvite}
                disabled={actionLoading || !inviteEmail.trim()}
                style={{
                  backgroundColor: !inviteEmail.trim() ? "#9ca3af" : "#00815d",
                  borderRadius: 8,
                  paddingVertical: 12,
                  alignItems: "center",
                }}
              >
                {actionLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Inviter</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        )}

        {/* Invitations en attente */}
        {invitations.length > 0 && (
          <>
            <Text style={{ color: "#6b7280", fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
              INVITATIONS EN ATTENTE ({invitations.length})
            </Text>
            {invitations.map((inv) => (
              <View
                key={inv.id}
                style={{ backgroundColor: "#fff", borderRadius: 12, borderWidth: 1, borderColor: "#e5e7eb", padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons name="mail-outline" size={20} color="#d97706" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: "#1f2937" }}>{inv.email}</Text>
                  <Text style={{ fontSize: 12, color: "#9ca3af" }}>Rôle : {ROLE_LABELS[inv.role] || inv.role}</Text>
                </View>
                {isAdmin && (
                  <TouchableOpacity onPress={() => handleCancelInvitation(inv.id)} style={{ padding: 6 }}>
                    <Ionicons name="close-circle-outline" size={22} color="#dc2626" />
                  </TouchableOpacity>
                )}
              </View>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
