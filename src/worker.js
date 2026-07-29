// Studio406 — access-request handler.
//
// This Worker sits in front of the static site. It only handles one route,
// POST /api/request-access; every other request (all the pages, images, CSS,
// the whole /studio/ tree) falls through to the static assets untouched.
//
// It sends a notification email to access@studio406.co via Cloudflare Email
// Routing's send_email binding (declared in wrangler.jsonc). That binding can
// only deliver to a *verified* destination address — access@studio406.co is
// verified in Email Routing, which is what makes this work.

import { EmailMessage } from "cloudflare:email";

const RECIPIENT = "access@studio406.co";      // verified Email Routing destination
const SENDER = "noreply@studio406.co";        // any address on the domain

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

  // Honeypot: a hidden field real users never see. If it's filled, it's a bot —
  // accept quietly so the bot thinks it succeeded, but send nothing.
  if (honeypot) return json({ ok: true });

  // Strict validation also blocks header injection: the pattern forbids
  // whitespace, so no CR/LF can reach the MIME headers via the address.
  if (!isValidEmail(email)) {
    return json({ ok: false, error: "Please enter a valid email address." }, 422);
  }

  const raw = buildMime({
    from: SENDER,
    to: RECIPIENT,
    replyTo: email,
    subject: "New access request — Studio406",
    text:
      "Someone requested access to Studio406.\r\n\r\n" +
      "Email: " + email + "\r\n\r\n" +
      "Reply to this message to respond to them directly."
  });

  try {
    await env.ACCESS_MAILER.send(new EmailMessage(SENDER, RECIPIENT, raw));
  } catch (err) {
    // NOTE: `detail` is here for the staging test loop only — remove before
    // going to production so we don't leak internals to the public endpoint.
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

// Minimal, well-formed plain-text MIME message. CRLF line endings throughout,
// blank line between headers and body, as RFC 5322 requires.
function buildMime({ from, to, replyTo, subject, text }) {
  const headers = [
    "From: Studio406 <" + from + ">",
    "To: " + to,
    "Reply-To: " + replyTo,
    "Message-ID: <" + crypto.randomUUID() + "@studio406.co>",
    "Date: " + new Date().toUTCString(),
    "Subject: " + subject,
    "MIME-Version: 1.0",
    "Content-Type: text/plain; charset=utf-8",
    "Content-Transfer-Encoding: 8bit"
  ];
  return headers.join("\r\n") + "\r\n\r\n" + text + "\r\n";
}
