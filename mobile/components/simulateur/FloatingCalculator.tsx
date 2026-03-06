import { useState } from "react";
import { View, Text, TouchableOpacity, Modal, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "@/lib/theme/ThemeContext";
import { useResponsive } from "@/lib/hooks/useResponsive";
import { fonts } from "@/lib/theme/fonts";
import { useCalculator } from "./calculator/useCalculator";
import CalculatorDisplay from "./calculator/CalculatorDisplay";
import CalculatorKeyboard from "./calculator/CalculatorKeyboard";

export default function FloatingCalculator() {
  const { colors } = useTheme();
  const { isMobile } = useResponsive();
  const [visible, setVisible] = useState(false);
  const { display, firstOperand, operator, handlePress } = useCalculator();

  return (
    <>
      <TouchableOpacity
        style={[styles.fab, { backgroundColor: colors.primary }]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
        accessibilityLabel="Ouvrir la calculatrice"
        accessibilityRole="button"
      >
        <Ionicons name="calculator" size={26} color="#fff" />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        transparent
        onRequestClose={() => setVisible(false)}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                width: isMobile ? "92%" : 360,
                borderColor: colors.border,
              },
            ]}
          >
            <View style={styles.header}>
              <Text style={[styles.headerTitle, { color: colors.text, fontFamily: fonts.bold }]}>
                Calculatrice
              </Text>
              <TouchableOpacity
                onPress={() => setVisible(false)}
                accessibilityLabel="Fermer la calculatrice"
                accessibilityRole="button"
              >
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <CalculatorDisplay display={display} firstOperand={firstOperand} operator={operator} />
            <CalculatorKeyboard onPress={handlePress} />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    zIndex: 999,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  card: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    padding: 16,
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
});
