/**
 * Global test setup — mocks for common modules used across components.
 */

// --- expo-router ---
jest.mock("expo-router", () => ({
  usePathname: jest.fn(() => "/"),
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  })),
  router: {
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
  },
  Link: "Link",
}));

// --- ThemeContext ---
jest.mock("@/lib/theme/ThemeContext", () => ({
  useTheme: () => ({
    colors: {
      primary: "#007AFF",
      background: "#FFFFFF",
      card: "#F2F2F7",
      text: "#000000",
      textMuted: "#8E8E93",
      border: "#C6C6C8",
      disabled: "#AEAEB2",
      danger: "#FF3B30",
      input: "#F2F2F7",
      sidebarText: "#FFFFFF",
    },
  }),
}));

// --- react-i18next ---
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: { language: "fr", changeLanguage: jest.fn() },
  }),
}));

// --- useResponsive ---
jest.mock("@/lib/hooks/useResponsive", () => ({
  useResponsive: () => ({ isMobile: false }),
}));

// --- @expo/vector-icons ---
jest.mock("@expo/vector-icons", () => ({
  Ionicons: "Ionicons",
}));

// --- fonts ---
jest.mock("@/lib/theme/fonts", () => ({
  fonts: { heading: "System", body: "System" },
  fontWeights: { heading: "700", body: "400" },
}));
