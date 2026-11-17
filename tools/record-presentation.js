/**
 * Presentation recording of the site.
 *
 *   npm run dev                 # in another terminal — the site must be live
 *   npm i -D playwright ffmpeg-static
 *   npx playwright install chromium
 *   node tools/record-presentation.js
 *
 * Produces a title card, a captioned walkthrough of every homepage section,
 * the shop, one blend, the basket and the story page, then an outro card.
 * Captions are read from each section's own eyebrow and heading, so they stay
 * correct when the copy changes. Writes .webm (and .mp4 if ffmpeg-static is
 * installed) to the Desktop.
 *
 * Uninstall both packages afterwards if you would rather not keep them.
 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:4000";
const DESK = process.env.OUT_DIR ||
  require("path").join(require("os").homedir(), "Desktop");
const TMP = path.join(__dirname, "vid");
const wait = (p, ms) => p.waitForTimeout(ms);

/* ── the overlay: title cards, lower-third captions, transition veil ───── */
const OVERLAY = `
(() => {
  if (document.getElementById("pres")) return;
  const s = document.createElement("style");
  s.textContent = \`
    #pres, #pres * { pointer-events: none; }
    #pres { position: fixed; inset: 0; z-index: 2147483647; font-family: "DM Sans", sans-serif; }
    #pres-veil { position: absolute; inset: 0; background: #0d2818; opacity: 0;
                 transition: opacity .55s cubic-bezier(.4,0,.2,1); }
    #pres-card { position: absolute; inset: 0; display: grid; place-content: center;
                 justify-items: center; gap: 22px; text-align: center;
                 background: linear-gradient(160deg, #143a23, #0d2818 70%);
                 opacity: 0; transition: opacity .9s ease; }
    #pres-card img { width: 132px; height: 132px; filter: drop-shadow(0 12px 30px rgba(0,0,0,.45)); }
    #pres-card .t { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 300;
                    font-size: 62px; line-height: 1.05; color: #fff; letter-spacing: .01em; }
    #pres-card .t em { font-style: italic; color: #e0b354; }
    #pres-card .s { font-size: 13px; letter-spacing: .3em; text-transform: uppercase;
                    color: #7cc793; font-weight: 500; }
    #pres-card .r { width: 54px; height: 1px; background: linear-gradient(90deg,#2f8a4f,#e0b354); }
    #pres-cap { position: absolute; left: 44px; bottom: 40px;
                background: rgba(13,40,24,.86); backdrop-filter: blur(10px);
                border-left: 3px solid #e0b354; border-radius: 4px;
                padding: 14px 26px 15px; opacity: 0; transform: translateY(14px);
                transition: opacity .5s ease, transform .5s cubic-bezier(.22,.61,.36,1); }
    #pres-cap .k { font-size: 10.5px; letter-spacing: .26em; text-transform: uppercase;
                   color: #e0b354; font-weight: 600; }
    #pres-cap .v { font-family: "Cormorant Garamond", Georgia, serif; font-weight: 300;
                   font-size: 30px; line-height: 1.15; color: #fff; margin-top: 3px; }
    #pres-cap .v em { font-style: italic; color: #b3e0c1; }
    #pres-bar { position: absolute; left: 0; bottom: 0; height: 3px; width: 0%;
                background: linear-gradient(90deg,#2f8a4f,#e0b354); transition: width .4s linear; }
    @media (max-width: 560px) {
      #pres-cap { left: 18px; right: 18px; bottom: 26px; padding: 11px 18px 12px; }
      #pres-cap .v { font-size: 22px; }
      #pres-card .t { font-size: 38px; } #pres-card img { width: 96px; height: 96px; }
    }\`;
  document.head.appendChild(s);
  const d = document.createElement("div");
  d.id = "pres";
  d.innerHTML = '<div id="pres-veil"></div>' +
    '<div id="pres-card"><img src="${BASE}/assets/img/sharon-logo.svg" alt="">' +
    '<div class="t"></div><div class="r"></div><div class="s"></div></div>' +
    '<div id="pres-cap"><div class="k"></div><div class="v"></div></div>' +
    '<div id="pres-bar"></div>';
  document.body.appendChild(d);

  window.__pres = {
    card(t, s) { const c = document.getElementById("pres-card");
      c.querySelector(".t").innerHTML = t; c.querySelector(".s").textContent = s || "";
      c.style.opacity = 1; },
    hideCard() { document.getElementById("pres-card").style.opacity = 0; },
    cap(k, v) { const c = document.getElementById("pres-cap");
      c.querySelector(".k").textContent = k; c.querySelector(".v").innerHTML = v;
      c.style.opacity = 1; c.style.transform = "translateY(0)"; },
    hideCap() { const c = document.getElementById("pres-cap");
      c.style.opacity = 0; c.style.transform = "translateY(14px)"; },
    veil(on) { document.getElementById("pres-veil").style.opacity = on ? 1 : 0; },
    bar(p) { document.getElementById("pres-bar").style.width = p + "%"; }
  };
})();`;

const install = async page => { await page.evaluate(OVERLAY); };
const pres = (page, fn, ...a) =>
  page.evaluate(([f, args]) => window.__pres[f](...args), [fn, a]);

/* Eased scroll — slow enough to read, fast enough to keep moving. */
async function glide(page, toY, ms = 1700) {
  await page.evaluate(([toY, ms]) => new Promise(res => {
    const y0 = window.scrollY, dy = toY - y0, t0 = performance.now();
    const ease = t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    (function step(now) {
      const t = Math.min(1, (now - t0) / ms);
      window.scrollTo(0, y0 + dy * ease(t));
      t < 1 ? requestAnimationFrame(step) : res();
    })(performance.now());
  }), [toY, ms]);
}

