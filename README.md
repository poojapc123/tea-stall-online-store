# Sharon Tea Stall — website redesign

A redesign of [teastall-demo.com](https://www.teastall-demo.com/) as a static site
with a leaf-green theme and a working Razorpay checkout.

Static HTML/CSS/JS for every page, plus four small serverless functions that handle
the one thing static files cannot do safely: taking money.

---

## Run it right now

```bash
cd sharon-tea-site
npm install          # razorpay + nodemailer
npm run dev          # http://localhost:4000
```

Ships in **demo mode** — you can click all the way through checkout and see the
confirmation page without any payment keys. No money moves, no order is stored.

> If port 4000 is busy: `PORT=4317 npm run dev`

You can also just double-click `index.html`. Everything works except the API calls,
which need the dev server.

---

## What's here

```
sharon-tea-site/
├── index.html              Homepage (hand-written)
├── about.html  shop.html  product.html  catering.html
├── franchise.html  contact.html  cart.html  checkout.html
├── order-success.html  shipping.html  privacy.html  terms.html
│
├── assets/
│   ├── css/style.css       Whole design system, one file
│   └── js/
│       ├── config.js       ← EDIT THIS (keys, demo mode)
│       ├── products.js     ← EDIT THIS (catalogue, prices)
│       ├── cart.js         Cart engine (localStorage)
│       ├── main.js         Nav, reveal, counters, toasts, cards
│       ├── shop.js  product.js  cart-page.js  checkout.js
│       ├── order-success.js  forms.js
│
├── api/                    Serverless functions
│   ├── _pricing.js         Server-side price authority
│   ├── _lib.js             CORS, storage, email
│   ├── create-order.js     POST — creates the Razorpay order
│   ├── verify-payment.js   POST — verifies the payment signature
│   ├── webhook.js          POST — Razorpay server-to-server events
│   └── enquiry.js          POST — contact/catering/franchise forms
│
├── tools/                  Page generator (not needed to host)
│   ├── build.js  layout.js  serve.js
│   └── pages/              One file per generated page
│
├── .env.example            Copy to .env
├── vercel.json  package.json
```

### Editing pages

`index.html` is hand-written — edit it directly.

The other twelve pages are generated so the header and footer live in one place
(`tools/layout.js`) instead of being copy-pasted twelve times. Edit the page's file
in `tools/pages/`, then:

```bash
npm run build
```

The output is plain static HTML — **nothing in `tools/` is needed to host the site.**
If you'd rather not use the generator, delete `tools/` and edit the `.html` files
directly; you'll just have to change the nav in twelve places.

---

## Going live

### 1. Catalogue and prices — `assets/js/products.js`

Prices came from the current live site. **Five need confirming** — they weren't
published anywhere I could reach, so I put in placeholders in line with their
siblings. Each is flagged `priceConfirmed: false`:

| Tea | Placeholder | Status |
|---|---|---|
| Regular Tea | ₹180 / ₹190 | **confirm** |
| Cinnamon Elaichi Tea | ₹200 / ₹210 | **confirm** |
| Tulsi Tea | ₹200 / ₹210 | **confirm** |
| Tulsi Elaichi Tea | ₹220 / ₹230 | **confirm** |
| Rose Tea | ₹210 / ₹220 | **confirm** |

The other eight are the live site's own figures.

**Also assumed, and worth checking:**

- The live site showed each tea as a price *range* (e.g. "₹190 – ₹200"). I read
  that as **selling price + MRP** and show the higher one struck through. If it was
  actually two pack sizes, change it in `products.js`.
- **Pack sizes** (250 g / 500 g) and the 500 g multiplier (`1.85`, i.e. ~8% off) are
  mine — the live site didn't state weights. Both live in the `PACKS` array.
- Shipping rules — free above ₹999, ₹60 flat, ₹30 COD fee, 5% GST — are in
  `SHIPPING` in the same file. **Confirm the GST rate with your accountant.**

Product descriptions, tasting notes and brewing instructions are written to fit each
blend but are **not** from the client. Read them before publishing.

### 2. Razorpay

1. Sign up at [razorpay.com](https://razorpay.com), complete KYC.
2. **Settings → API Keys** → generate. You get a key id (`rzp_test_…`) and a secret.
3. `cp .env.example .env` and fill in `RAZORPAY_KEY_ID` + `RAZORPAY_KEY_SECRET`.
4. In `assets/js/config.js` set:
   ```js
   RAZORPAY_KEY_ID: "rzp_test_your_actual_key",
   DEMO_MODE: false
   ```
5. Test with [Razorpay's test cards](https://razorpay.com/docs/payments/payments/test-card-details/)
   (e.g. `4111 1111 1111 1111`, any future expiry, any CVV).
6. When it all works, swap test keys for live keys in **both** `.env` and `config.js`.

> The key **id** in `config.js` is public and safe in the browser.
> The key **secret** goes only in `.env`. If a secret ever appears anywhere under
> `assets/`, rotate it immediately — that folder is downloaded by every visitor.

### 3. Webhook (do not skip)

The browser callback can be lost — customer closes the tab, phone dies, network
drops — and you'd have their money with no record of the order. The webhook is what
prevents that.

**Razorpay Dashboard → Settings → Webhooks → Add New Webhook**

- URL: `https://yourdomain.com/api/webhook`
- Secret: invent one, put the same value in `.env` as `RAZORPAY_WEBHOOK_SECRET`
  (this is **not** your key secret)
- Events: `payment.captured`, `payment.failed`, `order.paid`, `refund.processed`

### 4. Order emails (optional but recommended)

Fill in the `SMTP_*` values in `.env` and you get an email per order with the items
and delivery address. For Gmail you need an **App Password**, not the account
password (Google Account → Security → 2-Step Verification → App passwords).

Leave them blank and orders still work — you just read them off the Razorpay
dashboard instead.

### 5. Deploy

**Vercel** (simplest — `vercel.json` is already set up):

```bash
npm i -g vercel
vercel
vercel env add RAZORPAY_KEY_ID        # repeat for each var in .env
vercel --prod
```

**Netlify:** move `api/` to `netlify/functions/` and set `API_BASE` in `config.js`
to `"/.netlify/functions"`.

**Your own server / cPanel:** upload everything, run `npm install`, and keep
`tools/serve.js` alive behind nginx (`pm2 start tools/serve.js`). Static-only hosts
(GitHub Pages, plain S3) can serve the site but **cannot run `/api`** — checkout
will fail there.

---

## How payment security works

The browser never sends a price. It sends `{productId, packId, qty}`, and
`api/_pricing.js` recomputes every rupee from its own copy of the catalogue.

Verified during the build — a request claiming `"price": 1` for a ₹444 pack was
billed the full ₹556:

```bash
curl -X POST localhost:4000/api/create-order -H "Content-Type: application/json" \
  -d '{"paymentMethod":"cod","items":[{"productId":"ginger-elaichi-tea","packId":"500g","qty":1,"price":1}], ...}'
# → {"orderRef":"STS-…","total":556}
```

Payment confirmation is verified by HMAC-SHA256 signature (`verify-payment.js`), so
a forged "payment succeeded" POST is rejected. Both the valid and tampered cases
were tested.

**One case handled deliberately:** if the payment succeeds but verification fails,
the customer is told *not to pay again* and given the payment ID to quote. Never
change that message to imply the payment didn't go through — at that point their
money has already moved.

### Where orders are stored

Orders append to `orders.jsonl`. **On Vercel and Netlify the filesystem is wiped
between invocations, so treat that file as a debug log, not a record.**

Your durable records are:
1. **The Razorpay dashboard** — `create-order.js` attaches the customer name, phone,
   address and item list as order notes, so the dashboard is genuinely usable.
2. **The notification email**, if you configure SMTP.

For a growing shop, replace `saveOrder`/`readOrder` in `api/_lib.js` with a database
write (Supabase, Mongo, Postgres). The interface is two functions.

---

## Design notes

Leaf-green theme built on a 10-step green ramp with a honey-gold accent for
warmth — the ramp is defined as CSS custom properties at the top of `style.css`,
so the whole site re-themes by editing `--leaf-*`.

**No photographs.** Every product packet, the stall, the map, the catering setup and
the hero cup are hand-written inline SVG, generated per product from the colours in
`products.js`. Nothing can render broken, nothing needs licensing, and the whole
site is a few hundred KB. When you have real product photography, swap `packetSVG()`
in `products.js` for `<img>` tags — it's the single place the artwork is produced.

Responsive at 1024 / 860 / 620px, honours `prefers-reduced-motion`, keyboard-focusable
throughout, and the confirmation page has a print stylesheet.

Fonts are Fraunces + DM Sans from Google Fonts — the only external request the site
makes. To self-host them, download the woff2 files into `assets/` and replace the
`<link>` in `tools/layout.js` and `index.html`.

---

## Known gaps

Things a real shop will want that aren't built:

- **No customer accounts or order history.** Guest checkout only. Every order is
  traceable by reference number, but customers can't log in to see past orders.
- **No stock tracking.** Every tea is always purchasable.
- **No coupon codes.**
- **No shipping-rate logic by region** — one flat ₹60 nationwide.
- **The "Shop" nav has no sub-menu.** The live site listed 13 product
  subcategories; here they're filters on one shop page, which suits 13 products
  better than a dropdown does.
- **Legal pages are drafts.** `privacy.html` and `terms.html` are written to match
  what the site actually does, but need a lawyer's eye before publishing —
  particularly for DPDP Act compliance.
- **Social links point to the platform home pages** — I only found an Instagram
  reference on the live site, not the handle. Fix in `tools/layout.js`, then rebuild.
