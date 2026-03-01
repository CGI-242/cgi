import { View, Text, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface BackupCodesDisplayProps {
  backupCodes: string[];
  onCopy: () => void;
  onDone: () => void;
  colors: any;
}

export default function BackupCodesDisplay({
  backupCodes,
  onCopy,
  onDone,
  colors,
}: BackupCodesDisplayProps) {
  if (backupCodes.length === 0) return null;

  return (
    <View
      style={{
        backgroundColor: colors.card,
        borderWidth: 1,
        borderColor: colors.border,
        padding: 16,
        marginBottom: 16,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Ionicons
          name="warning-outline"
          size={20}
          color="#d97706"
          style={{ marginRight: 8 }}
        />
        <Text
          style={{ fontSize: 15, fontWeight: "600", color: colors.text }}
        >
          Codes de secours
        </Text>
      </View>
      <Text
        style={{
          fontSize: 13,
          color: colors.textSecondary,
          marginBottom: 12,
        }}
      >
        Sauvegardez ces codes dans un endroit sûr. Ils vous permettront de
        vous connecter si vous perdez l'accès à votre application
        d'authentification.
      </Text>
      <View
        style={{
          backgroundColor: colors.background,
          borderWidth: 1,
          borderColor: colors.border,
          padding: 16,
          marginBottom: 12,
        }}
      >
        {backupCodes.map((code, i) => (
          <Text
            key={i}
            style={{
              fontFamily:
                Platform.OS === "ios" ? "Menlo" : "monospace",
              fontSize: 14,
              color: colors.text,
              lineHeight: 24,
              textAlign: "center",
            }}
          >
            {code}
          </Text>
        ))}
      </View>
      <TouchableOpacity
        onPress={onCopy}
        style={{
          backgroundColor: colors.text,
          paddingVertical: 10,
          alignItems: "center",
          marginBottom: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Ionicons
            name="copy-outline"
            size={16}
            color="#fff"
            style={{ marginRight: 6 }}
          />
          <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
            Copier les codes
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onDone}
        style={{
          backgroundColor: colors.primary,
          paddingVertical: 10,
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
          J'ai sauvegardé mes codes
        </Text>
      </TouchableOpacity>
    </View>
  );
}
