import { useState, useEffect, useRef, useCallback } from "react";
import { ScrollView, View, Platform } from "react-native";
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
  const sectionRefs = useRef<Record<string, View | null>>({});

  useEffect(() => {
    requestAnimationFrame(() => setLoaded(true));
  }, []);

  const handleScrollTo = useCallback((section: string) => {
    const sectionView = sectionRefs.current[section];
    if (!sectionView) return;

    if (Platform.OS === "web") {
      // Sur web, utiliser scrollIntoView natif (fiable)
      const node = sectionView as unknown as HTMLElement;
      node?.scrollIntoView?.({ behavior: "smooth", block: "start" });
    } else {
      // Sur native, mesurer la position et scroller
      (sectionView as any).measureLayout?.(
        scrollRef.current,
        (_x: number, y: number) => {
          scrollRef.current?.scrollTo({ y, animated: true });
        },
        () => {}
      );
    }
  }, []);

  return (
    <ScrollView ref={scrollRef} style={{ flex: 1, backgroundColor: "#1A3A5C" }}>
      <LandingHeader isMobile={isMobile} onScrollTo={handleScrollTo} />
      <LandingHero isMobile={isMobile} loaded={loaded} />
      <View ref={(r) => { sectionRefs.current.features = r; }}>
        <LandingFeatures isMobile={isMobile} loaded={loaded} />
      </View>
      <View ref={(r) => { sectionRefs.current.simulateurs = r; }}>
        <LandingCountries isMobile={isMobile} loaded={loaded} />
      </View>
      <View ref={(r) => { sectionRefs.current.tarifs = r; }}>
        <LandingPricing isMobile={isMobile} />
      </View>
      <View ref={(r) => { sectionRefs.current.contact = r; }}>
        <LandingContact isMobile={isMobile} />
      </View>
      <View ref={(r) => { sectionRefs.current.assistant = r; }}>
        <LandingCTA />
      </View>
      <LandingFooter isMobile={isMobile} onScrollTo={handleScrollTo} />
    </ScrollView>
  );
}
