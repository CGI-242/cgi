import { ScrollView, StyleSheet, useWindowDimensions } from "react-native";
import { useTheme } from "@/lib/theme/ThemeContext";
import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingStats from "./LandingStats";
import LandingCTA from "./LandingCTA";
import LandingFooter from "./LandingFooter";

export default function LandingPage() {
  const { colors } = useTheme();
  const { width } = useWindowDimensions();

  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      <LandingHeader />
      <LandingHero isMobile={isMobile} />
      <LandingFeatures isMobile={isMobile} isTablet={isTablet} />
      <LandingStats isMobile={isMobile} />
      <LandingCTA />
      <LandingFooter isMobile={isMobile} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
