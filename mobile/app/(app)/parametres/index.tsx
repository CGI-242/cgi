import { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "@/lib/store/auth";
import { userApi, type SubscriptionInfo } from "@/lib/api/user";

type IoniconsName = React.ComponentProps<typeof Ionicons>["name"];

const PLAN_LABELS: Record<string, string> = {
  FREE: "Gratuit",
  STARTER: "Starter",
  PROFESSIONAL: "Professionnel",
  TEAM: "Equipe",
  ENTERPRISE: "Entreprise",
};

export default function ParametresScreen() {
  const user = useAuthStore((s) => s.user);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const data = await userApi.getProfile();
      setSubscription(data.subscription);
    } catch {
      // Silencieux — les donnees s'afficheront depuis le store
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: "#f3f4f6", justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#00815d" />
      </View>
    );
  }

  const planLabel = subscription ? (PLAN_LABELS[subscription.plan] || subscription.plan) : "Gratuit";
  const questionsUsed = subscription?.questionsUsed ?? 0;
  const questionsMax = subscription?.questionsPerMonth ?? 10;

  return (
    <View style={{ flex: 1, backgroundColor: "#f3f4f6" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#00815d",
          paddingTop: Platform.OS === "ios" ? 56 : 16,
          paddingBottom: 16,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <TouchableOpacity onPress={() => router.back()} style={{ marginRight: 12 }}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={{ color: "#fff", fontSize: 20, fontWeight: "bold" }}>Parametres</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        {/* Section Compte */}
        <SectionHeader title="COMPTE" />
        <View style={styles.card}>
          <SettingsRow
            icon="mail-outline"
            label="Email"
            value={user?.email || ""}
          />
          <Divider />
          <SettingsRow
            icon="lock-closed-outline"
            label="Changer le mot de passe"
            onPress={() => router.push("/(auth)/forgot-password")}
            showChevron
          />
        </View>

        {/* Section Abonnement */}
        <SectionHeader title="ABONNEMENT" />
        <View style={styles.card}>
          <SettingsRow icon="ribbon-outline" label="Plan" value={planLabel} />
          <Divider />
          <SettingsRow
            icon="chatbubble-ellipses-outline"
            label="Questions IA"
            value={`${questionsUsed} / ${questionsMax} ce mois`}
          />
          {subscription?.currentPeriodEnd && (
            <>
              <Divider />
              <SettingsRow
                icon="calendar-outline"
                label="Renouvellement"
                value={new Date(subscription.currentPeriodEnd).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              />
            </>
          )}
        </View>

        {/* Section A propos */}
        <SectionHeader title="A PROPOS" />
        <View style={styles.card}>
          <SettingsRow icon="information-circle-outline" label="Version" value="1.0.0" />
          <Divider />
          <SettingsRow icon="book-outline" label="Edition" value="CGI Edition 2026" />
        </View>
      </ScrollView>
    </View>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <Text
      style={{
        color: "#6b7280",
        fontSize: 12,
        fontWeight: "700",
        letterSpacing: 0.5,
        marginBottom: 8,
        marginTop: 16,
        marginLeft: 4,
      }}
    >
      {title}
    </Text>
  );
}

function SettingsRow({
  icon,
  label,
  value,
  onPress,
  showChevron,
}: {
  icon: IoniconsName;
  label: string;
  value?: string;
  onPress?: () => void;
  showChevron?: boolean;
}) {
  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 14,
        paddingHorizontal: 16,
      }}
    >
      <Ionicons name={icon} size={20} color="#6b7280" style={{ marginRight: 12 }} />
      <Text style={{ fontSize: 15, color: "#1f2937", flex: 1 }}>{label}</Text>
      {value ? (
        <Text style={{ fontSize: 14, color: "#9ca3af" }}>{value}</Text>
      ) : null}
      {showChevron && (
        <Ionicons name="chevron-forward" size={18} color="#d1d5db" style={{ marginLeft: 4 }} />
      )}
    </Container>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: "#f3f4f6", marginHorizontal: 16 }} />;
}

const styles = {
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    overflow: "hidden" as const,
    marginBottom: 4,
  },
};
