import { View, Text, TextInput } from "react-native";
import { useTranslation } from "react-i18next";

interface Props {
  email: string;
  emailError: string;
  emailChecking: boolean;
  onChangeEmail: (email: string) => void;
  onBlur: () => void;
  colors: any;
}

export default function EmailField({ email, emailError, onChangeEmail, onBlur, colors }: Props) {
  const { t } = useTranslation();
  const inputStyle = {
    width: "100%" as const,
    backgroundColor: colors.input,
    padding: 12,
    fontSize: 16,
    color: colors.text,
  };

  return (
    <>
      <Text style={{ fontSize: 14, fontWeight: "600", color: colors.text, marginBottom: 8 }}>
        Email <Text style={{ color: colors.danger }}>*</Text>
      </Text>
      <TextInput
        style={{ ...inputStyle, marginBottom: emailError ? 4 : 16, borderWidth: emailError ? 1 : 0, borderColor: emailError ? colors.danger : "transparent" }}
        placeholder={t("auth.emailPlaceholder")}
        placeholderTextColor={colors.textMuted}
        value={email}
        onChangeText={onChangeEmail}
        onBlur={onBlur}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {emailError ? (
        <Text style={{ color: colors.danger, fontSize: 12, marginBottom: 12 }}>{emailError}</Text>
      ) : null}
    </>
  );
}
