import { Platform } from "react-native";

/**
 * NORMX Tax Typography System
 *
 * Playfair Display (serif) — titres, hero, headings. Poids : 700, 900.
 * Outfit (sans-serif) — corps de texte, navigation, badges, boutons, chiffres. Poids : 300–900.
 */

// Sur web, les polices sont chargées via Google Fonts CDN (nom CSS standard).
// Sur native, expo-font enregistre les polices sous le nom d'export (ex: "Outfit_400Regular").
// On utilise une map pour abstraire cette différence.

const isWeb = Platform.OS === "web";

export const fonts = {
  // ── Playfair Display (titres) ──
  heading: isWeb ? "Playfair Display" : "PlayfairDisplay_700Bold",
  headingBlack: isWeb ? "Playfair Display" : "PlayfairDisplay_900Black",

  // ── Outfit (corps) ──
  light: isWeb ? "Outfit" : "Outfit_300Light",
  regular: isWeb ? "Outfit" : "Outfit_400Regular",
  medium: isWeb ? "Outfit" : "Outfit_500Medium",
  semiBold: isWeb ? "Outfit" : "Outfit_600SemiBold",
  bold: isWeb ? "Outfit" : "Outfit_700Bold",
  extraBold: isWeb ? "Outfit" : "Outfit_800ExtraBold",
  black: isWeb ? "Outfit" : "Outfit_900Black",
} as const;

// Font weights correspondants pour le web (fontWeight est ignoré sur native quand fontFamily est spécifié)
export const fontWeights = {
  heading: isWeb ? ("700" as const) : undefined,
  headingBlack: isWeb ? ("900" as const) : undefined,
  light: isWeb ? ("300" as const) : undefined,
  regular: isWeb ? ("400" as const) : undefined,
  medium: isWeb ? ("500" as const) : undefined,
  semiBold: isWeb ? ("600" as const) : undefined,
  bold: isWeb ? ("700" as const) : undefined,
  extraBold: isWeb ? ("800" as const) : undefined,
  black: isWeb ? ("900" as const) : undefined,
} as const;

/** Google Fonts CDN URL pour le web */
export const GOOGLE_FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,700&display=swap";
