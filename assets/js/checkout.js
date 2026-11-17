/* ==========================================================================
   Checkout — validation, order creation, Razorpay payment, verification.

   The browser never sends prices. It sends {productId, packId, qty} and the
   server recomputes every rupee from its own copy of the catalogue, so the
   amount charged cannot be altered from here.
   ========================================================================== */
(function () {
  "use strict";

  const C = window.SharonCatalog;
  const Cart = window.SharonCart;
  const UI = window.SharonUI;
  const CFG = window.SHARON_CONFIG;
  const esc = UI.escapeHtml;

  const form = document.getElementById("checkout-form");
  const emptyState = document.getElementById("checkout-empty");
  const itemsHost = document.getElementById("checkout-items");
  const summaryHost = document.getElementById("checkout-summary");
  const payBtn = document.getElementById("pay-btn");
  const errBox = document.getElementById("checkout-error");
  const errText = document.getElementById("checkout-error-text");

  let paymentMethod = "online";

  if (CFG.DEMO_MODE) document.getElementById("demo-banner").classList.remove("hidden");
  if (!CFG.ENABLE_COD) document.getElementById("cod-option").classList.add("hidden");

  /* ── Summary ─────────────────────────────────────────────────────────── */

  function render() {
    const t = Cart.totals({ paymentMethod });

    if (!t.lines.length) {
      form.classList.add("hidden");
      emptyState.classList.remove("hidden");
      return;
    }
    form.classList.remove("hidden");
    emptyState.classList.add("hidden");

    itemsHost.innerHTML = t.lines.map(l => `
      <div style="display:flex;gap:12px;align-items:center;padding:10px 0;border-bottom:1px solid var(--line)">
        <div style="width:52px;height:52px;flex:none;border-radius:10px;background:var(--leaf-50);display:grid;place-items:center;overflow:hidden">
          ${C.packetSVG(l.product, { steam: false })}
        </div>
        <div style="flex:1;min-width:0">
          <div style="font-weight:600;color:var(--ink);font-size:.92rem">${esc(l.product.name)}</div>
          <div style="font-size:.82rem;color:var(--muted)">${esc(l.pack.label)} × ${l.qty}</div>
        </div>
        <div style="font-weight:700;color:var(--leaf-700);white-space:nowrap">${C.formatINR(l.lineTotal)}</div>
      </div>`).join("");

    summaryHost.innerHTML = `
      <div class="summary-line"><span>Subtotal</span><span>${C.formatINR(t.subtotal)}</span></div>
      <div class="summary-line"><span>GST (5%)</span><span>${C.formatINR(t.gst)}</span></div>
      <div class="summary-line ${t.shipping === 0 ? "summary-line--free" : ""}">
        <span>Delivery</span><span>${t.shipping === 0 ? "FREE" : C.formatINR(t.shipping)}</span></div>
      ${t.codFee ? `<div class="summary-line"><span>COD handling</span><span>${C.formatINR(t.codFee)}</span></div>` : ""}
      <div class="summary-line summary-line--total"><span>Total</span><span>${C.formatINR(t.total)}</span></div>`;

    payBtn.textContent = paymentMethod === "cod"
      ? "Place order · " + C.formatINR(t.total)
      : "Pay " + C.formatINR(t.total) + " securely";
  }

  /* ── Payment method toggle ───────────────────────────────────────────── */

  document.querySelectorAll(".pay-option").forEach(opt => {
    opt.addEventListener("click", () => {
      paymentMethod = opt.dataset.pay;
      document.querySelectorAll(".pay-option").forEach(o =>
        o.classList.toggle("is-active", o === opt));
      opt.querySelector("input").checked = true;
      render();
    });
  });

  /* ── Validation ──────────────────────────────────────────────────────── */

  const RULES = {
    name: v => v.trim().length >= 2,
    phone: v => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")),
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    address1: v => v.trim().length >= 5,
    city: v => v.trim().length >= 2,
    state: v => v.trim().length > 0,
    pincode: v => /^[1-9]\d{5}$/.test(v.trim())
  };

  function validateField(el) {
    const rule = RULES[el.name];
    if (!rule) return true;
    const ok = rule(el.value);
    el.closest(".field").classList.toggle("has-error", !ok);
    return ok;
  }

  form.addEventListener("blur", e => {
    if (e.target.name in RULES) validateField(e.target);
  }, true);

  form.addEventListener("input", e => {
    const field = e.target.closest(".field");
    if (field && field.classList.contains("has-error")) validateField(e.target);
  });

  function collect() {
    let valid = true;
    Object.keys(RULES).forEach(name => {
      const el = form.elements[name];
      if (!validateField(el)) valid = false;
    });
    if (!valid) {
      form.querySelector(".has-error input, .has-error select")?.focus();
      return null;
    }
    return {
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.replace(/\D/g, ""),
      email: form.elements.email.value.trim(),
      address1: form.elements.address1.value.trim(),
      address2: form.elements.address2.value.trim(),
      city: form.elements.city.value.trim(),
      state: form.elements.state.value,
      pincode: form.elements.pincode.value.trim(),
      notes: form.elements.notes.value.trim()
    };
  }

  /* ── Errors ──────────────────────────────────────────────────────────── */

  function showError(msg) {
    errText.textContent = msg;
    errBox.classList.remove("hidden");
    errBox.scrollIntoView({ behavior: "smooth", block: "center" });
  }
  function clearError() { errBox.classList.add("hidden"); }

  function busy(on, label) {
    payBtn.disabled = on;
    if (on) { payBtn.dataset.prev = payBtn.textContent; payBtn.textContent = label; }
    else if (payBtn.dataset.prev) payBtn.textContent = payBtn.dataset.prev;
  }

  /* ── API ─────────────────────────────────────────────────────────────── */

  async function api(path, payload) {
    const res = await fetch((CFG.API_BASE || "") + path, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    let data = null;
    try { data = await res.json(); } catch (e) { /* non-JSON error page */ }
    if (!res.ok) throw new Error((data && data.error) || "Request failed (" + res.status + ")");
    return data;
  }

  /* ── Submit ──────────────────────────────────────────────────────────── */

  form.addEventListener("submit", async e => {
    e.preventDefault();
    clearError();

    const customer = collect();
    if (!customer) return;

    const items = Cart.read();
    if (!items.length) return;

    /* Demo mode — no API, no payment. Lets you click through the whole flow. */
    if (CFG.DEMO_MODE) {
      busy(true, "Processing…");
      const ref = "DEMO-" + Date.now().toString(36).toUpperCase();
      setTimeout(() => {
        stashReceipt(ref, customer, "demo");
        Cart.clear();
        location.href = "order-success.html?ref=" + encodeURIComponent(ref) + "&demo=1";
      }, 900);
      return;
    }

    busy(true, "Creating your order…");

    let order;
    try {
      order = await api("/api/create-order", { items, customer, paymentMethod });
    } catch (err) {
      busy(false);
      showError(err.message + " — please try again, or call us on 00000 00000 to order by phone.");
      return;
    }

    /* Cash on delivery is complete once the server has stored the order. */
    if (paymentMethod === "cod") {
      stashReceipt(order.orderRef, customer, "cod");
      Cart.clear();
      location.href = "order-success.html?ref=" + encodeURIComponent(order.orderRef);
      return;
    }

    if (typeof Razorpay === "undefined") {
      busy(false);
      showError("The payment library could not load. Check your connection and try again.");
      return;
    }

    busy(true, "Opening payment…");

    const rzp = new Razorpay({
      key: order.keyId || CFG.RAZORPAY_KEY_ID,
      order_id: order.razorpayOrderId,
      amount: order.amount,               // paise, from the server
      currency: order.currency || "INR",
      name: CFG.BRAND.name,
      description: CFG.BRAND.description,
      theme: { color: CFG.BRAND.themeColor },
      prefill: { name: customer.name, email: customer.email, contact: customer.phone },
      notes: { orderRef: order.orderRef },
      handler: async function (response) {
        busy(true, "Confirming payment…");
        try {
          await api("/api/verify-payment", {
            orderRef: order.orderRef,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          });
          stashReceipt(order.orderRef, customer, "online");
          Cart.clear();
          location.href = "order-success.html?ref=" + encodeURIComponent(order.orderRef);
        } catch (err) {
          busy(false);
          // Money may have left the customer's account — never imply it didn't.
          showError(
            "Your payment went through but we could not confirm it automatically. " +
            "Do not pay again. Please call 00000 00000 quoting payment ID " +
            response.razorpay_payment_id + " and we will sort it out."
          );
        }
      },
      modal: {
        ondismiss: function () {
          busy(false);
          showError("Payment was cancelled. Your basket is still here whenever you are ready.");
        }
      }
    });

    rzp.on("payment.failed", function (resp) {
      busy(false);
      showError((resp.error && resp.error.description) || "The payment failed. Please try another method.");
    });

    rzp.open();
    busy(false);
  });

  /* Keep just enough for the confirmation page. Cleared after it is shown. */
  function stashReceipt(ref, customer, method) {
    try {
      const t = Cart.totals({ paymentMethod: method === "cod" ? "cod" : "online" });
      sessionStorage.setItem("sharon_last_order", JSON.stringify({
        ref, method,
        name: customer.name, email: customer.email, phone: customer.phone,
        address: [customer.address1, customer.address2, customer.city,
                  customer.state, customer.pincode].filter(Boolean).join(", "),
        total: t.total,
        lines: t.lines.map(l => ({
          name: l.product.name, pack: l.pack.label, qty: l.qty, lineTotal: l.lineTotal
        }))
      }));
    } catch (e) { /* sessionStorage unavailable — the page copes without it */ }
  }

  Cart.onChange(render);
  render();
})();
