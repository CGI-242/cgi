import { Redirect } from "expo-router";
import { useAuthStore } from "@/lib/store/auth";

export default function Index() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  if (isAuthenticated) {
    return <Redirect href="/(app)" />;
  }

  return <Redirect href="/(auth)" />;
}
