import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { MyPermissions, PermissionItem } from "@/lib/api/permissions";

export const PERMISSION_LABELS: Record<string, string> = {
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
};

export const ROLE_COLORS: Record<string, string> = {
  OWNER: "#8b5cf6",
  ADMIN: "#3b82f6",
  MEMBER: "#16a34a",
  VIEWER: "#6b7280",
};

export const ROLE_LABELS: Record<string, string> = {
  OWNER: "Propriétaire",
  ADMIN: "Administrateur",
  MEMBER: "Membre",
  VIEWER: "Lecteur",
};

interface MyPermissionsCardProps {
  myPerms: MyPermissions;
  available: PermissionItem[];
  colors: any;
}

export default function MyPermissionsCard({ myPerms, available, colors }: MyPermissionsCardProps) {
  return (
    <>
      <Text style={{ color: colors.textSecondary, fontSize: 12, fontWeight: "700", letterSpacing: 0.5, marginBottom: 8, marginLeft: 4 }}>
        MES PERMISSIONS
      </Text>
      <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 20 }}>
        <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 14 }}>
          <Ionicons name="person-circle-outline" size={24} color={colors.text} style={{ marginRight: 10 }} />
          <Text style={{ fontSize: 15, fontWeight: "600", color: colors.text, flex: 1 }}>Mon rôle</Text>
          <View style={{ backgroundColor: `${ROLE_COLORS[myPerms.role] || "#6b7280"}20`, paddingHorizontal: 10, paddingVertical: 4 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: ROLE_COLORS[myPerms.role] || "#6b7280" }}>
              {ROLE_LABELS[myPerms.role] || myPerms.role}
            </Text>
          </View>
        </View>
        {available.map((perm) => {
          const perms = Array.isArray(myPerms.permissions) ? myPerms.permissions : [];
          const hasIt = perms.includes(perm.key);
          return (
            <View key={perm.key} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 6 }}>
              <Ionicons name={hasIt ? "checkmark-circle" : "close-circle"} size={18} color={hasIt ? "#16a34a" : "#dc2626"} style={{ marginRight: 10 }} />
              <Text style={{ fontSize: 13, color: colors.text, flex: 1 }}>{PERMISSION_LABELS[perm.key] || perm.key}</Text>
            </View>
          );
        })}
      </View>
    </>
  );
}
