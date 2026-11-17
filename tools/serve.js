#!/usr/bin/env node
/* ==========================================================================
   Local dev server.  npm run dev  →  http://localhost:4000

   Serves the static files AND routes /api/* to the serverless handlers, so
   the real checkout flow can be tested locally exactly as it will run on
   Vercel. Reads .env if present. Zero dependencies beyond Node itself.
   ========================================================================== */

const http = require("http");
const fs = require("fs");
const path = require("path");
const url = require("url");

const ROOT = path.join(__dirname, "..");
const PORT = Number(process.env.PORT) || 4000;

/* ── Load .env (simple KEY=VALUE parser) ───────────────────────────────── */
const envPath = path.join(ROOT, ".env");
if (fs.existsSync(envPath)) {
  for (const raw of fs.readFileSync(envPath, "utf8").split("\n")) {
    const line = raw.trim();
    if (!line || line.startsWith("#")) continue;
    const eq = line.indexOf("=");
    if (eq === -1) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
      val = val.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = val;
  }
  console.log("  · loaded .env");
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
  ".webp": "image/webp", ".ico": "image/x-icon",
  ".woff": "font/woff", ".woff2": "font/woff2"
};

/** Minimal Express-like res helpers so the API handlers run unchanged. */
function decorate(res) {
  res.status = code => { res.statusCode = code; return res; };
  res.json = obj => {
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(obj));
    return res;
  };
  res.setHeader("X-Content-Type-Options", "nosniff");
  return res;
}

const server = http.createServer(async (req, res) => {
  decorate(res);
  const parsed = url.parse(req.url);
  let pathname = decodeURIComponent(parsed.pathname);

  /* ── API routes ──────────────────────────────────────────────────────── */
  if (pathname.startsWith("/api/")) {
    const name = pathname.slice(5).replace(/[^a-z0-9-]/gi, "");
    const file = path.join(ROOT, "api", name + ".js");
    if (!fs.existsSync(file)) {
      return res.status(404).json({ error: "No such endpoint: " + name });
    }
    try {
      // Fresh require each time so edits are picked up without a restart.
      delete require.cache[require.resolve(file)];
      const handler = require(file);
      await handler(req, res);
    } catch (err) {
      console.error("[api/" + name + "]", err);
      if (!res.headersSent) res.status(500).json({ error: "Server error: " + err.message });
    }
    return;
  }

  /* ── Static files ────────────────────────────────────────────────────── */
  if (pathname === "/") pathname = "/index.html";
  // Allow extension-less URLs: /shop → /shop.html
  if (!path.extname(pathname)) pathname += ".html";

  const filePath = path.join(ROOT, pathname);
  // Never serve anything outside the site root.
  if (!filePath.startsWith(ROOT)) { res.status(403).end("Forbidden"); return; }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).setHeader("Content-Type", "text/html; charset=utf-8");
      res.end(`<h1 style="font-family:system-ui;padding:60px">404 — ${pathname} not found</h1>
        <p style="font-family:system-ui;padding:0 60px"><a href="/">Back to the shop</a></p>`);
      return;
    }
    res.setHeader("Content-Type", MIME[path.extname(filePath)] || "application/octet-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`\n  Sharon Tea Stall — dev server`);
  console.log(`  http://localhost:${PORT}\n`);
  console.log(`  Razorpay keys: ${process.env.RAZORPAY_KEY_ID ? "configured" : "NOT configured (demo mode only)"}`);
  console.log(`  Press Ctrl+C to stop.\n`);
});
