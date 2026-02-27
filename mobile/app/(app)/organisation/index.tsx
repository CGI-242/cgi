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
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";
import {
  organizationApi,
  type Organization,
  type OrgMember,
  type Invitation,
} from "@/lib/api/organization";
import { useTheme } from "@/lib/theme/ThemeContext";

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
  const { colors } = useTheme();
  const user = useAuthStore((s) => s.user);
  const orgId = user?.entreprise_id != null ? String(user.entreprise_id) : undefined;

  const [org, setOrg] = useState<Organization | null>(null);
  const [members, setMembers] = useState<OrgMember[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Invite form
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"MEMBER" | "ADMIN">("MEMBER");

  // Créer organisation
  const [createName, setCreateName] = useState("");
  const [createLoading, setCreateLoading] = useState(false);

  // Modifier nom org
  const [editingName, setEditingName] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");

  // Menu ouvert pour un membre
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  const currentUserRole = members.find((m) => m.userId === String(user?.id))?.role;
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
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(inviteEmail.trim())) {
      Alert.alert("Erreur", "Adresse email invalide");
      return;
    }
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

  const handleCreateOrg = async () => {
    if (!createName.trim()) return;
    setCreateLoading(true);
    try {
      await organizationApi.createOrganization(createName.trim());
      setCreateName("");
      // Recharger la page pour refléter la nouvelle org
      router.replace("/(app)/organisation");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditOrgName = async () => {
    if (!orgId || !newOrgName.trim()) return;
    setActionLoading(true);
    try {
      await organizationApi.updateOrganization(orgId, newOrgName.trim());
      setEditingName(false);
      setNewOrgName("");
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteOrg = () => {
    if (!orgId) return;
    const msg = "Supprimer l'organisation ? Cette action est réversible pendant 30 jours.";
    const doDelete = async () => {
      // Double confirmation
      const msg2 = "Êtes-vous vraiment sûr ? Tapez 'SUPPRIMER' pour confirmer.";
      if (Platform.OS === "web") {
        const input = window.prompt(msg2);
        if (input !== "SUPPRIMER") return;
      }
      setActionLoading(true);
      try {
        await organizationApi.deleteOrganization(orgId);
        router.replace("/(app)/organisation");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", msg);
      } finally {
        setActionLoading(false);
      }
    };

    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doDelete();
    } else {
      Alert.alert("Supprimer l'organisation", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer", style: "destructive", onPress: doDelete },
      ]);
    }
  };

  const handleRestoreOrg = async () => {
    if (!orgId) return;
    setActionLoading(true);
    try {
      await organizationApi.restoreOrganization(orgId);
      await loadData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Erreur";
      Alert.alert("Erreur", msg);
    } finally {
      setActionLoading(false);
    }
  };

  const handlePermanentDelete = () => {
    if (!orgId) return;
    const msg = "Supprimer définitivement l'organisation ? Cette action est IRRÉVERSIBLE.";
    const doPermDelete = async () => {
      setActionLoading(true);
      try {
        await organizationApi.permanentDeleteOrganization(orgId);
        router.replace("/(app)/organisation");
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Erreur";
        Alert.alert("Erreur", msg);
      } finally {
        setActionLoading(false);
      }
    };

    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doPermDelete();
    } else {
      Alert.alert("Suppression définitive", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer définitivement", style: "destructive", onPress: doPermDelete },
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

  if (!orgId) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.background }}>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: "center", padding: 24 }}>
          <View style={{ alignItems: "center", marginBottom: 24 }}>
            <Ionicons name="business-outline" size={48} color={colors.disabled} />
            <Text style={{ marginTop: 12, color: colors.textSecondary, fontSize: 16, textAlign: "center" }}>
              Vous n'appartenez à aucune organisation
            </Text>
          </View>

          {/* Formulaire de création */}
          <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 16 }}>
            <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text, marginBottom: 12 }}>Créer une organisation</Text>
            <TextInput
              value={createName}
              onChangeText={setCreateName}
              placeholder="Nom de l'organisation"
              placeholderTextColor={colors.textMuted}
              style={{
                backgroundColor: colors.background,
                borderRadius: 8,
                paddingHorizontal: 14,
                paddingVertical: 12,
                fontSize: 15,
                color: colors.text,
                marginBottom: 12,
              }}
            />
            <TouchableOpacity
              onPress={handleCreateOrg}
              disabled={createLoading || !createName.trim()}
              style={{
                backgroundColor: !createName.trim() ? colors.textMuted : colors.primary,
                borderRadius: 8,
                paddingVertical: 12,
                alignItems: "center",
              }}
            >
              {createLoading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 15 }}>Créer</Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Lien vers invitations */}
          <TouchableOpacity
            onPress={() => router.push("/(app)/invitations")}
            style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, flexDirection: "row", alignItems: "center" }}
          >
            <Ionicons name="mail-outline" size={22} color={colors.primary} style={{ marginRight: 12 }} />
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>Invitations reçues</Text>
              <Text style={{ fontSize: 13, color: colors.textSecondary }}>Accepter une invitation pour rejoindre une organisation</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {error && (
          <View style={{ backgroundColor: "#fef2f2", borderRadius: 12, padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* Détails organisation */}
        {org && (
          <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
              <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary, justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                <Ionicons name="business" size={22} color="#fff" />
              </View>
              <View style={{ flex: 1 }}>
                {editingName ? (
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
                    <TextInput
                      value={newOrgName}
                      onChangeText={setNewOrgName}
                      placeholder={org.name}
                      placeholderTextColor={colors.textMuted}
                      style={{
                        flex: 1,
                        backgroundColor: colors.background,
                        borderRadius: 6,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        fontSize: 16,
                        color: colors.text,
                      }}
                      autoFocus
                    />
                    <TouchableOpacity onPress={handleEditOrgName} disabled={actionLoading || !newOrgName.trim()}>
                      <Ionicons name="checkmark-circle" size={24} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => { setEditingName(false); setNewOrgName(""); }}>
                      <Ionicons name="close-circle" size={24} color={colors.textMuted} />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ fontSize: 18, fontWeight: "700", color: colors.text }}>{org.name}</Text>
                    {isAdmin && (
                      <TouchableOpacity onPress={() => { setEditingName(true); setNewOrgName(org.name); }} style={{ marginLeft: 8 }}>
                        <Ionicons name="create-outline" size={18} color={colors.primary} />
                      </TouchableOpacity>
                    )}
                  </View>
                )}
                <Text style={{ fontSize: 13, color: colors.textSecondary }}>{org.plan || "Gratuit"} — {org.memberCount} membre{org.memberCount > 1 ? "s" : ""}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Liste membres */}
        <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
          MEMBRES ({members.length})
        </Text>
        {members.map((member) => {
          const roleColor = ROLE_COLORS[member.role] || "#6b7280";
          const initials = (member.name || member.email).substring(0, 2).toUpperCase();
          const isMenuOpen = menuOpenId === member.userId;

          return (
            <View
              key={member.userId}
              style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 8 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                {/* Avatar */}
                <View style={{ width: 38, height: 38, borderRadius: 19, backgroundColor: `${roleColor}20`, justifyContent: "center", alignItems: "center", marginRight: 12 }}>
                  <Text style={{ fontSize: 14, fontWeight: "700", color: roleColor }}>{initials}</Text>
                </View>
                {/* Infos */}
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text }}>{member.name || member.email}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>{member.email}</Text>
                </View>
                {/* Badge rôle */}
                <View style={{ backgroundColor: `${roleColor}20`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginRight: 8 }}>
                  <Text style={{ fontSize: 11, fontWeight: "700", color: roleColor }}>{ROLE_LABELS[member.role] || member.role}</Text>
                </View>
                {/* Menu actions */}
                {isAdmin && member.role !== "OWNER" && (
                  <TouchableOpacity onPress={() => setMenuOpenId(isMenuOpen ? null : member.userId)} style={{ padding: 4 }}>
                    <Ionicons name="ellipsis-vertical" size={18} color={colors.textSecondary} />
                  </TouchableOpacity>
                )}
              </View>

              {/* Menu dropdown */}
              {isMenuOpen && isAdmin && member.role !== "OWNER" && (
                <View style={{ marginTop: 10, backgroundColor: colors.background, borderRadius: 8, padding: 8 }}>
                  {/* Changer rôle */}
                  {(["MEMBER", "ADMIN", "VIEWER"] as const).filter((r) => r !== member.role).map((role) => (
                    <TouchableOpacity
                      key={role}
                      onPress={() => handleChangeRole(member, role)}
                      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8 }}
                    >
                      <Ionicons name="swap-horizontal-outline" size={16} color={colors.text} style={{ marginRight: 8 }} />
                      <Text style={{ fontSize: 13, color: colors.text }}>Rôle → {ROLE_LABELS[role]}</Text>
                    </TouchableOpacity>
                  ))}
                  {/* Retirer */}
                  <TouchableOpacity
                    onPress={() => handleRemoveMember(member)}
                    style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 4 }}
                  >
                    <Ionicons name="person-remove-outline" size={16} color="#dc2626" style={{ marginRight: 8 }} />
                    <Text style={{ fontSize: 13, color: "#dc2626" }}>Retirer de l'organisation</Text>
                  </TouchableOpacity>
                  {/* Transférer propriété */}
                  {isOwner && (
                    <TouchableOpacity
                      onPress={() => handleTransferOwnership(member)}
                      style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8, paddingHorizontal: 8, borderTopWidth: 1, borderTopColor: colors.border, marginTop: 4 }}
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
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4, marginTop: 16 }}>
              INVITER UN MEMBRE
            </Text>
            <View style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 16 }}>
              <TextInput
                value={inviteEmail}
                onChangeText={setInviteEmail}
                placeholder="Adresse email"
                placeholderTextColor={colors.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{
                  backgroundColor: colors.background,
                  borderRadius: 8,
                  paddingHorizontal: 14,
                  paddingVertical: 12,
                  fontSize: 15,
                  color: colors.text,
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
                      backgroundColor: inviteRole === role ? colors.primary : colors.background,
                    }}
                  >
                    <Text style={{ fontSize: 13, fontWeight: "600", color: inviteRole === role ? "#fff" : colors.text }}>
                      {ROLE_LABELS[role]}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <TouchableOpacity
                onPress={handleInvite}
                disabled={actionLoading || !inviteEmail.trim()}
                style={{
                  backgroundColor: !inviteEmail.trim() ? colors.textMuted : colors.primary,
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
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
              INVITATIONS EN ATTENTE ({invitations.length})
            </Text>
            {invitations.map((inv) => (
              <View
                key={inv.id}
                style={{ backgroundColor: colors.card, borderRadius: 12, borderWidth: 1, borderColor: colors.border, padding: 14, marginBottom: 8, flexDirection: "row", alignItems: "center" }}
              >
                <Ionicons name="mail-outline" size={20} color="#d97706" style={{ marginRight: 12 }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{inv.email}</Text>
                  <Text style={{ fontSize: 12, color: colors.textMuted }}>Rôle : {ROLE_LABELS[inv.role] || inv.role}</Text>
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

        {/* Actions OWNER : Supprimer / Restaurer org */}
        {isOwner && (
          <View style={{ marginTop: 24, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 20 }}>
            <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 12, marginLeft: 4 }}>
              ZONE DANGER
            </Text>
            <TouchableOpacity
              onPress={handleDeleteOrg}
              disabled={actionLoading}
              style={{ backgroundColor: "#fef2f2", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 8 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="trash-outline" size={18} color="#dc2626" style={{ marginRight: 8 }} />
                <Text style={{ color: "#dc2626", fontWeight: "600", fontSize: 14 }}>Supprimer l'organisation</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleRestoreOrg}
              disabled={actionLoading}
              style={{ backgroundColor: "#f0fdf4", borderRadius: 12, paddingVertical: 14, alignItems: "center", marginBottom: 8 }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="refresh-outline" size={18} color="#16a34a" style={{ marginRight: 8 }} />
                <Text style={{ color: "#16a34a", fontWeight: "600", fontSize: 14 }}>Restaurer l'organisation</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handlePermanentDelete}
              disabled={actionLoading}
              style={{ backgroundColor: "#dc2626", borderRadius: 12, paddingVertical: 14, alignItems: "center" }}
            >
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Ionicons name="nuclear-outline" size={18} color="#fff" style={{ marginRight: 8 }} />
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Supprimer définitivement</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
