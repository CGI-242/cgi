import React from "react";
import { View, Text, TouchableOpacity, TextInput, ActivityIndicator } from "react-native";
import { ROLE_LABELS } from "./MemberList";

interface InviteFormProps {
  inviteEmail: string;
  inviteRole: "MEMBER" | "ADMIN";
  actionLoading: boolean;
  onChangeEmail: (email: string) => void;
  onChangeRole: (role: "MEMBER" | "ADMIN") => void;
  onInvite: () => void;
  colors: any;
}

export default function InviteForm({
  inviteEmail,
  inviteRole,
  actionLoading,
  onChangeEmail,
  onChangeRole,
  onInvite,
  colors,
}: InviteFormProps) {
  return (
    <>
      <Text
        style={{
          color: colors.textSecondary,
          fontSize: 12,
          fontWeight: "700",
          letterSpacing: 0.5,
          marginBottom: 8,
          marginLeft: 4,
          marginTop: 16,
        }}
      >
        INVITER UN MEMBRE
      </Text>
      <View
        style={{
          backgroundColor: colors.card,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
          marginBottom: 16,
        }}
      >
        <TextInput
          value={inviteEmail}
          onChangeText={onChangeEmail}
          placeholder="Adresse email"
          placeholderTextColor={colors.textMuted}
          keyboardType="email-address"
          autoCapitalize="none"
          style={{
            backgroundColor: colors.background,
            paddingHorizontal: 14,
            paddingVertical: 12,
            fontSize: 15,
            color: colors.text,
            marginBottom: 12,
          }}
        />
        {/* S\u00e9lecteur r\u00f4le */}
        <View style={{ flexDirection: "row", gap: 8, marginBottom: 12 }}>
          {(["MEMBER", "ADMIN"] as const).map((role) => (
            <TouchableOpacity
              key={role}
              onPress={() => onChangeRole(role)}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: "center",
                backgroundColor: inviteRole === role ? colors.primary : colors.background,
              }}
            >
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: "600",
                  color: inviteRole === role ? "#fff" : colors.text,
                }}
              >
                {ROLE_LABELS[role]}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          onPress={onInvite}
          disabled={actionLoading || !inviteEmail.trim()}
          style={{
            backgroundColor: !inviteEmail.trim() ? colors.textMuted : colors.primary,
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
  );
}
