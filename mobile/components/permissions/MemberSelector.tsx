import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { OrgMember } from "@/lib/api/organization";
import { ROLE_COLORS, ROLE_LABELS } from "./MyPermissionsCard";

interface MemberSelectorProps {
  members: OrgMember[];
  selectedMemberId: string | null;
  onSelect: (id: string | null) => void;
  colors: any;
}

export default function MemberSelector({ members, selectedMemberId, onSelect, colors }: MemberSelectorProps) {
  return (
    <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, marginBottom: 12, overflow: "hidden" }}>
      {members.map((member, index) => {
        const isSelected = selectedMemberId === member.userId;
        const roleColor = ROLE_COLORS[member.role] || "#6b7280";
        return (
          <TouchableOpacity
            key={member.userId}
            onPress={() => onSelect(isSelected ? null : member.userId)}
            style={{
              flexDirection: "row",
              alignItems: "center",
              padding: 12,
              backgroundColor: isSelected ? "#f0fdf4" : colors.card,
              borderTopWidth: index > 0 ? 1 : 0,
              borderTopColor: colors.background,
            }}
          >
            <View style={{ width: 32, height: 32, backgroundColor: `${roleColor}20`, justifyContent: "center", alignItems: "center", marginRight: 10 }}>
              <Text style={{ fontSize: 12, fontWeight: "700", color: roleColor }}>
                {(member.name || member.email).substring(0, 2).toUpperCase()}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text }}>{member.name || member.email}</Text>
              <Text style={{ fontSize: 11, color: colors.textMuted }}>{ROLE_LABELS[member.role] || member.role}</Text>
            </View>
            <Ionicons name={isSelected ? "chevron-up" : "chevron-down"} size={16} color={colors.textMuted} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