/* Fade through a navigation so pages do not hard-cut. */
async function go(page, url, hold) {
  await pres(page, "hideCap");
  await pres(page, "veil", true);
  await wait(page, 620);
  await page.goto(url, { waitUntil: "networkidle" });
  await install(page);
  await pres(page, "veil", true);
  await page.evaluate(() => document.fonts.ready);
  await wait(page, 260);
  await pres(page, "veil", false);
  await wait(page, hold);
}

async function tour(page, T) {
  await page.goto(BASE + "/index.html", { waitUntil: "networkidle" });
  await install(page);
  await page.evaluate(() => document.fonts.ready);

  /* ── title card ── */
  await pres(page, "card", "Sharon Tea <em>Stall</em>", "Indiranagar · Bangalore · Est. 2007");
  await wait(page, T.card);
  await pres(page, "hideCard");
  await wait(page, 900);

  /* ── homepage, section by section, captioned from the page's own words ── */
  const stops = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll("main > section").forEach(sec => {
      const eb = sec.querySelector(".eyebrow");
      const h = sec.querySelector("h1, h2");
      if (!h) return;
      out.push({
        y: sec.getBoundingClientRect().top + window.scrollY,
        k: eb ? eb.textContent.trim() : "",
        v: h.innerHTML.replace(/<br\s*\/?>/gi, " ").trim()
      });
    });
    return out;
  });

  await pres(page, "cap", stops[0].k || "Welcome", stops[0].v);
  await wait(page, T.hold);

  for (let i = 1; i < stops.length; i++) {
    await pres(page, "hideCap");
    await wait(page, 320);
    await glide(page, stops[i].y - 64, T.glide);
    await pres(page, "bar", Math.round((i / stops.length) * 70));
    await pres(page, "cap", stops[i].k || "Sharon Tea", stops[i].v);
    await wait(page, T.hold);
  }

  /* ── the shop ── */
  await go(page, BASE + "/shop.html", 500);
  await pres(page, "bar", 76);
  await pres(page, "cap", "Shop", "Thirteen blends, <em>sealed fresh</em>");
  await wait(page, T.hold);
  await glide(page, 620, T.glide);
  await wait(page, T.hold);

  /* ── one blend up close, added to the basket ── */
  const href = await page.evaluate(() => {
    const a = document.querySelector('.product-card a[href*="product.html"]');
    return a && a.getAttribute("href");
  });
  if (href) {
    await go(page, new URL(href, BASE + "/").href, 500);
    await pres(page, "bar", 85);
    const nm = await page.evaluate(() => (document.querySelector("h1") || {}).textContent || "A blend");
    await pres(page, "cap", "Tasting notes", nm.trim());
    await wait(page, T.hold);
    const add = await page.$("#add-to-cart");
    if (add) {
      await add.scrollIntoViewIfNeeded();
      await wait(page, 420);
      await pres(page, "cap", "Add to basket", "Straight into the <em>basket</em>");
      await add.click();
      await wait(page, T.hold);
    }
  }

  /* ── basket ── */
  await go(page, BASE + "/cart.html", 500);
  await pres(page, "bar", 92);
  await pres(page, "cap", "Basket", "Free delivery <em>over ₹999</em>");
  await wait(page, T.hold);

  /* ── the story ── */
  await go(page, BASE + "/about.html", 500);
  await pres(page, "bar", 97);
  await pres(page, "cap", "Our story", "It started with <em>one kettle</em>");
  await wait(page, T.hold);
  await glide(page, 760, T.glide);
  await wait(page, T.hold);

  /* ── outro ── */
  await pres(page, "hideCap");
  await pres(page, "bar", 100);
  await wait(page, 400);
  await pres(page, "card", "A warm cup<br>for <em>every</em> moment",
             "#00, Demo Street, Indiranagar · +91 00000 00000");
  await wait(page, T.card);
}

(async () => {
  fs.rmSync(TMP, { recursive: true, force: true });
  const browser = await chromium.launch();
  const made = [];

  for (const [name, size, T] of [
    ["Sharon-Tea-presentation",        { width: 1280, height: 800 },
     { card: 3600, hold: 2100, glide: 1700 }],
    ["Sharon-Tea-presentation-mobile", { width: 414, height: 896 },
     { card: 3000, hold: 1700, glide: 1400 }]
  ]) {
    const ctx = await browser.newContext({
      viewport: size, recordVideo: { dir: path.join(TMP, name), size }
    });
    const page = await ctx.newPage();
    await tour(page, T);
    await ctx.close();

    const src = fs.readdirSync(path.join(TMP, name)).find(f => f.endsWith(".webm"));
    const dest = path.join(DESK, name + ".webm");
    fs.copyFileSync(path.join(TMP, name, src), dest);
    made.push(name);
    console.log(`  ${dest}  (${(fs.statSync(dest).size / 1024 / 1024).toFixed(1)} MB)`);
  }
  await browser.close();
  fs.rmSync(TMP, { recursive: true, force: true });

  /* Optional: also emit .mp4, which slide decks accept and .webm does not. */
  try {
    const ff = require("ffmpeg-static");
    const { execFileSync } = require("child_process");
    for (const n of made) {
      const webm = path.join(DESK, n + ".webm"), mp4 = path.join(DESK, n + ".mp4");
      execFileSync(ff, ["-y", "-loglevel", "error", "-i", webm,
        "-c:v", "libx264", "-preset", "slow", "-crf", "21",
        "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2", mp4]);
      console.log("  " + mp4);
    }
  } catch (e) {
    console.log("  (ffmpeg-static not installed — .webm only)");
  }
})();
