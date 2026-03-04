import { useState, useEffect, useRef, useCallback } from "react";
import { ScrollView, View } from "react-native";
import LandingHeader from "./LandingHeader";
import LandingHero from "./LandingHero";
import LandingFeatures from "./LandingFeatures";
import LandingCountries from "./LandingCountries";
import LandingPricing from "./LandingPricing";
import LandingContact from "./LandingContact";
import LandingCTA from "./LandingCTA";
import LandingFooter from "./LandingFooter";
import { useResponsive } from "@/lib/hooks/useResponsive";

export default function LandingPage() {
  const { isMobile } = useResponsive();
  const [loaded, setLoaded] = useState(false);
  const scrollRef = useRef<ScrollView>(null);
  const sectionOffsets = useRef<Record<string, number>>({});

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  const handleScrollTo = useCallback((section: string) => {
    const y = sectionOffsets.current[section];
    if (y !== undefined) {
      scrollRef.current?.scrollTo({ y, animated: true });
    }
  }, []);

  return (
    <ScrollView ref={scrollRef} style={{ flex: 1, backgroundColor: "#08080d" }}>
      <LandingHeader isMobile={isMobile} onScrollTo={handleScrollTo} />
      <LandingHero isMobile={isMobile} loaded={loaded} />
      <LandingFeatures isMobile={isMobile} loaded={loaded} />
      <LandingCountries isMobile={isMobile} loaded={loaded} />
      <View onLayout={(e) => { sectionOffsets.current.tarifs = e.nativeEvent.layout.y; }}>
        <LandingPricing isMobile={isMobile} />
      </View>
      <View onLayout={(e) => { sectionOffsets.current.contact = e.nativeEvent.layout.y; }}>
        <LandingContact isMobile={isMobile} />
      </View>
      <LandingCTA />
      <LandingFooter isMobile={isMobile} />
    </ScrollView>
  );
}
