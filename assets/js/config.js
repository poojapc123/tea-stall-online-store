/* ==========================================================================
   Storefront configuration — EDIT THIS FILE BEFORE GOING LIVE.

   Only public values belong here. The Razorpay *secret* must never appear in
   any file under assets/ — it lives as an environment variable beside the
   serverless functions in /api. See README.md.
   ========================================================================== */

window.SHARON_CONFIG = {
  /* Where the /api serverless functions are hosted.
     - Same domain (Vercel/Netlify):  ""      → calls /api/create-order
     - Separate API host:             "https://api.teastall-demo.com" */
  API_BASE: "",

  /* Razorpay PUBLIC key id. Test keys start rzp_test_, live keys rzp_live_.
     Safe to expose — this is the browser-side identifier, not the secret. */
  RAZORPAY_KEY_ID: "rzp_test_REPLACE_ME",

  /* Shown on the Razorpay payment sheet. */
  BRAND: {
    name: "Sharon Tea Stall",
    description: "Fresh organic tea from Indiranagar, Bangalore",
    themeColor: "#2f8a4f"
  },

  /* Cash on delivery. Turn off if you only want prepaid orders. */
  ENABLE_COD: true,

  /* Demo mode: when true, checkout simulates a successful payment instead of
     calling Razorpay — so you can click through the flow before the API is
     deployed. MUST be false in production. */
  DEMO_MODE: true
};
