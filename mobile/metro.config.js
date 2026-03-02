const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Force Metro to resolve .js (CJS) before .mjs (ESM) to avoid
// "Cannot use import.meta outside a module" from zustand ESM build
config.resolver.sourceExts = config.resolver.sourceExts.filter((ext) => ext !== "mjs");

module.exports = withNativeWind(config, { input: "./global.css" });
