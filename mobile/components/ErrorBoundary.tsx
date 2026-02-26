import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Sentry } from "@/lib/sentry";

interface Props {
  children: React.ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center", padding: 24, backgroundColor: "#f9fafb" }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>!</Text>
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#1f2937", marginBottom: 8, textAlign: "center" }}>
            Une erreur est survenue
          </Text>
          <Text style={{ fontSize: 14, color: "#6b7280", textAlign: "center", marginBottom: 24 }}>
            L'application a rencontré un problème inattendu.
          </Text>
          {__DEV__ && this.state.error && (
            <View style={{ backgroundColor: "#fef2f2", padding: 12, marginBottom: 24, width: "100%", maxWidth: 400 }}>
              <Text style={{ fontSize: 12, color: "#991b1b", fontFamily: "monospace" }}>
                {this.state.error.message}
              </Text>
            </View>
          )}
          <TouchableOpacity
            onPress={this.handleRetry}
            style={{ backgroundColor: "#00815d", paddingHorizontal: 32, paddingVertical: 12 }}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>
              Réessayer
            </Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}
