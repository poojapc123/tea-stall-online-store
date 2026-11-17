/* ==========================================================================
   Contact / catering / franchise forms.

   Posts to /api/enquiry when it exists. In DEMO_MODE (or if the endpoint is
   missing) it falls back to opening the customer's mail client with the
   enquiry pre-filled, so no message is ever silently lost.
   ========================================================================== */
(function () {
  "use strict";

  const CFG = window.SHARON_CONFIG;
  const ENQUIRY_EMAIL = "hello@teastall-demo.com";

  const RULES = {
    name: v => v.trim().length >= 2,
    phone: v => /^[6-9]\d{9}$/.test(v.replace(/\D/g, "")),
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    city: v => v.trim().length >= 2,
    venue: v => v.trim().length >= 2,
    date: v => !!v,
    guests: v => parseInt(v, 10) >= 50,
    eventType: v => !!v,
    budget: v => !!v,
    experience: v => !!v,
    subject: v => !!v,
    message: v => v.trim().length >= 10
  };

  function validate(el) {
    const rule = RULES[el.name];
    const field = el.closest(".field");
    if (!rule || !field) return true;
    // Optional fields (no `required`) always pass when left blank.
    if (!el.hasAttribute("required") && !el.value.trim()) {
      field.classList.remove("has-error");
      return true;
    }
    const ok = rule(el.value);
    field.classList.toggle("has-error", !ok);
    return ok;
  }

  function status(host, type, html) {
    host.innerHTML = `<div class="notice ${type === "error" ? "notice--error" : ""}">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
        ${type === "error"
          ? '<path d="M12 3.5 22 20H2z"/><path d="M12 9.5v5M12 17.5h.01"/>'
          : '<circle cx="12" cy="12" r="9"/><path d="m8.5 12 2.5 2.5 4.5-5"/>'}
      </svg><span>${html}</span></div>`;
  }

  function mailtoFallback(kind, data) {
    const lines = Object.entries(data)
      .filter(([, v]) => v)
      .map(([k, v]) => k.replace(/([A-Z])/g, " $1").replace(/^./, c => c.toUpperCase()) + ": " + v);
    return "mailto:" + ENQUIRY_EMAIL
      + "?subject=" + encodeURIComponent(kind + " enquiry — " + (data.name || "Website"))
      + "&body=" + encodeURIComponent(lines.join("\n"));
  }

  function wire(formId, statusId, kind) {
    const form = document.getElementById(formId);
    if (!form) return;
    const statusHost = document.getElementById(statusId);

    form.addEventListener("blur", e => {
      if (e.target.name in RULES) validate(e.target);
    }, true);

    form.addEventListener("input", e => {
      const field = e.target.closest(".field");
      if (field && field.classList.contains("has-error")) validate(e.target);
    });

    form.addEventListener("submit", async e => {
      e.preventDefault();

      let ok = true;
      Array.from(form.elements).forEach(el => {
        if (el.name && !validate(el)) ok = false;
      });
      if (!ok) {
        status(statusHost, "error", "Please correct the highlighted fields.");
        form.querySelector(".has-error input, .has-error select, .has-error textarea")?.focus();
        return;
      }

      const data = {};
      Array.from(form.elements).forEach(el => {
        if (el.name) data[el.name] = el.value.trim();
      });

      const btn = form.querySelector('button[type="submit"]');
      btn.disabled = true;
      const prev = btn.textContent;
      btn.textContent = "Sending…";

      try {
        if (CFG.DEMO_MODE) throw new Error("demo");

        const res = await fetch((CFG.API_BASE || "") + "/api/enquiry", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind, data })
        });
        if (!res.ok) throw new Error("bad-status");

        form.reset();
        status(statusHost, "ok",
          "<strong>Thank you.</strong> Your enquiry has reached us — we reply within one working day. For anything urgent, call <a href=\"tel:+910000000000\">00000 00000</a>.");
      } catch (err) {
        // No endpoint (or demo mode): hand the message to their mail client
        // rather than pretending it was sent.
        const href = mailtoFallback(kind, data);
        status(statusHost, "ok",
          "Your mail app is opening with this enquiry ready to send. If nothing happens, "
          + "email us at <a href=\"mailto:" + ENQUIRY_EMAIL + "\">" + ENQUIRY_EMAIL + "</a> "
          + "or call <a href=\"tel:+910000000000\">00000 00000</a>.");
        window.location.href = href;
      } finally {
        btn.disabled = false;
        btn.textContent = prev;
        statusHost.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    });
  }

  wire("contact-form", "contact-status", "Contact");
  wire("catering-form", "catering-status", "Catering");
  wire("franchise-form", "franchise-status", "Franchise");
})();
