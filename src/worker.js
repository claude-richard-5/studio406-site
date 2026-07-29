// Studio406 — access-request handler.
//
// Sits in front of the static site and handles only POST /api/request-access;
// every other request falls through to the static assets untouched.
//
// It emails a notification to access@studio406.co via Resend (a transactional
// email API). Resend sends from its own infrastructure using our verified
// sending subdomain (send.studio406.co), so the root domain's Microsoft 365
// mail is never touched. The API key lives in the RESEND_API_KEY secret, set
// in the Worker's dashboard settings — never in this (public) repo.

const RECIPIENT = "access@studio406.co";
const SENDER = "Studio406 <noreply@send.studio406.co>";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/request-access") {
      if (request.method !== "POST") {
        return json({ ok: false, error: "Method not allowed" }, 405);
      }
      return handleAccessRequest(request, env);
    }
    // Everything else: serve the static site exactly as before.
    return env.ASSETS.fetch(request);
  }
};

async function handleAccessRequest(request, env) {
  let email = "";
  let honeypot = "";

  try {
    const type = request.headers.get("content-type") || "";
    if (type.includes("application/json")) {
      const body = await request.json();
      email = String(body.email || "").trim();
      honeypot = String(body.website || "").trim();
    } else {
      const form = await request.formData();
      email = String(form.get("email") || "").trim();
      honeypot = String(form.get("website") || "").trim();
    }
  } catch {
    return json({ ok: false, error: "Could not read the form." }, 400);
  }

  // Honeypot: a hidden field real users never see. Filled = bot; accept quietly.
  if (honeypot) return json({ ok: true });

  if (!isValidEmail(email)) {
    return json({ ok: false, error: "Please enter a valid email address." }, 422);
  }

  if (!env.RESEND_API_KEY) {
    return json({ ok: false, error: "Mailer not configured.", detail: "RESEND_API_KEY secret is not set" }, 500);
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + env.RESEND_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from: SENDER,
        to: [RECIPIENT],
        reply_to: email,               // hit reply in access@ to answer the requester
        subject: "New access request — Studio406",
        text:
          "Someone requested access to Studio406.\n\n" +
          "Email: " + email + "\n\n" +
          "Reply to this message to respond to them directly."
      })
    });

    if (!res.ok) {
      // NOTE: `detail` is for the staging test loop only — remove before production.
      const detail = await res.text();
      return json({ ok: false, error: "Could not send the request.", detail }, 502);
    }
  } catch (err) {
    return json({ ok: false, error: "Could not send the request.", detail: String(err) }, 502);
  }

  return json({ ok: true });
}

function isValidEmail(v) {
  return typeof v === "string" && v.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" }
  });
}
