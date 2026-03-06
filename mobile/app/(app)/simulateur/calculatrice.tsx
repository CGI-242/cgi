import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts, fontWeights } from "@/lib/theme/fonts";
import { useCalculator } from "@/components/simulateur/calculator/useCalculator";
import CalculatorDisplay from "@/components/simulateur/calculator/CalculatorDisplay";
import CalculatorKeyboard from "@/components/simulateur/calculator/CalculatorKeyboard";

export default function CalculatriceScreen() {
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const { display, firstOperand, operator, handlePress } = useCalculator();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.card, { backgroundColor: colors.card, maxWidth: isMobile ? "100%" : 400 }]}>
        <Text style={[styles.title, { color: colors.text, fontFamily: fonts.heading, fontWeight: fontWeights.heading }]}>
          Calculatrice
        </Text>
        <CalculatorDisplay display={display} firstOperand={firstOperand} operator={operator} />
        <CalculatorKeyboard onPress={handlePress} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 12,
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
  },
  title: {
    fontSize: 22,
    marginBottom: 16,
  },
});
