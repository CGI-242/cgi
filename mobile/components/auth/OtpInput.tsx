import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useTranslation } from "react-i18next";

interface Props {
  code: string;
  cooldown: number;
  onChangeCode: (code: string) => void;
  onResend: () => void;
  onSubmit?: () => void;
  colors: any;
}

export default function OtpInput({ code, cooldown, onChangeCode, onResend, onSubmit, colors }: Props) {
  const { t } = useTranslation();

  return (
    <>
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
        {t("auth.codePlaceholder")}
      </Text>
      <TextInput
        style={{ width: "100%", backgroundColor: colors.input, padding: 12, textAlign: "center", fontSize: 24, letterSpacing: 4, color: colors.text, marginBottom: 16 }}
        placeholder="000000"
        placeholderTextColor={colors.textMuted}
        value={code}
        onChangeText={(text) => {
          const cleaned = text.replace(/[^0-9]/g, "").slice(0, 6);
          onChangeCode(cleaned);
        }}
        keyboardType="number-pad"
        maxLength={6}
        returnKeyType="done"
        onSubmitEditing={onSubmit}
      />
      <TouchableOpacity style={{ alignItems: "center", marginTop: 16 }} onPress={onResend} disabled={cooldown > 0}>
        <Text style={{ fontSize: 14, color: cooldown > 0 ? colors.textMuted : colors.primary, textDecorationLine: cooldown > 0 ? "none" : "underline" }}>
          {cooldown > 0 ? t("auth.resendCooldown", { seconds: cooldown }) : t("auth.resendCode")}
        </Text>
      </TouchableOpacity>
    </>
  );
}
