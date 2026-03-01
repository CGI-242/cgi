import { View } from "react-native";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import type { ThemeColors } from "@/lib/theme/colors";
import SettingsRow, { Divider } from "./SettingsRow";

interface Props {
  colors: ThemeColors;
}

export default function ManagementLinks({ colors }: Props) {
  const { t } = useTranslation();

  return (
    <View style={{ backgroundColor: colors.card, overflow: "hidden" as const, marginBottom: 4 }}>
      <SettingsRow
        icon="card-outline"
        label={t("settings.managementSubscription")}
        onPress={() => router.push("/(app)/abonnement")}
        showChevron
        colors={colors}
      />
      <Divider colors={colors} />
      <SettingsRow
        icon="people-outline"
        label={t("settings.managementOrganization")}
        onPress={() => router.push("/(app)/organisation")}
        showChevron
        colors={colors}
      />
      <Divider colors={colors} />
      <SettingsRow
        icon="bar-chart-outline"
        label={t("settings.managementAnalytics")}
        onPress={() => router.push("/(app)/analytics")}
        showChevron
        colors={colors}
      />
      <Divider colors={colors} />
      <SettingsRow
        icon="document-text-outline"
        label={t("settings.managementAudit")}
        onPress={() => router.push("/(app)/audit")}
        showChevron
        colors={colors}
      />
      <Divider colors={colors} />
      <SettingsRow
        icon="key-outline"
        label={t("settings.managementPermissions")}
        onPress={() => router.push("/(app)/permissions")}
        showChevron
        colors={colors}
      />
      <Divider colors={colors} />
      <SettingsRow
        icon="shield-checkmark-outline"
        label={t("settings.managementAdmin")}
        onPress={() => router.push("/(app)/admin")}
        showChevron
        colors={colors}
      />
    </View>
  );
}
