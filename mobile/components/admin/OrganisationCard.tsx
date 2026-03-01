import React from "react";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import type { AdminOrganization } from "@/lib/api/admin";

type PlanKey = "FREE" | "BASIQUE" | "PRO";

export const PLAN_COLORS: Record<PlanKey, string> = {
  FREE: "#6b7280",
  BASIQUE: "#3b82f6",
  PRO: "#8b5cf6",
};

export const STATUS_COLORS: Record<string, string> = {
  ACTIVE: "#16a34a",
  TRIALING: "#2563eb",
  EXPIRED: "#dc2626",
  CANCELLED: "#dc2626",
  PAST_DUE: "#d97706",
};

export function formatDate(iso: string | null): string {
  if (!iso) return "-";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" });
}

export function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    ACTIVE: "Actif",
    TRIALING: "Essai",
    EXPIRED: "Expire",
    CANCELLED: "Annule",
    PAST_DUE: "Impaye",
  };
  return labels[status] || status;
}

interface OrganisationCardProps {
  org: AdminOrganization;
  actionLoading: string | null;
  onActivate: (org: AdminOrganization, plan: "BASIQUE" | "PRO") => void;
  onRenew: (org: AdminOrganization) => void;
  colors: any;
}

export default function OrganisationCard({ org, actionLoading, onActivate, onRenew, colors }: OrganisationCardProps) {
  const sub = org.subscription;
  const plan = (sub?.plan || "FREE") as PlanKey;
  const status = sub?.status || "EXPIRED";
  const planColor = PLAN_COLORS[plan] || "#6b7280";
  const statusColor = STATUS_COLORS[status] || "#6b7280";
  const quota = sub ? `${sub.questionsUsed} / ${sub.questionsPerMonth}` : "0 / 0";
  const quotaPercent = sub && sub.questionsPerMonth > 0 ? Math.min((sub.questionsUsed / sub.questionsPerMonth) * 100, 100) : 0;
  const isLoadingThis = actionLoading === org.id;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        borderLeftWidth: 4,
        borderLeftColor: planColor,
        marginBottom: 12,
        padding: 16,
      }}
    >
      {/* Entete org */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: "700", color: colors.text }}>{org.name}</Text>
          <Text style={{ fontSize: 12, color: colors.textMuted }}>{org.slug}</Text>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <View style={{ backgroundColor: `${planColor}20`, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: planColor }}>{plan}</Text>
          </View>
          <View style={{ backgroundColor: `${statusColor}20`, paddingHorizontal: 8, paddingVertical: 3 }}>
            <Text style={{ fontSize: 12, fontWeight: "700", color: statusColor }}>{statusLabel(status)}</Text>
          </View>
        </View>
      </View>

      {/* Quota */}
      <View style={{ marginBottom: 10 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: colors.textSecondary }}>Questions (total org)</Text>
          <Text style={{ fontSize: 12, fontWeight: "600", color: colors.text }}>{quota}</Text>
        </View>
        <View style={{ height: 6, backgroundColor: colors.border }}>
          <View
            style={{
              height: 6,
              width: `${quotaPercent}%` as `${number}%`,
              backgroundColor: quotaPercent > 90 ? "#dc2626" : quotaPercent > 70 ? "#d97706" : "#16a34a",
            }}
          />
        </View>
      </View>

      {/* Infos */}
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
        <View>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>Expire le</Text>
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>{formatDate(sub?.currentPeriodEnd || null)}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>Membres</Text>
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>{org.memberCount}</Text>
        </View>
        <View>
          <Text style={{ fontSize: 11, color: colors.textMuted }}>Prix total/an</Text>
          <Text style={{ fontSize: 13, fontWeight: "600", color: colors.text }}>{org.totalPrice > 0 ? `${org.totalPrice.toLocaleString("fr-FR")} XAF` : "-"}</Text>
        </View>
      </View>

      {/* Actions */}
      {isLoadingThis ? (
        <ActivityIndicator size="small" color={colors.primary} />
      ) : (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <TouchableOpacity
            onPress={() => onActivate(org, "BASIQUE")}
            style={{ flex: 1, backgroundColor: "#3b82f6", paddingVertical: 10, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Basique</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>{org.memberCount >= 2 ? "45 000" : "50 000"} /user</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => onActivate(org, "PRO")}
            style={{ flex: 1, backgroundColor: "#8b5cf6", paddingVertical: 10, alignItems: "center" }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Pro</Text>
            <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>{org.memberCount >= 2 ? "65 000" : "70 000"} /user</Text>
          </TouchableOpacity>
          {(status === "ACTIVE" || status === "EXPIRED" || status === "TRIALING") && (
            <TouchableOpacity
              onPress={() => onRenew(org)}
              style={{ flex: 1, backgroundColor: colors.primary, paddingVertical: 10, alignItems: "center" }}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Renouveler</Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>+1 an</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}
