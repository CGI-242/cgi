import React from "react";
import { View, Text, TouchableOpacity, Switch } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { PermissionItem, EffectivePermissions } from "@/lib/api/permissions";
import { PERMISSION_LABELS } from "./MyPermissionsCard";

interface PermissionTogglesProps {
  available: PermissionItem[];
  memberEffective: EffectivePermissions;
  selectedMemberId: string;
  isOwner: boolean;
  actionLoading: boolean;
  onToggle: (userId: string, permission: string, granted: boolean) => void;
  onReset: (userId: string) => void;
  colors: any;
}

export default function PermissionToggles({
  available,
  memberEffective,
  selectedMemberId,
  isOwner,
  actionLoading,
  onToggle,
  onReset,
  colors,
}: PermissionTogglesProps) {
  return (
    <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, padding: 16, marginBottom: 12 }}>
      {available.map((perm) => {
        const hasIt = memberEffective.effective.includes(perm.key);
        return (
          <View key={perm.key} style={{ flexDirection: "row", alignItems: "center", paddingVertical: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 13, fontWeight: "500", color: colors.text }}>
                {PERMISSION_LABELS[perm.key] || perm.key}
              </Text>
            </View>
            <Switch
              value={hasIt}
              onValueChange={() => onToggle(selectedMemberId, perm.key, hasIt)}
              disabled={!isOwner || actionLoading}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor={hasIt ? colors.primary : "#f4f3f4"}
            />
          </View>
        );
      })}

      {isOwner && (
        <TouchableOpacity
          onPress={() => onReset(selectedMemberId)}
          disabled={actionLoading}
          style={{ backgroundColor: colors.background, paddingVertical: 10, alignItems: "center", marginTop: 12 }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name="refresh-outline" size={16} color={colors.text} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.text, fontWeight: "600", fontSize: 13 }}>Réinitialiser aux valeurs par défaut</Text>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
}
