import { View, Text } from "react-native";

interface Props {
  initials: string;
  email: string;
  colors: any;
}

export default function AvatarSection({ initials, email, colors }: Props) {
  return (
    <View style={{ alignItems: "center", marginBottom: 24 }}>
      <View
        style={{
          width: 80,
          height: 80,
          backgroundColor: colors.primary,
          justifyContent: "center",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ color: "#fff", fontSize: 28, fontWeight: "bold" }}>{initials}</Text>
      </View>
      <Text style={{ color: colors.textSecondary, fontSize: 14 }}>{email}</Text>
    </View>
  );
}
