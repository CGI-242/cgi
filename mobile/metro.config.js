const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Force zustand to use CJS builds on web (the ESM builds contain import.meta.env
// which is invalid in classic <script defer> tags and breaks the web bundle).
const path = require("path");
const zustandDir = path.dirname(require.resolve("zustand"));
const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (platform === "web" && moduleName.startsWith("zustand")) {
    const cjsMap = {
      zustand: path.join(zustandDir, "index.js"),
      "zustand/middleware": path.join(zustandDir, "middleware.js"),
      "zustand/shallow": path.join(zustandDir, "shallow.js"),
      "zustand/vanilla": path.join(zustandDir, "vanilla.js"),
    };
    if (cjsMap[moduleName]) {
      return { filePath: cjsMap[moduleName], type: "sourceFile" };
    }
  }
  if (originalResolveRequest) {
    return originalResolveRequest(context, moduleName, platform);
  }
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = withNativeWind(config, { input: "./global.css" });
