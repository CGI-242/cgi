#!/usr/bin/env node
/**
 * Fix Expo web export: replace <script defer> with <script type="module">
 *
 * Expo injects <script defer src="..."> but the Metro bundle uses import.meta
 * which is only valid inside an ES module. This script patches dist/index.html
 * automatically after every web export.
 *
 * Usage: node scripts/fix-web-module.js
 */

const fs = require("fs");
const path = require("path");

const htmlPath = path.resolve(__dirname, "..", "dist", "index.html");

if (!fs.existsSync(htmlPath)) {
  console.error("❌ dist/index.html not found — run expo export first");
  process.exit(1);
}

let html = fs.readFileSync(htmlPath, "utf-8");
const original = html;

// Replace <script ... defer></script> with <script ... type="module"></script>
html = html.replace(
  /<script\b([^>]*)\sdefer><\/script>/g,
  '<script$1 type="module"></script>'
);

if (html === original) {
  console.log("✅ dist/index.html — already using type=\"module\" (no change needed)");
} else {
  fs.writeFileSync(htmlPath, html, "utf-8");
  console.log("✅ dist/index.html — patched: defer → type=\"module\"");
}
