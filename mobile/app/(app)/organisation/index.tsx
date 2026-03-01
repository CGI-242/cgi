import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";
import {
  organizationApi,
  type Organization,
  type OrgMember,
  type Invitation,
} from "@/lib/api/organization";
import { useTheme } from "@/lib/theme/ThemeContext";

import OrgHeader from "@/components/organisation/OrgHeader";
import MemberList from "@/components/organisation/MemberList";
import InviteForm from "@/components/organisation/InviteForm";
import PendingInvitations from "@/components/organisation/PendingInvitations";
import DangerZone from "@/components/organisation/DangerZone";
import NoOrganisation from "@/components/organisation/NoOrganisation";

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

  // Cr\u00e9er organisation
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
    const msg = `Transf\u00e9rer la propri\u00e9t\u00e9 de l'organisation \u00e0 ${member.name || member.email} ? Cette action est irr\u00e9versible.`;
    if (Platform.OS === "web") {
      if (!window.confirm(msg)) return;
      doTransfer(member.userId);
    } else {
      Alert.alert("Transf\u00e9rer la propri\u00e9t\u00e9", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Transf\u00e9rer", style: "destructive", onPress: () => doTransfer(member.userId) },
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
      // Recharger la page pour refl\u00e9ter la nouvelle org
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
    const msg = "Supprimer l'organisation ? Cette action est r\u00e9versible pendant 30 jours.";
    const doDelete = async () => {
      // Double confirmation
      const msg2 = "\u00cates-vous vraiment s\u00fbr ? Tapez 'SUPPRIMER' pour confirmer.";
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
    const msg = "Supprimer d\u00e9finitivement l'organisation ? Cette action est IRR\u00c9VERSIBLE.";
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
      Alert.alert("Suppression d\u00e9finitive", msg, [
        { text: "Annuler", style: "cancel" },
        { text: "Supprimer d\u00e9finitivement", style: "destructive", onPress: doPermDelete },
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
      <NoOrganisation
        createName={createName}
        createLoading={createLoading}
        onChangeCreateName={setCreateName}
        onCreateOrg={handleCreateOrg}
        colors={colors}
      />
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        {error && (
          <View style={{ backgroundColor: "#fef2f2", padding: 16, marginBottom: 12 }}>
            <Text style={{ color: "#dc2626", fontSize: 14 }}>{error}</Text>
          </View>
        )}

        {/* D\u00e9tails organisation */}
        {org && (
          <OrgHeader
            org={org}
            isAdmin={isAdmin}
            editingName={editingName}
            newOrgName={newOrgName}
            actionLoading={actionLoading}
            onStartEdit={() => {
              setEditingName(true);
              setNewOrgName(org.name);
            }}
            onCancelEdit={() => {
              setEditingName(false);
              setNewOrgName("");
            }}
            onSaveName={handleEditOrgName}
            onChangeNewName={setNewOrgName}
            colors={colors}
          />
        )}

        {/* Liste membres */}
        <MemberList
          members={members}
          isAdmin={isAdmin}
          isOwner={isOwner}
          menuOpenId={menuOpenId}
          onToggleMenu={setMenuOpenId}
          onChangeRole={handleChangeRole}
          onRemoveMember={handleRemoveMember}
          onTransferOwnership={handleTransferOwnership}
          colors={colors}
        />

        {/* Section inviter */}
        {isAdmin && (
          <InviteForm
            inviteEmail={inviteEmail}
            inviteRole={inviteRole}
            actionLoading={actionLoading}
            onChangeEmail={setInviteEmail}
            onChangeRole={setInviteRole}
            onInvite={handleInvite}
            colors={colors}
          />
        )}

        {/* Invitations en attente */}
        <PendingInvitations
          invitations={invitations}
          isAdmin={isAdmin}
          onCancelInvitation={handleCancelInvitation}
          colors={colors}
        />

        {/* Actions OWNER : Supprimer / Restaurer org */}
        {isOwner && (
          <DangerZone
            actionLoading={actionLoading}
            onDelete={handleDeleteOrg}
            onRestore={handleRestoreOrg}
            onPermanentDelete={handlePermanentDelete}
            colors={colors}
          />
        )}
      </ScrollView>
    </View>
  );
}
