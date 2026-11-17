#!/usr/bin/env node
/* ==========================================================================
   Static page generator.

   Run:  npm run build      (or: node tools/build.js)

   Writes plain .html files to the site root. The output is fully static —
   nothing in tools/ is needed to host or serve the site. index.html is
   hand-written and deliberately not generated.
   ========================================================================== */

const fs = require("fs");
const path = require("path");
const { render } = require("./layout");

const ROOT = path.join(__dirname, "..");
const PAGES_DIR = path.join(__dirname, "pages");

const pages = [];
for (const file of fs.readdirSync(PAGES_DIR).filter(f => f.endsWith(".js"))) {
  const mod = require(path.join(PAGES_DIR, file));
  // A page module exports either one page object or an array of them.
  Array.isArray(mod) ? pages.push(...mod) : pages.push(mod);
}

pages.sort((a, b) => a.file.localeCompare(b.file));

let written = 0;
for (const page of pages) {
  const out = path.join(ROOT, page.file);
  fs.writeFileSync(out, render(page), "utf8");
  const kb = (fs.statSync(out).size / 1024).toFixed(1);
  console.log(`  ✓ ${page.file.padEnd(22)} ${kb.padStart(6)} KB`);
  written++;
}

console.log(`\nBuilt ${written} page${written === 1 ? "" : "s"} into ${ROOT}`);
console.log("  · index.html is hand-written and was not regenerated.");
